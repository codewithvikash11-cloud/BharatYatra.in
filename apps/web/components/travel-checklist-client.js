'use client';
import { useState, useEffect } from 'react';
import {
  IconPassport,
  IconPill,
  IconShirt,
  IconPlug,
  IconBottle,
  IconPrinter,
  IconRefresh,
  IconCheckbox,
  IconSquare,
} from './icons';

const checklistCategories = [
  {
    category: 'Essential Documents & Finance',
    icon: IconPassport,
    items: [
      { id: 'doc-visa', text: 'Valid Passport & Indian Tourist Visa / e-Visa printout' },
      { id: 'doc-copies', text: 'Physical photocopies of passport photo page & visa (stored separately)' },
      { id: 'doc-upi', text: 'UPI App installed & linked (PhonePe / Google Pay / Paytm)' },
      { id: 'doc-cash', text: 'Emergency Indian Rupee cash reserve (₹2,000 – ₹5,000 in smaller notes)' },
      { id: 'doc-insurance', text: 'Comprehensive travel & medical emergency insurance policy documents' },
    ],
  },
  {
    category: 'Health & Pharmacy Essentials',
    icon: IconPill,
    items: [
      { id: 'health-repellent', text: 'Mosquito repellent cream or spray (DEET / Odomos / Picaridin)' },
      { id: 'health-ors', text: 'Electrolyte rehydration powder sachets (ORS)' },
      { id: 'health-probiotics', text: 'Gut health probiotics & traveler’s anti-diarrheal medication' },
      { id: 'health-sun', text: 'High-protection broad spectrum sunscreen (SPF 50+)' },
      { id: 'health-rx', text: 'Original prescription copies for any chronic medications' },
    ],
  },
  {
    category: 'Clothing & Cultural Modesty',
    icon: IconShirt,
    items: [
      { id: 'cloth-shoes', text: 'Comfortable slip-on shoes or sandals (easy removal outside sanctums)' },
      { id: 'cloth-cotton', text: 'Lightweight breathable cotton or linen clothing covering shoulders & knees' },
      { id: 'cloth-scarf', text: 'Light scarf or dupatta for covering head inside gurdwaras, temples & mosques' },
      { id: 'cloth-layer', text: 'Light fleece or sweater for heavily air-conditioned trains or desert nights' },
      { id: 'cloth-socks', text: 'Socks for walking on stone temple courtyards heated by afternoon sun' },
    ],
  },
  {
    category: 'Electronics & Connectivity',
    icon: IconPlug,
    items: [
      { id: 'elec-adapter', text: 'Type D (three round pins) & Type C universal electrical adapter' },
      { id: 'elec-powerbank', text: 'High-capacity power bank (10000 – 20000 mAh) for long sightseeing days' },
      { id: 'elec-maps', text: 'Offline Google Maps regions downloaded on phone' },
      { id: 'elec-digiyatra', text: 'DigiYatra App installed for fast-track biometric entry at Indian airports' },
    ],
  },
  {
    category: 'Hygiene & Travel Comfort',
    icon: IconBottle,
    items: [
      { id: 'hyg-sanitizer', text: 'Pocket alcohol-based hand sanitizer bottles' },
      { id: 'hyg-wipes', text: 'Biodegradable wet wipes & tissue packs' },
      { id: 'hyg-bottle', text: 'Insulated stainless steel reusable water bottle with water-filter compatibility' },
      { id: 'hyg-lock', text: 'Small luggage padlock and lightweight wire chain for overnight train berths' },
    ],
  },
];

export default function TravelChecklistClient() {
  const [checkedItems, setCheckedItems] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('bharatyatra_checklist');
      if (stored) setCheckedItems(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleItem = (id) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem('bharatyatra_checklist', JSON.stringify(updated));
    } catch {}
  };

  const resetAll = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem('bharatyatra_checklist');
    } catch {}
  };

  const allItems = checklistCategories.flatMap((c) => c.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter((item) => checkedItems[item.id]).length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  if (!mounted) return null;

  return (
    <div>
      {/* Progress Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Packing Readiness
            </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--teal-primary)' }}>
              {completedCount} of {totalCount} Packed ({percentage}%)
            </strong>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'var(--cream)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ width: `${percentage}%`, height: '100%', background: percentage === 100 ? '#16A34A' : 'var(--gold-muted)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid var(--teal-deep)',
              background: 'transparent',
              color: 'var(--teal-deep)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <IconPrinter size={16} />
            <span>Print Checklist</span>
          </button>
          <button
            type="button"
            onClick={resetAll}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <IconRefresh size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        {checklistCategories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div
              key={cat.category}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <span style={{ color: 'var(--teal-deep)', display: 'inline-flex' }}>
                  <CatIcon size={22} />
                </span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
                  {cat.category}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cat.items.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: isChecked ? '#F0FDF4' : 'var(--cream)',
                        border: isChecked ? '1px solid #86EFAC' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        opacity: isChecked ? 0.75 : 1,
                      }}
                    >
                      <span style={{ display: 'inline-flex', color: isChecked ? '#16A34A' : 'var(--text-muted)' }}>
                        {isChecked ? <IconCheckbox size={20} color="#16A34A" /> : <IconSquare size={20} />}
                      </span>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', flex: 1 }}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
