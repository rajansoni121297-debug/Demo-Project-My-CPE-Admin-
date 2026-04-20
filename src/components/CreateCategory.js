import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronDown, X, FolderTree, GitBranch, Check } from 'lucide-react';
import './CreateCategory.css';

const PARENT_CATEGORIES = [
  'Audit - Assessment',
  'Tax - Assessment',
  'Accounting - Assessment',
  'US CPA Firms Overview',
  'US Individual Tax - Foundation',
  'US Accounting - Foundation',
  'US Auditing - Foundation',
  'CFP Exam Prep',
];

const TOPICS = [
  '1031 Exchange', '1040', '1065', '1099', '1099\'s', '199A', '401(k)',
  '403 (b)', 'A & A (Govt)', 'A & A Update', 'AccounTech', 'Accounting',
  'Accounting & Auditing', 'Accounting Adjustments', 'Accounting Software',
  'Accounts Payable', 'NFP', 'Yellow Book', 'Tax Software',
  'Lacerte Tax Software', 'Drake Software',
];

const DOMAINS = ['Accounting', 'Auditing', 'Tax', 'Others'];

/* ===== Searchable Select Dropdown ===== */
const SelectDropdown = ({ placeholder, options, value, onChange, searchable, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = searchable && search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="cc-dropdown-wrap" ref={ref}>
      <button className={`cc-dropdown-trigger ${isOpen ? 'cc-dropdown-trigger--open' : ''} ${error ? 'cc-error' : ''}`} onClick={() => setIsOpen(!isOpen)} type="button">
        <span className={value ? '' : 'cc-placeholder'}>{value || placeholder}</span>
        <ChevronDown size={16} className={`cc-dropdown-chevron ${isOpen ? 'cc-dropdown-chevron--open' : ''}`} />
      </button>
      {isOpen && (
        <div className="cc-dropdown-panel">
          {searchable && (
            <div className="cc-dropdown-search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="cc-dropdown-search-input"
                autoFocus
              />
            </div>
          )}
          <div className="cc-dropdown-list">
            {filtered.map((opt) => (
              <div
                key={opt}
                className={`cc-dropdown-item ${value === opt ? 'cc-dropdown-item--selected' : ''}`}
                onClick={() => { onChange(opt); setIsOpen(false); setSearch(''); }}
              >
                <span>{opt}</span>
                {value === opt && <Check size={14} className="cc-dropdown-check" />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="cc-dropdown-empty">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== Multi Select Tags ===== */
const TagsSelect = ({ placeholder, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = (opt) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  return (
    <div className="cc-dropdown-wrap" ref={ref}>
      <div className={`cc-tags-trigger ${isOpen ? 'cc-tags-trigger--open' : ''}`} onClick={() => setIsOpen(true)}>
        {selected.length > 0 ? (
          <div className="cc-tags-chips">
            {selected.map((tag) => (
              <span key={tag} className="cc-chip">
                {tag}
                <X size={12} className="cc-chip-x" onClick={(e) => { e.stopPropagation(); onChange(selected.filter((s) => s !== tag)); }} />
              </span>
            ))}
          </div>
        ) : (
          <span className="cc-placeholder">{placeholder}</span>
        )}
        <ChevronDown size={16} className="cc-dropdown-chevron" />
      </div>
      {isOpen && (
        <div className="cc-dropdown-panel">
          <div className="cc-dropdown-search">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="cc-dropdown-search-input"
              autoFocus
            />
          </div>
          <div className="cc-dropdown-list">
            {filtered.map((opt) => (
              <div
                key={opt}
                className={`cc-dropdown-item ${selected.includes(opt) ? 'cc-dropdown-item--selected' : ''}`}
                onClick={() => toggle(opt)}
              >
                <span>{opt}</span>
                {selected.includes(opt) && <Check size={14} className="cc-dropdown-check" />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="cc-dropdown-empty">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CreateCategory = ({ onBack, onSuccess }) => {
  const [categoryType, setCategoryType] = useState('parent');
  const [parentCategory, setParentCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [domain, setDomain] = useState('');
  const [errors, setErrors] = useState({});

  const switchType = (type) => {
    setCategoryType(type);
    setParentCategory('');
    setCategoryName('');
    setCategoryDescription('');
    setSelectedTopics([]);
    setDomain('');
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!categoryName.trim()) e.categoryName = 'Category name is required';
    if (categoryType === 'child' && !parentCategory) e.parentCategory = 'Parent category is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate() && onSuccess) onSuccess();
  };

  const clearError = (field) => setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  return (
    <div className="create-category">
      <div className="cc-scroll">
        {/* Header */}
        <div className="cc-header">
          <button className="cc-back" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="cc-title">Create Category</h1>
        </div>

        {/* Card */}
        <div className="cc-card">
          {/* Type selector cards */}
          <div className="cc-type-row">
            <button
              className={`cc-type-option ${categoryType === 'parent' ? 'cc-type-option--active' : ''}`}
              onClick={() => switchType('parent')}
            >
              <div className="cc-type-icon-wrap">
                <FolderTree size={20} />
              </div>
              <div className="cc-type-text">
                <span className="cc-type-name">Parent Category</span>
                <span className="cc-type-desc">Top-level grouping</span>
              </div>
              <div className={`cc-type-radio ${categoryType === 'parent' ? 'cc-type-radio--active' : ''}`}>
                {categoryType === 'parent' && <div className="cc-type-radio-dot" />}
              </div>
            </button>
            <button
              className={`cc-type-option ${categoryType === 'child' ? 'cc-type-option--active' : ''}`}
              onClick={() => switchType('child')}
            >
              <div className="cc-type-icon-wrap cc-type-icon-wrap--child">
                <GitBranch size={20} />
              </div>
              <div className="cc-type-text">
                <span className="cc-type-name">Child Category</span>
                <span className="cc-type-desc">Nested under a parent</span>
              </div>
              <div className={`cc-type-radio ${categoryType === 'child' ? 'cc-type-radio--active' : ''}`}>
                {categoryType === 'child' && <div className="cc-type-radio-dot" />}
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="cc-divider" />

          {/* Form fields */}
          <div className="cc-fields">
            {categoryType === 'child' && (
              <div className="cc-field-group">
                <label className="cc-lbl">Parent Category <span className="cc-req">*</span></label>
                <SelectDropdown
                  placeholder="Select parent category"
                  options={PARENT_CATEGORIES}
                  value={parentCategory}
                  onChange={(v) => { setParentCategory(v); clearError('parentCategory'); }}
                  searchable
                  error={!!errors.parentCategory}
                />
                {errors.parentCategory && <span className="cc-error-msg">{errors.parentCategory}</span>}
              </div>
            )}

            <div className="cc-field-group">
              <label className="cc-lbl">Category Name <span className="cc-req">*</span></label>
              <input
                type="text"
                className={`cc-text-input ${errors.categoryName ? 'cc-error' : ''}`}
                placeholder="e.g. Financial Reporting Standards"
                value={categoryName}
                onChange={(e) => { setCategoryName(e.target.value); clearError('categoryName'); }}
              />
              {errors.categoryName && <span className="cc-error-msg">{errors.categoryName}</span>}
            </div>

            <div className="cc-field-group">
              <label className="cc-lbl">Description <span className="cc-optional">(optional)</span></label>
              <textarea
                className="cc-text-area"
                placeholder="Briefly describe what this category covers..."
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows={3}
              />
            </div>

            {categoryType === 'child' ? (
              <div className="cc-field-group">
                <label className="cc-lbl">Topics <span className="cc-optional">(optional)</span></label>
                <TagsSelect
                  placeholder="Select topics"
                  options={TOPICS}
                  selected={selectedTopics}
                  onChange={setSelectedTopics}
                />
              </div>
            ) : (
              <div className="cc-field-group">
                <label className="cc-lbl">Domain <span className="cc-optional">(optional)</span></label>
                <SelectDropdown
                  placeholder="Select domain"
                  options={DOMAINS}
                  value={domain}
                  onChange={setDomain}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="cc-actions">
            <button className="cc-btn-cancel" onClick={onBack}>Cancel</button>
            <button className="cc-btn-save" onClick={handleSave}>Save Category</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
