// GET /api/og?id=<inviteId> -> 800x420 preview image with the couple's photos and names.
import { ImageResponse } from '@vercel/og';
import { getInvite, isValidId, coupleName, formatWhen, DEFAULT_GROOM, DEFAULT_BRIDE, type Invite } from './_invite';

export const config = { runtime: 'edge' };

const ROSE = '#d98a8a';
// Rendered at 800x420 (2/3 of the usual 1200x630) to keep the PNG small enough for WhatsApp.
const W = 800, H = 420, k = W / 1200;
const px = (n: number) => Math.round(n * k);

// Plain-object elements so this file needs no JSX setup.
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) =>
  ({ type, props: { style, children, ...extra } });

// Photos are stored as data URLs; defaults are remote. Remote ones are fetched
// up front so a dead link falls back to a plain circle instead of failing the image.
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

const photo = (src: string | null, initial: string) =>
  h('div', {
    width: px(300), height: px(300), borderRadius: px(150), overflow: 'hidden', display: 'flex',
    alignItems: 'center', justifyContent: 'center', border: `${px(10)}px solid white`,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#fbe3e3',
  }, src
    ? h('img', { width: px(300), height: px(300), objectFit: 'cover' }, undefined, { src, width: px(300), height: px(300) })
    : h('div', { fontSize: px(120), color: ROSE }, initial));

function card(i: Invite, groom: string | null, bride: string | null) {
  const when = formatWhen(i);
  return h('div', {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', background: 'linear-gradient(180deg, #fff7f5 0%, #fde8e8 100%)', fontFamily: 'sans-serif',
  }, [
    h('div', { fontSize: px(26), letterSpacing: px(8), color: ROSE, textTransform: 'uppercase', marginBottom: px(24) },
      `${i.occasion || 'Wedding'} Invitation`),
    h('div', { display: 'flex', alignItems: 'center', gap: px(36) }, [
      photo(groom, (i.groomName || 'G')[0].toUpperCase()),
      h('div', { fontSize: px(90), color: ROSE }, '&'),
      photo(bride, (i.brideName || 'B')[0].toUpperCase()),
    ]),
    h('div', { fontSize: px(60), fontWeight: 700, color: '#1f2937', marginTop: px(28) }, coupleName(i)),
    when ? h('div', { fontSize: px(28), color: '#4b5563', marginTop: px(8) }, when) : null,
  ].filter(Boolean));
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
    width: W,
    height: H,
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
