'use client';

import React from 'react';
import * as Tabler from '@tabler/icons-react';

// Default design system specifications
const DEFAULT_SIZE = 20;
const DEFAULT_STROKE = 1.8;

// Size mapping utility
const SIZE_MAP = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
};

function normalizeSize(size) {
  if (typeof size === 'number') return size;
  if (typeof size === 'string' && SIZE_MAP[size]) return SIZE_MAP[size];
  if (typeof size === 'string' && !isNaN(Number(size))) return Number(size);
  return DEFAULT_SIZE;
}

// Icon Wrapper Factory to enforce design system consistency
export function wrapIcon(TablerComponent, defaultProps = {}) {
  if (!TablerComponent) {
    return function NullIcon() {
      return null;
    };
  }

  const WrappedIcon = React.forwardRef(function WrappedIcon(props, ref) {
    const {
      size = DEFAULT_SIZE,
      stroke = DEFAULT_STROKE,
      color,
      className = '',
      style = {},
      ...rest
    } = props;

    const computedSize = normalizeSize(size);

    return React.createElement(TablerComponent, {
      ref,
      size: computedSize,
      stroke: stroke,
      color: color || defaultProps.color || 'currentColor',
      className: `by-icon ${className}`.trim(),
      style: {
        verticalAlign: 'middle',
        flexShrink: 0,
        ...defaultProps.style,
        ...style,
      },
      ...defaultProps,
      ...rest,
    });
  });

  WrappedIcon.displayName = `Wrapped(${TablerComponent.displayName || TablerComponent.name || 'Icon'})`;
  return WrappedIcon;
}

// Navigation & Core Travel Icons
export const IconCompassStandard = wrapIcon(Tabler.IconCompass);
export const IconCompass = wrapIcon(Tabler.IconCompass);
export const IconMapPin = wrapIcon(Tabler.IconMapPin);
export const IconCalendar = wrapIcon(Tabler.IconCalendar);
export const IconCalendarEvent = wrapIcon(Tabler.IconCalendarEvent);
export const IconRoute = wrapIcon(Tabler.IconRoute);
export const IconUtensils = wrapIcon(Tabler.IconToolsKitchen2);
export const IconFood = wrapIcon(Tabler.IconSoup);
export const IconSoup = wrapIcon(Tabler.IconSoup);
export const IconSparkles = wrapIcon(Tabler.IconSparkles);
export const IconShield = wrapIcon(Tabler.IconShield);
export const IconShieldCheck = wrapIcon(Tabler.IconShieldCheck);
export const IconCreditCard = wrapIcon(Tabler.IconCreditCard);
export const IconPhoneCall = wrapIcon(Tabler.IconPhoneCall);
export const IconLandmark = wrapIcon(Tabler.IconBuildingMonument);
export const IconCastle = wrapIcon(Tabler.IconBuildingCastle);
export const IconBuildingCastle = wrapIcon(Tabler.IconBuildingCastle);
export const IconFort = wrapIcon(Tabler.IconBuildingFortress);
export const IconBuildingFortress = wrapIcon(Tabler.IconBuildingFortress);
export const IconMonument = wrapIcon(Tabler.IconBuildingMonument);
export const IconBuildingMonument = wrapIcon(Tabler.IconBuildingMonument);
export const IconBuildingArch = wrapIcon(Tabler.IconBuildingArch);
export const IconClipboardCheck = wrapIcon(Tabler.IconClipboardCheck);
export const IconRipple = wrapIcon(Tabler.IconRipple);
export const IconSun = wrapIcon(Tabler.IconSun);
export const IconCloudSun = wrapIcon(Tabler.IconSunHigh);
export const IconSunHigh = wrapIcon(Tabler.IconSunHigh);
export const IconCloudRain = wrapIcon(Tabler.IconCloudRain);
export const IconSnowflake = wrapIcon(Tabler.IconSnowflake);
export const IconSearch = wrapIcon(Tabler.IconSearch);
export const IconChecklist = wrapIcon(Tabler.IconChecklist);
export const IconCalculator = wrapIcon(Tabler.IconCalculator);
export const IconClock = wrapIcon(Tabler.IconClock);
export const IconBook = wrapIcon(Tabler.IconBook);
export const IconBookOpen = wrapIcon(Tabler.IconBook);
export const IconArticle = wrapIcon(Tabler.IconArticle);
export const IconFileText = wrapIcon(Tabler.IconFileText);
export const IconFileDescription = wrapIcon(Tabler.IconFileDescription);
export const IconList = wrapIcon(Tabler.IconList);
export const IconLock = wrapIcon(Tabler.IconLock);
export const IconVolume = wrapIcon(Tabler.IconVolume);
export const IconVolumeOff = wrapIcon(Tabler.IconVolumeOff);
export const IconPlayerPlay = wrapIcon(Tabler.IconPlayerPlay);
export const IconPlayerPause = wrapIcon(Tabler.IconPlayerPause);
export const IconMap = wrapIcon(Tabler.IconMap);
export const IconMap2 = wrapIcon(Tabler.IconMap2);
export const IconArrowRight = wrapIcon(Tabler.IconArrowRight);
export const IconArrowLeft = wrapIcon(Tabler.IconArrowLeft);
export const IconArrowUp = wrapIcon(Tabler.IconArrowUp);
export const IconArrowDown = wrapIcon(Tabler.IconArrowDown);
export const IconChevronRight = wrapIcon(Tabler.IconChevronRight);
export const IconChevronLeft = wrapIcon(Tabler.IconChevronLeft);
export const IconChevronDown = wrapIcon(Tabler.IconChevronDown);
export const IconChevronUp = wrapIcon(Tabler.IconChevronUp);
export const IconPassport = wrapIcon(Tabler.IconEPassport);
export const IconCamera = wrapIcon(Tabler.IconCamera);

