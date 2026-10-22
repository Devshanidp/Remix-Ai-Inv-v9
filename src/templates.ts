import type { CSSProperties } from 'react';

export type Tier = 'luxury' | 'premium' | 'standard' | 'basic';

export interface InviteTemplate {
  id: string;
  name: string;
  tier: Tier;
  tagline: string;
  image: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  // Heading font for the invitation (any font loaded in index.html).
  font: string;
  // 'dark' = full photo cover with light text; 'light' = soft faded cover.
  hero: 'light' | 'dark';
}

export interface EventType {
  id: string;
  label: string;
  tagline: string;
  image: string;
  color: string;
  icon: string;
  comingSoon?: boolean;
}

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const EVENT_TYPES: EventType[] = [
  { id: 'wedding', label: 'Wedding', tagline: 'Two hearts, one journey', image: img('1511285560929-80b456fea0bc', 600), color: '#b83a5a', icon: '💍' },
  { id: 'betrothal', label: 'Betrothal', tagline: 'The promise of forever', image: img('1465495976277-4387d4b0b4c6', 600), color: '#9b59b6', icon: '💞' },
  { id: 'haldi', label: 'Haldi', tagline: 'Colours of joy', image: img('1457089328109-e5d9bd499191', 600), color: '#d4a017', icon: '🌼' },
  { id: 'reception', label: 'Reception', tagline: 'Dinner, music and dancing', image: img('1519225421980-715cb0215aed', 600), color: '#4a8fd4', icon: '🥂' },
  { id: 'birthday', label: 'Birthday', tagline: 'Another year of happy memories', image: img('1530103862676-de8c9debad1d', 600), color: '#a24fc4', icon: '🎂', comingSoon: true },
  { id: 'babyshower', label: 'Baby Shower', tagline: 'Awaiting a little miracle', image: img('1555252333-9f8e92e65df9', 600), color: '#e0718f', icon: '🍼', comingSoon: true },
  { id: 'housewarming', label: 'Housewarming', tagline: 'Beginning life in a new home', image: img('1560448204-e02f11c3d0e2', 600), color: '#5f8b62', icon: '🏡', comingSoon: true },
  { id: 'other', label: 'Other Events', tagline: 'Moments worth sharing', image: img('1464366400600-7168b8af9bc3', 600), color: '#16917f', icon: '📅', comingSoon: true },
];

export const TIERS: { id: Tier; label: string; benefits: string[] }[] = [
  {
    id: 'luxury',
    label: 'Luxury',
    benefits: ['Cinematic full-photo cover', 'Gold & jewel-tone palettes', 'Regal display fonts', 'Music, gallery, RSVP & guest list'],
  },
  {
    id: 'premium',
    label: 'Premium',
    benefits: ['Photo-led cover designs', 'Elegant serif & script fonts', 'Curated colour palettes', 'Music, gallery, RSVP & guest list'],
  },
  {
    id: 'standard',
    label: 'Standard',
    benefits: ['Soft faded photo cover', 'Classic serif headings', 'Music, gallery, RSVP & guest list'],
  },
  {
    id: 'basic',
    label: 'Basic',
    benefits: ['Clean, minimal layout', 'Simple neutral palettes', 'Gallery, RSVP & guest list'],
  },
];

const FONTS = {
  playfair: '"Playfair Display", ui-serif, Georgia, serif',
  cormorant: '"Cormorant Garamond", ui-serif, Georgia, serif',
  cinzel: '"Cinzel", ui-serif, Georgia, serif',
  vibes: '"Great Vibes", "Playfair Display", cursive',
  lora: '"Lora", ui-serif, Georgia, serif',
  system: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
};

