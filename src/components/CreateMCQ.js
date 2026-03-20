import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, Check, Eye,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Paintbrush, Highlighter, Link, Image, Table, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Code, Minus, Quote,
} from 'lucide-react';
import './CreateMCQ.css';
import ConfirmModal from './ConfirmModal';

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Bascis of Accounting - Foundation',
  'US Accounting - Foundation', 'US Accounting - Intermediate', 'CFP Exam Prep',
  'US Auditing - Foundation', 'US Auditing - Intermediate', 'EA Test',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Firms',
  'Restaurant Accounting - Foundation', 'US Business Tax - Foundation', 'IRS - Foundation',
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const OPTIONS_BY_TYPE = {
  'MCQ': [
    { label: 'A', text: '', editable: true },
    { label: 'B', text: '', editable: true },
    { label: 'C', text: '', editable: true },
    { label: 'D', text: '', editable: true },
  ],
  'Yes/No': [
    { label: 'Yes', text: 'Yes', editable: false },
    { label: 'No', text: 'No', editable: false },
  ],
  'True/False': [
    { label: 'True', text: 'True', editable: false },
    { label: 'False', text: 'False', editable: false },
  ],
};

/* ===== Toolbar ===== */
const RichToolbar = ({ compact }) => (
  <div className={`cm-toolbar ${compact ? 'cm-toolbar--compact' : ''}`}>
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Bold"><Bold size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Italic"><Italic size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Underline"><Underline size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Strikethrough"><Strikethrough size={compact ? 14 : 16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Subscript"><Subscript size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Superscript"><Superscript size={compact ? 14 : 16} /></button>
    </div>
    {!compact && (
      <>
        <span className="cm-tb-sep" />
        <div className="cm-toolbar-group">
          <button type="button" className="cm-tb-btn" title="Font Size"><Type size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Text Color"><Paintbrush size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Highlight"><Highlighter size={16} /></button>
        </div>
      </>
    )}
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Align Left"><AlignLeft size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Align Center"><AlignCenter size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Align Right"><AlignRight size={compact ? 14 : 16} /></button>
      {!compact && <button type="button" className="cm-tb-btn" title="Justify"><AlignJustify size={16} /></button>}
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Bulleted List"><List size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Numbered List"><ListOrdered size={compact ? 14 : 16} /></button>
    </div>
    {!compact && (
      <>
        <span className="cm-tb-sep" />
        <div className="cm-toolbar-group">
          <button type="button" className="cm-tb-btn" title="Blockquote"><Quote size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Link"><Link size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Image"><Image size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Table"><Table size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Code"><Code size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Horizontal Rule"><Minus size={16} /></button>
        </div>
      </>
    )}
  </div>
);

/* ===== Searchable Dropdown ===== */
const SelectDropdown = ({ label, placeholder, options, value, onChange, required, error, disabled }) => {
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
      <label className="cm-label">{label} {required && <span className="cm-req">*</span>}</label>
      <div className="cm-select-wrap">
        <button
          type="button"
          className={`cm-select-btn ${open ? 'cm-select-btn--open' : ''} ${error ? 'cm-select-btn--error' : ''} ${disabled ? 'cm-select-btn--disabled' : ''}`}
          onClick={() => { if (!disabled) setOpen(!open); }}
          disabled={disabled}
        >
          <span className={value ? '' : 'cm-placeholder'}>{value || placeholder}</span>
          <ChevronDown size={14} className={`cm-chev ${open ? 'cm-chev--open' : ''}`} />
        </button>
        {open && (
          <div className="cm-select-panel">
            <div className="cm-select-search">
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." className="cm-select-search-input" autoFocus
              />
            </div>
            <div className="cm-select-list">
              <div className="cm-select-item cm-select-item--header" onClick={() => { onChange(''); setOpen(false); setSearch(''); }}>
                {placeholder}
              </div>
              {filtered.map((o) => (
                <div key={o} className={`cm-select-item ${value === o ? 'cm-select-item--sel' : ''}`}
                  onClick={() => { onChange(o); setOpen(false); setSearch(''); }}>
                  {o}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <span className="cm-error-msg">{error}</span>}
    </div>
  );
};

/* ===== Main Component ===== */
const MCQ_TYPE_OPTIONS = ['MCQ', 'Yes/No', 'True/False'];

const CreateMCQ = ({ mcqType, onBack, onSave, initialData }) => {
  const [selectType, setSelectType] = useState(initialData?.type || mcqType || 'MCQ');
  const [marks, setMarks] = useState(initialData?.marks ?? '');
  const [difficulty, setDifficulty] = useState(initialData?.level || '');
  const [category, setCategory] = useState(initialData?.parentCategory || '');
  const [question, setQuestion] = useState(initialData?.name || '');

  const typeConfig = OPTIONS_BY_TYPE[selectType] || OPTIONS_BY_TYPE['MCQ'];
  const isMCQ = selectType === 'MCQ';

  const [options, setOptions] = useState(
    initialData?.options
      ? initialData.options.map((o) => ({ label: o.label, text: o.text, isCorrect: o.isCorrect, explanation: o.explanation || '', editable: true }))
      : typeConfig.map((opt) => ({ label: opt.label, text: opt.text, explanation: '', isCorrect: false, editable: opt.editable }))
  );
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleBack = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  const handleTypeChange = (newType) => {
    setSelectType(newType);
    const config = OPTIONS_BY_TYPE[newType] || OPTIONS_BY_TYPE['MCQ'];
    setOptions(config.map((opt) => ({ label: opt.label, text: opt.text, explanation: '', isCorrect: false, editable: opt.editable })));
    setErrors({});
    markDirty();
  };

  const clearError = (key) => {
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const updateOption = (idx, field, value) => {
    setOptions((prev) => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o));
    if (field === 'text') clearError(`option_${idx}`);
    markDirty();
  };

  const toggleCorrect = (idx) => {
    setOptions((prev) => prev.map((o, i) => ({ ...o, isCorrect: i === idx })));
    clearError('correctAnswer');
    markDirty();
  };

  const validate = () => {
    const e = {};
    if (!marks.trim()) e.marks = 'Marks is required';
    if (!difficulty) e.difficulty = 'Select difficulty level';
    if (!category) e.category = 'Select a category';
    if (!question.trim()) e.question = 'Enter a question';
    options.forEach((o, i) => { if (o.editable && !o.text.trim()) e[`option_${i}`] = `Option ${o.label} is required`; });
    if (!options.some((o) => o.isCorrect)) e.correctAnswer = 'Mark one option as correct';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setTimeout(() => document.querySelector('.cm-error-msg')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      if (onSave) {
        onSave({ selectType, marks, difficulty, category, question, options });
      } else {
        onBack();
      }
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
          <h1 className="cm-page-title">Multiple Choice Questions</h1>
        </div>

        {/* Form Fields Row */}
        <div className="cm-fields-row">
          <SelectDropdown
            label="Select Type" placeholder="Select Type" options={MCQ_TYPE_OPTIONS}
            value={selectType} onChange={handleTypeChange}
            required
          />

          <div className="cm-field">
            <label className="cm-label">Marks <span className="cm-req">*</span></label>
            <input
              type="number"
              className={`cm-text-input ${errors.marks ? 'cm-text-input--error' : ''}`}
              placeholder="e.g. 5"
              value={marks}
              onChange={(e) => { setMarks(e.target.value); clearError('marks'); markDirty(); }}
            />
            {errors.marks && <span className="cm-error-msg">{errors.marks}</span>}
          </div>

          <SelectDropdown
            label="Difficulty Level" placeholder="Select Difficulty Level" options={DIFFICULTY_LEVELS}
            value={difficulty} onChange={(v) => { setDifficulty(v); clearError('difficulty'); markDirty(); }}
            required error={errors.difficulty}
          />

          <SelectDropdown
            label="Select Category" placeholder="Nothing selected" options={CATEGORIES}
            value={category} onChange={(v) => { setCategory(v); clearError('category'); markDirty(); }}
            required error={errors.category}
          />
        </div>

        {/* Question Editor */}
        <div className="cm-section">
          <label className="cm-label">Enter Question <span className="cm-req">*</span></label>
          <div className={`cm-editor-card ${errors.question ? 'cm-editor-card--error' : ''}`}>
            <RichToolbar />
            <textarea
              className="cm-editor-area"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => { setQuestion(e.target.value); clearError('question'); markDirty(); }}
              rows={6}
            />
            <div className="cm-char-count">Characters : {question.length}</div>
          </div>
          {errors.question && <span className="cm-error-msg">{errors.question}</span>}
        </div>

        {/* Options */}
        <div className="cm-section">
          <label className="cm-label">Options <span className="cm-req">*</span></label>
          {errors.correctAnswer && <span className="cm-error-msg cm-error-msg--top">{errors.correctAnswer}</span>}

          <div className="cm-options-list">
            {options.map((opt, idx) => (
              <div key={opt.label} className={`cm-option-card ${opt.isCorrect ? 'cm-option-card--correct' : ''} ${!isMCQ ? 'cm-option-card--fixed' : ''}`}>
                <div className="cm-option-left">
                  {isMCQ ? (
                    /* MCQ: Badge + editable textarea */
                    <>
                      <div className="cm-option-input-wrap">
                        <span className="cm-option-badge">{opt.label}</span>
                        <textarea
                          className={`cm-option-textarea ${errors[`option_${idx}`] ? 'cm-option-textarea--error' : ''}`}
                          placeholder="Type option text..."
                          value={opt.text}
                          onChange={(e) => updateOption(idx, 'text', e.target.value)}
                          rows={3}
                        />
                      </div>
                      <button
                        type="button"
                        className={`cm-correct-btn ${opt.isCorrect ? 'cm-correct-btn--active' : ''}`}
                        onClick={() => toggleCorrect(idx)}
                        title={opt.isCorrect ? 'Marked as correct' : 'Mark as correct answer'}
                      >
                        <Check size={16} />
                        <span>{opt.isCorrect ? 'Correct Answer' : 'Mark as Correct'}</span>
                      </button>
                      {errors[`option_${idx}`] && <span className="cm-error-msg">{errors[`option_${idx}`]}</span>}
                    </>
                  ) : (
                    /* Yes/No & True/False: Fixed label input with mark as correct */
                    <>
                      <div className="cm-fixed-option-input">
                        <span className="cm-fixed-option-text">{opt.label}</span>
                      </div>
                      <button
                        type="button"
                        className={`cm-correct-btn ${opt.isCorrect ? 'cm-correct-btn--active' : ''}`}
                        onClick={() => toggleCorrect(idx)}
                        title={opt.isCorrect ? 'Marked as correct' : 'Mark as correct answer'}
                      >
                        <Check size={16} />
                        <span>{opt.isCorrect ? 'Correct Answer' : 'Mark as Correct'}</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="cm-option-right">
                  <div className="cm-explanation-card">
                    <RichToolbar compact />
                    <textarea
                      className="cm-explanation-area"
                      placeholder={`Type Explanation: Why this option ${opt.label} is correct/incorrect?`}
                      value={opt.explanation}
                      onChange={(e) => updateOption(idx, 'explanation', e.target.value)}
                      rows={4}
                    />
                    <div className="cm-char-count">Characters : {opt.explanation.length}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="cm-footer">
        <div className="cm-footer-inner">
          <button type="button" className="cm-btn cm-btn--save" onClick={handleSave}>Save</button>
          <button type="button" className="cm-btn cm-btn--cancel" onClick={handleBack}>Cancel</button>
          <button type="button" className="cm-btn cm-btn--preview">
            <Eye size={16} /> Preview
          </button>
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
    </div>
  );
};

export default CreateMCQ;
