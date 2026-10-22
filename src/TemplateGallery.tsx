import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Crown, Gem, Plus, Sparkle, Star } from 'lucide-react';
import { EVENT_TYPES, TEMPLATES, TIERS, type EventType, type InviteTemplate, type Tier } from './templates';

const TIER_ICONS: Record<Tier, React.ElementType> = { luxury: Crown, premium: Gem, standard: Star, basic: Sparkle };

export const EventHome = ({ onSelect }: { onSelect: (event: EventType) => void }) => (
  <div className="min-h-screen bg-[#f8f5fd]">
    <header className="max-w-6xl mx-auto px-4 pt-6">
      <div className="bg-white rounded-full shadow-sm shadow-[#7a1424]/10 border border-[#ece5f8] px-6 py-3 flex items-center">
        <span className="text-2xl font-bold tracking-tight text-[#7a1424] font-['Playfair_Display',serif]">
          Invitation
        </span>
      </div>
    </header>

    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 font-['Playfair_Display',serif]">What are you celebrating?</h1>
        <p className="text-gray-500 mt-3 text-lg">Pick your occasion and we'll help you build a beautiful invitation website.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {EVENT_TYPES.map((ev, i) => (
          <motion.button
            key={ev.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            disabled={ev.comingSoon}
            onClick={() => onSelect(ev)}
            className={`group text-left bg-white rounded-[28px] overflow-hidden shadow-sm transition-all flex flex-col ${ev.comingSoon ? 'cursor-default' : 'hover:shadow-xl hover:-translate-y-1'}`}
          >
            <div className="relative h-28 md:h-40 shrink-0">
              <img src={ev.image} alt="" className={`w-full h-full object-cover ${ev.comingSoon ? 'grayscale-[40%]' : ''}`} />
              {ev.comingSoon && (
                <span className="absolute top-3 right-3 text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow" style={{ background: ev.color }}>
                  Coming Soon
                </span>
              )}
              <div
                className="absolute -bottom-7 left-4 md:left-6 w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border-4 border-white shadow-md flex items-center justify-center text-2xl md:text-4xl"
                style={{ background: ev.color }}
              >
                {ev.icon}
              </div>
            </div>
            <div className="px-4 md:px-6 pt-9 md:pt-11 pb-5 flex flex-col flex-1 items-center text-center">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 font-['Playfair_Display',serif]">{ev.label}</h2>
              <p className="text-gray-500 text-sm md:text-base mt-1 flex-1">{ev.tagline}</p>
              <span
                className="mt-4 inline-flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 font-bold text-sm md:text-base"
                style={{ background: `${ev.color}14`, color: ev.color }}
              >
                {ev.comingSoon ? 'Explore Soon' : 'Get Started'}
                <span className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5" style={{ background: `${ev.color}22` }}>
                  <ArrowRight size={16} />
                </span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </main>
  </div>
);

// Miniature mock of the invitation cover, drawn with the template's own colours and font.
const TemplateThumb = ({ t }: { t: InviteTemplate }) =>
  t.hero === 'dark' ? (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900">
      <img src={t.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/75" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white">
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-80" style={{ color: t.accentSoft }}>Save the Date</p>
        <p className="text-xl md:text-2xl leading-tight mt-1" style={{ fontFamily: t.font }}>Rahul &amp; Anjali</p>
        <div className="h-0.5 w-10 mx-auto my-2 rounded-full" style={{ background: t.accent }} />
        <p className="text-[10px] opacity-80">12 · 12 · 2026</p>
      </div>
    </div>
  ) : (
    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white flex flex-col">
      <div className="relative h-[62%]">
        <img src={t.image} alt="" loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-3" style={{ background: t.accentSoft }}>
        <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: t.accent }}>Save the Date</p>
        <p className="text-lg md:text-xl leading-tight text-gray-800 mt-0.5" style={{ fontFamily: t.font }}>Rahul &amp; Anjali</p>
        <div className="h-0.5 w-8 my-1.5 rounded-full" style={{ background: t.accent }} />
        <p className="text-[9px] text-gray-500">12 · 12 · 2026</p>
      </div>
    </div>
  );

