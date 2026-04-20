import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import './CustomSelect.css';

const CustomSelect = ({ value, onChange, options, placeholder = 'Select', className = '', error }) => {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const [search, setSearch] = useState('');
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const updatePosition = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;
    setPanelStyle(
      openUpward
        ? { position: 'fixed', bottom: window.innerHeight - r.top + 4, left: r.left, width: r.width, zIndex: 9999 }
        : { position: 'fixed', top: r.bottom + 4, left: r.left, width: r.width, zIndex: 9999 }
    );
  };

  useEffect(() => {
    if (open) {
      updatePosition();
      setSearch('');
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selected = options.find((o) => (o.value !== undefined ? o.value : o) === value);
  const displayLabel = selected ? (selected.label || selected) : placeholder;

  return (
    <div className={`csel-wrap ${className}`}>
      <button
        ref={btnRef}
        type="button"
        className={`csel-btn ${open ? 'csel-btn--open' : ''} ${error ? 'csel-btn--error' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={`csel-value ${!selected ? 'csel-placeholder' : ''}`}>{displayLabel}</span>
        <ChevronDown size={14} className={`csel-chev ${open ? 'csel-chev--open' : ''}`} />
      </button>
      {open && ReactDOM.createPortal(
        <div className="csel-panel" ref={panelRef} style={panelStyle}>
          <div className="csel-search">
            <input
              type="text"
              className="csel-search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="csel-list">
            {options
              .filter((opt) => {
                const label = opt.label || opt;
                return String(label).toLowerCase().includes(search.toLowerCase());
              })
              .map((opt) => {
                const val = opt.value !== undefined ? opt.value : opt;
                const label = opt.label || opt;
                const isSelected = val === value;
                return (
                  <div
                    key={val}
                    className={`csel-option ${isSelected ? 'csel-option--selected' : ''}`}
                    onClick={() => { onChange(val); setOpen(false); }}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={13} className="csel-check" />}
                  </div>
                );
              })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