// User Actions & State Icons
export const IconHeart = wrapIcon(Tabler.IconHeart);
export const IconHeartFilled = wrapIcon(Tabler.IconHeartFilled, { color: '#B9653F' });
export const IconShare = wrapIcon(Tabler.IconShare);
export const IconPrinter = wrapIcon(Tabler.IconPrinter);
export const IconCopy = wrapIcon(Tabler.IconCopy);
export const IconCheck = wrapIcon(Tabler.IconCheck);
export const IconX = wrapIcon(Tabler.IconX);
export const IconTrash = wrapIcon(Tabler.IconTrash);
export const IconRefresh = wrapIcon(Tabler.IconRefresh);
export const IconRestore = wrapIcon(Tabler.IconRestore);
export const IconRocket = wrapIcon(Tabler.IconRocket);
export const IconLink = wrapIcon(Tabler.IconLink);
export const IconExternalLink = wrapIcon(Tabler.IconExternalLink);
export const IconEye = wrapIcon(Tabler.IconEye);
export const IconEyeOff = wrapIcon(Tabler.IconEyeOff);
export const IconPencil = wrapIcon(Tabler.IconPencil);
export const IconPlus = wrapIcon(Tabler.IconPlus);
export const IconMinus = wrapIcon(Tabler.IconMinus);
export const IconFilter = wrapIcon(Tabler.IconFilter);
export const IconAdjustments = wrapIcon(Tabler.IconAdjustments);
export const IconUser = wrapIcon(Tabler.IconUser);
export const IconUsers = wrapIcon(Tabler.IconUsers);
export const IconSettings = wrapIcon(Tabler.IconSettings);
export const IconHistory = wrapIcon(Tabler.IconHistory);
export const IconMenu2 = wrapIcon(Tabler.IconMenu2);
export const IconLayoutDashboard = wrapIcon(Tabler.IconLayoutDashboard);
export const IconPhoto = wrapIcon(Tabler.IconPhoto);
export const IconPhotoOff = wrapIcon(Tabler.IconPhotoOff);
export const IconUpload = wrapIcon(Tabler.IconUpload);
export const IconPalette = wrapIcon(Tabler.IconPalette);
export const IconBed = wrapIcon(Tabler.IconBed);
export const IconHotel = wrapIcon(Tabler.IconBed);
export const IconPlane = wrapIcon(Tabler.IconPlane);
export const IconTrain = wrapIcon(Tabler.IconTrain);
export const IconBus = wrapIcon(Tabler.IconBus);
export const IconCar = wrapIcon(Tabler.IconCar);
export const IconMotorbike = wrapIcon(Tabler.IconMotorbike);
export const IconMountain = wrapIcon(Tabler.IconMountain);
export const IconBeach = wrapIcon(Tabler.IconBeach);
export const IconCoast = wrapIcon(Tabler.IconBeach);
export const IconPaw = wrapIcon(Tabler.IconPaw);
export const IconWildlife = wrapIcon(Tabler.IconPaw);
export const IconLeaf = wrapIcon(Tabler.IconLeaf);
export const IconTrees = wrapIcon(Tabler.IconTrees);
export const IconNature = wrapIcon(Tabler.IconTrees);
export const IconTicket = wrapIcon(Tabler.IconTicket);
export const IconFirstAidKit = wrapIcon(Tabler.IconFirstAidKit);
export const IconSos = wrapIcon(Tabler.IconSos);
export const IconEmergency = wrapIcon(Tabler.IconSos);
export const IconAlertTriangle = wrapIcon(Tabler.IconAlertTriangle);
export const IconInfoCircle = wrapIcon(Tabler.IconInfoCircle);
export const IconBulb = wrapIcon(Tabler.IconBulb);
export const IconSpeakerphone = wrapIcon(Tabler.IconSpeakerphone);
export const IconDeviceFloppy = wrapIcon(Tabler.IconDeviceFloppy);
export const IconCheckbox = wrapIcon(Tabler.IconCheckbox);
export const IconSquare = wrapIcon(Tabler.IconSquare);
export const IconCategory = wrapIcon(Tabler.IconCategory);
export const IconLuggage = wrapIcon(Tabler.IconLuggage);
export const IconShirt = wrapIcon(Tabler.IconShirt);
export const IconPill = wrapIcon(Tabler.IconPill);
export const IconPlug = wrapIcon(Tabler.IconPlug);
export const IconBottle = wrapIcon(Tabler.IconBottle);

