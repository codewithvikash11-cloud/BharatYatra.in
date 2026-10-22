'use client';

import React from 'react';
import {
  IconLayoutDashboard,
  IconFileDescription,
  IconArticle,
  IconFileText,
  IconPlus,
  IconMinus,
  IconMapPin,
  IconMap,
  IconBuildingMonument,
  IconBuildingCastle,
  IconBuildingFortress,
  IconCalendar,
  IconCalendarEvent,
  IconRoute,
  IconPhoto,
  IconPhotoOff,
  IconUpload,
  IconPalette,
  IconHistory,
  IconMenu2,
  IconX,
  IconPencil,
  IconEye,
  IconEyeOff,
  IconCopy,
  IconTrash,
  IconRestore,
  IconRefresh,
  IconRocket,
  IconSearch,
  IconCheck,
  IconSparkles,
  IconLink,
  IconExternalLink,
  IconUnlink,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconLock,
  IconKey,
  IconUser,
  IconLogout,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconList,
  IconListNumbers,
  IconIndentIncrease,
  IconIndentDecrease,
  IconQuote,
  IconTable,
  IconVideo,
  IconBrandYoutube,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconClearFormatting,
  IconAlertTriangle,
  IconInfoCircle,
  IconBulb,
  IconHighlight,
  IconRowInsertTop,
  IconRowInsertBottom,
  IconColumnInsertLeft,
  IconColumnInsertRight,
} from '@tabler/icons-react';

const DEFAULT_SIZE = 18;
const DEFAULT_STROKE = 1.8;

function wrap(TablerComponent, defaultProps = {}) {
  const Icon = ({
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
    const finalStroke = strokeWidth ?? stroke;
    const finalAriaHidden = ariaLabel ? undefined : (ariaHidden ?? true);

    return (
      <TablerComponent
        size={size}
        stroke={finalStroke}
        color={color}
        className={`by-admin-icon ${className}`.trim()}
        style={{ verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-hidden={finalAriaHidden}
        aria-label={ariaLabel}
        {...defaultProps}
        {...rest}
      />
    );
  };
  Icon.displayName = `AdminIcon(${TablerComponent.displayName || TablerComponent.name || 'Icon'})`;
  return Icon;
}

// Navigation & Dashboard
export const IconDashboard = wrap(IconLayoutDashboard);
export const IconLayoutDashboardStd = wrap(IconLayoutDashboard);
export const IconArticles = wrap(IconFileDescription);
export const IconArticleStd = wrap(IconArticle);
export const IconFileTextStd = wrap(IconFileText);
export const IconStates = wrap(IconMapPin);
export const IconDistricts = wrap(IconMapPin);
export const IconTehsils = wrap(IconMapPin);
export const IconDestinations = wrap(IconMapPin);
export const IconAttractions = wrap(IconBuildingMonument);
export const IconItineraries = wrap(IconRoute);
export const IconMedia = wrap(IconPhoto);
export const IconAppearance = wrap(IconPalette);
export const IconAudit = wrap(IconHistory);
export const IconMenu = wrap(IconMenu2);
export const IconClose = wrap(IconX);
export const IconXStd = wrap(IconX);

// CRUD & Table Actions
export const IconPlusStd = wrap(IconPlus);
export const IconMinusStd = wrap(IconMinus);
export const IconEdit = wrap(IconPencil);
export const IconPreview = wrap(IconEye);
export const IconPreviewOff = wrap(IconEyeOff);
export const IconDuplicate = wrap(IconCopy);
export const IconCopyStd = wrap(IconCopy);
export const IconDelete = wrap(IconTrash);
export const IconTrashStd = wrap(IconTrash);
export const IconRestoreStd = wrap(IconRestore);
export const IconPublish = wrap(IconRocket);
export const IconSearchStd = wrap(IconSearch);
export const IconCheckStd = wrap(IconCheck);
export const IconMagic = wrap(IconSparkles);
export const IconSparklesStd = wrap(IconSparkles);
export const IconUploadStd = wrap(IconUpload);
export const IconEmpty = wrap(IconPhotoOff);
export const IconExternal = wrap(IconExternalLink);
export const IconLinkStd = wrap(IconLink);
export const IconUnlinkStd = wrap(IconUnlink);

// Navigation & Pagination
export const IconPrev = wrap(IconChevronLeft);
export const IconNext = wrap(IconChevronRight);
export const IconChevronDownStd = wrap(IconChevronDown);
export const IconChevronUpStd = wrap(IconChevronUp);

// Auth
export const IconLockStd = wrap(IconLock);
export const IconKeyStd = wrap(IconKey);
export const IconUserStd = wrap(IconUser);
export const IconSignout = wrap(IconLogout);

// Editor Toolbar
export const IconBoldStd = wrap(IconBold);
export const IconItalicStd = wrap(IconItalic);
export const IconUnderlineStd = wrap(IconUnderline);
export const IconStrikethroughStd = wrap(IconStrikethrough);
export const IconSubscriptStd = wrap(IconSubscript);
export const IconSuperscriptStd = wrap(IconSuperscript);
export const IconAlignLeftStd = wrap(IconAlignLeft);
export const IconAlignCenterStd = wrap(IconAlignCenter);
export const IconAlignRightStd = wrap(IconAlignRight);
export const IconAlignJustifiedStd = wrap(IconAlignJustified);
export const IconListStd = wrap(IconList);
export const IconListNumbersStd = wrap(IconListNumbers);
export const IconIndentIncreaseStd = wrap(IconIndentIncrease);
export const IconIndentDecreaseStd = wrap(IconIndentDecrease);
export const IconQuoteStd = wrap(IconQuote);
export const IconTableStd = wrap(IconTable);
export const IconVideoStd = wrap(IconBrandYoutube);
export const IconUndoStd = wrap(IconArrowBackUp);
export const IconRedoStd = wrap(IconArrowForwardUp);
export const IconClearFormattingStd = wrap(IconClearFormatting);
export const IconAlertTriangleStd = wrap(IconAlertTriangle);
export const IconInfoCircleStd = wrap(IconInfoCircle);
export const IconBulbStd = wrap(IconBulb);
export const IconHighlightStd = wrap(IconHighlight);
export const IconRowAbove = wrap(IconRowInsertTop);
export const IconRowBelow = wrap(IconRowInsertBottom);
export const IconColLeft = wrap(IconColumnInsertLeft);
export const IconColRight = wrap(IconColumnInsertRight);
