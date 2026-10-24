import Link from 'next/link';

export default function BrandLogo({
  size = 'default',
  showSubtitle = true,
  light = false,
  customLogoUrl = null,
  className = '',
  priority = false,
}) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const logoHeight = isSm ? 32 : isLg ? 48 : 40;
  const logoSrc = customLogoUrl || '/logo-horizontal.svg';

  return (
    <Link
      href="/"
      className={`brand-logo-root ${light ? 'brand-logo-light' : ''} ${className}`.trim()}
      aria-label="BharatYatra — Home"
    >
      <img
        src={logoSrc}
        alt="BharatYatra"
        className={`brand-logo-img brand-logo-${size}`}
        style={{
          height: `${logoHeight}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
    </Link>
  );
}
