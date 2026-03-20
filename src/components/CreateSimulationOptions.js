import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, Eye, X, Copy,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Paintbrush, Highlighter, Link, Image, Table, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Code, Minus, Quote,
} from 'lucide-react';
import './CreateMCQ.css';
import './CreateSimulationOptions.css';
import ConfirmModal from './ConfirmModal';

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Bascis of Accounting - Foundation',
  'US Accounting - Foundation', 'US Accounting - Intermediate', 'CFP Exam Prep',
  'US Auditing - Foundation', 'US Auditing - Intermediate', 'EA Test',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Firms',
  'Restaurant Accounting - Foundation', 'US Business Tax - Foundation', 'IRS - Foundation',
];

/* ===== Rich Toolbar ===== */
const RichToolbar = () => (
  <div className="cm-toolbar">
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Bold size={16} /></button>
      <button type="button" className="cm-tb-btn"><Italic size={16} /></button>
      <button type="button" className="cm-tb-btn"><Underline size={16} /></button>
      <button type="button" className="cm-tb-btn"><Strikethrough size={16} /></button>
      <button type="button" className="cm-tb-btn"><Subscript size={16} /></button>
      <button type="button" className="cm-tb-btn"><Superscript size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Type size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Paintbrush size={16} /></button>
      <button type="button" className="cm-tb-btn"><Highlighter size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><AlignLeft size={16} /></button>
      <button type="button" className="cm-tb-btn"><AlignCenter size={16} /></button>
      <button type="button" className="cm-tb-btn"><AlignRight size={16} /></button>
      <button type="button" className="cm-tb-btn"><AlignJustify size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><List size={16} /></button>
      <button type="button" className="cm-tb-btn"><ListOrdered size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Quote size={16} /></button>
      <button type="button" className="cm-tb-btn"><Link size={16} /></button>
      <button type="button" className="cm-tb-btn"><Image size={16} /></button>
      <button type="button" className="cm-tb-btn"><Table size={16} /></button>
      <button type="button" className="cm-tb-btn"><Code size={16} /></button>
      <button type="button" className="cm-tb-btn"><Minus size={16} /></button>
    </div>
  </div>
);

