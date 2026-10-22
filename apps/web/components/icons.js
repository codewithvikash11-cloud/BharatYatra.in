'use client';

import React from 'react';
import {
  IconCompass,
  IconMapPin,
  IconCalendar,
  IconCalendarEvent,
  IconRoute,
  IconSoup,
  IconToolsKitchen2,
  IconSparkles,
  IconShield,
  IconShieldCheck,
  IconCreditCard,
  IconPhoneCall,
  IconBuildingMonument,
  IconBuildingCastle,
  IconBuildingFortress,
  IconBuildingArch,
  IconSun,
  IconCloudSun,
  IconCloudRain,
  IconSnowflake,
  IconSearch,
  IconChecklist,
  IconClipboardCheck,
  IconCalculator,
  IconClock,
  IconBookOpen,
  IconFileText,
  IconFileDescription,
  IconArticle,
  IconMap,
  IconMap2,
  IconArrowRight,
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronDown,
  IconChevronUp,
  IconEPassport,
  IconCamera,
  IconHeart,
  IconHeartFilled,
  IconShare,
  IconPrinter,
  IconCopy,
  IconCheck,
  IconX,
  IconTrash,
  IconRefresh,
  IconRestore,
  IconRocket,
  IconLink,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconPencil,
  IconPlus,
  IconMinus,
  IconFilter,
  IconAdjustments,
  IconUser,
  IconUsers,
  IconSettings,
  IconHistory,
  IconMenu2,
  IconLayoutDashboard,
  IconPhoto,
  IconPhotoOff,
  IconUpload,
  IconPalette,
  IconBed,
  IconPlane,
  IconTrain,
  IconBus,
  IconCar,
  IconMotorbike,
  IconMountain,
  IconBeach,
  IconRipple,
  IconPaw,
  IconLeaf,
  IconTrees,
  IconTicket,
  IconFirstAidKit,
  IconSos,
  IconAlertTriangle,
  IconInfoCircle,
  IconBulb,
  IconSpeakerphone,
  IconDeviceFloppy,
  IconCheckbox,
  IconSquare,
  IconCategory,
  IconLuggage,
  IconShirt,
  IconPill,
  IconPlug,
  IconBottle,
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconList,
  IconLock,
  IconVolume,
  IconVolumeOff,
  IconPlayerPlay,
  IconPlayerPause,
} from '@tabler/icons-react';

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
  '2xl': 40,
};

function resolveSize(size) {
  if (typeof size === 'number') return size;
  if (typeof size === 'string' && SIZE_MAP[size]) return SIZE_MAP[size];
  const parsed = parseInt(size, 10);
  return isNaN(parsed) ? DEFAULT_SIZE : parsed;
}

