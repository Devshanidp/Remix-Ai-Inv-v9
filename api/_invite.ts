// Shared helpers for the link-preview functions (files starting with _ are not routes).
import config from '../firebase-applet-config.json';

export const DEFAULT_GROOM = 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&w=400&q=80';
export const DEFAULT_BRIDE = 'https://images.unsplash.com/photo-1585241920473-b472eb9ffbae?auto=format&fit=crop&w=400&q=80';

export type Invite = {
  occasion: string;
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  location: string;
  groomPhoto: string;
  bridePhoto: string;
};

// Invite IDs are Firestore auto-IDs (20 alphanumeric chars).
export const isValidId = (id: string | null): id is string => !!id && /^[A-Za-z0-9]{10,40}$/.test(id);

// Reads the invitation through the Firestore REST API (rules allow public reads).
export async function getInvite(id: string): Promise<Invite | null> {
  const db = encodeURIComponent(config.firestoreDatabaseId || '(default)');
  const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${db}/documents/invitations/${id}?key=${config.apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const doc = await res.json();
  const f = doc.fields || {};
  const str = (k: string) => (f[k]?.stringValue as string) || '';
  return {
    occasion: str('occasion'),
    groomName: str('groomName'),
    brideName: str('brideName'),
    date: str('date'),
    time: str('time'),
    location: str('location'),
    groomPhoto: str('groomPhoto'),
    bridePhoto: str('bridePhoto'),
  };
}

export const coupleName = (i: Invite) => `${i.groomName || 'Groom'} & ${i.brideName || 'Bride'}`;

export function formatWhen(i: Invite) {
  if (!i.date) return '';
  const d = new Date(`${i.date}T00:00:00Z`);
  if (isNaN(d.getTime())) return i.date;
  let s = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  if (i.time) {
    const t = new Date(`2000-01-01T${i.time}:00Z`);
    if (!isNaN(t.getTime())) s += ` at ${t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })}`;
  }
  return s;
}