// Social Media Icons
export const IconBrandWhatsapp = wrapIcon(Tabler.IconBrandWhatsapp);
export const IconBrandX = wrapIcon(Tabler.IconBrandX);
export const IconBrandFacebook = wrapIcon(Tabler.IconBrandFacebook);
export const IconBrandInstagram = wrapIcon(Tabler.IconBrandInstagram);
export const IconBrandYoutube = wrapIcon(Tabler.IconBrandYoutube);

// Regional Mapping Component & Helper
export function RegionIcon({ regionId, region, ...props }) {
  const normalized = (regionId || region || '').toLowerCase().trim();
  switch (normalized) {
    case 'north':
      return <IconMountain {...props} />;
    case 'south':
      return <IconBeach {...props} />;
    case 'west':
      return <IconBuildingCastle {...props} />;
    case 'east':
      return <IconBuildingMonument {...props} />;
    case 'central':
      return <IconPaw {...props} />;
    case 'northeast':
      return <IconLeaf {...props} />;
    default:
      return <IconCompass {...props} />;
  }
}

export function getRegionIcon(regionId, props = {}) {
  return <RegionIcon regionId={regionId} {...props} />;
}

// Travel Category Mapping Component & Helper
export function CategoryIcon({ category, ...props }) {
  const norm = (category || '').toLowerCase();
  if (norm.includes('fort') || norm.includes('palace') || norm.includes('heritage') || norm.includes('castle')) {
    return <IconBuildingCastle {...props} />;
  }
  if (norm.includes('temple') || norm.includes('ghat') || norm.includes('sacred') || norm.includes('monument')) {
    return <IconBuildingMonument {...props} />;
  }
  if (norm.includes('hill') || norm.includes('mountain') || norm.includes('trek')) {
    return <IconMountain {...props} />;
  }
  if (norm.includes('beach') || norm.includes('coast') || norm.includes('backwater')) {
    return <IconBeach {...props} />;
  }
  if (norm.includes('wildlife') || norm.includes('national park') || norm.includes('tiger') || norm.includes('safari')) {
    return <IconPaw {...props} />;
  }
  if (norm.includes('nature') || norm.includes('forest') || norm.includes('valley')) {
    return <IconTrees {...props} />;
  }
  if (norm.includes('food') || norm.includes('cuisine') || norm.includes('dining')) {
    return <IconSoup {...props} />;
  }
  if (norm.includes('stay') || norm.includes('hotel') || norm.includes('resort')) {
    return <IconBed {...props} />;
  }
  if (norm.includes('train') || norm.includes('rail')) {
    return <IconTrain {...props} />;
  }
  if (norm.includes('flight') || norm.includes('air') || norm.includes('airport')) {
    return <IconPlane {...props} />;
  }
  if (norm.includes('bus') || norm.includes('roadways')) {
    return <IconBus {...props} />;
  }
  if (norm.includes('road') || norm.includes('drive') || norm.includes('expressway') || norm.includes('car')) {
    return <IconCar {...props} />;
  }
  if (norm.includes('checklist') || norm.includes('pack')) {
    return <IconChecklist {...props} />;
  }
  if (norm.includes('budget') || norm.includes('cost') || norm.includes('price')) {
    return <IconCalculator {...props} />;
  }
  return <IconMapPin {...props} />;
}

export function getCategoryIcon(category, props = {}) {
  return <CategoryIcon category={category} {...props} />;
}
