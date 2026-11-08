import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Crown, Gem, Heart, PencilLine, Plus, ShieldCheck, Sparkle, Star, X } from 'lucide-react';
import { EVENT_TYPES, TEMPLATES, TIERS, TIER_FEATURES, tierIncludes, type EventType, type InviteTemplate, type Tier } from './templates';
import { FloralArch, sceneColors } from './GrandEntrance';

const TIER_ICONS: Record<Tier, React.ElementType> = { luxury: Crown, premium: Gem, standard: Star, basic: Sparkle };

export const EventHome = ({ onSelect }: { onSelect: (event: EventType) => void }) => (
  <div className="min-h-screen bg-[#0d0b0e]">
    <header className="max-w-6xl mx-auto px-4 pt-6">
      <div className="bg-white rounded-full shadow-sm border border-white/10 px-6 py-3 flex items-center">
        <span className="text-2xl font-bold tracking-tight text-[#7a1424] font-['Playfair_Display',serif]">
          Invitation
        </span>
      </div>
    </header>

    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white font-['Playfair_Display',serif]">What are you celebrating?</h1>
        <p className="text-gray-400 mt-3 text-lg">Pick your occasion and we'll help you build a beautiful invitation website.</p>
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

      <section className="max-w-md mx-auto mt-14 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#fbe3e8] flex items-center justify-center text-[#b83a5a]">
          <Heart size={28} fill="currentColor" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-5">Free to design — pay only when you're ready</h2>
        <p className="text-gray-400 mt-2">Personalize your invitation website with zero commitment</p>
        <div className="mt-6 space-y-3 text-left">
          {[
            { icon: PencilLine, text: 'Edit and preview multiple times' },
            { icon: BadgeCheck, text: "Pay only when you're ready to share" },
            { icon: ShieldCheck, text: 'No ads · No hidden charges' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3">
              <span className="w-11 h-11 rounded-xl bg-[#fbe3e8] text-[#b83a5a] flex items-center justify-center shrink-0"><Icon size={20} /></span>
              <span className="text-gray-200">{text}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onSelect(EVENT_TYPES[0])}
          className="mt-8 w-full rounded-2xl py-4 text-white font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#b83a5a] to-[#d65f7a] hover:brightness-110 transition"
        >
          Choose a Design <ArrowRight size={20} />
        </button>
      </section>
    </main>
  </div>
);

// Miniature mock of the invitation cover, drawn with the template's own colours and font.
const TemplateThumb = ({ t }: { t: InviteTemplate }) =>
  t.hero === 'card' ? (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden" style={{ background: `linear-gradient(180deg, ${sceneColors(t).from}, ${sceneColors(t).to})` }}>
      <img src={t.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <FloralArch template={t} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-6" style={{ color: t.accentDark, fontFamily: t.font }}>
        <p className="text-lg md:text-xl uppercase leading-tight tracking-wider">Rahul</p>
        <p className="text-sm" style={{ color: t.accent }}>&amp;</p>
        <p className="text-lg md:text-xl uppercase leading-tight tracking-wider">Anjali</p>
        <p className="text-[8px] tracking-[0.3em] uppercase mt-2 font-sans" style={{ color: t.accent }}>Wedding Date</p>
        <p className="text-sm">12/12/26</p>
      </div>
      <span className="absolute top-2 left-2 text-[10px] font-bold font-sans bg-white/85 rounded-full px-2 py-0.5" style={{ color: t.accentDark }}>🎀 Curtain opening</span>
    </div>
  ) : t.hero === 'dark' ? (
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
        <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-semibold mb-4">
          <ArrowLeft size={18} /> {backLabel}
        </button>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display',serif]">Choose your {eventLabel} design</h1>
      <p className="text-gray-400 mt-2 mb-6">A beautiful beginning to your {eventLabel.toLowerCase()}. Make it yours.</p>

      {/* Tier tabs */}
      <div className="grid grid-cols-4 gap-1 md:gap-2 p-1.5 md:p-2 bg-white/[0.07] border border-white/10 rounded-2xl">
        {TIERS.map(t => {
          const Icon = TIER_ICONS[t.id];
          const active = t.id === tier;
          return (
            <button
              key={t.id}
              onClick={() => { setTier(t.id); setShowBenefits(false); }}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 py-2.5 md:py-4 rounded-xl text-xs md:text-lg font-semibold transition-all ${active ? 'bg-white shadow-sm text-[#7a1424]' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Icon size={20} />
              <span className="flex flex-col md:flex-row items-center md:gap-2 leading-tight">
                {t.label}
                <span className={`text-[10px] md:text-sm font-bold px-1.5 md:px-2 py-0.5 rounded-full ${t.price === 0 ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-[#7a1424]/10 text-[#7a1424]' : 'bg-white/10 text-gray-300'}`}>
                  {t.price === 0 ? 'Free' : `₹${t.price}`}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tier details */}
      <div className="border-b border-white/10 py-5">
        <button onClick={() => setShowBenefits(v => !v)} className="w-full flex items-center justify-between text-left">
          <span className="text-gray-200">{tierInfo.label} tier details</span>
          <span className="flex items-center gap-3 text-gray-400">
            <span className="hidden sm:inline">{showBenefits ? 'Hide details' : 'View details'}</span>
            <span className={`w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[#e0566a] transition-transform ${showBenefits ? 'rotate-45' : ''}`}>
              <Plus size={18} />
            </span>
          </span>
        </button>
        <AnimatePresence initial={false}>
          {showBenefits && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-[#fdfbf7] rounded-3xl p-5 md:p-7 border border-white/10">
                <h3 className="text-2xl md:text-3xl text-[#4a3237] font-['Playfair_Display',serif]">{tierInfo.label} {eventLabel} Templates</h3>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-5">
                  {TIER_FEATURES.map(f => {
                    const ok = tierIncludes(tier, f.from);
                    return (
                      <li key={f.label} className={`flex items-center gap-3 ${ok ? 'text-[#4a3237]' : 'text-gray-400'}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ok ? 'bg-[#efe6dc] text-[#8a6a52]' : 'bg-gray-100 text-gray-400'}`}>
                          {ok ? <Check size={15} /> : <X size={14} />}
                        </span>
                        {ok ? f.label : `No ${f.label.charAt(0).toLowerCase()}${f.label.slice(1)}`}
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-gray-200 mt-6 pt-4 flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
                  <ShieldCheck size={16} /> {tierInfo.price === 0 ? 'Free forever · No hidden fees' : 'Secure UPI payment · Pay only when you share · No hidden fees'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Designs */}
      <div className="flex items-center justify-between mt-8 mb-5">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          {tierInfo.label} designs
          <span className="text-sm font-medium bg-white/10 text-gray-300 px-2.5 py-1 rounded-lg">{designs.length}</span>
        </h2>
        <span className="hidden sm:inline text-gray-400">Choose a design to explore</span>
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
                {selected ? 'Selected' : 'View demo'} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Shown when a paid design is picked. Drop the QR image at public/payment-qr.png.
export const PaymentModal = ({ template, price, tierLabel, onClose }: { template: InviteTemplate; price: number; tierLabel: string; onClose: () => void }) => {
  const [qrMissing, setQrMissing] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100" aria-label="Close"><X size={20} /></button>
        <p className="text-xs font-bold tracking-widest uppercase text-[#9b1c2e]">{tierLabel} design</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1 font-['Playfair_Display',serif]">{template.name}</h3>
        <p className="text-4xl font-bold text-gray-900 mt-3">₹{price}</p>
        <p className="text-gray-500 text-sm mt-1">Pay once to share your {tierLabel.toLowerCase()} invitation</p>
        <div className="mt-4 mx-auto w-52 h-52 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
          {qrMissing ? (
            <span className="text-gray-400 text-sm px-4">Payment QR coming soon</span>
          ) : (
            <img src="/payment-qr.png" alt="Payment QR code" className="w-full h-full object-contain" onError={() => setQrMissing(true)} />
          )}
        </div>
        <p className="mt-2 font-bold text-gray-800">J@S Tech Solution</p>
        <p className="text-gray-400 text-xs">Scan with GPay, PhonePe, Paytm or any UPI app</p>
        <a
          href={`upi://pay?pa=shanid77shan@okhdfcbank&pn=${encodeURIComponent('J@S Tech Solution')}&am=${price}&cu=INR&tn=${encodeURIComponent(template.name + ' design')}`}
          className="mt-4 block w-full bg-[#9b1c2e] text-white font-bold py-3 rounded-full hover:bg-[#7a1424] md:hidden"
        >
          Pay ₹{price} with UPI app
        </a>
        <p className="text-gray-500 text-xs mt-2 select-all">UPI ID: shanid77shan@okhdfcbank</p>
        <p className="text-gray-500 text-xs mt-3">After paying, send the payment screenshot on WhatsApp and we'll unlock sharing for you.</p>
        <a
          href={`https://wa.me/918848133032?text=${encodeURIComponent(`Hi! I paid ₹${price} to J@S Tech Solution for the ${template.name} (${tierLabel}) invitation. Sharing the payment screenshot.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3 rounded-full hover:bg-[#20bd5a]"
        >
          Send screenshot on WhatsApp
        </a>
        <button onClick={onClose} className="mt-3 w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-200">Keep editing</button>
      </motion.div>
    </motion.div>
  );
};
