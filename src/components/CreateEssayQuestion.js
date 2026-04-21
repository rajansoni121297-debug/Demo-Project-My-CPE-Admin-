import React, { useRef, useState } from 'react';
import {
  ArrowLeft, ChevronDown, Plus, Upload, X,
} from 'lucide-react';
import './CreateMCQ.css';
import './CreateEssayQuestion.css';
import QuestionEditorToolbar from './QuestionEditorToolbar';
import ConfirmModal from './ConfirmModal';

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Bascis of Accounting - Foundation',
  'US Accounting - Foundation', 'US Accounting - Intermediate', 'CFP Exam Prep',
  'US Auditing - Foundation', 'US Auditing - Intermediate', 'EA Test',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Firms',
  'Restaurant Accounting - Foundation', 'US Business Tax - Foundation', 'IRS - Foundation',
  'Not-for-Profit Audit - US', 'CMA Part 1',
];

const SelectDropdown = ({ label, placeholder, options, value, onChange, required, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = search ? options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className="cm-field" ref={ref}>
      <label className="cm-label">{label}{required && <span className="cm-req"> *</span>}</label>
      <div className="cm-select-wrap">
        <button
          type="button"
          className={`cm-select-btn ${open ? 'cm-select-btn--open' : ''} ${error ? 'cm-select-btn--error' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={value ? '' : 'cm-placeholder'}>{value || placeholder}</span>
          <ChevronDown size={14} className={`cm-chev ${open ? 'cm-chev--open' : ''}`} />
        </button>
        {open && (
          <div className="cm-select-panel">
            <div className="cm-select-search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="cm-select-search-input"
                autoFocus
              />
            </div>
            <div className="cm-select-list">
              <div
                className="cm-select-item cm-select-item--header"
                onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
              >
                {placeholder}
              </div>
              {filtered.map((opt) => (
                <div
                  key={opt}
                  className={`cm-select-item ${value === opt ? 'cm-select-item--sel' : ''}`}
                  onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                >
                  {opt}
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

const normalizeBlocks = (blocks) => {
  if (Array.isArray(blocks) && blocks.length > 0) {
    return blocks.map((block, index) => ({
      id: block.id ?? index + 1,
      question: block.question || block.text || '',
      explanation: block.explanation || block.answer || '',
    }));
  }

  return [{ id: 1, question: '', explanation: '' }];
};

const CreateEssayQuestion = ({ onBack, onSave, isEditing = false, initialData }) => {
  const [difficulty, setDifficulty] = useState(initialData?.level || '');
  const [category, setCategory] = useState(initialData?.parentCategory || '');
  const [scenario, setScenario] = useState(initialData?.scenario || initialData?.question || initialData?.name || '');
  const [materialFiles, setMaterialFiles] = useState(initialData?.materialFiles || []);
  const [questionBlocks, setQuestionBlocks] = useState(() => normalizeBlocks(initialData?.questionBlocks));
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const materialInputRef = useRef(null);
  const nextBlockIdRef = useRef(questionBlocks.length + 1);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleBack = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  const addBlock = () => {
    const id = nextBlockIdRef.current;
    nextBlockIdRef.current += 1;
    setQuestionBlocks((prev) => [...prev, { id, question: '', explanation: '' }]);
    markDirty();
  };

  const updateBlock = (id, field, value) => {
    setQuestionBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, [field]: value } : block)));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`question_${id}`];
      return next;
    });
    markDirty();
  };

  const removeBlock = (id) => {
    setQuestionBlocks((prev) => prev.filter((block) => block.id !== id));
    markDirty();
  };

  const handleMaterialFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setMaterialFiles((prev) => [...prev, ...files]);
      markDirty();
    }
    e.target.value = '';
  };

  const removeMaterialFile = (idx) => {
    setMaterialFiles((prev) => prev.filter((_, i) => i !== idx));
    markDirty();
  };

  const validate = () => {
    const nextErrors = {};
    if (!difficulty) nextErrors.difficulty = 'Required';
    if (!category) nextErrors.category = 'Required';
    if (!scenario.trim()) nextErrors.scenario = 'Required';
    questionBlocks.forEach((block) => {
      if (!block.question.trim()) nextErrors[`question_${block.id}`] = 'Question is required';
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.({
      difficulty,
      category,
      scenario,
      questionBlocks,
      materialFiles,
    });
  };

  return (
    <div className="cm-page">
      <div className="cm-scroll">
        <div className="cm-header">
          <button type="button" className="cm-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="cm-page-title">{isEditing ? 'Edit Essay Question' : 'Essay Question'}</h1>
        </div>

        <div className="ce-top-row">
          <SelectDropdown
            label="Difficulty Level"
            placeholder="Select Difficulty Level"
            options={DIFFICULTY_LEVELS}
            value={difficulty}
            onChange={(value) => { setDifficulty(value); markDirty(); }}
            required
            error={errors.difficulty}
          />

          <SelectDropdown
            label="Select Category"
            placeholder="Nothing selected"
            options={CATEGORIES}
            value={category}
            onChange={(value) => { setCategory(value); markDirty(); }}
            required
            error={errors.category}
          />
        </div>

        <div className="ce-section">
          <label className="cm-label">Enter Scenario <span className="cm-req">*</span></label>
          <div className={`cm-editor-card ${errors.scenario ? 'cm-editor-card--error' : ''}`}>
            <QuestionEditorToolbar />
            <textarea
              className="cm-editor-area"
              placeholder="Type the scenario or context for this essay question..."
              value={scenario}
              onChange={(e) => { setScenario(e.target.value); markDirty(); }}
              style={{ minHeight: 180 }}
            />
            <div className="cm-char-count">Characters : {scenario.length}</div>
          </div>
          {errors.scenario && <span className="cm-error-msg">{errors.scenario}</span>}
        </div>

        <div className="ce-section">
          <label className="cm-label">Upload Material</label>
          <div className="ce-upload-row">
            <button type="button" className="ce-material-btn" onClick={() => materialInputRef.current?.click()}>
              <Upload size={15} />
              Browse File
            </button>
            <input
              ref={materialInputRef}
              type="file"
              multiple
              hidden
              onChange={handleMaterialFiles}
            />
          </div>
          {materialFiles.length > 0 && (
            <div className="ce-files-list">
              {materialFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="ce-file-chip">
                  <span className="ce-file-chip-name">{file.name}</span>
                  <button type="button" className="ce-file-chip-remove" onClick={() => removeMaterialFile(index)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="ce-help-text">Upload reference documents for the essay question, if needed.</div>
        </div>

        <div className="ce-section">
          <div className="ce-section-header">
            <div>
              <label className="cm-label">Questions</label>
              <div className="ce-help-text">Add one or more question blocks with explanation.</div>
            </div>
            <button type="button" className="ce-add-btn" onClick={addBlock}>
              <Plus size={15} />
              Add Question
            </button>
          </div>

          <div className="ce-blocks">
            {questionBlocks.map((block, index) => (
              <div key={block.id} className="ce-block-card">
                <div className="ce-block-header">
                  <span className="ce-block-title">Question {index + 1}</span>
                  {questionBlocks.length > 1 && (
                    <button type="button" className="ce-block-remove" onClick={() => removeBlock(block.id)}>
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="ce-block-grid">
                  <div className="ce-block-editor">
                    <label className="cm-label">Enter Question <span className="cm-req">*</span></label>
                    <div className={`cm-editor-card ${errors[`question_${block.id}`] ? 'cm-editor-card--error' : ''}`}>
                      <QuestionEditorToolbar compact />
                      <textarea
                        className="cm-editor-area"
                        placeholder="Type question here..."
                        value={block.question}
                        onChange={(e) => updateBlock(block.id, 'question', e.target.value)}
                        style={{ minHeight: 120 }}
                      />
                      <div className="cm-char-count">Characters : {block.question.length}</div>
                    </div>
                    {errors[`question_${block.id}`] && <span className="cm-error-msg">{errors[`question_${block.id}`]}</span>}
                  </div>

                  <div className="ce-block-editor">
                    <label className="cm-label">Explanation</label>
                    <div className="cm-editor-card">
                      <QuestionEditorToolbar compact />
                      <textarea
                        className="cm-editor-area"
                        placeholder="Type explanation here..."
                        value={block.explanation}
                        onChange={(e) => updateBlock(block.id, 'explanation', e.target.value)}
                        style={{ minHeight: 120 }}
                      />
                      <div className="cm-char-count">Characters : {block.explanation.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cm-footer">
        <div className="cm-footer-inner">
          <button type="button" className="cm-btn cm-btn--save" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
          <button type="button" className="cm-btn cm-btn--cancel" onClick={handleBack}>Cancel</button>
        </div>
      </div>

      {showLeaveConfirm && (
        <ConfirmModal
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to leave?"
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

export default CreateEssayQuestion;
