"use client";

import Link from "next/link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Fragment, useEffect, useMemo, useState } from "react";
import styles from "./AdminPanel.module.scss";

type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "boolean"
  | "number"
  | "date"
  | "datetime"
  | "url"
  | "file";

type FieldValue = string | number | boolean;
type AdminRecord = Record<string, FieldValue> & { id: string };
type RecordsByResource = Record<string, AdminRecord[]>;
type ExperienceEntry = {
  id?: string;
  role: string;
  company: string;
  period: string;
};
type AnalyticsValue = {
  consultations?: string;
  attendance?: string;
  experienceYears?: string;
  [key: string]: unknown;
};
type ArticleSection = {
  title?: string;
  paragraphs?: string[];
  html?: string;
};

interface AdminField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  accept?: string;
  fullWidth?: boolean;
}

interface ResourceConfig {
  key: string;
  label: string;
  singular: string;
  accent: string;
  fields: AdminField[];
  columns: string[];
  records: AdminRecord[];
}

const statusOptions = ["draft", "published", "archived"];
const kindOptions = ["", "article", "event", "expert", "learn_material", "project"];
const contentTypeOptions = ["news", "blog"];
const resourceHelpText: Record<string, string> = {
  categories:
    "Categories group content by topic and type, so articles, events, learning materials and projects can be organized and filtered.",
  tags:
    "Tags add flexible labels to content, helping mark topics, highlights, recommendations and cross-category relationships.",
  organizations:
    "Organizations store companies, partners and institutions that can be connected to experts, events and projects.",
  experts:
    "Experts describe people shown on the site, including their profile, expertise, availability and consultation details.",
  articles:
    "Articles manage news, blog posts and insights that appear in content sections across the site.",
  events:
    "Events manage upcoming or past activities, including speakers, organizers, dates, location and registration content.",
  learn_materials:
    "Learn Materials manage educational resources such as guides, PDFs and paid or previewable learning content.",
  projects:
    "Projects describe portfolio or community initiatives, including organization, date, status and external links.",
};

