import HeroSearchWidget from './hero-search-widget.js';

function getResponsiveHeroSource(image, width) {
  try {
    const url = new URL(image);
    if (url.hostname === 'images.unsplash.com') {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', '80');
      return url.toString();
    }
  } catch {}
  return image;
}

export default function CinematicHero({ image, destinations = [] }) {
  const imageSrc = getResponsiveHeroSource(image, 1600);
  const imageSrcSet = image?.includes('images.unsplash.com')
    ? `${getResponsiveHeroSource(image, 768)} 768w, ${getResponsiveHeroSource(image, 1280)} 1280w, ${imageSrc} 1600w`
    : undefined;

  return (
    <section className="by-cinematic-hero" aria-labelledby="by-hero-title">
      <img
        className="by-hero-image"
        src={imageSrc}
        srcSet={imageSrcSet}
        sizes="100vw"
        alt=""
        width="1600"
        height="900"
        fetchPriority="high"
        decoding="async"
      />
      <div className="by-hero-overlay" aria-hidden="true" />
      <div className="by-container by-hero-layout">
        <div className="by-hero-content">
          <p className="by-hero-eyebrow">Curated journeys · Across India</p>
          <h1 id="by-hero-title" className="by-hero-title">Find your way into the heart of India</h1>
          <p className="by-hero-subtitle">
            Thoughtful destination guides, local stories and practical tools for the journey ahead.
          </p>
          <HeroSearchWidget destinations={destinations} />
        </div>
      </div>
    </section>
  );
}
