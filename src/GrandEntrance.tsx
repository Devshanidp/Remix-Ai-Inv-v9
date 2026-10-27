import React, { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { InviteTemplate } from './templates';

// Small seeded random so the flower arrangement is the same on every render.
const seeded = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Flower = { x: number; y: number; r: number; kind: 'blossom' | 'rose' | 'dot'; rot: number };
type Leaf = { x: number; y: number; r: number; rot: number };

// Arch in a 100 x 200 box: straight sides with a semicircle on top.
const ARCH = { left: 7, right: 93, top: 55, radius: 43, bottom: 200 };

const archPoint = (t: number) => {
  // t runs 0..1 from bottom-left, over the top, to bottom-right.
  const side = ARCH.bottom - ARCH.top;
  const arc = Math.PI * ARCH.radius;
  const total = side * 2 + arc;
  const d = t * total;
  if (d < side) return { x: ARCH.left, y: ARCH.bottom - d };
  if (d < side + arc) {
    const a = Math.PI - ((d - side) / arc) * Math.PI;
    return { x: 50 + Math.cos(a) * ARCH.radius, y: ARCH.top - Math.sin(a) * ARCH.radius };
  }
  return { x: ARCH.right, y: ARCH.top + (d - side - arc) };
};

const buildArrangement = () => {
  const rand = seeded(7);
  const flowers: Flower[] = [];
  const leaves: Leaf[] = [];
  const add = (x: number, y: number, spread: number, big: boolean) => {
    const r = big ? 3.2 + rand() * 3.4 : 1.4 + rand() * 2.6;
    const px = x + (rand() - 0.5) * spread;
    const py = y + (rand() - 0.5) * spread;
    const roll = rand();
    flowers.push({ x: px, y: py, r, kind: big && roll < 0.55 ? 'rose' : roll < 0.2 ? 'dot' : 'blossom', rot: rand() * 360 });
    if (rand() < 0.6) leaves.push({ x: px + (rand() - 0.5) * r * 2, y: py + (rand() - 0.5) * r * 2, r: r * 1.1, rot: rand() * 360 });
  };
  // Even garland along the arch.
  for (let i = 0; i <= 150; i++) {
    const p = archPoint(i / 150);
    add(p.x, p.y, 8, rand() < 0.25);
  }
  // Fuller clusters on the shoulders, the crown and the two bases.
  const clusters = [0.36, 0.5, 0.64].map(archPoint).concat([{ x: ARCH.left, y: 192 }, { x: ARCH.right, y: 192 }]);
  clusters.forEach((c, i) => {
    const n = i < 3 ? 26 : 34;
    for (let k = 0; k < n; k++) add(c.x, c.y, i < 3 ? 16 : 22, rand() < 0.5);
  });
  // Baby's breath sprinkled around.
  for (let i = 0; i < 90; i++) {
    const p = archPoint(rand());
    flowers.push({ x: p.x + (rand() - 0.5) * 14, y: p.y + (rand() - 0.5) * 14, r: 0.5 + rand() * 0.6, kind: 'dot', rot: 0 });
  }
  // Draw small ones last so they sit on top.
  flowers.sort((a, b) => b.r - a.r);
  return { flowers, leaves };
};

const ARRANGEMENT = buildArrangement();

export const sceneColors = (t: InviteTemplate) =>
  t.scene || { from: t.accentSoft, to: t.accentSoft, petal: '#f4d3de', rose: '#e7a3b8' };

const GOLD = '#c9a96e';

export const FloralArch = ({ template, className = '' }: { template: InviteTemplate; className?: string }) => {
  const id = useId().replace(/:/g, '');
  const colors = sceneColors(template);
  const { flowers, leaves } = ARRANGEMENT;
  return (
    <svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice" className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`p${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#fdf6f8" />
          <stop offset="100%" stopColor={colors.petal} />
        </radialGradient>
        <radialGradient id={`r${id}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fff8fa" />
          <stop offset="55%" stopColor={colors.petal} />
          <stop offset="100%" stopColor={colors.rose} />
        </radialGradient>
        <filter id={`s${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.35" stdDeviation="0.45" floodColor="#7a5566" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Thin gold line just inside the flowers */}
      <path
        d={`M${ARCH.left + 7} 200 V${ARCH.top} A${ARCH.radius - 7} ${ARCH.radius - 7} 0 0 1 ${ARCH.right - 7} ${ARCH.top} V200`}
        fill="none" stroke={GOLD} strokeWidth="0.35" opacity="0.8"
      />

      <g filter={`url(#s${id})`}>
        {leaves.map((l, i) => (
          <ellipse key={`l${i}`} cx={l.x} cy={l.y} rx={l.r} ry={l.r * 0.38} fill="#9db59a" opacity="0.75" transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
        ))}
        {flowers.map((f, i) => {
          if (f.kind === 'dot') return <circle key={i} cx={f.x} cy={f.y} r={f.r} fill="#fffdfd" />;
          if (f.kind === 'rose')
            return (
              <g key={i}>
                <circle cx={f.x} cy={f.y} r={f.r} fill={`url(#r${id})`} />
                <circle cx={f.x} cy={f.y} r={f.r * 0.66} fill="none" stroke={colors.rose} strokeWidth={f.r * 0.08} opacity="0.55" />
                <circle cx={f.x + f.r * 0.08} cy={f.y - f.r * 0.05} r={f.r * 0.34} fill="none" stroke={colors.rose} strokeWidth={f.r * 0.08} opacity="0.6" />
              </g>
            );
          return (
            <g key={i} transform={`rotate(${f.rot} ${f.x} ${f.y})`}>
              {[0, 72, 144, 216, 288].map(a => (
                <circle
                  key={a}
                  cx={f.x + Math.cos((a * Math.PI) / 180) * f.r * 0.45}
                  cy={f.y + Math.sin((a * Math.PI) / 180) * f.r * 0.45}
                  r={f.r * 0.55}
                  fill={`url(#p${id})`}
                />
              ))}
              <circle cx={f.x} cy={f.y} r={f.r * 0.22} fill="#ecd3a0" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const Bow = ({ className = '' }: { className?: string }) => {
  const id = useId().replace(/:/g, '');
  const satin = `url(#b${id})`;
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f8eff3" />
          <stop offset="100%" stopColor="#e6d3dc" />
        </linearGradient>
        <filter id={`bs${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6b4a5a" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#bs${id})`} stroke="#dcc4cf" strokeWidth="1.2" strokeLinejoin="round">
        {/* tails */}
        <path d="M94 70 C84 98 70 122 52 146 L72 141 L80 149 C92 122 100 96 102 72 Z" fill={satin} />
        <path d="M106 70 C116 98 130 122 148 146 L128 141 L120 149 C108 122 100 96 98 72 Z" fill={satin} />
        {/* loops */}
        <path d="M100 64 C72 20 18 8 12 44 C6 82 62 88 100 68 Z" fill={satin} />
        <path d="M100 64 C128 20 182 8 188 44 C194 82 138 88 100 68 Z" fill={satin} />
        {/* folds */}
        <path d="M96 64 C70 40 34 34 28 50" fill="none" stroke="#e3cfd8" strokeWidth="2" />
        <path d="M104 64 C130 40 166 34 172 50" fill="none" stroke="#e3cfd8" strokeWidth="2" />
        {/* knot */}
        <ellipse cx="100" cy="66" rx="15" ry="13" fill={satin} />
      </g>
    </svg>
  );
};

// Ruched satin panel. `side` sets which way the folds shade.
const Curtain = ({ side }: { side: 'left' | 'right' }) => (
  <div
    className="absolute inset-y-0 w-1/2"
    style={{
      [side]: 0,
      background: `
        linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0) 30%, rgba(196,160,176,0.18) 100%),
        linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(0,0,0,0) 70%, rgba(150,110,128,0.22) 100%),
        repeating-linear-gradient(90deg, #fffafc 0px, #f7ecf1 12px, #e8d5de 20px, #f9f1f5 28px, #fffafc 38px)
      `,
      boxShadow: side === 'left' ? 'inset -8px 0 18px rgba(120,80,100,0.12)' : 'inset 8px 0 18px rgba(120,80,100,0.12)',
    } as React.CSSProperties}
  />
);

export const GrandEntrance = ({ template, onOpened, onOpenStart }: { template: InviteTemplate; onOpened: () => void; onOpenStart?: () => void }) => {
  const [opening, setOpening] = useState(false);
  const colors = sceneColors(template);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpenStart?.();
    setTimeout(onOpened, 3200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-[#2a1f25] cursor-pointer select-none"
      onClick={open}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      role="button"
      aria-label="Open the invitation"
    >
      {/* Blurred backdrop for wide screens */}
      <img src={template.image} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110" />

      <div className="relative h-full max-w-[480px] mx-auto overflow-hidden" style={{ background: `linear-gradient(180deg, ${colors.from}, ${colors.to})` }}>
        {/* The aisle revealed behind the curtains */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={opening ? { scale: 1.35 } : { scale: 1.08 }}
          transition={{ duration: 3.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <img src={template.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${colors.from}99, ${colors.to}55 60%, ${colors.from}aa)` }} />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#fff6e6]/70 to-transparent" />
        </motion.div>

        {/* Curtains, pulled aside when opened */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left"
          animate={opening ? { scaleX: 0.3 } : { scaleX: 1 }}
          transition={{ duration: 1.9, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
        >
          <Curtain side="left" />
        </motion.div>
        <motion.div
          className="absolute inset-y-0 right-0 w-full origin-right"
          animate={opening ? { scaleX: 0.3 } : { scaleX: 1 }}
          transition={{ duration: 1.9, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
        >
          <Curtain side="right" />
        </motion.div>

        {/* Bow tying the curtains */}
        <motion.div
          className="absolute left-1/2 top-[44%] w-[62%] -translate-x-1/2 -translate-y-1/2"
          animate={opening ? { scale: 1.5, opacity: 0, rotate: -8, y: -30 } : { scale: [1, 1.04, 1] }}
          transition={opening ? { duration: 0.7 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bow className="w-full drop-shadow-xl" />
        </motion.div>

        <FloralArch template={template} />

        {/* Prompt */}
        <motion.div
          className="absolute inset-x-0 bottom-[11%] flex flex-col items-center text-center"
          animate={opening ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase" style={{ color: template.accentDark }}>You're invited</p>
          <div className="mt-3 relative">
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: `${template.accent}33` }} />
            <span
              className="relative inline-block px-7 py-3 rounded-full bg-white/85 backdrop-blur text-lg shadow-lg"
              style={{ color: template.accentDark, fontFamily: template.font }}
            >
              Tap to open
            </span>
          </div>
        </motion.div>

        {/* Soft flash as we walk through */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={opening ? { opacity: [0, 0, 1] } : { opacity: 0 }}
          transition={{ duration: 3.2, times: [0, 0.75, 1] }}
        />
      </div>
    </motion.div>
  );
};

const formatDate = (date: string) => {
  if (!date) return 'Save the Date';
  const [y, m, d] = date.split('-');
  return d && m && y ? `${d}/${m}/${y.slice(-2)}` : date;
};

const formatTime = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h)) return time;
  return `${((h + 11) % 12) + 1}.${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

// The pastel invitation card shown as the cover for curtain designs.
export const InvitationCard = ({
  template, groomName, brideName, occasion, date, time, location,
}: {
  template: InviteTemplate; groomName: string; brideName: string; occasion: string; date: string; time: string; location: string;
}) => {
  const colors = sceneColors(template);
  const [venue, ...rest] = (location || '').split(',');
  return (
    <div className="w-full" style={{ background: `linear-gradient(180deg, ${colors.from}, ${colors.to})` }}>
      <div className="relative max-w-[480px] mx-auto min-h-[100svh] overflow-hidden">
        <img src={template.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px]" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 45%, ${colors.from}f2 0%, ${colors.from}cc 45%, ${colors.to}66 100%)` }} />
        <FloralArch template={template} />

        <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-14 pt-24 pb-16" style={{ color: template.accentDark }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[10px] tracking-[0.35em] uppercase opacity-80">
            Together with their families
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="mt-5 uppercase leading-[1.05] tracking-[0.06em]"
            style={{ fontFamily: template.font }}
          >
            <p className="text-[2.6rem] sm:text-5xl break-words">{groomName || 'Groom'}</p>
            <p className="text-3xl my-1 normal-case" style={{ color: template.accent }}>&amp;</p>
            <p className="text-[2.6rem] sm:text-5xl break-words">{brideName || 'Bride'}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-col items-center">
            <div className="flex items-center gap-2 my-5">
              <span className="h-px w-10" style={{ background: GOLD }} />
              <span className="w-1.5 h-1.5 rotate-45" style={{ background: GOLD }} />
              <span className="h-px w-10" style={{ background: GOLD }} />
            </div>
            <p className="text-[11px] tracking-[0.35em] uppercase" style={{ color: template.accent }}>{occasion || 'Wedding'} Date</p>
            <p className="text-3xl mt-1 tracking-wider" style={{ fontFamily: template.font }}>{formatDate(date)}</p>

            {(time || location) && (
              <div className="mt-6 space-y-0.5">
                {time && <p className="text-lg tracking-wider" style={{ fontFamily: template.font }}>{formatTime(time)}</p>}
                {location && (
                  <>
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-70">at</p>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em]">{venue.trim()}</p>
                    {rest.length > 0 && <p className="text-xs uppercase tracking-[0.12em] opacity-75">{rest.join(',').trim()}</p>}
                  </>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ color: template.accent }}
          >
            <ChevronDown size={26} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
