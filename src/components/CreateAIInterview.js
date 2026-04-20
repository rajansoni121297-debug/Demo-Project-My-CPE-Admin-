import React, { useState } from 'react';
import {
  ArrowLeft, ChevronDown, Info,
  Bold, Italic, Underline, List, ListOrdered,
} from 'lucide-react';
import './CreateMCQ.css';
import './CreateAIInterview.css';
import ConfirmModal from './ConfirmModal';

const DIFFICULTIES = ['Basic', 'Intermediate', 'Advanced'];

/* ===== Mini Toolbar ===== */
const MiniToolbar = () => (
  <div className="cai-toolbar">
    <button type="button" className="cm-tb-btn" title="Bold"><Bold size={15} /></button>
    <button type="button" className="cm-tb-btn" title="Italic"><Italic size={15} /></button>
    <button type="button" className="cm-tb-btn" title="Underline"><Underline size={15} /></button>
    <span className="cm-tb-sep" />
    <button type="button" className="cm-tb-btn" title="Bulleted List"><List size={15} /></button>
    <button type="button" className="cm-tb-btn" title="Numbered List"><ListOrdered size={15} /></button>
  </div>
);

/* ===== Main Component ===== */
const CreateAIInterview = ({ onBack, onSave, isEditing = false, initialData }) => {
  const [interviewName, setInterviewName] = useState(initialData?.name || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'Easy');
  const [diffOpen, setDiffOpen] = useState(false);

  const [coreIntro, setCoreIntro] = useState(initialData?.coreIntro ?? 2);
  const [coreTech, setCoreTech] = useState(initialData?.coreTech ?? 5);
  const [coreBehav, setCoreBehav] = useState(initialData?.coreBehav ?? 3);

  const [followIntro, setFollowIntro] = useState(initialData?.followIntro ?? 1);
  const [followTech, setFollowTech] = useState(initialData?.followTech ?? 1);
  const [followBehav, setFollowBehav] = useState(initialData?.followBehav ?? 1);

  const [evalCriteria, setEvalCriteria] = useState('');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleClose = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  const totalQuestions = (Number(coreIntro) || 0) + (Number(coreTech) || 0) + (Number(coreBehav) || 0)
    + (Number(followIntro) || 0) + (Number(followTech) || 0) + (Number(followBehav) || 0);

  const validate = () => {
    const errs = {};
    if (!interviewName.trim()) errs.interviewName = 'Required';
    if (totalQuestions === 0) errs.questions = 'At least one question is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      interviewName, difficulty,
      coreIntro, coreTech, coreBehav,
      followIntro, followTech, followBehav,
      evalCriteria, totalQuestions,
    });
  };

  const numInput = (val, setter, label) => (
    <div className="cai-num-field">
      <label className="cai-num-label">{label}</label>
      <input
        type="number"
        min={0}
        className="cai-num-input"
        value={val}
        onChange={(e) => { setter(e.target.value); markDirty(); }}
      />
    </div>
  );

  return (
    <div className="cai-page">
      <div className="cai-scroll">

        {/* Header */}
        <div className="cai-header">
          <div className="cai-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7162EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <h1 className="cai-title">Video Assessment Setup</h1>
            <p className="cai-subtitle">Configure difficulty, questions and follow-ups for the AI-driven interview</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="cai-instructions">
          <div className="cai-instructions-header">
            <Info size={18} className="cai-instructions-icon" />
            <span className="cai-instructions-title">Instructions</span>
          </div>
          <ul className="cai-instructions-list">
            <li><strong>Difficulty</strong> selects overall level (Basic, Intermediate, Advanced).</li>
            <li><strong>Core Skill Questions</strong> configure questions that assess key job skills.</li>
            <li><strong>Follow-up Questions</strong> configure questions that depend on earlier answers for deeper assessment.</li>
          </ul>
        </div>

        {/* AI Interview Name + Difficulty (same row) */}
        <div className="cai-top-row">
          <div className="cai-top-row-field cai-top-row-field--name">
            <label className="cai-field-label">AI Interview Name <span className="cai-req">*</span></label>
            <input
              type="text"
              className={`cai-text-input ${errors.interviewName ? 'cai-text-input--error' : ''}`}
              placeholder="Enter AI Interview Name"
              value={interviewName}
              onChange={(e) => { setInterviewName(e.target.value); markDirty(); }}
            />
            {errors.interviewName && <span className="cai-error">{errors.interviewName}</span>}
          </div>

          <div className="cai-top-row-field cai-top-row-field--diff">
            <label className="cai-field-label">Difficulty Level</label>
            <div className="cai-select-wrap">
              <button
                type="button"
                className={`cai-select-btn ${diffOpen ? 'cai-select-btn--open' : ''}`}
                onClick={() => setDiffOpen(!diffOpen)}
              >
                <span>{difficulty}</span>
                <ChevronDown size={16} className={diffOpen ? 'cai-chev--open' : ''} />
              </button>
              {diffOpen && (
                <div className="cai-select-panel">
                  {DIFFICULTIES.map((d) => (
                    <div
                      key={d}
                      className={`cai-select-item ${difficulty === d ? 'cai-select-item--sel' : ''}`}
                      onClick={() => { setDifficulty(d); setDiffOpen(false); markDirty(); }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Core Skill Questions */}
        <div className="cai-questions-section">
          <h3 className="cai-section-title">Core Skill Questions</h3>
          <div className="cai-num-row">
            {numInput(coreIntro, setCoreIntro, 'Introductory')}
            {numInput(coreTech, setCoreTech, 'Technical')}
            {numInput(coreBehav, setCoreBehav, 'Behavioral')}
          </div>
        </div>

        {/* Follow-up Questions */}
        <div className="cai-questions-section">
          <h3 className="cai-section-title">Follow-up Questions</h3>
          <div className="cai-num-row">
            {numInput(followIntro, setFollowIntro, 'Introductory')}
            {numInput(followTech, setFollowTech, 'Technical')}
            {numInput(followBehav, setFollowBehav, 'Behavioral')}
          </div>
        </div>

        {/* Total Questions */}
        <div className="cai-total-row">
          <span className="cai-total-label">Total Questions</span>
          <span className="cai-total-value">{totalQuestions}</span>
          {errors.questions && <span className="cai-error" style={{ marginLeft: 12 }}>{errors.questions}</span>}
        </div>

        {/* Evaluation Criteria */}
        <div className="cai-eval-section">
          <label className="cai-field-label">Evaluation Criteria (Optional)</label>
          <div className="cai-eval-card">
            <MiniToolbar />
            <textarea
              className="cai-eval-area"
              placeholder="Add any evaluation guidelines or notes for this assessment (optional)."
              value={evalCriteria}
              onChange={(e) => { setEvalCriteria(e.target.value); markDirty(); }}
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="cai-footer">
        <button type="button" className="cai-footer-close" onClick={handleClose}>Close</button>
        <div className="cai-footer-right">
          <button type="button" className="cai-footer-skip" onClick={onBack}>Skip</button>
          <button type="button" className="cai-footer-save" onClick={handleSave}>Save</button>
        </div>
      </div>

      {/* Leave Confirm */}
      {showLeaveConfirm && (
        <ConfirmModal
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to leave?"
          confirmLabel="Leave"
          variant="warning"
          onConfirm={onBack}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}
    </div>
  );
};

export default CreateAIInterview;