// Higher-order icon wrapper to enforce consistent styling and accessibility
function wrapIcon(TablerComponent, defaultProps = {}) {
  const IconComponent = ({
    size = DEFAULT_SIZE,
    stroke = DEFAULT_STROKE,
    strokeWidth,
    color = 'currentColor',
    className = '',
    style,
    'aria-hidden': ariaHidden = true,
    'aria-label': ariaLabel,
    ...rest
  }) => {
    const finalSize = resolveSize(size);
    const finalStroke = strokeWidth ?? stroke;
    const finalAriaHidden = ariaLabel ? undefined : (ariaHidden ?? true);

    return (
      <TablerComponent
        size={finalSize}
        stroke={finalStroke}
        color={color}
        className={`by-icon ${className}`.trim()}
        style={{ verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-hidden={finalAriaHidden}
        aria-label={ariaLabel}
        {...defaultProps}
        {...rest}
      />
    );
  };

  IconComponent.displayName = `ByIcon(${TablerComponent.displayName || TablerComponent.name || 'Icon'})`;
  return IconComponent;
}

// Core Interface & Navigation Icons
export const IconCompassStandard = wrapIcon(IconCompass);
export const IconCompass = wrapIcon(IconCompass);
export const IconMapPin = wrapIcon(IconMapPin);
export const IconCalendar = wrapIcon(IconCalendar);
export const IconCalendarEvent = wrapIcon(IconCalendarEvent);
export const IconRoute = wrapIcon(IconRoute);
export const IconUtensils = wrapIcon(IconToolsKitchen2);
export const IconFood = wrapIcon(IconSoup);
export const IconSoup = wrapIcon(IconSoup);
export const IconSparkles = wrapIcon(IconSparkles);
export const IconShield = wrapIcon(IconShield);
export const IconShieldCheck = wrapIcon(IconShieldCheck);
export const IconCreditCard = wrapIcon(IconCreditCard);
export const IconPhoneCall = wrapIcon(IconPhoneCall);
export const IconLandmark = wrapIcon(IconBuildingMonument);
export const IconCastle = wrapIcon(IconBuildingCastle);
export const IconFort = wrapIcon(IconBuildingFortress);
export const IconMonument = wrapIcon(IconBuildingMonument);
export const IconSun = wrapIcon(IconSun);
export const IconCloudSun = wrapIcon(IconCloudSun);
export const IconCloudRain = wrapIcon(IconCloudRain);
export const IconSnowflake = wrapIcon(IconSnowflake);
export const IconSearch = wrapIcon(IconSearch);
export const IconChecklist = wrapIcon(IconChecklist);
export const IconCalculator = wrapIcon(IconCalculator);
export const IconClock = wrapIcon(IconClock);
export const IconBookOpen = wrapIcon(IconBookOpen);
export const IconArticle = wrapIcon(IconArticle);
export const IconFileText = wrapIcon(IconFileText);
export const IconFileDescription = wrapIcon(IconFileDescription);
export const IconList = wrapIcon(IconList);
export const IconLock = wrapIcon(IconLock);
export const IconVolume = wrapIcon(IconVolume);
export const IconVolumeOff = wrapIcon(IconVolumeOff);
export const IconPlayerPlay = wrapIcon(IconPlayerPlay);
export const IconPlayerPause = wrapIcon(IconPlayerPause);
export const IconMap = wrapIcon(IconMap);
export const IconMap2 = wrapIcon(IconMap2);
export const IconArrowRight = wrapIcon(IconArrowRight);
export const IconArrowLeft = wrapIcon(IconArrowLeft);
export const IconArrowUp = wrapIcon(IconArrowUp);
export const IconArrowDown = wrapIcon(IconArrowDown);
export const IconChevronRight = wrapIcon(IconChevronRight);
export const IconChevronLeft = wrapIcon(IconChevronLeft);
export const IconChevronDown = wrapIcon(IconChevronDown);
export const IconChevronUp = wrapIcon(IconChevronUp);
export const IconPassport = wrapIcon(IconEPassport);
export const IconCamera = wrapIcon(IconCamera);

// User Actions & State Icons
export const IconHeart = wrapIcon(IconHeart);
export const IconHeartFilled = wrapIcon(IconHeartFilled, { color: '#B9653F' });
export const IconShare = wrapIcon(IconShare);
export const IconPrinter = wrapIcon(IconPrinter);
export const IconCopy = wrapIcon(IconCopy);
export const IconCheck = wrapIcon(IconCheck);
export const IconX = wrapIcon(IconX);
export const IconTrash = wrapIcon(IconTrash);
export const IconRefresh = wrapIcon(IconRefresh);
export const IconRestore = wrapIcon(IconRestore);
export const IconRocket = wrapIcon(IconRocket);
export const IconLink = wrapIcon(IconLink);
export const IconExternalLink = wrapIcon(IconExternalLink);
export const IconEye = wrapIcon(IconEye);
export const IconEyeOff = wrapIcon(IconEyeOff);
export const IconPencil = wrapIcon(IconPencil);
export const IconPlus = wrapIcon(IconPlus);
export const IconMinus = wrapIcon(IconMinus);
export const IconFilter = wrapIcon(IconFilter);
export const IconAdjustments = wrapIcon(IconAdjustments);
export const IconUser = wrapIcon(IconUser);
export const IconUsers = wrapIcon(IconUsers);
export const IconSettings = wrapIcon(IconSettings);
export const IconHistory = wrapIcon(IconHistory);
export const IconMenu2 = wrapIcon(IconMenu2);
export const IconLayoutDashboard = wrapIcon(IconLayoutDashboard);
export const IconPhoto = wrapIcon(IconPhoto);
export const IconPhotoOff = wrapIcon(IconPhotoOff);
export const IconUpload = wrapIcon(IconUpload);
export const IconPalette = wrapIcon(IconPalette);

// Travel, Stay & Transport Specific
export const IconBed = wrapIcon(IconBed);
export const IconHotel = wrapIcon(IconBed);
export const IconPlane = wrapIcon(IconPlane);
export const IconTrain = wrapIcon(IconTrain);
export const IconBus = wrapIcon(IconBus);
export const IconCar = wrapIcon(IconCar);
export const IconMotorbike = wrapIcon(IconMotorbike);
export const IconMountain = wrapIcon(IconMountain);
export const IconBeach = wrapIcon(IconBeach);
export const IconCoast = wrapIcon(IconRipple);
export const IconPaw = wrapIcon(IconPaw);
export const IconWildlife = wrapIcon(IconPaw);
export const IconLeaf = wrapIcon(IconLeaf);
export const IconTrees = wrapIcon(IconTrees);
export const IconNature = wrapIcon(IconTrees);
export const IconTicket = wrapIcon(IconTicket);
export const IconFirstAidKit = wrapIcon(IconFirstAidKit);
export const IconSos = wrapIcon(IconSos);
export const IconEmergency = wrapIcon(IconSos);
export const IconAlertTriangle = wrapIcon(IconAlertTriangle);
export const IconInfoCircle = wrapIcon(IconInfoCircle);
export const IconBulb = wrapIcon(IconBulb);
export const IconSpeakerphone = wrapIcon(IconSpeakerphone);
export const IconDeviceFloppy = wrapIcon(IconDeviceFloppy);
export const IconCheckbox = wrapIcon(IconCheckbox);
export const IconSquare = wrapIcon(IconSquare);
export const IconCategory = wrapIcon(IconCategory);
export const IconLuggage = wrapIcon(IconLuggage);
export const IconShirt = wrapIcon(IconShirt);
export const IconPill = wrapIcon(IconPill);
export const IconPlug = wrapIcon(IconPlug);
export const IconBottle = wrapIcon(IconBottle);

// Social Media Icons
export const IconBrandWhatsapp = wrapIcon(IconBrandWhatsapp);
export const IconBrandX = wrapIcon(IconBrandX);
export const IconBrandFacebook = wrapIcon(IconBrandFacebook);
export const IconBrandInstagram = wrapIcon(IconBrandInstagram);
export const IconBrandYoutube = wrapIcon(IconBrandYoutube);

// Regional Mapping Helper
export function getRegionIcon(regionId, props = {}) {
  const normalized = (regionId || '').toLowerCase();
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

// Travel Category Mapping Helper
export function getCategoryIcon(category, props = {}) {
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
