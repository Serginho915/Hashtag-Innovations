const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.scss') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/(@use|@import)\s+['"](.*?)['"]/g, (match, type, importPath) => {
    if (importPath.endsWith('.scss') || importPath.endsWith('.css')) {
      return match;
    }
    
    let resolvedPath = importPath;
    if (importPath.startsWith('@/')) {
        resolvedPath = path.join('./src', importPath.slice(2));
    } else if (importPath.startsWith('.')) {
        resolvedPath = path.join(path.dirname(file), importPath);
    } else {
        return match;
    }
    
    if (fs.existsSync(resolvedPath + '.scss')) {
        return match.replace(importPath, importPath + '.scss');
    } else if (fs.existsSync(resolvedPath + '.css')) {
        return match.replace(importPath, importPath + '.css');
    }
    
    let dirname = path.dirname(resolvedPath);
    let basename = path.basename(resolvedPath);
    if (fs.existsSync(path.join(dirname, '_' + basename + '.scss'))) {
        return match.replace(importPath, importPath + '.scss');
    }

    return match;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
  }
});

console.log(`Updated ${changedCount} SCSS/CSS files.`);