const resources: ResourceConfig[] = [
  {
    key: "categories",
    label: "Categories",
    singular: "Category",
    accent: "#0F0FFF",
    columns: ["name", "slug", "kind", "is_active"],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "kind", label: "Kind", type: "select", options: kindOptions },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    records: [
      {
        id: "category-1",
        name: "Business",
        slug: "business",
        kind: "article",
        is_active: true,
      },
      {
        id: "category-2",
        name: "Technology",
        slug: "technology",
        kind: "event",
        is_active: true,
      },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    singular: "Tag",
    accent: "#D62612",
    columns: ["name", "slug", "kind", "is_active"],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "kind", label: "Kind", type: "select", options: kindOptions },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    records: [
      {
        id: "tag-1",
        name: "Recommended",
        slug: "recommended",
        kind: "event",
        is_active: true,
      },
      {
        id: "tag-2",
        name: "AI",
        slug: "ai",
        kind: "article",
        is_active: true,
      },
    ],
  },
  {
    key: "organizations",
    label: "Organizations",
    singular: "Organization",
    accent: "#00966E",
    columns: ["name", "slug", "website_url", "is_active"],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "logo", label: "Logo", type: "file", accept: "image/*" },
      { key: "website_url", label: "Website URL", type: "url" },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    records: [
      {
        id: "organization-1",
        name: "Hashtag Innovations",
        slug: "hashtag-innovations",
        logo: "/images/Logo.svg",
        website_url: "https://example.com",
        description: "Main platform organization.",
        is_active: true,
      },
    ],
  },
  {
    key: "experts",
    label: "Experts",
    singular: "Expert",
    accent: "#AE73F1",
    columns: ["name_en", "name_bg", "service_consultation", "service_mentorship", "service_project_analysis", "is_active"],
    fields: [
      { key: "slug", label: "Slug", type: "text", fullWidth: true },
      { key: "name_en", label: "Name EN", type: "text" },
      { key: "name_bg", label: "Name BG", type: "text" },
      { key: "role_en", label: "Role EN", type: "text" },
      { key: "role_bg", label: "Role BG", type: "text" },
      { key: "company_name_en", label: "Company name EN", type: "text" },
      { key: "company_name_bg", label: "Company name BG", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "photo", label: "Photo", type: "file", accept: "image/*" },
      { key: "quote_en", label: "Quote EN", type: "textarea" },
      { key: "quote_bg", label: "Quote BG", type: "textarea" },
      { key: "bio_en", label: "Bio EN", type: "textarea" },
      { key: "bio_bg", label: "Bio BG", type: "textarea" },
      { key: "expertise_en", label: "Expertise EN", type: "textarea" },
      { key: "expertise_bg", label: "Expertise BG", type: "textarea" },
      { key: "industries_en", label: "Industries EN", type: "textarea" },
      { key: "industries_bg", label: "Industries BG", type: "textarea" },
      { key: "languages_en", label: "Languages EN", type: "textarea" },
      { key: "languages_bg", label: "Languages BG", type: "textarea" },
      { key: "experience_en", label: "Experience EN", type: "textarea" },
      { key: "experience_bg", label: "Experience BG", type: "textarea" },
      { key: "analytics", label: "Analytics", type: "textarea", fullWidth: true },
      { key: "is_available_for_consultation", label: "Available for consultation", type: "boolean" },
      { key: "service_consultation", label: "Consultation", type: "boolean" },
      { key: "service_consultation_price", label: "Consultation price", type: "number" },
      { key: "service_mentorship", label: "Mentorship", type: "boolean" },
      { key: "service_mentorship_price", label: "Mentorship price", type: "number" },
      { key: "service_project_analysis", label: "Project analysis", type: "boolean" },
      { key: "service_project_analysis_price", label: "Project analysis price", type: "number" },
      { key: "is_featured", label: "Featured", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    records: [
      {
        id: "expert-1",
        slug: "elena-petrova",
        name_en: "Elena Petrova",
        name_bg: "Елена Петрова",
        role_en: "Digital strategy lead",
        role_bg: "Лийд дигитална стратегия",
        company_name_en: "Hashtag Innovations",
        company_name_bg: "Hashtag Innovations",
        organization: "Hashtag Innovations",
        photo: "/images/avatars/avatar_1.png",
        quote_en: "Strong products start with clear operational habits.",
        quote_bg: "Силните продукти започват с ясни оперативни навици.",
        bio_en: "Advises teams on digital operations and content strategy.",
        bio_bg: "Консултира екипи по дигитални операции и стратегия за съдържание.",
        expertise_en: "Strategy, Product, Operations",
        expertise_bg: "Стратегия, Продукт, Операции",
        industries_en: "SaaS, Education, Media",
        industries_bg: "SaaS, Образование, Медии",
        languages_en: "English, Bulgarian",
        languages_bg: "Английски, Български",
        experience_en: "Digital Strategy Lead at Hashtag Innovations",
        experience_bg: "Лийд дигитална стратегия в Hashtag Innovations",
        analytics: "consultations: 120, attendance: 94%",
        is_available_for_consultation: true,
        service_consultation: true,
        service_consultation_price: 120,
        service_mentorship: true,
        service_mentorship_price: 180,
        service_project_analysis: true,
        service_project_analysis_price: 250,
        is_featured: true,
        is_active: true,
      },
    ],
  },
  {
    key: "articles",
    label: "Articles",
    singular: "Article",
    accent: "#111827",
    columns: ["title_en", "title_bg", "article_type", "status", "published_at"],
    fields: [
      { key: "article_type", label: "Article type", type: "select", options: contentTypeOptions },
      { key: "slug", label: "Slug", type: "text" },
      { key: "title_en", label: "Title EN", type: "text" },
      { key: "title_bg", label: "Title BG", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "text" },
      { key: "author", label: "Author expert", type: "text" },
      { key: "image", label: "Image", type: "file", accept: "image/*" },
      { key: "excerpt_en", label: "Excerpt EN", type: "textarea" },
      { key: "excerpt_bg", label: "Excerpt BG", type: "textarea" },
      { key: "lead_en", label: "Lead EN", type: "textarea", fullWidth: true },
      { key: "lead_bg", label: "Lead BG", type: "textarea", fullWidth: true },
      { key: "body_sections_en", label: "Body sections EN", type: "textarea", fullWidth: true },
      { key: "body_sections_bg", label: "Body sections BG", type: "textarea", fullWidth: true },
      { key: "hashtags_en", label: "Hashtags EN", type: "textarea" },
      { key: "hashtags_bg", label: "Hashtags BG", type: "textarea" },
      { key: "display_date", label: "Display date", type: "text" },
      { key: "time_to_read", label: "Time to read", type: "text" },
      { key: "promoted_label_en", label: "Promoted label EN", type: "text" },
      { key: "promoted_label_bg", label: "Promoted label BG", type: "text" },
      { key: "read_time", label: "Read time", type: "number" },
      { key: "published_at", label: "Published at", type: "datetime" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "is_featured", label: "Featured", type: "boolean" },
    ],
    records: [
      {
        id: "article-1",
        article_type: "news",
        title_en: "Digital well-being becomes a product priority",
        title_bg: "Digital well-being becomes a product priority",
        slug: "digital-wellbeing-product-priority",
        category: "Business",
        tags: "wellbeing, teams",
        author: "expert-1",
        image: "/images/community/summit_event.png",
        excerpt_en: "A short look at healthier digital work habits.",
        excerpt_bg: "A short look at healthier digital work habits.",
        lead_en: "Digital well-being has moved from a soft benefit to a real business priority.",
        lead_bg: "Digital well-being has moved from a soft benefit to a real business priority.",
        body_sections_en: "<h2>Section 1</h2><p>Teams need calmer systems.</p>",
        body_sections_bg: "<h2>Section 1</h2><p>Teams need calmer systems.</p>",
        hashtags_en: "wellbeing, teams",
        hashtags_bg: "wellbeing, teams",
        display_date: "17/06/2026",
        time_to_read: "5 min read",
        promoted_label_en: "Featured",
        promoted_label_bg: "Featured",
        read_time: 5,
        published_at: "2026-06-17T10:00",
        status: "published",
        is_featured: true,
      },
    ],
  },
  {
    key: "events",
    label: "Events",
    singular: "Event",
    accent: "#D62612",
    columns: ["title", "expert", "starts_at", "location", "status"],
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "text" },
      { key: "expert", label: "Expert", type: "text" },
      { key: "organizers", label: "Organizers", type: "text" },
      { key: "partners", label: "Partners", type: "text" },
      { key: "related_articles", label: "Related articles", type: "text" },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "detail_description", label: "Detail description", type: "textarea", fullWidth: true },
      { key: "starts_at", label: "Starts at", type: "datetime" },
      { key: "timezone", label: "Timezone", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "price_label", label: "Price label", type: "text" },
      { key: "image", label: "Image", type: "file", accept: "image/*" },
      { key: "hero_image", label: "Hero image", type: "file", accept: "image/*" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "is_featured_hero", label: "Featured hero", type: "boolean" },
    ],
    records: [
      {
        id: "event-1",
        title: "Product systems breakfast",
        slug: "product-systems-breakfast",
        category: "Technology",
        tags: "recommended, product",
        expert: "Elena Petrova",
        organizers: "Hashtag Innovations",
        partners: "Hashtag Innovations",
        related_articles: "Digital well-being becomes a product priority",
        description: "A morning session for operational product teams.",
        detail_description: "Discussion, examples and a short Q&A.",
        starts_at: "2026-07-24T09:30",
        timezone: "Europe/Sofia",
        location: "Sofia",
        price_label: "Free",
        image: "/images/community/tech_event.png",
        hero_image: "/images/community/summit.png",
        status: "published",
        is_featured_hero: true,
      },
    ],
  },
  {
    key: "learn_materials",
    label: "Learn Materials",
    singular: "Learn Material",
    accent: "#69698B",
    columns: ["title", "author_name", "format_label", "price", "status"],
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "text" },
      { key: "author", label: "Author expert", type: "text" },
      { key: "author_name", label: "Author name", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea", fullWidth: true },
      { key: "cover_image", label: "Cover image", type: "file", accept: "image/*" },
      { key: "pdf_file", label: "PDF file path", type: "text" },
      { key: "preview_pdf_file", label: "Preview PDF path", type: "text" },
      { key: "sales_url", label: "Sales URL", type: "url" },
      { key: "format_label", label: "Format label", type: "text" },
      { key: "price", label: "Price", type: "number" },
      { key: "badge", label: "Badge", type: "text" },
      { key: "has_preview", label: "Has preview", type: "boolean" },
      { key: "is_trending", label: "Trending", type: "boolean" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "published_at", label: "Published at", type: "datetime" },
    ],
    records: [
      {
        id: "material-1",
        title: "Design systems field guide",
        slug: "design-systems-field-guide",
        category: "Technology",
        tags: "design, product",
        author: "Elena Petrova",
        author_name: "Elena Petrova",
        excerpt: "Define tokens, document components and align teams.",
        cover_image: "/images/default_textbook_cover.png",
        pdf_file: "/test.pdf",
        preview_pdf_file: "/test.pdf",
        sales_url: "",
        format_label: "PDF",
        price: 49,
        badge: "Trending",
        has_preview: true,
        is_trending: true,
        status: "published",
        published_at: "2026-06-14T12:00",
      },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    singular: "Project",
    accent: "#C0C0D2",
    columns: ["title", "code", "organization", "project_date", "status"],
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "code", label: "Code", type: "text" },
      { key: "project_date", label: "Project date", type: "date" },
      { key: "image", label: "Image", type: "file", accept: "image/*" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "is_featured", label: "Featured", type: "boolean" },
    ],
    records: [
      {
        id: "project-1",
        title: "Community learning platform",
        slug: "community-learning-platform",
        category: "Technology",
        tags: "community, education",
        organization: "Hashtag Innovations",
        description: "A digital learning hub for experts and teams.",
        code: "HI-24",
        project_date: "2026-05-20",
        image: "/ProjectImg.png",
        status: "published",
        is_featured: true,
      },
    ],
  },
];

