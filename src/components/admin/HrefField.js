'use client';

const SECTIONS = [
  { value: '#',           label: 'Home (top)' },
  { value: '#listings',   label: 'Featured Listings' },
  { value: '#value-props', label: 'Why Marcus Cole' },
  { value: '#reviews',    label: 'Client Reviews' },
  { value: '#about',      label: 'About Marcus' },
  { value: '#market',     label: 'Market Stats' },
  { value: '#process',    label: 'The Process' },
  { value: '#faq',        label: 'FAQ' },
  { value: '#lead-form',  label: 'Free Valuation Form' },
];

function getType(href) {
  if (!href || href.startsWith('#')) return 'section';
  if (href.startsWith('tel:'))       return 'tel';
  return 'url';
}

export default function HrefField({ value = '', onChange }) {
  const type = getType(value);

  function switchType(t) {
    if (t === type) return;
    if (t === 'section') onChange('#listings');
    else if (t === 'tel') onChange('tel:');
    else onChange('https://');
  }

  const sectionValue = SECTIONS.some((o) => o.value === value) ? value : '#';

  return (
    <div className="admin-href-field">
      <div className="admin-href-field__tabs">
        {[['section', 'Section'], ['tel', 'Phone'], ['url', 'URL']].map(([t, lbl]) => (
          <button
            key={t}
            type="button"
            className={`admin-href-field__tab${type === t ? ' admin-href-field__tab--on' : ''}`}
            onClick={() => switchType(t)}
          >
            {lbl}
          </button>
        ))}
      </div>

      {type === 'section' ? (
        <select value={sectionValue} onChange={(e) => onChange(e.target.value)}>
          {SECTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type === 'tel' ? 'tel' : 'url'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={type === 'tel' ? 'tel:+15128000101' : 'https://example.com'}
        />
      )}
    </div>
  );
}