/* ===== Searchable Dropdown ===== */
const SelectDropdown = ({ label, placeholder, options, value, onChange, required, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = search ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className="cm-field" ref={ref}>
      <label className="cm-label">{label}{required && <span className="cm-req"> *</span>}</label>
      <div className="cm-select-wrap">
        <button type="button"
          className={`cm-select-btn ${open ? 'cm-select-btn--open' : ''} ${error ? 'cm-select-btn--error' : ''}`}
          onClick={() => setOpen(!open)}>
          <span className={value ? '' : 'cm-placeholder'}>{value || placeholder}</span>
          <ChevronDown size={14} className={`cm-chev ${open ? 'cm-chev--open' : ''}`} />
        </button>
        {open && (
          <div className="cm-select-panel">
            <div className="cm-select-search">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." className="cm-select-search-input" autoFocus />
            </div>
            <div className="cm-select-list">
              <div className="cm-select-item cm-select-item--header"
                onClick={() => { onChange(''); setOpen(false); setSearch(''); }}>{placeholder}</div>
              {filtered.map((o) => (
                <div key={o} className={`cm-select-item ${value === o ? 'cm-select-item--sel' : ''}`}
                  onClick={() => { onChange(o); setOpen(false); setSearch(''); }}>{o}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <span className="cm-error-msg">{error}</span>}
    </div>
  );
};

/* ===== Options Modal ===== */
const OptionsModal = ({ blank, initialOptions, onSave, onClose }) => {
  const [options, setOptions] = useState(
    initialOptions && initialOptions.length > 0
      ? initialOptions
      : [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
  );

  const addOption = () => setOptions((p) => [...p, { text: '', isCorrect: false }]);

  const updateText = (i, text) => setOptions((p) => p.map((o, idx) => idx === i ? { ...o, text } : o));

  const toggleCorrect = (i) => setOptions((p) => p.map((o, idx) => ({ ...o, isCorrect: idx === i })));

  return (
    <div className="cso-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cso-modal">
        <div className="cso-modal-header">
          <h3 className="cso-modal-title">Enter Options – {blank}</h3>
          <button type="button" className="cso-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="cso-modal-body">
          <div className="cso-options-header-row">
            <span className="cso-options-col-label cso-options-col-label--text">Option Text</span>
            <span className="cso-options-col-label cso-options-col-label--correct">Correct</span>
          </div>

          <div className="cso-options-list">
            {options.map((opt, i) => (
              <div key={i} className="cso-option-row">
                <span className="cso-option-num">{i + 1} –</span>
                <textarea
                  className="cso-option-textarea"
                  value={opt.text}
                  onChange={(e) => updateText(i, e.target.value)}
                  rows={2}
                />
                <input
                  type="radio"
                  name={`correct-${blank}`}
                  className="cso-option-radio"
                  checked={opt.isCorrect}
                  onChange={() => toggleCorrect(i)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="cso-modal-footer">
          <button type="button" className="cso-add-options-btn" onClick={addOption}>Add Options</button>
          <button type="button" className="cso-save-btn" onClick={() => onSave(options)}>Save</button>
        </div>
      </div>
    </div>
  );
};

/* ===== Main Component ===== */
const CreateSimulationOptions = ({ onBack, onSave, initialData }) => {
  const [difficulty, setDifficulty] = useState(initialData?.level || '');
  const [category, setCategory] = useState(initialData?.parentCategory || '');
  const [rangeOfCorrect, setRangeOfCorrect] = useState('0');
  const [simulationName, setSimulationName] = useState(initialData?.name || '');
  const [question, setQuestion] = useState(initialData?.question || '');
  const [allowFileUpload, setAllowFileUpload] = useState(initialData?.fileUploadAllowed === 'Yes');
  const [explanation, setExplanation] = useState('');
  const [materialFiles, setMaterialFiles] = useState([]);
  const [variables, setVariables] = useState([]);
  const [varCounter, setVarCounter] = useState(1);
  const [optionsModal, setOptionsModal] = useState(null); // { variableId, blank, initialOptions }
  const [errors, setErrors] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const materialFileRef = useRef(null);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleBack = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  const clearError = (k) => {
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const addVariable = () => {
    const id = varCounter;
    setVarCounter((c) => c + 1);
    setVariables((p) => [...p, { id, label: `Variable ${id}`, blank: `%%Blank${id}%%`, options: [] }]);
  };

  const removeVariable = (id) => setVariables((p) => p.filter((v) => v.id !== id));

  const handleCopy = (id, blank) => {
    navigator.clipboard.writeText(blank).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSaveOptions = (variableId, opts) => {
    setVariables((p) => p.map((v) => v.id === variableId ? { ...v, options: opts } : v));
    setOptionsModal(null);
  };

  const handleMaterialFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) setMaterialFiles((p) => [...p, ...files]);
    e.target.value = '';
  };

  const validate = () => {
    const e = {};
    if (!difficulty) e.difficulty = 'Select difficulty level';
    if (!category) e.category = 'Select a category';
    if (!simulationName.trim()) e.simulationName = 'Simulation name is required';
    if (!question.trim()) e.question = 'Enter a question';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate() && onSave) {
      onSave({ difficulty, category, rangeOfCorrect, simulationName, question, allowFileUpload, explanation, variables, materialFiles });
    }
  };

  return (
    <div className="cm-page">
      <div className="cm-scroll">
        {/* Header */}
        <div className="cm-header">
          <button type="button" className="cm-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="cm-page-title">Option List</h1>
        </div>

        {/* Fields Row — 3 columns */}
        <div className="cso-fields-row">
          <SelectDropdown
            label="Difficulty Level" placeholder="Select Difficulty Level" options={DIFFICULTY_LEVELS}
            value={difficulty} onChange={(v) => { setDifficulty(v); clearError('difficulty'); markDirty(); }}
            required error={errors.difficulty}
          />
          <SelectDropdown
            label="Category" placeholder="Nothing selected" options={CATEGORIES}
            value={category} onChange={(v) => { setCategory(v); clearError('category'); markDirty(); }}
            required error={errors.category}
          />
          <div className="cm-field">
            <label className="cm-label">Range of Correct answer (In %)</label>
            <input type="number" min={0} max={100} className="cm-text-input"
              value={rangeOfCorrect} onChange={(e) => setRangeOfCorrect(e.target.value)} />
          </div>
        </div>

        {/* Simulation Name */}
        <div className="cm-section">
          <label className="cm-label">Simulation Name <span className="cm-req">*</span></label>
          <input type="text"
            className={`cm-text-input cso-full-input ${errors.simulationName ? 'cm-text-input--error' : ''}`}
            value={simulationName}
            onChange={(e) => { setSimulationName(e.target.value); clearError('simulationName'); markDirty(); }} />
          {errors.simulationName && <span className="cm-error-msg">{errors.simulationName}</span>}
        </div>

        {/* Enter Question */}
        <div className="cm-section">
          <label className="cm-label">Enter Question <span className="cm-req">*</span></label>
          <div className={`cm-editor-card ${errors.question ? 'cm-editor-card--error' : ''}`}>
            <RichToolbar />
            <textarea className="cm-editor-area" value={question} rows={6}
              onChange={(e) => { setQuestion(e.target.value); clearError('question'); markDirty(); }} />
            <div className="cm-char-count">Characters : {question.length}</div>
          </div>
          {errors.question && <span className="cm-error-msg">{errors.question}</span>}
        </div>

        {/* Allow file upload */}
        <div className="cso-checkbox-row">
          <label className="cso-checkbox-label">
            <input type="checkbox" className="cso-checkbox"
              checked={allowFileUpload} onChange={(e) => setAllowFileUpload(e.target.checked)} />
            Allow user to upload their file
          </label>
        </div>

        {/* Explanation */}
        <div className="cm-section">
          <label className="cm-label">Explanation :</label>
          <div className="cm-editor-card">
            <RichToolbar />
            <textarea className="cm-editor-area" rows={6}
              placeholder="Type Explanation: Why this answer is correct?"
              value={explanation} onChange={(e) => setExplanation(e.target.value)} />
            <div className="cm-char-count">Characters : {explanation.length}</div>
          </div>
        </div>

        {/* Variable Section */}
        <div className="cso-variable-section">
          <div className="cso-variable-header">
            <span className="cso-variable-title">Variable</span>
            <button type="button" className="cso-add-variable-btn" onClick={addVariable}>
              Add Variable
            </button>
          </div>

          {variables.length > 0 && (
            <div className="cso-variables-grid">
              {variables.map((v) => {
                const hasOptions = v.options && v.options.length > 0;
                return (
                  <div key={v.id} className="cso-variable-card">
                    <span className="cso-variable-label">{v.label}</span>
                    <div className="cso-variable-row">
                      <input type="text" className="cso-variable-input" value={v.blank} readOnly />
                      <button
                        type="button"
                        className={`cso-copy-btn ${copiedId === v.id ? 'cso-copy-btn--copied' : ''}`}
                        onClick={() => handleCopy(v.id, v.blank)}
                        title="Copy to clipboard"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        className={`cso-options-btn ${hasOptions ? 'cso-options-btn--has-options' : ''}`}
                        onClick={() => setOptionsModal({ variableId: v.id, blank: v.blank, initialOptions: v.options })}
                      >
                        {hasOptions ? 'View Options' : 'Add Options'}
                      </button>
                      <button type="button" className="cso-remove-var-btn" onClick={() => removeVariable(v.id)}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upload Material */}
        <div className="cso-upload-section">
          <span className="cso-upload-label">Upload Material</span>
          <div className="cso-upload-row">
            <button type="button" className="cso-browse-btn" onClick={() => materialFileRef.current.click()}>
              Browse File
            </button>
            <input ref={materialFileRef} type="file" multiple style={{ display: 'none' }} onChange={handleMaterialFiles} />
          </div>
          {materialFiles.length > 0 && (
            <div className="cso-files-list">
              {materialFiles.map((f, i) => (
                <div key={i} className="cso-file-item">
                  <span className="cso-file-name">{f.name}</span>
                  <button type="button" className="cso-file-remove"
                    onClick={() => setMaterialFiles((p) => p.filter((_, idx) => idx !== i))}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="cm-footer">
        <div className="cm-footer-inner">
          <button type="button" className="cm-btn cso-btn--submit" onClick={handleSave}>Submit</button>
          <button type="button" className="cm-btn cm-btn--cancel" onClick={handleBack}>Cancel</button>
          <button type="button" className="cm-btn cm-btn--preview"><Eye size={16} /> Preview</button>
        </div>
      </div>

      {showLeaveConfirm && (
        <ConfirmModal
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to leave? All changes will be lost."
          confirmLabel="Leave"
          cancelLabel="Stay"
          variant="warning"
          onConfirm={onBack}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}

      {/* Options Modal */}
      {optionsModal && (
        <OptionsModal
          blank={optionsModal.blank}
          initialOptions={optionsModal.initialOptions}
          onSave={(opts) => handleSaveOptions(optionsModal.variableId, opts)}
          onClose={() => setOptionsModal(null)}
        />
      )}
    </div>
  );
};

export default CreateSimulationOptions;