const makeBlankRecord = (resource: ResourceConfig): AdminRecord => {
  const record: AdminRecord = {
    id: `${resource.key}-${Date.now()}`,
  };

  resource.fields.forEach((field) => {
    if (field.type === "boolean") {
      record[field.key] = false;
      return;
    }

    if (field.type === "number") {
      record[field.key] = 0;
      return;
    }

    record[field.key] = field.options?.[0] ?? "";
  });

  return record;
};

const formatValue = (value: FieldValue | undefined) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const formatOptionLabel = (value: string) => {
  if (!value) {
    return "Any";
  }

  return value
    .split("_")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
};

const readApiError = async (response: Response) => {
  const payload = await response.json().catch(() => null) as { error?: unknown } | null;

  if (!payload?.error) {
    return "The database did not accept this change.";
  }

  return typeof payload.error === "string" ? payload.error : JSON.stringify(payload.error);
};

const parseJsonValue = <T,>(value: FieldValue | undefined, fallback: T): T => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const parseStringList = (value: FieldValue | undefined) => {
  const parsed = parseJsonValue<unknown>(value, null);

  if (Array.isArray(parsed)) {
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const stringifyJsonField = (value: unknown) => JSON.stringify(value, null, 2);

const EditIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
    <path
      d="M8.6 4H4.8A1.8 1.8 0 0 0 3 5.8v9.4A1.8 1.8 0 0 0 4.8 17h9.4a1.8 1.8 0 0 0 1.8-1.8v-3.8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
    <path
      d="M14.5 2.8a1.5 1.5 0 0 1 2.1 2.1l-7.1 7.1-2.9.8.8-2.9 7.1-7.1Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
    <path
      d="m13.4 3.9 2.7 2.7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
    <path
      d="M7.2 4.2h5.6l.5 1.5h2.4v2H4.3v-2h2.4l.5-1.5Z"
      fill="currentColor"
    />
    <path
      d="M5.8 8.7h8.4l-.7 7.2a1.5 1.5 0 0 1-1.5 1.3H8a1.5 1.5 0 0 1-1.5-1.3l-.7-7.2Z"
      fill="currentColor"
    />
    <path
      d="M8.6 10.5v4.4M11.4 10.5v4.4"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth="1.2"
    />
  </svg>
);

const HelpIcon = () => (
  <span aria-hidden="true">?</span>
);

interface TagsEditorProps {
  label: string;
  value: FieldValue | undefined;
  onChange: (value: string) => void;
}

const TagsEditor = ({ label, value, onChange }: TagsEditorProps) => {
  const [draft, setDraft] = useState("");
  const tags = parseStringList(value);

  const commitTag = () => {
    const nextTag = draft.trim();

    if (!nextTag || tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
      setDraft("");
      return;
    }

    onChange(stringifyJsonField([...tags, nextTag]));
    setDraft("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(stringifyJsonField(tags.filter((tag) => tag !== tagToRemove)));
  };

  return (
    <div className={styles.formField}>
      <span>{label}</span>
      <div className={styles.tagsEditor}>
        <div className={styles.tagsList}>
          {tags.map((tag) => (
            <button key={tag} type="button" onClick={() => removeTag(tag)} title="Remove tag">
              <span>{tag}</span>
              <strong aria-hidden="true">x</strong>
            </button>
          ))}
        </div>
        <div className={styles.tagInputLine}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                commitTag();
              }
            }}
            onBlur={commitTag}
          />
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={commitTag}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

interface ArticleSectionsEditorProps {
  label: string;
  value: FieldValue | undefined;
  onChange: (value: string) => void;
}

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const textToHtml = (value: string) => value
  .split(/\n{2,}/)
  .map((item) => item.trim())
  .filter(Boolean)
  .map((item) => `<p>${escapeHtml(item)}</p>`)
  .join("");

const articleSectionsToHtml = (value: FieldValue | undefined) => {
  const rawValue = String(value ?? "").trim();
  const sections = parseJsonValue<ArticleSection[]>(value, [])
    .filter((section) => section && typeof section === "object")
    .map((section) => ({
      title: String(section.title ?? ""),
      html: String(section.html ?? ""),
      paragraphs: Array.isArray(section.paragraphs)
        ? section.paragraphs.map((paragraph) => String(paragraph))
        : [],
    }));

  if (!sections.length) {
    if (!rawValue) {
      return "";
    }

    return rawValue.startsWith("<") ? rawValue : textToHtml(rawValue);
  }

  return sections.map((section) => {
    if (section.html) {
      return section.html;
    }

    const title = section.title ? `<h2>${escapeHtml(section.title)}</h2>` : "";
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    return `${title}${paragraphs}`;
  }).join("");
};

const ArticleSectionsEditor = ({ label, value, onChange }: ArticleSectionsEditorProps) => {
  const htmlValue = useMemo(() => articleSectionsToHtml(value), [value]);
  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.richTextSurface,
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === htmlValue) {
      return;
    }

    editor.commands.setContent(htmlValue, { emitUpdate: false });
  }, [editor, htmlValue]);

  return (
    <div className={`${styles.formField} ${styles.fullWidth}`}>
      <span>{label}</span>
      <div className={styles.richTextEditor}>
        <div className={styles.richTextToolbar}>
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive("bold") ? styles.activeToolButton : ""}>B</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive("italic") ? styles.activeToolButton : ""}>I</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive("heading", { level: 2 }) ? styles.activeToolButton : ""}>H2</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive("bulletList") ? styles.activeToolButton : ""}>List</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive("orderedList") ? styles.activeToolButton : ""}>1.</button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive("blockquote") ? styles.activeToolButton : ""}>Quote</button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

