// Zero-dependency, safe Markdown to JSX parser for BharatYatra editorial content
import React from 'react';

function parseInline(text) {
  if (!text) return null;

  // Split by inline markdown patterns: images, links, bold, italic, code
  const tokens = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // 1. Image: ![alt](url)
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

    // 2. Link: [text](url)
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

    // 3. Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 4. Italic: *text* or _text_
    const italicMatch = remaining.match(/^\*([^*]+)\*/) || remaining.match(/^_([^_]+)_/);
    if (italicMatch) {
      tokens.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Plain text up to next special character
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

export function MarkdownContent({ content }) {
  if (!content) return null;

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let key = 0;
  let inList = false;
  let listType = null; // 'ul' | 'ol'
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

    // Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(line)) {
      flushList();
      elements.push(<hr key={key++} className="article-divider" />);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="article-heading-3">
          {parseInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="article-heading-2">
          {parseInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="article-heading-2">
          {parseInline(line.slice(2))}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={key++} className="article-blockquote">
          <p>{parseInline(line.slice(2))}</p>
        </blockquote>
      );
      continue;
    }

    // Ordered list: "1. "
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

    // Unordered list: "- " or "* "
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

    // Regular paragraph
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
