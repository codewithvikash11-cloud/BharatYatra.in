import Link from 'next/link';

export default function BrandLogo({ size = 'default', showSubtitle = true, light = false, customLogoUrl = null }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const iconSize = isSm ? 32 : isLg ? 48 : 40;

  return (
    <Link href="/" className="brand-logo-root" aria-label="BharatYatra — Home">
      <div
        className="brand-logo-mark"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="BharatYatra"
            width={iconSize}
            height={iconSize}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="brand-logo-svg"
            width={iconSize}
            height={iconSize}
          >
            {/* Outer Sunburst Ring */}
            <circle cx="24" cy="24" r="22" fill={light ? '#FFFDF8' : '#153E3A'} />
            {/* Radiant Petals / Sunburst Mandala in approved Indian jewel tones */}
            <path d="M24 6 C22 12, 26 12, 24 18" stroke="#C58B32" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 30 C22 36, 26 36, 24 42" stroke="#C58B32" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M6 24 C12 22, 12 26, 18 24" stroke="#B9653F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 24 C36 22, 36 26, 42 24" stroke="#B9653F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M11 11 C15 17, 19 13, 19 19" stroke="#247A72" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M37 11 C33 17, 29 13, 29 19" stroke="#247A72" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M11 37 C15 31, 19 35, 19 29" stroke="#6E9CA0" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M37 37 C33 31, 29 35, 29 29" stroke="#6E9CA0" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="24" cy="24" r="5" fill="#C58B32" />
            <circle cx="24" cy="24" r="2.5" fill={light ? '#153E3A' : '#FFFDF8'} />
          </svg>
        )}
      </div>

      <div className="brand-logo-text">
        <span
          className="brand-logo-name"
          style={{
            color: light ? '#FFFDF8' : 'var(--teal-primary, #153E3A)',
            fontSize: isSm ? '1.15rem' : isLg ? '1.5rem' : '1.35rem',
          }}
        >
          BharatYatra
        </span>
        {showSubtitle && (
          <span
            className="brand-logo-sub"
            style={{
              color: light ? 'rgba(255,253,248,0.75)' : 'var(--text-secondary, #64736F)',
              fontSize: isSm ? '0.62rem' : '0.68rem',
            }}
          >
            Explore India, Plan Better Trips
          </span>
        )}
      </div>
    </Link>
  );
}