interface BioEditorProps {
  label: string;
  value: FieldValue | undefined;
  onChange: (value: string) => void;
}

const BioEditor = ({ label, value, onChange }: BioEditorProps) => {
  const paragraphs = parseStringList(value);
  const [draftText, setDraftText] = useState(() => paragraphs.join("\n\n"));

  const updateText = (nextValue: string) => {
    setDraftText(nextValue);

    const nextParagraphs = nextValue
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);

    onChange(stringifyJsonField(nextParagraphs));
  };

  return (
    <div className={styles.formField}>
      <span>{label}</span>
      <textarea value={draftText} onChange={(event) => updateText(event.target.value)} rows={8} />
    </div>
  );
};

interface ExperienceEditorProps {
  label: string;
  value: FieldValue | undefined;
  onChange: (value: string) => void;
}

const ExperienceEditor = ({ label, value, onChange }: ExperienceEditorProps) => {
  const entries = parseJsonValue<ExperienceEntry[]>(value, []).filter((entry) => typeof entry === "object");

  const updateEntries = (nextEntries: ExperienceEntry[]) => {
    onChange(stringifyJsonField(nextEntries));
  };

  const updateEntry = (index: number, key: keyof ExperienceEntry, nextValue: string) => {
    updateEntries(entries.map((entry, entryIndex) => (
      entryIndex === index ? { ...entry, [key]: nextValue } : entry
    )));
  };

  const addEntry = () => {
    updateEntries([
      ...entries,
      {
        role: "",
        company: "",
        period: "",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    updateEntries(entries.filter((_, entryIndex) => entryIndex !== index));
  };

  return (
    <div className={styles.formField}>
      <span>{label}</span>
      <div className={styles.experienceEditor}>
        {entries.map((entry, index) => (
          <div className={styles.experienceItem} key={entry.id || index}>
            <label>
              <span>Role</span>
              <input value={entry.role ?? ""} onChange={(event) => updateEntry(index, "role", event.target.value)} />
            </label>
            <label>
              <span>Company</span>
              <input value={entry.company ?? ""} onChange={(event) => updateEntry(index, "company", event.target.value)} />
            </label>
            <label>
              <span>Period</span>
              <input value={entry.period ?? ""} onChange={(event) => updateEntry(index, "period", event.target.value)} />
            </label>
            <button type="button" onClick={() => removeEntry(index)} title="Remove experience">
              Remove
            </button>
          </div>
        ))}
        <button className={styles.addInlineButton} type="button" onClick={addEntry}>
          Add experience
        </button>
      </div>
    </div>
  );
};

interface AnalyticsEditorProps {
  value: FieldValue | undefined;
  onChange: (value: string) => void;
}

const AnalyticsEditor = ({ value, onChange }: AnalyticsEditorProps) => {
  const analytics = parseJsonValue<AnalyticsValue>(value, {});

  const updateAnalytics = (key: keyof AnalyticsValue, nextValue: string) => {
    onChange(stringifyJsonField({
      ...analytics,
      [key]: nextValue,
    }));
  };

  return (
    <div className={`${styles.formField} ${styles.fullWidth}`}>
      <span>Analytics</span>
      <div className={styles.analyticsEditor}>
        <label>
          <span>Consultations</span>
          <input
            value={String(analytics.consultations ?? "")}
            onChange={(event) => updateAnalytics("consultations", event.target.value)}
          />
        </label>
        <label>
          <span>Attendance</span>
          <input
            value={String(analytics.attendance ?? "")}
            onChange={(event) => updateAnalytics("attendance", event.target.value)}
          />
        </label>
        <label>
          <span>Experience years</span>
          <input
            value={String(analytics.experienceYears ?? "")}
            onChange={(event) => updateAnalytics("experienceYears", event.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export const AdminPanel = () => {
  const [activeKey, setActiveKey] = useState(resources[0].key);
  const [query, setQuery] = useState("");
  const [recordsByResource, setRecordsByResource] = useState(
    () => Object.fromEntries(resources.map((resource) => [resource.key, [] as AdminRecord[]])),
  );
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [editingMode, setEditingMode] = useState<"create" | "edit">("edit");
  const [mutationError, setMutationError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRecords = async () => {
      setIsLoadingRecords(true);
      setRecordsError("");

      const response = await fetch("/admin/api/resources", {
        cache: "no-store",
      }).catch(() => null);

      if (!isMounted) {
        return;
      }

      if (!response) {
        setRecordsError("Could not connect to admin API.");
        setIsLoadingRecords(false);
        return;
      }

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      if (!response.ok) {
        setRecordsError("Could not load records from the database.");
        setIsLoadingRecords(false);
        return;
      }

      const payload = (await response.json().catch(() => null)) as RecordsByResource | null;

      if (!payload) {
        setRecordsError("Admin API returned an invalid response.");
        setIsLoadingRecords(false);
        return;
      }

      setRecordsByResource((current) =>
        Object.fromEntries(
          resources.map((resource) => [
            resource.key,
            Array.isArray(payload[resource.key]) ? payload[resource.key] : current[resource.key] ?? [],
          ]),
        ),
      );
      setIsLoadingRecords(false);
    };

    void loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeResource = resources.find((resource) => resource.key === activeKey) ?? resources[0];
  const activeResourceHelpText = resourceHelpText[activeResource.key];
  const activeRecords = useMemo(
    () => recordsByResource[activeResource.key] ?? [],
    [activeResource.key, recordsByResource],
  );

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return activeRecords;
    }

    return activeRecords.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [activeRecords, query]);

  const openCreate = () => {
    setEditingMode("create");
    setMutationError("");
    setEditingRecord(makeBlankRecord(activeResource));
  };

  const openEdit = (record: AdminRecord) => {
    setEditingMode("edit");
    setMutationError("");
    setEditingRecord({ ...record });
  };

  const closeEditor = () => {
    setMutationError("");
    setEditingRecord(null);
  };

  const updateEditingValue = (field: AdminField, value: FieldValue) => {
    setEditingRecord((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field.key]: value,
      };
    });
  };

  const updateEditingKey = (key: string, value: FieldValue) => {
    setEditingRecord((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const expertOptions = recordsByResource.experts ?? [];

  const renderEditorField = (field: AdminField) => {
    if (!editingRecord) {
      return null;
    }

    if (activeResource.key === "articles" && field.key === "author") {
      return (
        <label key={field.key} className={styles.formField}>
          <span>{field.label}</span>
          <select
            value={String(editingRecord[field.key] ?? "")}
            onChange={(event) => updateEditingValue(field, event.target.value)}
          >
            <option value="">No author</option>
            {expertOptions.map((expert) => {
              const value = String(expert.slug || expert.id);
              const label = String(expert.name_en || expert.name_bg || expert.name || value);

              return (
                <option key={expert.id} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </label>
      );
    }

    if (activeResource.key === "articles" && ["body_sections_en", "body_sections_bg"].includes(field.key)) {
      return (
        <ArticleSectionsEditor
          key={field.key}
          label={field.label}
          value={editingRecord[field.key]}
          onChange={(value) => updateEditingValue(field, value)}
        />
      );
    }

    if (activeResource.key === "articles" && ["hashtags_en", "hashtags_bg"].includes(field.key)) {
      return (
        <TagsEditor
          key={field.key}
          label={field.label}
          value={editingRecord[field.key]}
          onChange={(value) => updateEditingValue(field, value)}
        />
      );
    }

    if (activeResource.key === "experts" && ["bio_en", "bio_bg"].includes(field.key)) {
      return (
        <BioEditor
          key={field.key}
          label={field.label}
          value={editingRecord[field.key]}
          onChange={(value) => updateEditingValue(field, value)}
        />
      );
    }

    if (
      activeResource.key === "experts" &&
      ["expertise_en", "expertise_bg", "industries_en", "industries_bg", "languages_en", "languages_bg"].includes(field.key)
    ) {
      return (
        <TagsEditor
          key={field.key}
          label={field.label}
          value={editingRecord[field.key]}
          onChange={(value) => updateEditingValue(field, value)}
        />
      );
    }

    if (activeResource.key === "experts" && ["experience_en", "experience_bg"].includes(field.key)) {
      return (
        <ExperienceEditor
          key={field.key}
          label={field.label}
          value={editingRecord[field.key]}
          onChange={(value) => updateEditingValue(field, value)}
        />
      );
    }

    if (activeResource.key === "experts" && field.key === "analytics") {
      return (
        <AnalyticsEditor
          key={field.key}
          value={editingRecord[field.key]}
          onChange={(value) => updateEditingValue(field, value)}
        />
      );
    }

    if (activeResource.key === "experts" && field.key === "is_available_for_consultation") {
      const isAvailable = Boolean(editingRecord.is_available_for_consultation);
      const serviceFields = [
        { key: "service_consultation", priceKey: "service_consultation_price", label: "Consultation" },
        { key: "service_mentorship", priceKey: "service_mentorship_price", label: "Mentorship" },
        { key: "service_project_analysis", priceKey: "service_project_analysis_price", label: "Project analysis" },
      ];

      return (
        <div key={field.key} className={`${styles.formField} ${styles.fullWidth}`}>
          <span className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(event) => {
                const nextValue = event.target.checked;
                updateEditingKey("is_available_for_consultation", nextValue);

                if (!nextValue) {
                  serviceFields.forEach((serviceField) => updateEditingKey(serviceField.key, false));
                }
              }}
            />
            <span>{field.label}</span>
          </span>

          <div className={`${styles.serviceSubFields} ${!isAvailable ? styles.disabledServiceSubFields : ""}`}>
            {serviceFields.map((serviceField) => {
              const isServiceEnabled = isAvailable && Boolean(editingRecord[serviceField.key]);

              return (
                <Fragment key={serviceField.key}>
                  <label className={styles.serviceCheckboxField}>
                    <input
                      type="checkbox"
                      checked={Boolean(editingRecord[serviceField.key])}
                      disabled={!isAvailable}
                      onChange={(event) => updateEditingKey(serviceField.key, event.target.checked)}
                    />
                    <span>{serviceField.label}</span>
                  </label>
                  <label className={styles.servicePriceField}>
                    <span>{serviceField.label} price</span>
                    <input
                      type="number"
                      value={String(editingRecord[serviceField.priceKey] ?? 0)}
                      disabled={!isServiceEnabled}
                      onChange={(event) => updateEditingKey(serviceField.priceKey, Number(event.target.value))}
                    />
                  </label>
                </Fragment>
              );
            })}
          </div>
        </div>
      );
    }

    if (
      activeResource.key === "experts" &&
      [
        "service_consultation",
        "service_consultation_price",
        "service_mentorship",
        "service_mentorship_price",
        "service_project_analysis",
        "service_project_analysis_price",
      ].includes(field.key)
    ) {
      return null;
    }

    return (
      <label
        key={field.key}
        className={`${styles.formField} ${field.fullWidth ? styles.fullWidth : ""} ${
          field.type === "boolean" ? styles.booleanFormField : ""
        }`}
      >
        {field.type === "boolean" ? (
          <span className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={Boolean(editingRecord[field.key])}
              onChange={(event) => updateEditingValue(field, event.target.checked)}
            />
            <span>{field.label}</span>
          </span>
        ) : (
          <>
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                value={String(editingRecord[field.key] ?? "")}
                onChange={(event) => updateEditingValue(field, event.target.value)}
                rows={field.fullWidth ? 5 : 3}
              />
            ) : field.type === "file" ? (
              <span className={styles.fileField}>
                <input
                  type="file"
                  accept={field.accept}
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      updateEditingValue(field, file.name);
                    }
                  }}
                />
                {editingRecord[field.key] && (
                  <span>{`Selected: ${String(editingRecord[field.key])}`}</span>
                )}
              </span>
            ) : field.type === "select" ? (
              <select
                value={String(editingRecord[field.key] ?? "")}
                onChange={(event) => updateEditingValue(field, event.target.value)}
              >
                {field.options?.map((option) => (
                  <option key={option || "blank"} value={option}>
                    {formatOptionLabel(option)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  field.type === "datetime"
                    ? "datetime-local"
                    : field.type === "url"
                      ? "url"
                      : field.type
                }
                value={String(editingRecord[field.key] ?? "")}
                onChange={(event) =>
                  updateEditingValue(
                    field,
                    field.type === "number" ? Number(event.target.value) : event.target.value,
                  )
                }
              />
            )}
          </>
        )}
      </label>
    );
  };

  const saveRecord = async () => {
    if (!editingRecord) {
      return;
    }

    setIsSaving(true);
    setMutationError("");

    const response = await fetch("/admin/api/resources", {
      method: editingMode === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resourceKey: activeResource.key,
        recordId: editingMode === "edit" ? editingRecord.id : undefined,
        record: editingRecord,
      }),
    }).catch(() => null);

    if (!response) {
      setMutationError("Could not connect to the admin API.");
      setIsSaving(false);
      return;
    }

    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }

    if (!response.ok) {
      setMutationError(await readApiError(response));
      setIsSaving(false);
      return;
    }

    const savedRecord = (await response.json().catch(() => null)) as AdminRecord | null;

    if (!savedRecord?.id) {
      setMutationError("Admin API returned an invalid saved record.");
      setIsSaving(false);
      return;
    }

    setRecordsByResource((current) => {
      const records = current[activeResource.key] ?? [];
      const nextRecords =
        editingMode === "create"
          ? [savedRecord, ...records]
          : records.map((record) =>
              record.id === savedRecord.id ? savedRecord : record,
            );

      return {
        ...current,
        [activeResource.key]: nextRecords,
      };
    });

    setIsSaving(false);
    closeEditor();
  };

  const deleteRecord = async (recordId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");

    if (!isConfirmed) {
      return;
    }

    const response = await fetch("/admin/api/resources", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resourceKey: activeResource.key,
        recordId,
      }),
    }).catch(() => null);

    if (!response) {
      setRecordsError("Could not connect to the admin API.");
      return;
    }

    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }

    if (!response.ok) {
      setRecordsError(await readApiError(response));
      return;
    }

    setRecordsByResource((current) => ({
      ...current,
      [activeResource.key]: (current[activeResource.key] ?? []).filter(
        (record) => record.id !== recordId,
      ),
    }));
  };

  const logout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });
    window.location.assign("/admin/login");
  };

  return (
    <div className={styles.adminShell}>
      <header className={styles.topbar}>
        <Link href="/bg" className={styles.brand} aria-label="Hashtag Innovations home">
          <span className={styles.brandMark}>#</span>
          <span>innovations</span>
        </Link>
        <div className={styles.topbarMeta}>
          <button className={styles.logoutButton} type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="Admin resources">
          <nav className={styles.resourceNav}>
            {resources.map((resource) => {
              const isActive = resource.key === activeResource.key;
              const count = recordsByResource[resource.key]?.length ?? 0;

              return (
                <button
                  key={resource.key}
                  className={`${styles.resourceButton} ${isActive ? styles.activeResource : ""}`}
                  style={{ "--resource-accent": resource.accent } as React.CSSProperties}
                  type="button"
                  onClick={() => {
                    setActiveKey(resource.key);
                    setQuery("");
                    closeEditor();
                  }}
                >
                  <span className={styles.resourceDot} />
                  <span className={styles.resourceLabel}>{resource.label}</span>
                  <span className={styles.resourceCount}>{count}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className={styles.contentArea}>
          <div className={styles.titleLine}>
            <div>
              <div className={styles.titleHeading}>
                <h1>{activeResource.label}</h1>
                {activeResourceHelpText && (
                  <button
                    className={styles.helpButton}
                    type="button"
                    aria-label={`${activeResource.label} help`}
                  >
                    <HelpIcon />
                    <span className={styles.helpTooltip} role="tooltip">
                      {activeResourceHelpText}
                    </span>
                  </button>
                )}
              </div>
            </div>
            <button className={styles.primaryButton} type="button" onClick={openCreate}>
              New record
            </button>
          </div>

          <div className={styles.toolbar}>
            <label className={styles.searchField}>
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${activeResource.label.toLowerCase()}`}
              />
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {activeResource.columns.map((column) => (
                    <th key={column}>{column.replaceAll("_", " ")}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    {activeResource.columns.map((column) => (
                      <td key={column}>
                        <span
                          className={
                            column === "status" || column.startsWith("is_") || column === "article_type"
                              ? styles.valuePill
                              : ""
                          }
                        >
                          {formatValue(record[column])}
                        </span>
                      </td>
                    ))}
                    <td>
                      <div className={styles.tableActions}>
                        <button type="button" onClick={() => openEdit(record)} aria-label="Edit record" title="Edit">
                          <EditIcon />
                        </button>
                        <button
                          className={`${styles.dangerButton} ${styles.deleteActionButton}`}
                          type="button"
                          onClick={() => deleteRecord(record.id)}
                          aria-label="Delete record"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoadingRecords && (
              <div className={styles.emptyState}>
                <h2>Loading records...</h2>
              </div>
            )}

            {!isLoadingRecords && recordsError && (
              <div className={styles.emptyState}>
                <h2>{recordsError}</h2>
              </div>
            )}

            {!isLoadingRecords && !recordsError && filteredRecords.length === 0 && (
              <div className={styles.emptyState}>
                <h2>No records found</h2>
              </div>
            )}
          </div>
        </section>
      </main>

      {editingRecord && (
        <div className={styles.editorBackdrop} role="presentation" onMouseDown={closeEditor}>
          <section
            className={styles.editor}
            aria-label={`${editingMode === "create" ? "Create" : "Edit"} ${activeResource.singular}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.editorHeader}>
              <div>
                <span className={styles.eyebrow}>
                  {editingMode === "create" ? "Create" : "Edit"}
                </span>
                <h2>{activeResource.singular}</h2>
              </div>
              <button className={styles.iconButton} type="button" onClick={closeEditor} aria-label="Close editor">
                x
              </button>
            </div>

            <div className={styles.formGrid}>
              {activeResource.fields.map((field) => renderEditorField(field))}
            </div>

            <div className={styles.editorFooter}>
              {mutationError && (
                <p className={styles.editorError} role="alert">
                  {mutationError}
                </p>
              )}
              <button className={styles.secondaryButton} type="button" onClick={closeEditor}>
                Cancel
              </button>
              <button className={styles.primaryButton} type="button" onClick={saveRecord} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