export const TemplatePicker = ({
  eventLabel,
  selectedId,
  onSelect,
  onBack,
  backLabel = 'Back',
}: {
  eventLabel: string;
  selectedId?: string;
  onSelect: (t: InviteTemplate) => void;
  onBack?: () => void;
  backLabel?: string;
}) => {
  const initialTier = TEMPLATES.find(t => t.id === selectedId)?.tier || 'premium';
  const [tier, setTier] = useState<Tier>(initialTier);
  const [showBenefits, setShowBenefits] = useState(false);
  const tierInfo = TIERS.find(t => t.id === tier)!;
  const designs = TEMPLATES.filter(t => t.tier === tier);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {onBack && (
        <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold mb-4">
          <ArrowLeft size={18} /> {backLabel}
        </button>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-['Playfair_Display',serif]">Choose your {eventLabel} design</h1>
      <p className="text-gray-500 mt-2 mb-6">A beautiful beginning to your {eventLabel.toLowerCase()}. Make it yours.</p>

      {/* Tier tabs */}
      <div className="grid grid-cols-4 gap-1 md:gap-2 p-1.5 md:p-2 bg-[#ece5f8] rounded-2xl">
        {TIERS.map(t => {
          const Icon = TIER_ICONS[t.id];
          const active = t.id === tier;
          return (
            <button
              key={t.id}
              onClick={() => { setTier(t.id); setShowBenefits(false); }}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 py-2.5 md:py-4 rounded-xl text-xs md:text-lg font-semibold transition-all ${active ? 'bg-white shadow-sm text-[#7a1424]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={20} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tier details */}
      <div className="border-b border-[#e2d8f3] py-5">
        <button onClick={() => setShowBenefits(v => !v)} className="w-full flex items-center justify-between text-left">
          <span className="text-gray-700">{tierInfo.label} tier details</span>
          <span className="flex items-center gap-3 text-gray-500">
            <span className="hidden sm:inline">View benefits</span>
            <span className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[#7a1424] transition-transform ${showBenefits ? 'rotate-45' : ''}`}>
              <Plus size={18} />
            </span>
          </span>
        </button>
        <AnimatePresence initial={false}>
          {showBenefits && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden grid sm:grid-cols-2 gap-2 pt-4"
            >
              {tierInfo.benefits.map(b => (
                <li key={b} className="flex items-center gap-2 text-gray-600">
                  <Check size={16} className="text-[#7a1424] shrink-0" /> {b}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Designs */}
      <div className="flex items-center justify-between mt-8 mb-5">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-3">
          {tierInfo.label} designs
          <span className="text-sm font-medium bg-[#ece5f8] text-gray-600 px-2.5 py-1 rounded-lg">{designs.length}</span>
        </h2>
        <span className="hidden sm:inline text-gray-500">Choose a design to explore</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {designs.map((t, i) => {
          const selected = t.id === selectedId;
          return (
            <motion.button
              key={t.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(t)}
              className={`group text-left rounded-3xl p-3 md:p-5 transition-all hover:-translate-y-1 hover:shadow-lg ${selected ? 'ring-2 ring-offset-2' : ''}`}
              style={{ background: t.accentSoft, ['--tw-ring-color' as any]: t.accent }}
            >
              <div className="relative">
                <TemplateThumb t={t} />
                {selected && (
                  <span className="absolute top-2 right-2 w-8 h-8 rounded-full text-white flex items-center justify-center shadow" style={{ background: t.accent }}>
                    <Check size={18} />
                  </span>
                )}
              </div>
              <div className="mt-3 px-1">
                <p className="font-bold text-gray-800">{t.name}</p>
                <p className="text-sm text-gray-500">{t.tagline}</p>
              </div>
              <span className="mt-2 mx-1 inline-flex items-center gap-1 text-sm font-bold" style={{ color: t.accentDark }}>
                {selected ? 'Selected' : 'Use this design'} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
