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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

let changedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/(import|export)\s+(?:.*?from\s+)?['"](.*?)['"]/g, (match, type, importPath) => {
    // Only process relative paths or alias paths
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      return match;
    }

    // Skip if already has extension
    if (/\.(ts|tsx|js|jsx|json|scss|css|svg|png|jpg)$/.test(importPath)) {
      return match;
    }

    // Resolve the actual path
    let resolvedPath = importPath;
    if (importPath.startsWith('@/')) {
      resolvedPath = path.join('./src', importPath.slice(2));
    } else {
      resolvedPath = path.join(path.dirname(file), importPath);
    }

    let extension = '';
    if (fs.existsSync(resolvedPath + '.tsx')) {
      extension = '.tsx';
    } else if (fs.existsSync(resolvedPath + '.ts')) {
      extension = '.ts';
    } else if (fs.existsSync(path.join(resolvedPath, 'index.tsx'))) {
      importPath += '/index.tsx';
      extension = 'none'; // already appended
    } else if (fs.existsSync(path.join(resolvedPath, 'index.ts'))) {
      importPath += '/index.ts';
      extension = 'none'; // already appended
    } else {
      // Could be a third party or not found
      return match;
    }

    if (extension === '.tsx' || extension === '.ts') {
      importPath += extension;
    }

    return match.replace(/(['"])(.*?)\1/, `$1${importPath}$1`);
  });

  // Also catch dynamic imports: import('...')
  newContent = newContent.replace(/import\(['"](.*?)['"]\)/g, (match, importPath) => {
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      return match;
    }
    if (/\.(ts|tsx|js|jsx|json|scss|css|svg|png|jpg)$/.test(importPath)) {
      return match;
    }
    
    let resolvedPath = importPath;
    if (importPath.startsWith('@/')) {
      resolvedPath = path.join('./src', importPath.slice(2));
    } else {
      resolvedPath = path.join(path.dirname(file), importPath);
    }

    let extension = '';
    if (fs.existsSync(resolvedPath + '.tsx')) {
      extension = '.tsx';
    } else if (fs.existsSync(resolvedPath + '.ts')) {
      extension = '.ts';
    } else if (fs.existsSync(path.join(resolvedPath, 'index.tsx'))) {
      importPath += '/index.tsx';
      extension = 'none';
    } else if (fs.existsSync(path.join(resolvedPath, 'index.ts'))) {
      importPath += '/index.ts';
      extension = 'none';
    } else {
      return match;
    }

    if (extension === '.tsx' || extension === '.ts') {
      importPath += extension;
    }

    return match.replace(/(['"])(.*?)\1/, `$1${importPath}$1`);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
  }
});

console.log(`Updated ${changedCount} files.`);
