'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DestinationInteractiveClient({ destination, galleryPhotos = [] }) {
  const [isSaved, setIsSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeItineraryTab, setActiveItineraryTab] = useState('2days');
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState('overview');
  
  // Trip planner form state in sidebar
  const [tripFrom, setTripFrom] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripTravellers, setTripTravellers] = useState('2 Travellers');

  const router = useRouter();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      setIsSaved(stored.some((item) => item.slug === destination.slug));
    } catch {}
  }, [destination.slug]);

  const toggleSave = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      let updated;
      if (isSaved) {
        updated = stored.filter((item) => item.slug !== destination.slug);
        setIsSaved(false);
      } else {
        updated = [
          ...stored,
          {
            slug: destination.slug,
            title: destination.name,
            subtitle: destination.state,
            image: destination.coverUrl,
            url: `/destinations/${destination.slug}`,
          },
        ];
        setIsSaved(true);
      }
      localStorage.setItem('bharatyatra_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharatyatra_favorites_updated'));
    } catch {}
  };

  const handleShare = async () => {
    const shareData = {
      title: `${destination.name} Travel Guide | BharatYatra`,
      text: `Discover ${destination.name}, ${destination.state} on BharatYatra.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 3000);
      } catch {}
    }
  };

  const handlePlanTripSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      destination: destination.name,
      from: tripFrom,
      date: tripDate,
      travellers: tripTravellers,
    });
    router.push(`/trip-planner?${query.toString()}`);
  };

  return (
    <>
      {/* 1. Top Hero Actions (Save & Share) */}
      <div className="by-dest-hero-actions">
        <button
          type="button"
          onClick={toggleSave}
          className={`by-dest-action-btn ${isSaved ? 'is-active' : ''}`}
          aria-label={isSaved ? 'Remove from saved places' : 'Save to wishlist'}
        >
          <span style={{ color: isSaved ? '#B9653F' : 'inherit' }}>{isSaved ? '❤️' : '♡'}</span>
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="by-dest-action-btn"
          aria-label="Share destination"
        >
          <span>↗</span>
          <span>Share</span>
        </button>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="by-toast-notification" role="status">
          ✓ Link copied to clipboard!
        </div>
      )}

      {/* 2. Floating Gallery Button on Hero */}
      {galleryPhotos.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setActivePhotoIdx(0);
            setGalleryOpen(true);
          }}
          className="by-hero-gallery-trigger"
          aria-label="View destination photo gallery"
        >
          <span className="camera-icon">📷</span>
          <span>View Gallery ({galleryPhotos.length}+ Photos)</span>
        </button>
      )}

      {/* 3. Photo Gallery Modal */}
      {galleryOpen && (
        <div
          className="by-gallery-modal-overlay"
          onClick={() => setGalleryOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${destination.name} Photo Gallery`}
        >
          <div className="by-gallery-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="by-gallery-header">
              <span className="by-gallery-counter">
                {activePhotoIdx + 1} / {galleryPhotos.length}
              </span>
              <span className="by-gallery-caption">
                {galleryPhotos[activePhotoIdx]?.title || destination.name}
              </span>
              <button
                type="button"
                className="by-gallery-close"
                onClick={() => setGalleryOpen(false)}
                aria-label="Close photo gallery"
              >
                ✕
              </button>
            </div>

            <div className="by-gallery-stage">
              <button
                type="button"
                className="by-gallery-nav-prev"
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1))
                }
                aria-label="Previous photo"
              >
                ‹
              </button>

              <div className="by-gallery-active-image-wrap">
                <img
                  src={galleryPhotos[activePhotoIdx]?.url}
                  alt={galleryPhotos[activePhotoIdx]?.title || destination.name}
                  className="by-gallery-active-img"
                />
              </div>

              <button
                type="button"
                className="by-gallery-nav-next"
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0))
                }
                aria-label="Next photo"
              >
                ›
              </button>
            </div>

            <div className="by-gallery-thumbs-row">
              {galleryPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`by-gallery-thumb-btn ${activePhotoIdx === idx ? 'active' : ''}`}
                  onClick={() => setActivePhotoIdx(idx)}
                >
                  <img src={photo.url} alt={photo.title} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Client wrapper for Itinerary Days tabs
