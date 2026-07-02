"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  expert_sessions:
    "Expert Sessions define bookable or featured sessions connected to an expert, including title, description and price.",
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
    columns: ["name", "role", "company_name", "is_available_for_consultation", "is_active"],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "company_name", label: "Company name", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "photo", label: "Photo", type: "file", accept: "image/*" },
      { key: "quote", label: "Quote", type: "textarea", fullWidth: true },
      { key: "bio", label: "Bio", type: "textarea", fullWidth: true },
      { key: "expertise", label: "Expertise", type: "textarea" },
      { key: "industries", label: "Industries", type: "textarea" },
      { key: "languages", label: "Languages", type: "textarea" },
      { key: "experience", label: "Experience", type: "textarea", fullWidth: true },
      { key: "analytics", label: "Analytics", type: "textarea", fullWidth: true },
      { key: "consultation_price", label: "Consultation price", type: "number" },
      { key: "is_available_for_consultation", label: "Available for consultation", type: "boolean" },
      { key: "is_featured", label: "Featured", type: "boolean" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    records: [
      {
        id: "expert-1",
        name: "Elena Petrova",
        slug: "elena-petrova",
        role: "Digital strategy lead",
        company_name: "Hashtag Innovations",
        organization: "Hashtag Innovations",
        photo: "/images/avatars/avatar_1.png",
        quote: "Strong products start with clear operational habits.",
        bio: "Advises teams on digital operations and content strategy.",
        expertise: "Strategy, Product, Operations",
        industries: "SaaS, Education, Media",
        languages: "English, Bulgarian",
        experience: "Digital Strategy Lead at Hashtag Innovations",
        analytics: "consultations: 120, attendance: 94%",
        consultation_price: 120,
        is_available_for_consultation: true,
        is_featured: true,
        is_active: true,
      },
    ],
  },
  {
    key: "expert_sessions",
    label: "Expert Sessions",
    singular: "Expert Session",
    accent: "#4A5565",
    columns: ["title", "expert", "price", "is_active"],
    fields: [
      { key: "expert", label: "Expert", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "price", label: "Price", type: "number" },
      { key: "is_active", label: "Active", type: "boolean" },
    ],
    records: [
      {
        id: "session-1",
        expert: "Elena Petrova",
        title: "Strategy review",
        subtitle: "Focused product and content consultation",
        description: "A focused session for teams that need a clear next step.",
        price: 120,
        is_active: true,
      },
    ],
  },
  {
    key: "articles",
    label: "Articles",
    singular: "Article",
    accent: "#111827",
    columns: ["title", "article_type", "category", "status", "published_at"],
    fields: [
      { key: "article_type", label: "Article type", type: "select", options: contentTypeOptions },
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "text" },
      { key: "author", label: "Author expert", type: "text" },
      { key: "author_name", label: "Author name", type: "text" },
      { key: "image", label: "Image", type: "file", accept: "image/*" },
      { key: "excerpt", label: "Excerpt", type: "textarea", fullWidth: true },
      { key: "lead", label: "Lead", type: "textarea", fullWidth: true },
      { key: "body", label: "Body", type: "textarea", fullWidth: true },
      { key: "promoted_label", label: "Promoted label", type: "text" },
      { key: "read_time", label: "Read time", type: "number" },
      { key: "published_at", label: "Published at", type: "datetime" },
      { key: "status", label: "Status", type: "select", options: statusOptions },
      { key: "is_featured", label: "Featured", type: "boolean" },
    ],
    records: [
      {
        id: "article-1",
        article_type: "news",
        title: "Digital well-being becomes a product priority",
        slug: "digital-wellbeing-product-priority",
        category: "Business",
        tags: "wellbeing, teams",
        author: "Elena Petrova",
        author_name: "Elena Petrova",
        image: "/images/community/summit_event.png",
        excerpt: "A short look at healthier digital work habits.",
        lead: "Digital well-being has moved from a soft benefit to a real business priority.",
        body: "Section 1: Teams need calmer systems.",
        promoted_label: "Featured",
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
    setEditingRecord(makeBlankRecord(activeResource));
  };

  const openEdit = (record: AdminRecord) => {
    setEditingMode("edit");
    setEditingRecord({ ...record });
  };

  const closeEditor = () => {
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

  const saveRecord = () => {
    if (!editingRecord) {
      return;
    }

    setRecordsByResource((current) => {
      const records = current[activeResource.key] ?? [];
      const nextRecords =
        editingMode === "create"
          ? [editingRecord, ...records]
          : records.map((record) =>
              record.id === editingRecord.id ? editingRecord : record,
            );

      return {
        ...current,
        [activeResource.key]: nextRecords,
      };
    });

    closeEditor();
  };

  const deleteRecord = (recordId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");

    if (!isConfirmed) {
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
              {activeResource.fields.map((field) => (
                <label
                  key={field.key}
                  className={`${styles.formField} ${field.fullWidth ? styles.fullWidth : ""}`}
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
              ))}
            </div>

            <div className={styles.editorFooter}>
              <button className={styles.secondaryButton} type="button" onClick={closeEditor}>
                Cancel
              </button>
              <button className={styles.primaryButton} type="button" onClick={saveRecord}>
                Save
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
