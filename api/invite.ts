// GET /i/<inviteId> (rewritten to /api/invite?id=...) -> the app's index.html with
// per-invite Open Graph tags, so WhatsApp etc. show the couple's photos and names.
import { getInvite, isValidId, coupleName, formatWhen } from './_invite';

export const config = { runtime: 'edge' };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req: Request) {
  const url = new URL(req.url);
  // After the /i/:id rewrite the request may still carry the original path.
  const id = url.searchParams.get('id') || url.pathname.match(/^\/i\/([A-Za-z0-9]+)/)?.[1] || null;
  const origin = url.origin;

  const htmlRes = await fetch(`${origin}/index.html`);
  let html = await htmlRes.text();

  const invite = isValidId(id) ? await getInvite(id) : null;
  if (invite && id) {
    const title = `${coupleName(invite)} — ${invite.occasion || 'Wedding'} Invitation`;
    const details = [formatWhen(invite), invite.location].filter(Boolean).join(' · ');
    const description = `${details ? details + '. ' : ''}Tap to view the invitation and RSVP.`;
    const image = `${origin}/api/og?id=${id}&v=2`; // bump v when the card design changes
    const pageUrl = `${origin}/i/${id}`;

    const tags = [
      `<title>${esc(title)}</title>`,
      `<meta name="description" content="${esc(description)}" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta property="og:image:width" content="540" />`,
      `<meta property="og:image:height" content="540" />`,
      `<meta property="og:image:type" content="image/png" />`,
      `<meta property="og:url" content="${esc(pageUrl)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta name="twitter:card" content="summary" />`,
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(description)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`,
    ].join('\n    ');

    // Drop the generic tags and put the invite-specific ones in.
    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+(property|name)="(og|twitter):[^"]*"[^>]*>\s*/gi, '')
      .replace(/<head>/i, `<head>\n    ${tags}`);
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
