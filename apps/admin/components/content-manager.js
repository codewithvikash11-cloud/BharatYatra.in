'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import ContentImageManager from './content-image-manager.js';

const configs = {
  destinations: {
    label: 'Destinations',
    fields: [
      ['slug', 'URL slug', 'text', true],
      ['name_en', 'Name · English', 'text', true],
      ['name_hi', 'Name · Hindi', 'text'],
      ['summary_en', 'Summary · English', 'textarea'],
      ['summary_hi', 'Summary · Hindi', 'textarea'],
      ['description_en', 'Description · English', 'textarea'],
      ['description_hi', 'Description · Hindi', 'textarea'],
      ['state_id', 'State (Selection)', 'state_select'],
      ['district_id', 'District (Selection)', 'district_select'],
      ['tehsil_id', 'Tehsil / Sub-district (Selection)', 'tehsil_select'],
      ['state_name', 'State Name (Display)', 'text'],
      ['district_name', 'District Name (Display)', 'text'],
      ['latitude', 'Latitude', 'number'],
      ['longitude', 'Longitude', 'number'],
      ['best_time_en', 'Best time · English', 'text'],
      ['best_time_hi', 'Best time · Hindi', 'text'],
    ],
  },
  attractions: {
    label: 'Attractions',
    fields: [
      ['destination_id', 'Destination (Selection)', 'destination_select', true],
      ['slug', 'URL slug', 'text', true],
      ['name_en', 'Name · English', 'text', true],
      ['name_hi', 'Name · Hindi', 'text'],
      ['description_en', 'Description · English', 'textarea'],
      ['description_hi', 'Description · Hindi', 'textarea'],
      ['category', 'Category', 'text'],
      ['latitude', 'Latitude', 'number'],
      ['longitude', 'Longitude', 'number'],
      ['visiting_hours', 'Visiting hours', 'text'],
      ['entry_fee_note', 'Entry fee note', 'text'],
      ['source_url', 'Source URL', 'url'],
      ['verified_at', 'Verified date', 'date'],
    ],
  },
  articles: {
    label: 'Articles',
    fields: [
      ['title_en', 'Article Title (English)', 'text', true],
      ['slug', 'URL slug (auto-generated or custom)', 'text', true],
      ['category', 'Category (e.g. Travel Guide, Heritage, Culture, Food, Planning)', 'text', false],
      ['tags', 'Tags (comma-separated, e.g. nawalgarh, shekhawati, demo)', 'text', false],
      ['author_name', 'Author Name', 'text', false],
      ['state_id', 'State / UT (Location Association)', 'state_select', false],
      ['destination_id', 'Related Destination', 'destination_select', false],
      ['cover_image_url', 'Cover Image URL', 'url', false],
      ['cover_image_alt', 'Cover Image Alt Text', 'text', false],
      ['excerpt_en', 'Excerpt / Summary (English)', 'textarea', false],
      ['body_en', 'Article Body (Markdown supported)', 'textarea', false],
      ['seo_title_en', 'SEO Meta Title', 'text', false],
      ['seo_description_en', 'SEO Meta Description', 'textarea', false],
      ['canonical_url', 'Canonical URL (optional override)', 'url', false],
    ],
  },
  itineraries: {
    label: 'Itineraries',
    fields: [
      ['destination_id', 'Destination (Selection)', 'destination_select', false],
      ['slug', 'URL slug (auto-generated or custom)', 'text', true],
      ['title_en', 'Itinerary Title (English)', 'text', true],
      ['title_hi', 'Itinerary Title (Hindi)', 'text', false],
      ['duration_days', 'Duration in Days (e.g. 2, 3, 4, 7)', 'number', true],
      ['description_en', 'Detailed Day-by-Day Itinerary (Markdown supported)', 'textarea', true],
      ['description_hi', 'Description (Hindi)', 'textarea', false],
    ],
  },
  states: {
    label: 'States',
    fields: [
      ['slug', 'URL slug', 'text', true],
      ['name_en', 'Name · English', 'text', true],
      ['name_hi', 'Name · Hindi', 'text'],
      ['type', 'Type (STATE / UT)', 'text'],
      ['description_en', 'Description · English', 'textarea'],
      ['description_hi', 'Description · Hindi', 'textarea'],
    ],
  },
  districts: {
    label: 'Districts',
    fields: [
      ['state_id', 'State (Selection)', 'state_select', true],
      ['slug', 'URL slug', 'text', true],
      ['name_en', 'Name · English', 'text', true],
      ['name_hi', 'Name · Hindi', 'text'],
      ['description_en', 'Description · English', 'textarea'],
      ['description_hi', 'Description · Hindi', 'textarea'],
    ],
  },
  tehsils: {
    label: 'Local Areas (Tehsils)',
    fields: [
      ['district_id', 'District (Selection)', 'district_select', true],
      ['slug', 'URL slug', 'text', true],
      ['name_en', 'Name · English', 'text', true],
      ['name_hi', 'Name · Hindi', 'text'],
      ['local_label', 'Local label (Tehsil/Taluka)', 'text'],
      ['description_en', 'Description · English', 'textarea'],
      ['description_hi', 'Description · Hindi', 'textarea'],
    ],
  },
};

const statuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);

// Basic client-side safe Markdown to HTML preview renderer
function renderMarkdownPreview(md) {
  if (!md) return '<p>No content written yet.</p>';
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.2rem;margin:1.2rem 0 0.5rem;color:#153E3A;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.5rem;margin:1.5rem 0 0.6rem;color:#153E3A;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:1.8rem;margin:1.8rem 0 0.8rem;color:#153E3A;">$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left:4px solid #C58B32;padding:0.5rem 1rem;margin:1rem 0;background:#F7F3E8;color:#173633;font-style:italic;">$1</blockquote>');

  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<div style="margin:1.5rem 0;text-align:center;"><img src="$2" alt="$1" style="max-width:100%;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);"/><p style="font-size:0.8rem;color:#64736F;margin-top:0.3rem;">$1</p></div>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#247A72;text-decoration:underline;">$1</a>');

  // Bold / Italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Bullet Lists
  html = html.replace(/^\- (.*$)/gim, '<li style="margin-left:1.5rem;list-style-type:disc;">$1</li>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p style="margin:1rem 0;line-height:1.7;">');
  return `<div style="line-height:1.7;color:#173633;">${html}</div>`;
}

export default function ContentManager({ type, role }) {
  const config = configs[type];
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Reference lists for dropdown relations
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [tehsilsList, setTehsilsList] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);

  // Load states and destinations for convenient selector dropdowns
  useEffect(() => {
    async function loadRelations() {
      try {
        const [sRes, dRes, districtRes, tehsilRes] = await Promise.all([
          fetch('/api/admin/states?limit=100', { cache: 'no-store' }),
          fetch('/api/admin/destinations?limit=100', { cache: 'no-store' }),
          fetch('/api/admin/districts?limit=100', { cache: 'no-store' }),
          fetch('/api/admin/tehsils?limit=100', { cache: 'no-store' }),
        ]);
        if (sRes.ok) {
          const sData = await sRes.json();
          setStatesList(sData.data || []);
        }
        if (dRes.ok) {
          const dData = await dRes.json();
          setDestinationsList(dData.data || []);
        }
        if (districtRes.ok) {
          const districtData = await districtRes.json();
          setDistrictsList(districtData.data || []);
        }
        if (tehsilRes.ok) {
          const tehsilData = await tehsilRes.json();
          setTehsilsList(tehsilData.data || []);
        }
      } catch {
        // Fallback silently if offline or restricted
      }
    }
    void loadRelations();
  }, []);

  const refresh = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(q ? { q } : {}),
        ...(status ? { status } : {}),
      });
      const res = await fetch(`/api/admin/${type}?${params}`, { cache: 'no-store' });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Could not load content');
      setRows(payload.data || []);
      setPagination(payload.pagination || {});
    } catch (err) {
      setError(err.message || 'Could not load content');
    } finally {
      setBusy(false);
    }
  }, [type, page, q, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function newRecord() {
    setSelected(null);
    setForm({});
    setError('');
    setNotice('');
    setPreviewOpen(false);
  }

  function editRecord(row) {
    setSelected(row);
    setForm(Object.fromEntries(config.fields.map(([name]) => [name, row[name] ?? ''])));
    setError('');
    setNotice('');
    setPreviewOpen(false);
  }

  function handleFieldChange(name, val) {
    const next = { ...form, [name]: val };
    // Auto-generate slug when title/name changes on a new record or when slug is not manually entered
    if ((name === 'title_en' || name === 'name_en') && (!selected || !form.slug)) {
      next.slug = slugify(val);
    }
    // Auto-sync state_name if state_id is selected
    if (name === 'state_id' && statesList.length > 0) {
      const matched = statesList.find((s) => s.id === val);
      if (matched) {
        next.state_name = matched.name_en;
        next.district_id = '';
        next.tehsil_id = '';
      }
    }
    if (name === 'district_id') {
      const matched = districtsList.find((district) => district.id === val);
      if (matched) {
        next.district_name = matched.name_en;
        next.tehsil_id = '';
      }
    }
    setForm(next);
  }

  function insertMarkdown(prefix, suffix = '') {
    const current = form.body_en || '';
    setForm({ ...form, body_en: current + `\n${prefix}text${suffix}\n` });
  }

  function handleInsertImagePrompt() {
    const url = window.prompt('Enter Image URL (e.g. from Media Library or Unsplash):');
    if (!url) return;
    const alt = window.prompt('Enter image descriptive alt text (optional):', 'Travel photo') || 'Travel photo';
    const current = form.body_en || '';
    setForm({ ...form, body_en: current + `\n![${alt}](${url})\n` });
  }

  // Cover Image direct file upload to Supabase Storage
  async function handleCoverUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Cover image must be 5 MB or smaller.');
      return;
    }
    setUploadingCover(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'content-type': 'application/octet-stream' },
        body: file,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Upload failed');
      const uploadedUrl = payload.data?.public_url;
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, cover_image_url: uploadedUrl }));
        setNotice('Cover image uploaded and set successfully.');
      }
    } catch (err) {
      setError(err.message || 'Image upload failed. Verify storage bucket permissions.');
    } finally {
      setUploadingCover(false);
      event.target.value = '';
    }
  }

  async function save(event) {
    if (event) event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const payload = {};
      for (const [key, value] of Object.entries(form)) {
        if (value === '') continue;
        const def = config.fields.find(([name]) => name === key);
        payload[key] = def?.[2] === 'number' ? Number(value) : value;
      }
      const res = await fetch(`/api/admin/${type}${selected ? `/${selected.id}` : ''}`, {
        method: selected ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Could not save changes');
      setNotice(selected ? 'Changes saved successfully.' : 'Draft created successfully.');
      setSelected(result.data);
      setForm(Object.fromEntries(config.fields.map(([name]) => [name, result.data[name] ?? ''])));
      await refresh();
      return result.data;
    } catch (err) {
      setError(err.message || 'Could not save changes');
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(next) {
    if (!selected) {
      setError('Please save the draft first before changing status.');
      return;
    }
    const verb =
      next === 'PUBLISHED'
        ? 'publish'
        : next === 'DRAFT' && selected.status === 'PUBLISHED'
        ? 'unpublish'
        : next === 'ARCHIVED'
        ? 'archive'
        : 'move';
    if (!window.confirm(`Are you sure you want to ${verb} this ${config.label.slice(0, -1).toLowerCase()}?`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/${type}/${selected.id}/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Status change failed');
      setSelected(result.data);
      setNotice(`Status successfully changed to ${next.toLowerCase()}.`);
      await refresh();
    } catch (err) {
      setError(err.message || 'Status change failed');
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord() {
    if (!selected) return;
    if (!window.confirm(`Are you sure you want to delete/archive "${selected.title_en || selected.name_en || selected.slug}"? This action cannot be easily undone.`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/${type}/${selected.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Delete failed');
      setNotice('Record archived / deleted.');
      newRecord();
      await refresh();
    } catch (err) {
      setError(err.message || 'Delete operation failed');
    } finally {
      setBusy(false);
    }
  }

  if (!config) return <p className="error">Unknown content type.</p>;

  const publicHref = selected?.status === 'PUBLISHED'
    ? ({ articles: `/articles/${selected.slug}`, destinations: `/destinations/${selected.slug}`, states: `/states/${selected.slug}` }[type] || null)
    : null;

  // Filter rows locally if category filter is active
  const displayedRows = categoryFilter
    ? rows.filter((r) => r.category && r.category.toLowerCase().includes(categoryFilter.toLowerCase()))
    : rows;

  return (
    <section className="manager-grid">
      {/* ====================================================
          LIST PANEL (LEFT COLUMN)
          ==================================================== */}
      <div className="list-panel">
        <div className="list-toolbar">
          <label className="search-label">
            Search
            <input
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder={`Search ${config.label.toLowerCase()}…`}
              maxLength={100}
            />
          </label>

          <label className="filter-label">
            Status
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          {type === 'articles' && (
            <label className="filter-label" style={{ width: '130px' }}>
              Category
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All categories</option>
                <option value="Travel Guide">Travel Guide</option>
                <option value="Heritage">Heritage</option>
                <option value="Culture">Culture</option>
                <option value="Food">Food</option>
                <option value="Planning">Planning</option>
              </select>
            </label>
          )}

          <button className="button primary" onClick={newRecord}>
            + New {config.label.slice(0, -1)}
          </button>
        </div>

        {error && !selected && <p className="error" role="alert" style={{ margin: '1rem' }}>{error}</p>}
        {busy && !rows.length ? (
          <p className="loading">Loading {config.label.toLowerCase()}…</p>
        ) : displayedRows.length === 0 ? (
          <div className="empty">
            <span>✦</span>
            <h2>No {config.label.toLowerCase()} found</h2>
            <p>Try clearing search filters or create a new record.</p>
          </div>
        ) : (
          <div className="record-list">
            {displayedRows.map((row) => {
              const isDemo =
                row.tags?.includes('demo') ||
                row.title_en?.includes('Nawalgarh') ||
                row.category === 'Demo Guide';
              return (
                <button
                  key={row.id}
                  className={`record-row ${selected?.id === row.id ? 'active' : ''}`}
                  onClick={() => editRecord(row)}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <b>{row.name_en || row.title_en || row.slug}</b>
                      {isDemo && (
                        <span style={{ fontSize: '0.62rem', background: '#e8eee4', color: '#153E3A', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          DEMO
                        </span>
                      )}
                    </div>
                    <small style={{ color: '#73817a' }}>
                      {row.category ? `${row.category} · ` : ''}{row.slug}
                    </small>
                  </span>
                  <span className={`status status-${row.status?.toLowerCase()}`}>{row.status}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="pagination">
          <span>{pagination.total || rows.length} records</span>
          <div>
            <button className="button subtle" disabled={page <= 1 || busy} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>Page {pagination.page || page} of {pagination.totalPages || 1}</span>
            <button
              className="button subtle"
              disabled={page >= (pagination.totalPages || 1) || busy}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================
          EDITOR PANEL (RIGHT COLUMN)
          ==================================================== */}
      <div className="editor-panel">
        <div className="editor-heading">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p className="eyebrow">{selected ? 'EDIT RECORD' : 'NEW RECORD'}</p>
              {selected?.status === 'PUBLISHED' && (
                <span style={{ fontSize: '0.65rem', background: '#e1f1e4', color: '#327243', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
                  LIVE ON SITE
                </span>
              )}
            </div>
            <h2>
              {selected
                ? selected.name_en || selected.title_en || selected.slug
                : `Create ${config.label.slice(0, -1).toLowerCase()}`}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {type === 'articles' && (
              <button
                type="button"
                className="button subtle"
                onClick={() => setPreviewOpen(!previewOpen)}
                style={{ background: previewOpen ? '#153E3A' : '', color: previewOpen ? '#fff' : '' }}
              >
                {previewOpen ? 'Close Preview' : '👁 Preview'}
              </button>
            )}
            {selected && (
              <span className={`status status-${selected.status?.toLowerCase()}`}>{selected.status}</span>
            )}
          </div>
        </div>

        {error && selected && <p className="error" role="alert" style={{ marginTop: '1rem' }}>{error}</p>}
        {notice && <p className="success" role="status" style={{ marginTop: '1rem' }}>{notice}</p>}

        {/* ====================================================
            LIVE PREVIEW DRAWER (FOR ARTICLES)
            ==================================================== */}
        {previewOpen && type === 'articles' && (
          <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: '#F7F3E8', border: '1px solid #DCE4DC', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C58B32', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                LIVE PREVIEW: {form.category || 'Article'}
              </span>
              <button type="button" className="button subtle" onClick={() => setPreviewOpen(false)}>✕</button>
            </div>
            {form.cover_image_url && (
              <div style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                <img src={form.cover_image_url} alt={form.cover_image_alt || 'Cover'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.8rem', color: '#153E3A', margin: '0 0 0.5rem 0' }}>
              {form.title_en || 'Untitled Article'}
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64736F', margin: '0 0 1rem 0' }}>
              By {form.author_name || 'BharatYatra Editorial'} · {Math.max(2, Math.ceil((form.body_en || '').split(/\s+/).length / 200))} min read
            </p>
            {form.excerpt_en && (
              <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#173633', fontStyle: 'italic', borderLeft: '3px solid #C58B32', paddingLeft: '1rem', margin: '1rem 0' }}>
                {form.excerpt_en}
              </p>
            )}
            <div dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(form.body_en) }} />
          </div>
        )}

        {/* ====================================================
            MAIN FORM
            ==================================================== */}
        <form className="editor-form" onSubmit={save}>
          {/* Quick Actions Row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button type="submit" className="button primary" disabled={busy}>
              {busy ? 'Saving…' : selected ? 'Save Changes' : 'Create Draft'}
            </button>

            {role === 'admin' && selected && selected.status !== 'PUBLISHED' && (
              <button
                type="button"
                className="button"
                style={{ background: '#e1f1e4', color: '#276738', borderColor: '#c9e0cd' }}
                disabled={busy}
                onClick={() => changeStatus('PUBLISHED')}
              >
                ✓ Publish Now
              </button>
            )}

            {role === 'admin' && selected && selected.status === 'PUBLISHED' && (
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={() => changeStatus('DRAFT')}
              >
                ↩ Unpublish to Draft
              </button>
            )}

            {selected && (
              <button
                type="button"
                className="button danger"
                disabled={busy}
                onClick={deleteRecord}
              >
                🗑 Delete / Archive
              </button>
            )}

            {publicHref && (
              <a
                href={`http://localhost:3000${publicHref}`}
                target="_blank"
                rel="noreferrer"
                className="button subtle"
                style={{ marginLeft: 'auto' }}
              >
                View Public URL ↗
              </a>
            )}
          </div>

          <div className="field-grid">
            {config.fields.map(([name, label, kind, required]) => {
              // Custom State Dropdown Selector
              if (kind === 'state_select') {
                return (
                  <label key={name}>
                    {label}
                    <select
                      value={form[name] || ''}
                      required={required}
                      onChange={(e) => handleFieldChange(name, e.target.value)}
                    >
                      <option value="">— Select State / UT —</option>
                      {statesList.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name_en} ({st.type})
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }

              // Custom Destination Dropdown Selector
              if (kind === 'destination_select') {
                return (
                  <label key={name}>
                    {label}
                    <select
                      value={form[name] || ''}
                      required={required}
                      onChange={(e) => handleFieldChange(name, e.target.value)}
                    >
                      <option value="">— Select Related Destination —</option>
                      {destinationsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name_en} ({d.state_name || 'India'})
                        </option>
                      ))}
                    </select>
                  </label>
                );
              }

              if (kind === 'district_select') {
                const availableDistricts = districtsList.filter((district) => !form.state_id || district.state_id === form.state_id);
                return (
                  <label key={name}>
                    {label}
                    <select value={form[name] || ''} required={required} onChange={(e) => handleFieldChange(name, e.target.value)}>
                      <option value="">— Select District —</option>
                      {availableDistricts.map((district) => <option key={district.id} value={district.id}>{district.name_en}</option>)}
                    </select>
                  </label>
                );
              }

              if (kind === 'tehsil_select') {
                const availableTehsils = tehsilsList.filter((tehsil) => !form.district_id || tehsil.district_id === form.district_id);
                return (
                  <label key={name}>
                    {label}
                    <select value={form[name] || ''} required={required} onChange={(e) => handleFieldChange(name, e.target.value)}>
                      <option value="">— Select Tehsil / Sub-district —</option>
                      {availableTehsils.map((tehsil) => <option key={tehsil.id} value={tehsil.id}>{tehsil.name_en}{tehsil.local_label ? ` (${tehsil.local_label})` : ''}</option>)}
                    </select>
                  </label>
                );
              }

              // Cover Image URL with Direct Upload Button & Preview
              if (name === 'cover_image_url') {
                return (
                  <div key={name} className="span-two" style={{ background: '#f8f7f2', padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>Cover Image</span>
                      <label className="button subtle" style={{ cursor: 'pointer', margin: 0 }}>
                        {uploadingCover ? 'Uploading to Supabase…' : '📁 Upload New File'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={handleCoverUpload}
                          style={{ display: 'none' }}
                          disabled={uploadingCover}
                        />
                      </label>
                    </div>

                    <input
                      type="url"
                      value={form.cover_image_url || ''}
                      placeholder="https://... (or upload file above)"
                      onChange={(e) => handleFieldChange('cover_image_url', e.target.value)}
                      style={{ marginBottom: '8px' }}
                    />

                    {form.cover_image_url && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '120px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)' }}>
                          <img src={form.cover_image_url} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <small style={{ color: '#73817a' }}>Cover image loaded. Alt text can be customized below.</small>
                      </div>
                    )}
                  </div>
                );
              }

              // Textarea with Markdown Toolbar for body_en
              if (kind === 'textarea') {
                return (
                  <label key={name} className="span-two">
                    {label}
                    {name === 'body_en' && (
                      <div style={{ display: 'flex', gap: '6px', margin: '6px 0', flexWrap: 'wrap' }}>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('## ')}>H2</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('### ')}>H3</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('**', '**')}>Bold</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('*', '*')}>Italic</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('> ')}>Quote</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('- ')}>Bullet List</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => insertMarkdown('1. ')}>Numbered</button>
                        <button type="button" className="button subtle" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={handleInsertImagePrompt}>🖼 Insert Image</button>
                      </div>
                    )}
                    <textarea
                      rows={name === 'body_en' ? 14 : 3}
                      value={form[name] || ''}
                      required={required}
                      maxLength={50000}
                      onChange={(e) => handleFieldChange(name, e.target.value)}
                    />
                  </label>
                );
              }

              // Standard Input
              return (
                <label key={name}>
                  {label}
                  <input
                    type={kind}
                    value={form[name] || ''}
                    required={required}
                    maxLength={kind === 'url' ? 2048 : 10000}
                    step={kind === 'number' ? 'any' : undefined}
                    onChange={(e) => handleFieldChange(name, e.target.value)}
                  />
                </label>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
            <button className="button primary" disabled={busy}>
              {busy ? 'Saving…' : selected ? 'Save Changes' : 'Create Draft'}
            </button>
          </div>
        </form>

        {/* Existing ContentImageManager fallback slot for backward compatibility */}
        {selected && (type === 'destinations' || type === 'attractions' || (type === 'articles' && !form.cover_image_url)) && (
          <ContentImageManager type={type} slug={selected.slug} />
        )}
      </div>
    </section>
  );
}