export function DestinationItineraryTabs({ itineraries }) {
  const [activeTab, setActiveTab] = useState('2days');

  const currentItin = itineraries[activeTab] || itineraries['2days'];

  return (
    <div className="by-itinerary-widget">
      <div className="by-itin-tabs-header" role="tablist">
        {Object.entries(itineraries).map(([key, data]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={`by-itin-tab-pill ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {data.tabLabel}
          </button>
        ))}
      </div>

      <div className="by-itin-days-container">
        {currentItin.days.map((day, idx) => (
          <div key={idx} className="by-itin-day-card">
            <h4 className="by-itin-day-heading">{day.title}</h4>
            <ul className="by-itin-stops-list">
              {day.stops.map((stop, sIdx) => (
                <li key={sIdx} className="by-itin-stop-item">
                  <span className="by-itin-check">✓</span>
                  <div className="by-itin-stop-details">
                    <strong>{stop.name}</strong>
                    {stop.time && <span className="by-itin-time">({stop.time})</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="by-itin-action-row">
        <Link
          href={`/trip-planner?itinerary=${encodeURIComponent(currentItin.tabLabel)}`}
          className="by-itin-detailed-btn"
        >
          View Detailed Itinerary →
        </Link>
      </div>
    </div>
  );
}

// Client wrapper for History Read More toggle
export function DestinationHistoryToggle({ text, extendedText, image, imageAlt }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="by-history-widget">
      <div className="by-history-content">
        <p className="by-history-main-text">{text}</p>
        {expanded && extendedText && (
          <div className="by-history-extended-text">
            <p>{extendedText}</p>
          </div>
        )}
        {extendedText && (
          <button
            type="button"
            className="by-history-toggle-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Read Less ↑' : 'Read More ↓'}
          </button>
        )}
      </div>

      {image && (
        <div className="by-history-media">
          <img src={image} alt={imageAlt || 'Historical monument'} loading="lazy" />
        </div>
      )}
    </div>
  );
}

// Client wrapper for Sidebar Plan Your Trip form
export function SidebarPlanForm({ destinationName }) {
  const [fromCity, setFromCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState('2 Travellers');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      destination: destinationName,
      from: fromCity,
      date: travelDate,
      travellers,
    });
    router.push(`/trip-planner?${query.toString()}`);
  };

  return (
    <div className="by-sidebar-card by-sidebar-plan-card">
      <h3 className="by-sidebar-title">
        <span className="by-sidebar-title-icon">🗓</span> Plan Your Trip to {destinationName}
      </h3>
      <form onSubmit={handleSubmit} className="by-sidebar-form">
        <div className="by-sidebar-field">
          <label htmlFor="plan-from-city">From</label>
          <div className="by-sidebar-input-wrap">
            <span className="by-input-icon">📍</span>
            <input
              id="plan-from-city"
              type="text"
              placeholder="Your starting city"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="by-sidebar-field">
          <label htmlFor="plan-travel-date">Travel Date</label>
          <div className="by-sidebar-input-wrap">
            <span className="by-input-icon">📅</span>
            <input
              id="plan-travel-date"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>
        </div>

        <div className="by-sidebar-field">
          <label htmlFor="plan-travellers-count">No. of Travellers</label>
          <div className="by-sidebar-input-wrap">
            <span className="by-input-icon">👥</span>
            <select
              id="plan-travellers-count"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
            >
              <option value="1 Traveller">1 Traveller (Solo)</option>
              <option value="2 Travellers">2 Travellers (Couple / Duo)</option>
              <option value="3-4 Travellers">3–4 Travellers (Small Group)</option>
              <option value="5+ Travellers">5+ Travellers (Family / Large Group)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="by-sidebar-submit-btn">
          Plan My Trip →
        </button>
      </form>
    </div>
  );
}
