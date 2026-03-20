import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, Eye, X, Upload,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Paintbrush, Highlighter, Link, Image, Table, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Code, Minus, Quote,
} from 'lucide-react';
import './CreateMCQ.css';
import './CreateSubjective.css';
import ConfirmModal from './ConfirmModal';

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Bascis of Accounting - Foundation',
  'US Accounting - Foundation', 'US Accounting - Intermediate', 'CFP Exam Prep',
  'US Auditing - Foundation', 'US Auditing - Intermediate', 'EA Test',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Farms',
  'Restaurant Accounting - Foundation', 'US Business Tax - Foundation', 'IRS - Foundation',
  'Not-for-Profit Audit - US', 'CMA Part 1',
];

/* ===== Rich Toolbar ===== */
const RichToolbar = () => (
  <div className="cm-toolbar">
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Bold"><Bold size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Italic"><Italic size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Underline"><Underline size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Strikethrough"><Strikethrough size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Subscript"><Subscript size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Superscript"><Superscript size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Font Size"><Type size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Text Color"><Paintbrush size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Highlight"><Highlighter size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Align Left"><AlignLeft size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Align Center"><AlignCenter size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Align Right"><AlignRight size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Justify"><AlignJustify size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Bullet List"><List size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Ordered List"><ListOrdered size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Quote"><Quote size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Link"><Link size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Image"><Image size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Table"><Table size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Code"><Code size={16} /></button>
      <button type="button" className="cm-tb-btn" title="Divider"><Minus size={16} /></button>
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

/* ===== Main Component ===== */
const CreateSubjective = ({ onBack, onSave, isEditing = false, initialData }) => {
  const [difficulty, setDifficulty] = useState(initialData?.level || '');
  const [marks, setMarks] = useState(initialData?.marks ?? '');
  const [category, setCategory] = useState(initialData?.parentCategory || '');
  const [questionName, setQuestionName] = useState(initialData?.name || '');
  const [question, setQuestion] = useState(initialData?.question || '');
  const [allowUpload, setAllowUpload] = useState(initialData?.fileUploadAllowed === 'Yes');
  const [explanation, setExplanation] = useState('');
  const [materialFiles, setMaterialFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleBack = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  const fileInputRef = useRef(null);

  const validate = () => {
    const errs = {};
    if (!difficulty) errs.difficulty = 'Required';
    if (!category) errs.category = 'Required';
    if (!questionName.trim()) errs.questionName = 'Required';
    if (!question.trim()) errs.question = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setMaterialFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const handleRemoveFile = (idx) => {
    setMaterialFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ difficulty, marks, category, questionName, question, allowUpload, explanation, materialFiles });
  };

  return (
    <div className="cm-page">
      <div className="cm-scroll">

        {/* Header */}
        <div className="cm-header">
          <button type="button" className="cm-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="cm-page-title">{isEditing ? 'Edit Question' : 'Add Question'}</h1>
        </div>

        {/* Subtitle tag */}
        <div className="csub-tag">Subjective Question</div>

        {/* Row 1: Difficulty | Marks | Category */}
        <div className="csub-fields-row">
          <SelectDropdown
            label="Difficulty Level"
            placeholder="Select Level"
            options={DIFFICULTY_LEVELS}
            value={difficulty}
            onChange={(v) => { setDifficulty(v); markDirty(); }}
            required
            error={errors.difficulty}
          />

          <div className="cm-field">
            <label className="cm-label">Marks</label>
            <input
              type="number"
              min="0"
              className="cm-text-input"
              placeholder="e.g. 10"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <SelectDropdown
            label="Select Category"
            placeholder="Select Category"
            options={CATEGORIES}
            value={category}
            onChange={(v) => { setCategory(v); markDirty(); }}
            required
            error={errors.category}
          />
        </div>

        {/* Name of Question */}
        <div className="cm-field csub-name-field">
          <label className="cm-label">Name of Question <span className="cm-req">*</span></label>
          <input
            type="text"
            className={`cm-text-input ${errors.questionName ? 'cm-text-input--error' : ''}`}
            placeholder="Enter question name / title"
            value={questionName}
            onChange={(e) => { setQuestionName(e.target.value); markDirty(); if (errors.questionName) setErrors((p) => ({ ...p, questionName: '' })); }}
          />
          {errors.questionName && <span className="cm-error-msg">{errors.questionName}</span>}
        </div>

        {/* Enter Question */}
        <div className="csub-editor-section">
          <label className="cm-label csub-editor-label">
            Enter Question <span className="cm-req">*</span>
          </label>
          <div className={`cm-editor-card ${errors.question ? 'cm-editor-card--error' : ''}`}>
            <RichToolbar />
            <textarea
              className="cm-editor-area"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => { setQuestion(e.target.value); markDirty(); if (errors.question) setErrors((p) => ({ ...p, question: '' })); }}
              style={{ minHeight: 140 }}
            />
          </div>
          {errors.question && <span className="cm-error-msg">{errors.question}</span>}
        </div>

        {/* Allow file upload */}
        <div className="csub-checkbox-row">
          <label className="csub-checkbox-label">
            <input
              type="checkbox"
              className="csub-checkbox"
              checked={allowUpload}
              onChange={(e) => setAllowUpload(e.target.checked)}
            />
            Allow user to upload their file
          </label>
        </div>

        {/* Explanation */}
        <div className="csub-editor-section">
          <label className="cm-label csub-editor-label">Explanation:</label>
          <div className="cm-editor-card">
            <RichToolbar />
            <textarea
              className="cm-editor-area"
              placeholder="Type Explanation: Why this answer is correct?"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              style={{ minHeight: 120 }}
            />
          </div>
        </div>

        {/* Upload Material */}
        <div className="csub-upload-section">
          <label className="cm-label csub-upload-label-text">Upload Material</label>
          <div className="csub-upload-row">
            <button type="button" className="csub-browse-btn" onClick={() => fileInputRef.current.click()}>
              <Upload size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Browse File
            </button>
            <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileSelect} />
          </div>
          {materialFiles.length > 0 && (
            <div className="csub-files-list">
              {materialFiles.map((f, idx) => (
                <div key={idx} className="csub-file-item">
                  <span className="csub-file-name">{f.name}</span>
                  <button type="button" className="csub-file-remove" onClick={() => handleRemoveFile(idx)}>
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
          <button type="button" className="cm-btn cm-btn--save" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
          <button type="button" className="cm-btn cm-btn--cancel" onClick={handleBack}>Cancel</button>
          <button type="button" className="cm-btn cm-btn--preview">
            <Eye size={15} />
            Preview
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

export default CreateSubjective;
