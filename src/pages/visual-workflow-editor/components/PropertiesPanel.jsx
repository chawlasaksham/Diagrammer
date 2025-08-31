import React from 'react';

const fontFamilies = [
  'Open Sans',
  'Arial',
  'Roboto',
  'Montserrat',
  'Lato',
  'Inter',
];
const outlineStyles = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

export default function PropertiesPanel({ node, onChange, onClose }) {
  if (!node) return null;
  const data = node.data || {};
  return (
    <div style={{ width: 300, background: '#fff', borderLeft: '1px solid #e5e7eb', boxShadow: '0 0 8px #0001', padding: 20, position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 100, fontFamily: 'inherit', color: '#222' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <span style={{ fontWeight: 700, fontSize: 20, flex: 1 }}>Properties</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
      </div>
      {/* Presentation Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: '#444', letterSpacing: 0.5 }}>Presentation</div>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
          {/* Color pickers */}
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 13, color: '#444' }}>
            <span style={{ marginBottom: 4 }}>Fill</span>
            <input type="color" value={data.fill || '#ffffff'} onChange={e => onChange({ fill: e.target.value })} style={{ width: 32, height: 32, border: 'none', background: 'none' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 13, color: '#444' }}>
            <span style={{ marginBottom: 4 }}>Outline</span>
            <input type="color" value={data.outline || '#222222'} onChange={e => onChange({ outline: e.target.value })} style={{ width: 32, height: 32, border: 'none', background: 'none' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 13, color: '#444' }}>
            <span style={{ marginBottom: 4 }}>Text</span>
            <input type="color" value={data.textColor || '#000000'} onChange={e => onChange({ textColor: e.target.value })} style={{ width: 32, height: 32, border: 'none', background: 'none' }} />
          </label>
        </div>
        {/* Shape size controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <label style={{ fontSize: 14, color: '#444', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            Width
            <input type="number" min={20} max={1000} step={1} value={data.width || 120} onChange={e => onChange({ width: Number(e.target.value) })} style={{ width: 70, marginTop: 2, border: '1px solid #bdbdbd', borderRadius: 4, padding: '2px 6px', fontSize: 14 }} />
          </label>
          <label style={{ fontSize: 14, color: '#444', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            Height
            <input type="number" min={20} max={1000} step={1} value={data.height || 60} onChange={e => onChange({ height: Number(e.target.value) })} style={{ width: 70, marginTop: 2, border: '1px solid #bdbdbd', borderRadius: 4, padding: '2px 6px', fontSize: 14 }} />
          </label>
        </div>
        <label style={{ fontSize: 14, display: 'block', marginBottom: 4, color: '#444' }}>
          Outline thickness: <span style={{ color: '#888' }}>{data.outlineWidth || 2} px</span>
        </label>
        <input type="range" min={1} max={8} value={data.outlineWidth || 2} onChange={e => onChange({ outlineWidth: Number(e.target.value) })} style={{ width: '100%', marginBottom: 12 }} />
        <label style={{ fontSize: 14, display: 'block', marginBottom: 4, color: '#444' }}>
          Outline style:
        </label>
        <select value={data.outlineStyle || 'solid'} onChange={e => onChange({ outlineStyle: e.target.value })} style={{ width: '100%', padding: 6, fontSize: 14, border: '1px solid #bdbdbd', borderRadius: 4, marginBottom: 8 }}>
          {outlineStyles.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {/* Text Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10, color: '#444', letterSpacing: 0.5 }}>Text</div>
        <label style={{ fontSize: 14, display: 'block', marginBottom: 4, color: '#444' }}>Text:</label>
        <textarea value={data.text || ''} onChange={e => onChange({ text: e.target.value })} style={{ width: '100%', minHeight: 40, marginBottom: 12, fontSize: 14, border: '1px solid #bdbdbd', borderRadius: 4, padding: 6 }} />
        <label style={{ fontSize: 14, display: 'block', marginBottom: 4, color: '#444' }}>
          Font size: <span style={{ color: '#888' }}>{data.fontSize || 15} px</span>
        </label>
        <input type="range" min={10} max={40} value={data.fontSize || 15} onChange={e => onChange({ fontSize: Number(e.target.value) })} style={{ width: '100%', marginBottom: 12 }} />
        <label style={{ fontSize: 14, display: 'block', marginBottom: 4, color: '#444' }}>
          Font family:
        </label>
        <select value={data.fontFamily || 'Open Sans'} onChange={e => onChange({ fontFamily: e.target.value })} style={{ width: '100%', padding: 6, fontSize: 14, border: '1px solid #bdbdbd', borderRadius: 4, marginBottom: 8 }}>
          {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <label style={{ fontSize: 14, display: 'block', marginBottom: 4, color: '#444' }}>
          Font thickness:
        </label>
        <input type="range" min={300} max={900} step={100} value={data.fontWeight || 400} onChange={e => onChange({ fontWeight: Number(e.target.value) })} style={{ width: '100%' }} />
      </div>
      {/* Conditional Section */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: '#444', gap: 8 }}>
          <input
            type="checkbox"
            checked={!!data.isConditional}
            onChange={e => {
              onChange({ isConditional: e.target.checked });
              if (e.target.checked) {
                onChange({ condition: 'inactive' });
              } else {
                onChange({ condition: undefined });
              }
            }}
            style={{ marginRight: 8 }}
          />
          Conditional (True/False)
        </label>
        {data.isConditional && (
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 14, color: '#444', marginBottom: 4, display: 'block' }}>Condition:</label>
            <select
              value={data.condition || 'inactive'}
              onChange={e => onChange({ condition: e.target.value })}
              style={{ width: '100%', padding: 6, fontSize: 14, border: '1px solid #bdbdbd', borderRadius: 4 }}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="wip">WIP</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
} 