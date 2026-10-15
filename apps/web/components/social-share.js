'use client';

import React, { useState } from 'react';

export default function SocialShare({ title, url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  const shareText = encodeURIComponent(title || 'BharatYatra Travel Guide');
  const shareUrl = encodeURIComponent(url || '');

  return (
    <div className="by-share-bar">
      <span className="by-share-label">Share:</span>
      <button
        type="button"
        onClick={handleCopy}
        className="by-share-btn"
        title="Copy article link"
      >
        <span>🔗</span>
        <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
      </button>

      <a
        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="by-share-btn"
        title="Share on WhatsApp"
      >
        <span>💬</span>
        <span>WhatsApp</span>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="by-share-btn"
        title="Share on X"
      >
        <span>🐦</span>
        <span>X / Twitter</span>
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="by-share-btn"
        title="Share on Facebook"
      >
        <span>📘</span>
        <span>Facebook</span>
      </a>
    </div>
  );
}
