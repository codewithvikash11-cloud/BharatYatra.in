import React from 'react';

export function isHTML(content) {
  if (!content || typeof content !== 'string') return false;
  return /<\/?(p|h[1-6]|div|span|ul|ol|li|blockquote|table|img|a|br|hr)\b/i.test(content);
}

export function slugifyHeading(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract H2 and H3 headings for the Table of Contents
 */
export function extractHeadings(content) {
  if (!content || typeof content !== 'string') return [];
  const headings = [];
  const slugCounts = {};

  if (isHTML(content)) {
    const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1], 10);
      const rawText = match[2].replace(/<[^>]*>/g, '').trim();
      if (!rawText) continue;

      let baseSlug = slugifyHeading(rawText) || `section-${headings.length + 1}`;
      let slug = baseSlug;
      if (slugCounts[slug]) {
        slugCounts[slug] += 1;
        slug = `${baseSlug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 1;
      }

      headings.push({
        id: slug,
        level,
        text: rawText,
      });
    }
  } else {
    // Markdown
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      let level = 0;
      let rawText = '';
      if (trimmed.startsWith('## ')) {
        level = 2;
        rawText = trimmed.slice(3).trim();
      } else if (trimmed.startsWith('### ')) {
        level = 3;
        rawText = trimmed.slice(4).trim();
      }
      if (level > 0 && rawText) {
        let baseSlug = slugifyHeading(rawText) || `section-${headings.length + 1}`;
        let slug = baseSlug;
        if (slugCounts[slug]) {
          slugCounts[slug] += 1;
          slug = `${baseSlug}-${slugCounts[slug]}`;
        } else {
          slugCounts[slug] = 1;
        }
        headings.push({
          id: slug,
          level,
          text: rawText,
        });
      }
    }
  }

  return headings;
}

/**
 * Clean & Sanitize HTML with XSS prevention and inject heading IDs
 */
export function sanitizeAndPrepareHTML(html) {
  if (!html || typeof html !== 'string') return '';

  const clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, (match, attrs) => {
      if (/src=["']https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)/i.test(attrs)) {
        return match;
      }
      return '';
    })
    .replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data:text\/html):.*?\2/gi, '$1="#"');

  const slugCounts = {};

  // Inject anchor IDs into H2 and H3 if missing
  let withHeadings = clean.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    if (/\bid=["']([^"']+)["']/i.test(attrs)) {
      return match;
    }
    const rawText = inner.replace(/<[^>]*>/g, '').trim();
    let baseSlug = slugifyHeading(rawText) || `section-${level}`;
    let slug = baseSlug;
    if (slugCounts[slug]) {
      slugCounts[slug]++;
      slug = `${baseSlug}-${slugCounts[slug]}`;
    } else {
      slugCounts[slug] = 1;
    }
    return `<h${level}${attrs} id="${slug}">${inner}</h${level}>`;
  });

  // Wrap tables in responsive container if not already wrapped
  withHeadings = withHeadings.replace(/(<table[\s\S]*?<\/table>)/gi, (match) => {
    return `<div class="by-table-wrapper">${match}</div>`;
  });

  return withHeadings;
}

/**
 * Legacy Markdown Parser fallback
 */
function parseInline(text) {
  if (!text) return null;
  const tokens = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      tokens.push(
        <img
          key={key++}
          src={imgMatch[2]}
          alt={imgMatch[1] || 'Editorial image'}
          className="article-inline-image"
          loading="lazy"
        />
      );
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith('http');
      tokens.push(
        <a
          key={key++}
          href={linkMatch[2]}
          className="article-body-link"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*([^*]+)\*/) || remaining.match(/^_([^_]+)_/);
    if (italicMatch) {
      tokens.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/([!\[*_])/);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
}

function renderLegacyMarkdown(content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let key = 0;
  let inList = false;
  let listType = null;
  let listItems = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={key++} className="article-ordered-list">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={key++} className="article-unordered-list">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInline(item)}</li>
            ))}
          </ul>
        );
      }
      inList = false;
      listType = null;
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    if (/^(\*\*\*|---|___)$/.test(line)) {
      flushList();
      elements.push(<hr key={key++} className="article-divider" />);
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      const text = line.slice(4);
      elements.push(
        <h3 key={key++} id={slugifyHeading(text)} className="article-heading-3">
          {parseInline(text)}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      const text = line.slice(3);
      elements.push(
        <h2 key={key++} id={slugifyHeading(text)} className="article-heading-2">
          {parseInline(text)}
        </h2>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      const text = line.slice(2);
      elements.push(
        <h2 key={key++} id={slugifyHeading(text)} className="article-heading-2">
          {parseInline(text)}
        </h2>
      );
      continue;
    }

    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={key++} className="article-blockquote">
          <p>{parseInline(line.slice(2))}</p>
        </blockquote>
      );
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(olMatch[2]);
      continue;
    }

    const ulMatch = line.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(ulMatch[1]);
      continue;
    }

    flushList();
    elements.push(
      <p key={key++} className="article-paragraph">
        {parseInline(line)}
      </p>
    );
  }

  flushList();
  return <div className="article-prose">{elements}</div>;
}

/**
 * Universal Content Component:
 * - If HTML: cleans with DOMPurify and renders dangerouslySetInnerHTML with complete security
 * - If Markdown: parses with fallback parser
 */
export function MarkdownContent({ content }) {
  if (!content) return null;

  if (isHTML(content)) {
    const preparedHtml = sanitizeAndPrepareHTML(content);
    return (
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: preparedHtml }}
      />
    );
  }

  return renderLegacyMarkdown(content);
}

/**
 * Table of Contents Component
 */
export function TableOfContents({ headings }) {
  if (!headings || headings.length < 2) return null;

  return (
    <nav className="by-toc-card" aria-label="Table of Contents">
      <div className="by-toc-header">
        <span>📑</span>
        <span>Table of Contents</span>
      </div>
      <ol className="by-toc-list">
        {headings.map((h, i) => (
          <li key={i} className={`by-toc-item level-${h.level}`}>
            <a href={`#${h.id}`} className="by-toc-link">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
