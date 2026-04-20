import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './MultiSelectDropdown.css';

const MultiSelectDropdown = ({ label, placeholder, options, selected, onChange, hasSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (option === placeholder) {
      onChange(selected.length === options.length ? [] : [...options]);
      return;
    }
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  const filteredOptions = hasSearch && searchTerm
    ? options.filter((o) => o.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const displayText = selected.length > 0
    ? (selected.length === options.length ? placeholder : `${selected.length} selected`)
    : placeholder;

  return (
    <div className="msd-group" ref={ref}>
      {label && <label className="msd-label">{label}</label>}
      <div className="msd-wrapper">
        <button
          className="msd-btn"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className="msd-text">{displayText}</span>
          <ChevronDown size={14} className={`msd-chevron ${isOpen ? 'msd-chevron--open' : ''}`} />
        </button>

        {isOpen && (
          <div className="msd-dropdown">
            {hasSearch && (
              <div className="msd-search">
                <input
                  type="text"
                  placeholder=""
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="msd-search-input"
                  autoFocus
                />
              </div>
            )}
            <div className="msd-options">
              <label className="msd-option">
                <span>{placeholder}</span>
                <input
                  type="checkbox"
                  checked={selected.length === options.length}
                  onChange={() => toggleOption(placeholder)}
                />
              </label>
              {filteredOptions.map((option) => (
                <label key={option} className="msd-option">
                  <span>{option}</span>
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
