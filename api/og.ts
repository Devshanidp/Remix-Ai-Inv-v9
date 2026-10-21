// GET /api/og?id=<inviteId> -> square "Save the Date" preview image with the couple's photos.
// Square so WhatsApp's small square thumbnail shows the whole card instead of a cropped middle.
import { ImageResponse } from '@vercel/og';
import { getInvite, isValidId, formatWhen, DEFAULT_GROOM, DEFAULT_BRIDE, type Invite } from './_invite';

export const config = { runtime: 'edge' };

const ROSE = '#c97b7b';
const INK = '#2b2b2b';
// Laid out on a 600px grid, rendered at 540px so the PNG stays under WhatsApp's ~300KB preview limit.
const SIZE = 540;
const k = SIZE / 600;
const px = (n: number) => Math.round(n * k);
const PHOTO_W = px(236);
const PHOTO_H = px(300);

// Plain-object elements so this file needs no JSX setup.
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) =>
  ({ type, props: { style, children, ...extra } });

// Photos are stored as data URLs; defaults are remote. Remote ones are fetched
// up front so a dead link falls back to a plain box instead of failing the image.
async function loadPhoto(src: string, fallback: string): Promise<string | null> {
  const url = src || fallback;
  if (url.startsWith('data:image/')) return url;
  try {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.startsWith('image/')) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return `data:${type};base64,${btoa(bin)}`;
  } catch {
    return null;
  }
}

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

// One person: framed photo with their name and role underneath.
const person = (src: string | null, name: string, role: string) =>
  h('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', width: PHOTO_W + px(12) }, [
    h('div', {
      width: PHOTO_W, height: PHOTO_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: px(14), overflow: 'hidden', border: `${px(6)}px solid white`, background: '#f6dede',
      boxShadow: '0 8px 22px rgba(0,0,0,0.18)',
    }, src
      ? h('img', { width: PHOTO_W, height: PHOTO_H, objectFit: 'cover' }, undefined, { src, width: PHOTO_W, height: PHOTO_H })
      : h('div', { fontSize: px(110), color: ROSE }, name[0].toUpperCase())),
    h('div', { fontSize: px(30), fontWeight: 700, color: INK, marginTop: px(12) }, truncate(name, 16)),
    h('div', { fontSize: px(16), letterSpacing: px(3), color: ROSE, textTransform: 'uppercase', marginTop: px(2) }, role),
  ]);

function card(i: Invite, groom: string | null, bride: string | null) {
  const when = formatWhen(i);
  const venue = i.location ? truncate(i.location.split(',').slice(0, 2).join(',').trim(), 44) : '';
  return h('div', {
    width: '100%', height: '100%', display: 'flex', padding: px(14),
    background: 'linear-gradient(160deg, #fffaf6 0%, #fbe6e3 100%)', fontFamily: 'sans-serif',
  }, h('div', {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    border: '2px solid #e6c4bd', borderRadius: px(18),
  }, [
    h('div', { fontSize: px(38), letterSpacing: px(8), color: ROSE, textTransform: 'uppercase', marginBottom: px(18) },
      i.occasion && i.occasion.toLowerCase() !== 'wedding' ? truncate(i.occasion, 18) : 'Save the Date'),
    h('div', { display: 'flex', alignItems: 'flex-start', gap: px(20) }, [
      person(groom, i.groomName || 'Groom', 'Groom'),
      person(bride, i.brideName || 'Bride', 'Bride'),
    ]),
    when ? h('div', { fontSize: px(22), fontWeight: 700, color: INK, marginTop: px(16) }, when) : null,
    venue ? h('div', { fontSize: px(18), color: '#5b5b5b', marginTop: px(4) }, venue) : null,
  ].filter(Boolean)));
}

export default async function handler(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const invite = isValidId(id) ? await getInvite(id) : null;
  const data: Invite = invite || {
    occasion: 'Wedding', groomName: '', brideName: '', date: '', time: '', location: '', groomPhoto: '', bridePhoto: '',
  };
  const [groom, bride] = await Promise.all([
    loadPhoto(data.groomPhoto, DEFAULT_GROOM),
    loadPhoto(data.bridePhoto, DEFAULT_BRIDE),
  ]);
  return new ImageResponse(card(data, groom, bride) as any, {
    width: SIZE,
    height: SIZE,
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
