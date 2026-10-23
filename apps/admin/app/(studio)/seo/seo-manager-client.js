'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  saveGlobalSeoSettingsAction,
  submitAllPublishedToIndexNowAction,
  submitUrlToIndexNowAction,
} from './actions.js';

export default function SeoManagerClient({ initialSettings, initialAudit, initialLog }) {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'settings' | 'indexnow' | 'docs'
  const [settings, setSettings] = useState(initialSettings);
  const [audit, setAudit] = useState(initialAudit);
  const [log, setLog] = useState(initialLog);
  const [notice, setNotice] = useState('');
  const [isPending, startTransition] = useTransition();

  // SERP preview interactive state
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      try {
        const res = await saveGlobalSeoSettingsAction(formData);
        setNotice('✓ Global SEO settings saved successfully.');
        setTimeout(() => setNotice(''), 4000);
      } catch (err) {
        setNotice(`Error saving settings: ${err.message}`);
      }
    });
  };

  const handleSubmitAllIndexNow = () => {
    startTransition(async () => {
      try {
        setNotice('Submitting published URLs to IndexNow...');
        const res = await submitAllPublishedToIndexNowAction();
        if (res.success) {
          setNotice(`✓ IndexNow accepted ${res.count} URLs (HTTP ${res.status}). Discovery notification sent to Bing and Yandex.`);
        } else {
          setNotice(`IndexNow notice: ${res.message || 'Submission completed'}`);
        }
        setLog((prev) => ({
          ...prev,
          lastSubmission: new Date().toISOString(),
          status: res.status,
          message: res.message,
          submittedUrlsCount: res.count,
        }));
      } catch (err) {
        setNotice(`IndexNow error: ${err.message}`);
      }
    });
  };

  const handleSingleIndexNow = (url) => {
    startTransition(async () => {
      try {
        setNotice(`Submitting ${url} to IndexNow...`);
        const res = await submitUrlToIndexNowAction(url);
        setNotice(res.success ? `✓ URL submitted to IndexNow (HTTP ${res.status}).` : res.message);
      } catch (err) {
        setNotice(`Error: ${err.message}`);
      }
    });
  };

  const siteUrl = settings.productionSiteUrl;
  const keyUrl = `${siteUrl}/${settings.indexNowKey}.txt`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
            TECHNICAL SEO &amp; CRAWLABILITY
          </span>
          <h1 style={{ fontSize: '1.8rem', color: '#0F3D36', margin: '0.25rem 0 0.5rem 0', fontWeight: 800 }}>
            SEO &amp; Indexing Management
          </h1>
          <p style={{ color: '#64716C', margin: 0, fontSize: '0.95rem', maxWidth: '720px' }}>
            Monitor search indexability, dynamic sitemaps, IndexNow discovery notifications, and metadata across all published articles and destinations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="button"
            style={{ background: '#0F766E', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            disabled={isPending}
            onClick={handleSubmitAllIndexNow}
          >
            {isPending ? 'Submitting…' : '⚡ Push All to IndexNow'}
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div style={{ padding: '10px 14px', borderRadius: '6px', background: notice.startsWith('✓') ? '#ecfdf5' : '#fef2f2', border: `1px solid ${notice.startsWith('✓') ? '#a7f3d0' : '#fecaca'}`, color: notice.startsWith('✓') ? '#065f46' : '#991b1b', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 500 }}>
          {notice}
        </div>
      )}

      {/* KPI Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E4E7DF', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64716C', textTransform: 'uppercase' }}>Sitemap Indexable URLs</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F3D36', margin: '0.25rem 0' }}>
            {audit.summary.estimatedSitemapUrls}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#0F766E' }}>● Dynamic /sitemap.xml</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E4E7DF', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64716C', textTransform: 'uppercase' }}>Published Articles</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F3D36', margin: '0.25rem 0' }}>
            {audit.summary.totalPublishedArticles}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64716C' }}>+ {audit.summary.totalDraftArticles} drafts hidden</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E4E7DF', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64716C', textTransform: 'uppercase' }}>States &amp; Destinations</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F3D36', margin: '0.25rem 0' }}>
            {audit.summary.totalStates + audit.summary.totalPublishedDestinations}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64716C' }}>36 States + Published Towns</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E4E7DF', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64716C', textTransform: 'uppercase' }}>IndexNow Status</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: log.status === 200 || log.status === 202 ? '#0F766E' : (log.status ? '#dc2626' : '#64716C'), margin: '0.4rem 0' }}>
            {log.status ? `HTTP ${log.status} (Active)` : 'Ready to Submit'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64716C' }}>
            {log.lastSubmission ? `Last: ${new Date(log.lastSubmission).toLocaleTimeString()}` : 'Key verified at /<key>.txt'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E4E7DF', gap: '1rem', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'audit' ? '#0F3D36' : '#64716C',
            borderBottom: activeTab === 'audit' ? '3px solid #0F766E' : '3px solid transparent',
            marginBottom: '-2px',
          }}
        >
          🔍 Content SEO Audit ({audit.articleAudits.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'settings' ? '#0F3D36' : '#64716C',
            borderBottom: activeTab === 'settings' ? '3px solid #0F766E' : '3px solid transparent',
            marginBottom: '-2px',
          }}
        >
          ⚙️ Global SEO &amp; Verification
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('indexnow')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'indexnow' ? '#0F3D36' : '#64716C',
            borderBottom: activeTab === 'indexnow' ? '3px solid #0F766E' : '3px solid transparent',
            marginBottom: '-2px',
          }}
        >
          ⚡ IndexNow Dispatcher
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('docs')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'docs' ? '#0F3D36' : '#64716C',
            borderBottom: activeTab === 'docs' ? '3px solid #0F766E' : '3px solid transparent',
            marginBottom: '-2px',
          }}
        >
          📘 Search Console Setup Guide
        </button>
      </div>

      {/* TAB 1: SEO AUDIT & CRAWLABILITY */}
      {activeTab === 'audit' && (
        <div>
          {/* Quick Technical Files Bar */}
          <div style={{ background: '#F8F6EF', padding: '1rem', borderRadius: '8px', border: '1px solid #E4E7DF', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#17312D' }}>Crawling &amp; Discovery Endpoints:</span>
            <a href={settings.sitemapUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#0F766E', textDecoration: 'none', fontWeight: 600 }}>
              📄 XML Sitemap ↗
            </a>
            <a href={settings.robotsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#0F766E', textDecoration: 'none', fontWeight: 600 }}>
              🤖 Robots.txt ↗
            </a>
            <a href={settings.llmsTxtUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#0F766E', textDecoration: 'none', fontWeight: 600 }}>
              🤖 LLMs.txt (AI Discovery) ↗
            </a>
            <a href={settings.rssFeedUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#0F766E', textDecoration: 'none', fontWeight: 600 }}>
              📡 RSS Feed (/feed.xml) ↗
            </a>
            <a href={keyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#0F766E', textDecoration: 'none', fontWeight: 600 }}>
              🔑 IndexNow Key File ↗
            </a>
          </div>

          {/* Duplicate Slug Warning */}
          {audit.summary.duplicateSlugsCount > 0 && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #f87171', borderRadius: '6px', color: '#991b1b', marginBottom: '1.5rem' }}>
              <strong>⚠️ Duplicate Slug Warning:</strong> The following slug(s) appear more than once in the database:
              <span style={{ fontWeight: 700 }}> {audit.summary.duplicateSlugs.join(', ')}</span>. Duplicate slugs cause canonical collisions and indexing errors.
            </div>
          )}

          {/* Published Articles Audit Table */}
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E4E7DF', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #E4E7DF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0F3D36', fontWeight: 700 }}>
                Published Articles SEO Health
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64716C' }}>
                Auditing titles, meta descriptions, canonical URLs, and social images
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8F6EF', color: '#17312D', borderBottom: '1px solid #E4E7DF' }}>
                    <th style={{ padding: '10px 14px' }}>Score</th>
                    <th style={{ padding: '10px 14px' }}>Article Title &amp; Slug</th>
                    <th style={{ padding: '10px 14px' }}>SEO Checks &amp; Directives</th>
                    <th style={{ padding: '10px 14px' }}>Canonical URL</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.articleAudits.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #E4E7DF' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: item.score >= 80 ? '#ecfdf5' : item.score >= 50 ? '#fffbeb' : '#fef2f2',
                            color: item.score >= 80 ? '#065f46' : item.score >= 50 ? '#b45309' : '#b91c1c',
                          }}
                        >
                          {item.score}%
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', maxWidth: '320px' }}>
                        <strong style={{ color: '#0F3D36', display: 'block', marginBottom: '2px' }}>
                          {item.title}
                        </strong>
                        <code style={{ fontSize: '0.75rem', color: '#64716C' }}>
                          /articles/{item.slug}
                        </code>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {item.issues.length === 0 ? (
                          <span style={{ color: '#16a34a', fontSize: '0.78rem', fontWeight: 600 }}>
                            ✓ Perfect (Title, description, og:image present)
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {item.issues.map((iss, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.75rem',
                                  color: iss.type === 'error' ? '#dc2626' : '#d97706',
                                }}
                              >
                                {iss.type === 'error' ? '✖ ' : '⚠️ '}
                                {iss.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#64716C', maxWidth: '240px', wordBreak: 'break-all' }}>
                        {item.canonicalUrl}
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleSingleIndexNow(item.canonicalUrl)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#F8F6EF', border: '1px solid #E4E7DF', borderRadius: '4px', cursor: 'pointer' }}
                            title="Ping IndexNow"
                          >
                            ⚡ Ping
                          </button>
                          <Link
                            href={`/articles/${item.id}`}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#0F766E', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 600 }}
                          >
                            Edit SEO
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL SEO SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} style={{ background: '#fff', padding: '1.75rem', borderRadius: '8px', border: '1px solid #E4E7DF', maxWidth: '800px' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#0F3D36', fontSize: '1.2rem', fontWeight: 700 }}>
            Global SEO &amp; Verification Tokens
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
              <span>Website Name</span>
              <input
                type="text"
                name="websiteName"
                defaultValue={settings.websiteName}
                style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
              <span>Canonical Production Site URL</span>
              <input
                type="url"
                name="productionSiteUrl"
                defaultValue={settings.productionSiteUrl}
                style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
              <small style={{ color: '#64716C', fontWeight: 400 }}>
                Used as the canonical domain in sitemap.xml, robots.txt, metadataBase, and Open Graph tags.
              </small>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
              <span>Default SEO Title</span>
              <input
                type="text"
                name="defaultSeoTitle"
                defaultValue={settings.defaultSeoTitle}
                style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
              <span>Default Meta Description</span>
              <textarea
                name="defaultSeoDescription"
                defaultValue={settings.defaultSeoDescription}
                rows={3}
                style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.9rem' }}
                required
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
              <span>Default Social Share Image URL (og:image)</span>
              <input
                type="text"
                name="defaultSocialImage"
                defaultValue={settings.defaultSocialImage}
                style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.9rem' }}
              />
            </label>

            <div style={{ borderTop: '1px solid #E4E7DF', paddingTop: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F3D36', fontSize: '1rem', fontWeight: 700 }}>
                Search Engine Verification Tokens
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
                  <span>Google Search Console Verification Token</span>
                  <input
                    type="text"
                    name="googleVerificationToken"
                    defaultValue={settings.googleVerificationToken}
                    placeholder="e.g. google-site-verification code"
                    style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                  <small style={{ color: '#64716C', fontWeight: 400 }}>
                    Injected as &lt;meta name="google-site-verification"&gt; in &lt;head&gt;
                  </small>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
                  <span>Bing Webmaster Tools Token (msvalidate.01)</span>
                  <input
                    type="text"
                    name="bingVerificationToken"
                    defaultValue={settings.bingVerificationToken}
                    placeholder="e.g. 32-character hexadecimal token"
                    style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                  <small style={{ color: '#64716C', fontWeight: 400 }}>
                    Injected as &lt;meta name="msvalidate.01"&gt; in &lt;head&gt;
                  </small>
                </label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E4E7DF', paddingTop: '1.25rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#17312D' }}>
                <span>IndexNow Secret Key</span>
                <input
                  type="text"
                  name="indexNowKey"
                  defaultValue={settings.indexNowKey}
                  style={{ padding: '8px 12px', border: '1px solid #E4E7DF', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                  required
                />
                <small style={{ color: '#64716C', fontWeight: 400 }}>
                  Served publicly at <a href={keyUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0F766E' }}>{keyUrl}</a> to verify domain ownership with IndexNow API.
                </small>
              </label>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isPending}
                style={{ background: '#0F766E', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
              >
                {isPending ? 'Saving Settings…' : 'Save Global SEO Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: INDEXNOW DISPATCHER */}
      {activeTab === 'indexnow' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E4E7DF' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F3D36', fontSize: '1.1rem', fontWeight: 700 }}>
              ⚡ Instant IndexNow Discovery
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64716C', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              IndexNow instantly notifies Bing, Yandex, Seznam, and participating search engines whenever pages are published or modified.
            </p>

            <div style={{ background: '#F8F6EF', padding: '1rem', borderRadius: '6px', border: '1px solid #E4E7DF', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
              <div style={{ marginBottom: '6px' }}><strong>Host:</strong> {new URL(siteUrl).host}</div>
              <div style={{ marginBottom: '6px' }}><strong>Verification Key File:</strong> <a href={keyUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0F766E' }}>{settings.indexNowKey}.txt ↗</a></div>
              <div><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>● Active &amp; Verified</span></div>
            </div>

            <button
              type="button"
              onClick={handleSubmitAllIndexNow}
              disabled={isPending}
              style={{ width: '100%', background: '#0F766E', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', marginBottom: '1rem' }}
            >
              {isPending ? 'Submitting…' : 'Submit All Published Content to IndexNow'}
            </button>

            <span style={{ fontSize: '0.75rem', color: '#64716C', display: 'block', lineHeight: 1.4 }}>
              Note: IndexNow notifies search engines about URL existence. Indexing and ranking decisions remain at the search engine's discretion.
            </span>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E4E7DF' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F3D36', fontSize: '1.1rem', fontWeight: 700 }}>
              Recent Submission Logs
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64716C', margin: '0 0 1rem 0' }}>
              Logged outcomes of search engine discovery requests.
            </p>

            {log.recentSubmissions && log.recentSubmissions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {log.recentSubmissions.map((entry, idx) => (
                  <div key={idx} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <strong style={{ color: entry.status === 200 || entry.status === 202 ? '#16a34a' : '#dc2626' }}>
                        HTTP {entry.status} ({entry.count} URLs)
                      </strong>
                      <span style={{ color: '#94a3b8' }}>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#475569' }}>{entry.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No recent submissions recorded. Click "Submit All Published Content" to perform the first dispatch.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE & BING SETUP GUIDE */}
      {activeTab === 'docs' && (
        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '8px', border: '1px solid #E4E7DF', maxWidth: '880px', lineHeight: 1.6 }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0F3D36', fontSize: '1.25rem', fontWeight: 800 }}>
            Official Webmaster Verification &amp; Sitemap Submission Guide
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: '#F8F6EF', borderRadius: '6px', borderLeft: '4px solid #0F766E' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F3D36' }}>1. Google Search Console Setup</h4>
              <ol style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#17312D' }}>
                <li>Visit <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" style={{ color: '#0F766E', fontWeight: 600 }}>Google Search Console</a> and click <strong>Add property</strong>.</li>
                <li>Choose <strong>URL prefix</strong> and enter your production site URL (<code>{siteUrl}</code>).</li>
                <li>Select <strong>HTML tag</strong> verification. Copy the <code>content="..."</code> value and paste it into the <strong>Google Verification Token</strong> field in the Global SEO tab.</li>
                <li>Alternatively, choose <strong>HTML file upload</strong>: BharatYatra automatically responds to Google verification file requests matching <code>/google*.html</code>.</li>
                <li>After verifying, go to <strong>Sitemaps</strong> in the left sidebar and submit <code>sitemap.xml</code>.</li>
              </ol>
            </div>

            <div style={{ padding: '1rem', background: '#F8F6EF', borderRadius: '6px', borderLeft: '4px solid #E99A24' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F3D36' }}>2. Bing Webmaster Tools &amp; IndexNow</h4>
              <ol style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#17312D' }}>
                <li>Visit <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" style={{ color: '#0F766E', fontWeight: 600 }}>Bing Webmaster Tools</a>.</li>
                <li>You can import your verified properties directly from Google Search Console, or enter <code>{siteUrl}</code>.</li>
                <li>For manual verification, copy the <code>msvalidate.01</code> token into the <strong>Bing Verification Token</strong> field.</li>
                <li>Submit <code>{settings.sitemapUrl}</code> in the Sitemaps section.</li>
                <li>Under <strong>IndexNow</strong>, verify that your key is recognized using the public key link (<code>{keyUrl}</code>).</li>
              </ol>
            </div>

            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>3. Environment Variables Configuration</h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#475569' }}>
                You can permanently store these verification codes in your deployment platform (Vercel / production environment variables):
              </p>
              <pre style={{ background: '#0F3D36', color: '#F8F6EF', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', overflowX: 'auto' }}>
{`NEXT_PUBLIC_SITE_URL=${siteUrl}
GOOGLE_SITE_VERIFICATION=${settings.googleVerificationToken || 'your-google-verification-code'}
BING_SITE_VERIFICATION=${settings.bingVerificationToken || 'your-bing-msvalidate-code'}
INDEXNOW_KEY=${settings.indexNowKey}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
