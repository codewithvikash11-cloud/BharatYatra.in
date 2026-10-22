'use client';

import React from 'react';
import {
  IconMap,
  IconPalette,
  IconMountain,
  IconBuildingCastle,
  IconBuildingMonument,
  IconRipple,
  IconRoute,
} from './icons.js';

export function MapSymbol(props) {
  return <IconMap size={22} stroke={1.8} {...props} />;
}

export function PaletteSymbol(props) {
  return <IconPalette size={22} stroke={1.8} {...props} />;
}

export function MountainSymbol(props) {
  return <IconMountain size={22} stroke={1.8} {...props} />;
}

export function HeritageFortSymbol(props) {
  return <IconBuildingCastle size={22} stroke={1.8} {...props} />;
}

export function TempleSymbol(props) {
  return <IconBuildingMonument size={22} stroke={1.8} {...props} />;
}

export function CoastlineSymbol(props) {
  return <IconRipple size={22} stroke={1.8} {...props} />;
}

export function RouteSymbol(props) {
  return <IconRoute size={22} stroke={1.8} {...props} />;
}