export const TEMPLATES: InviteTemplate[] = [
  // Luxury
  { id: 'royal-noir', name: 'Royal Noir', tier: 'luxury', tagline: 'Black-tie elegance', image: img('1606216794074-735e91aa2c92', 1200), accent: '#b8913a', accentDark: '#94722a', accentSoft: '#f6efdf', font: FONTS.cinzel, hero: 'dark' },
  { id: 'maharaja-gold', name: 'Maharaja Gold', tier: 'luxury', tagline: 'A palace celebration', image: img('1595407753234-0882f1e77954', 1200), accent: '#a8742a', accentDark: '#865a1e', accentSoft: '#f8eedd', font: FONTS.cormorant, hero: 'dark' },
  { id: 'midnight-veil', name: 'Midnight Veil', tier: 'luxury', tagline: 'Timeless black & white', image: img('1460978812857-470ed1c77af0', 1200), accent: '#3f3f46', accentDark: '#18181b', accentSoft: '#f1f1f2', font: FONTS.vibes, hero: 'dark' },
  { id: 'golden-hour', name: 'Golden Hour', tier: 'luxury', tagline: 'Sunset in the fields', image: img('1546032996-6dfacbacbf3f', 1200), accent: '#c0782f', accentDark: '#9a5e22', accentSoft: '#fbefe2', font: FONTS.playfair, hero: 'dark' },

  // Premium
  { id: 'forever-always', name: 'Forever and Always', tier: 'premium', tagline: 'Soft lavender romance', image: img('1591604466107-ec97de577aff', 1200), accent: '#8a6bb8', accentDark: '#6e5296', accentSoft: '#f2edf9', font: FONTS.vibes, hero: 'light' },
  { id: 'sunshine-saree', name: 'Sunshine in a Saree', tier: 'premium', tagline: 'Warm marigold glow', image: img('1478146896981-b80fe463b330', 1200), accent: '#d08a1e', accentDark: '#a96f15', accentSoft: '#fdf3e1', font: FONTS.playfair, hero: 'light' },
  { id: 'rose-garden', name: 'Rose Garden', tier: 'premium', tagline: 'Peach roses & ivory', image: img('1525258946800-98cfd641d0de', 1200), accent: '#d0776b', accentDark: '#b05e53', accentSoft: '#fcefec', font: FONTS.cormorant, hero: 'light' },
  { id: 'mountain-vows', name: 'Mountain Vows', tier: 'premium', tagline: 'Wide open skies', image: img('1532712938310-34cb3982ef74', 1200), accent: '#5e7c8f', accentDark: '#476273', accentSoft: '#edf2f5', font: FONTS.playfair, hero: 'dark' },

  // Standard
  { id: 'blush-classic', name: 'Blush Classic', tier: 'standard', tagline: 'Our signature pink', image: img('1511285560929-80b456fea0bc', 1200), accent: '#d98a8a', accentDark: '#c87979', accentSoft: '#fdf2f4', font: FONTS.system, hero: 'light' },
  { id: 'sage-garden', name: 'Sage Garden', tier: 'standard', tagline: 'Fresh greens & florals', image: img('1519225421980-715cb0215aed', 1200), accent: '#6f8f6a', accentDark: '#587353', accentSoft: '#eff4ee', font: FONTS.lora, hero: 'light' },
  { id: 'confetti-joy', name: 'Confetti Joy', tier: 'standard', tagline: 'Bright and festive', image: img('1583939003579-730e3918a45a', 1200), accent: '#4a7fc0', accentDark: '#3a669c', accentSoft: '#edf3fb', font: FONTS.playfair, hero: 'light' },
  { id: 'mr-mrs', name: 'Mr & Mrs', tier: 'standard', tagline: 'Rustic outdoor charm', image: img('1507504031003-b417219a0fde', 1200), accent: '#9a6b4a', accentDark: '#7c553a', accentSoft: '#f6efe9', font: FONTS.cormorant, hero: 'light' },

  // Basic
  { id: 'pure-white', name: 'Pure White', tier: 'basic', tagline: 'Clean and calm', image: img('1470290378698-263fa7ca60ab', 1200), accent: '#6b7280', accentDark: '#4b5563', accentSoft: '#f3f4f6', font: FONTS.system, hero: 'light' },
  { id: 'simple-rings', name: 'Simple Rings', tier: 'basic', tagline: 'Minimal and warm', image: img('1465495976277-4387d4b0b4c6', 1200), accent: '#b07d62', accentDark: '#8f644d', accentSoft: '#f7f0ec', font: FONTS.lora, hero: 'light' },
  { id: 'bouquet', name: 'Bouquet', tier: 'basic', tagline: 'A pop of colour', image: img('1457089328109-e5d9bd499191', 1200), accent: '#c2415d', accentDark: '#9e344b', accentSoft: '#fcedf0', font: FONTS.system, hero: 'light' },
];

export const DEFAULT_TEMPLATE_ID = 'blush-classic';

export const getTemplate = (id?: string) =>
  TEMPLATES.find(t => t.id === id) || TEMPLATES.find(t => t.id === DEFAULT_TEMPLATE_ID)!;

// CSS variables the invitation reads its colours and heading font from.
export const templateStyle = (t: InviteTemplate): CSSProperties => ({
  ['--accent' as any]: t.accent,
  ['--accent-dark' as any]: t.accentDark,
  ['--accent-soft' as any]: t.accentSoft,
  ['--font-serif' as any]: t.font,
});
