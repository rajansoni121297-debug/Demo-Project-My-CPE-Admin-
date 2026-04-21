import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Eye, Bookmark, Settings, Sliders, Check, ChevronDown, X, Plus,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Pen, Droplet, PenTool, Highlighter,
  Pilcrow, AlignLeft, AlignCenter, List, ListOrdered, AlignRight, AlignJustify, Quote,
  Link, Image, Film, Columns3, Table, Smile, DollarSign, Minus, Play, Triangle,
  Save, FileCode, HelpCircle, Code, Undo, Redo,
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import './CreateAssessment.css';

const QUESTION_TYPES = ['MCQ', 'SUB', 'AVS', 'AI Video', 'SIM', 'ESSAY'];

const QUESTION_TYPE_LABELS = {
  MCQ: 'Multiple Choice (MCQ)',
  SUB: 'Subjective (SUB)',
  AVS: 'Video (AVS)',
  'AI Video': 'AI Video',
  SIM: 'Simulation (SIM)',
  ESSAY: 'Essay',
};

const CATEGORIES = [
  'Business Documents', 'Terminology', 'Timesheets', 'Accounting Industry',
  'Trial Balance', 'Financial Statements', 'Tax Compliance', 'Audit Standards',
  'Ethics & Governance', 'Payroll Processing', 'Revenue Recognition',
];

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const REPORT_WEIGHTAGE_TOTAL = 100;

const PROFILES = [
  'Staff Accountant', 'Senior Accountant', 'Tax Analyst', 'Audit Associate',
  'Financial Analyst', 'Bookkeeper', 'Payroll Specialist', 'Accounts Payable',
  'Accounts Receivable', 'Controller', 'CFO', 'CPA',
  'Tax Manager', 'Audit Manager', 'Advisory Consultant',
];

const TOPICS = [
  '1031 Exchange', '1040', '1065', '1099', "1099's", '199A', '401(k)', '403(b)',
  'A & A (Govt)', 'A & A Update', 'AccounTech', 'Accounting', 'Accounting & Auditing',
  'Accounting Adjustments', 'Accounting Software', 'Accounts Receivable', 'ADA Compliance',
  'Advisory Services', 'AFSP', 'AFTR Course', 'Agreed Upon Procedures', 'AI Assurance',
  'AI Governance', 'AI Theme', 'AICPA Ethics', 'AK Ethics', 'AL Ethics', 'Alicia Pollock',
  'Annual Letter', 'Annuities', 'ASC 606', 'ASC 805', 'ASC 820', 'ASC 842', 'ASPE',
  'CA Ethics', 'California Taxes', 'Canadian Accounting', 'Canadian Accounting (Govt.)',
  'Canadian Auditing', 'CCH Software', 'Certificate Courses', 'CFF Ethics', 'CFO',
  'Denise Cicchella', 'Dev Strischek', 'Digital Exposure', 'Digital Marketing',
];

const COUNTRIES = [
  'Global (GLB)', 'United States (US)', 'Canada (CA)', 'United Kingdom (GB)',
];

const ROLE_DATA = [
  { name: 'Partner – Tax Advisory & Compliance', level: 'Advance', domain: 'Tax' },
  { name: 'Tax Director', level: 'Advance', domain: 'Tax' },
  { name: 'Senior Tax Manager', level: 'Advance', domain: 'Tax' },
  { name: 'Tax Manager', level: 'Intermediate', domain: 'Tax' },
  { name: 'Tax Supervisor', level: 'Intermediate', domain: 'Tax' },
  { name: 'Senior Tax Accountant', level: 'Intermediate', domain: 'Tax' },
  { name: 'Junior Tax Accountant', level: 'Basic', domain: 'Tax' },
  { name: 'Tax Associate', level: 'Basic', domain: 'Tax' },
  { name: 'Tax Intern', level: 'Basic', domain: 'Tax' },
  { name: 'Assurance Partner', level: 'Advance', domain: 'Auditing' },
  { name: 'Audit Director', level: 'Advance', domain: 'Auditing' },
  { name: 'Senior Audit Manager', level: 'Advance', domain: 'Auditing' },
  { name: 'Audit Manager', level: 'Intermediate', domain: 'Auditing' },
  { name: 'Audit Supervisor', level: 'Intermediate', domain: 'Auditing' },
  { name: 'Audit Senior', level: 'Intermediate', domain: 'Auditing' },
  { name: 'Audit Staff', level: 'Basic', domain: 'Auditing' },
  { name: 'Audit Associate', level: 'Basic', domain: 'Auditing' },
  { name: 'Partner – Accounting & Advisory', level: 'Advance', domain: 'Accounting' },
  { name: 'Accounting Director', level: 'Advance', domain: 'Accounting' },
  { name: 'Finance Manager', level: 'Advance', domain: 'Accounting' },
  { name: 'Account Manager', level: 'Intermediate', domain: 'Accounting' },
  { name: 'Account Supervisor', level: 'Intermediate', domain: 'Accounting' },
  { name: 'Senior Accountant', level: 'Intermediate', domain: 'Accounting' },
  { name: 'Junior Accountant', level: 'Basic', domain: 'Accounting' },
  { name: 'Staff Accountant', level: 'Basic', domain: 'Accounting' },
  { name: 'Accounting Intern', level: 'Basic', domain: 'Accounting' },
];

/* ===== Multi-select checkbox dropdown ===== */
const CheckboxDropdown = ({ placeholder, options, selected, onChange, labels, error, dropUp }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const filtered = search ? options.filter((o) => (labels?.[o] || o).toLowerCase().includes(search.toLowerCase())) : options;
  const toggle = (o) => onChange(selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]);

  let displayContent;
  if (selected.length === 0) {
    displayContent = <span className="ca-placeholder">{placeholder}</span>;
  } else {
    displayContent = <span>{selected.map((s) => labels?.[s] || s).join(', ')}</span>;
  }

  return (
    <div className="ca-cbdrop" ref={ref}>
      <button className={`ca-cbdrop-btn ${open ? 'ca-cbdrop-btn--open' : ''} ${error ? 'ca-error' : ''}`} onClick={() => setOpen(!open)} type="button">
        <span className="ca-cbdrop-display">{displayContent}</span>
        <ChevronDown size={16} className={`ca-cbdrop-chev ${open ? 'ca-cbdrop-chev--open' : ''}`} />
      </button>
      {open && (
        <div className={`ca-cbdrop-panel ${dropUp ? 'ca-cbdrop-panel--up' : ''}`}>
          <div className="ca-cbdrop-search">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="ca-cbdrop-search-input" autoFocus />
          </div>
          <div className="ca-cbdrop-list">
            {filtered.map((o) => (
              <label key={o} className={`ca-cbdrop-item ${selected.includes(o) ? 'ca-cbdrop-item--sel' : ''}`}>
                <span>{labels?.[o] || o}</span>
                <input type="checkbox" checked={selected.includes(o)} onChange={() => toggle(o)} />
              </label>
            ))}
            {filtered.length === 0 && <div className="ca-cbdrop-empty">No results</div>}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== Toolbar ===== */
const Toolbar = () => {
  const t = [
    { i: Type }, { i: Bold }, { i: Italic }, { i: Underline }, { i: Strikethrough }, { i: Subscript }, { i: Superscript },
    { d: true }, { i: Pen }, { i: Droplet }, { i: PenTool }, { i: Highlighter },
    { d: true }, { i: Pilcrow }, { i: AlignLeft }, { i: AlignCenter }, { i: List }, { i: ListOrdered }, { i: AlignRight }, { i: AlignJustify }, { i: Quote },
    { d: true }, { i: Link }, { i: Image }, { i: Film }, { i: Columns3 }, { i: Table },
    { d: true }, { i: Smile }, { i: DollarSign }, { i: Minus }, { i: Play }, { i: Triangle },
    { d: true }, { i: Save }, { i: FileCode }, { i: HelpCircle }, { i: Code },
    { d: true }, { i: Undo }, { i: Redo },
  ];
  return (
    <div className="ca-toolbar">
      {t.map((x, j) => x.d ? <span key={j} className="ca-toolbar-divider" /> : <button key={j} type="button" className="ca-toolbar-btn"><x.i size={14} /></button>)}
    </div>
  );
};

/* ===== Category Modal ===== */
const CategoryModal = ({ categories, selected, onSubmit, onClose }) => {
  const [search, setSearch] = useState('');
  const [tempSelected, setTempSelected] = useState([...selected]);

  const filtered = search ? categories.filter((c) => c.toLowerCase().includes(search.toLowerCase())) : categories;

  const toggle = (cat) => {
    setTempSelected((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  return (
    <div className="ca-modal-overlay" onClick={onClose}>
      <div className="ca-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ca-modal-header">
          <h3 className="ca-modal-title">Select Category (Multi Select)</h3>
          <button className="ca-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="ca-modal-search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="ca-modal-search-input"
            autoFocus
          />
        </div>
        <div className="ca-modal-list">
          {filtered.map((cat) => (
            <label key={cat} className={`ca-modal-item ${tempSelected.includes(cat) ? 'ca-modal-item--sel' : ''}`}>
              <span>{cat}</span>
              <input type="checkbox" checked={tempSelected.includes(cat)} onChange={() => toggle(cat)} />
            </label>
          ))}
          {filtered.length === 0 && <div className="ca-modal-empty">No categories found</div>}
        </div>
        <div className="ca-modal-footer">
          <button className="ca-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="ca-modal-submit" onClick={() => { onSubmit(tempSelected); onClose(); }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

/* ===== Main Component ===== */
const CreateAssessment = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [f, setF] = useState({
    visibility: [], assessmentName: '', description: '', evaluationCriteria: '',
    quickLinks: '', maxRetake: 'No Retake', evaluator: '', duration: '', instructionVideo: null,
    allowViewAnswers: 'No', questionOrder: 'Randomly', downloadReport: 'No',
    secureBrowser: 'No', allowProctoring: 'No', assessmentLevel: [],
    assessmentDomain: '', topic: '', role: '', allowCertificate: 'No', country: [],
    profiles: [],
  });
  const u = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; }); };
  const vis = ['Commercial Subscription', 'Prospective Hire', 'Offshoring Client (Offshore Staff)', 'Internal Team', 'Others'];
  const toggleVis = (o) => u('visibility', f.visibility.includes(o) ? f.visibility.filter((v) => v !== o) : [...f.visibility, o]);

  const handleLevelChange = (updated) => {
    let newLevel;
    if (updated.length < 2) {
      newLevel = updated;
    } else {
      const indices = updated.map((l) => DIFFICULTY_LEVELS.indexOf(l)).sort((a, b) => a - b);
      newLevel = DIFFICULTY_LEVELS.slice(indices[0], indices[indices.length - 1] + 1);
    }
    setF((p) => ({ ...p, assessmentLevel: newLevel, role: '' }));
    setErrors((prev) => { const n = { ...prev }; delete n.assessmentLevel; return n; });
  };

  const handleDomainChange = (v) => {
    setF((p) => ({ ...p, assessmentDomain: v, role: '' }));
    setErrors((prev) => { const n = { ...prev }; delete n.assessmentDomain; return n; });
  };

  const getAvailableRoles = () => {
    let roles = ROLE_DATA;
    if (f.assessmentDomain) {
      if (f.assessmentDomain === 'Others') {
        roles = roles.filter((r) => ['Tax', 'Accounting', 'Auditing'].includes(r.domain));
      } else {
        roles = roles.filter((r) => r.domain === f.assessmentDomain);
      }
    }
    if (f.assessmentLevel.length > 0) {
      const normalizedLevels = f.assessmentLevel.map((l) => l === 'Advanced' ? 'Advance' : l);
      roles = roles.filter((r) => normalizedLevels.includes(r.level));
    }
    return roles.map((r) => r.name);
  };

  const scrollToFirstError = (errorKeys) => {
    setTimeout(() => {
      for (const key of errorKeys) {
        const el = document.getElementById(`field-${key}`);
        if (el) {
          const container = document.querySelector('.ca-scroll');
          if (container) {
            const containerTop = container.getBoundingClientRect().top;
            const elTop = el.getBoundingClientRect().top;
            const offset = elTop - containerTop + container.scrollTop - container.clientHeight / 2 + el.offsetHeight / 2;
            container.scrollTo({ top: offset, behavior: 'smooth' });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          const focusable = el.matches('input,textarea,select,button') ? el : el.querySelector('input,textarea,select,button');
          focusable?.focus();
          break;
        }
      }
    }, 0);
  };

  const validateStep2 = () => {
    const e = {};
    if (selectedQTypes.length === 0) e.qTypes = 'Select at least one question type';
    selectedQTypes.forEach((qt) => {
      const c = qTypeConfigs[qt];
      if (c) {
        if (!c.passingPercent) e[`${qt}_passing`] = true;
        if (!c.duration) e[`${qt}_duration`] = true;
        if (!c.noOfQues) e[`${qt}_noOfQues`] = true;
        if (!c.reportWeightage) e[`${qt}_reportWeightage`] = true;
      }
    });
    const reportWeightageError = getReportWeightageError(selectedQTypes, qTypeConfigs);
    if (reportWeightageError) e.reportWeightageTotal = reportWeightageError;
    setErrors(e);
    if (Object.keys(e).length > 0) scrollToFirstError(Object.keys(e));
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleSubmit = () => {
    if (validateStep2() && onSuccess) {
      const questionTypeConfigs = selectedQTypes.map((type) => ({
        type,
        difficulty: qTypeConfigs[type]?.difficulty || 'Basic',
        passingPercent: qTypeConfigs[type]?.passingPercent || '',
        reportWeightage: qTypeConfigs[type]?.reportWeightage || '',
        duration: qTypeConfigs[type]?.duration || '',
        noOfQues: qTypeConfigs[type]?.noOfQues || '',
        categories: qTypeConfigs[type]?.categories || [],
      }));

      onSuccess({
        name: f.assessmentName.trim(),
        invited: 0,
        completed: 0,
        evaluation: 0,
        pending: 0,
        level: f.assessmentLevel.join(', ') || '-',
        createdBy: 'Admin',
        topic: f.topic,
        course: f.topic,
        visibility: f.visibility,
        assessmentReport: f.downloadReport === 'No' ? 'Not Allowed' : 'Allowed',
        sampleQuestion: 'Stored',
        status: 'Draft',
        usedInPtc: '-',
        mappedProfiles: f.profiles,
        questionTypeConfigs,
      });
    }
  };

  // Step 2 state
  const [modalOpen, setModalOpen] = useState(null); // qType string or null
  const [selectedQTypes, setSelectedQTypes] = useState([]);
  const [qTypeConfigs, setQTypeConfigs] = useState({});

  const formatWeightage = (value) => {
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '');
  };

  const clearWeightageErrors = (prevErrors) => {
    const next = { ...prevErrors };
    Object.keys(next).forEach((key) => {
      if (key.endsWith('_reportWeightage') || key === 'reportWeightageTotal') {
        delete next[key];
      }
    });
    return next;
  };

  const getAutoWeightageType = (configs, types) => {
    const blankTypes = types.filter((type) => (configs[type]?.reportWeightage ?? '') === '');
    if (blankTypes.length !== 1) return '';

    const hasInvalid = types.some((type) => {
      const value = configs[type]?.reportWeightage ?? '';
      if (value === '') return false;
      const numericValue = Number(value);
      return Number.isNaN(numericValue) || numericValue < 0 || numericValue > REPORT_WEIGHTAGE_TOTAL;
    });

    if (hasInvalid) return '';
    return blankTypes[0];
  };

  const syncAutoWeightage = (configs, types) => {
    if (types.length === 0) return configs;

    const autoType = getAutoWeightageType(configs, types);
    if (!autoType) return configs;

    const total = types.reduce((sum, type) => {
      if (type === autoType) return sum;
      const value = configs[type]?.reportWeightage ?? '';
      const numericValue = Number(value);
      if (value === '' || Number.isNaN(numericValue) || numericValue < 0 || numericValue > REPORT_WEIGHTAGE_TOTAL) {
        return sum;
      }
      return sum + numericValue;
    }, 0);

    const remaining = REPORT_WEIGHTAGE_TOTAL - total;
    if (remaining < 0) return configs;

    const nextValue = formatWeightage(remaining);
    const currentValue = configs[autoType]?.reportWeightage ?? '';
    if (currentValue === nextValue) return configs;

    return {
      ...configs,
      [autoType]: {
        ...configs[autoType],
        reportWeightage: nextValue,
      },
    };
  };

  const getReportWeightageSummary = (types, configs) => {
    const values = types.map((type) => configs[type]?.reportWeightage ?? '');
    const missingCount = values.filter((value) => value === '').length;
    const invalidCount = values.filter((value) => value !== '' && (Number.isNaN(Number(value)) || Number(value) < 0 || Number(value) > REPORT_WEIGHTAGE_TOTAL)).length;
    const total = values.reduce((sum, value) => sum + (value === '' || Number.isNaN(Number(value)) ? 0 : Number(value)), 0);
    return {
      total: Math.round(total * 100) / 100,
      missingCount,
      invalidCount,
    };
  };

  const getReportWeightageError = (types, configs) => {
    if (types.length === 0) return '';
    const summary = getReportWeightageSummary(types, configs);
    if (summary.invalidCount > 0) return 'Each Report Weightage must be between 0 and 100.';
    if (summary.total > REPORT_WEIGHTAGE_TOTAL) return `Total Report Weightage cannot exceed 100%. Current total: ${formatWeightage(summary.total)}%.`;
    if (summary.missingCount > 0) return `Report Weightage is required for all question types. Remaining to assign: ${formatWeightage(Math.max(REPORT_WEIGHTAGE_TOTAL - summary.total, 0))}%.`;
    if (summary.total !== REPORT_WEIGHTAGE_TOTAL) return `Total Report Weightage must equal 100%. Current total: ${formatWeightage(summary.total)}%.`;
    return '';
  };

  const initConfig = (types) => {
    const newConfigs = { ...qTypeConfigs };
    types.forEach((t) => {
      if (!newConfigs[t]) {
        newConfigs[t] = {
          difficulty: 'Basic',
          passingPercent: '',
          duration: '',
          noOfQues: '',
          reportWeightage: '',
          categories: [],
        };
      }
    });
    Object.keys(newConfigs).forEach((k) => {
      if (!types.includes(k)) delete newConfigs[k];
    });
    setQTypeConfigs(syncAutoWeightage(newConfigs, types));
  };

  const handleQTypeChange = (types) => {
    setSelectedQTypes(types);
    initConfig(types);
    setErrors((prev) => clearWeightageErrors(prev));
  };

  const updateConfig = (type, field, value) => {
    setQTypeConfigs((prev) => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
  };

  const updateReportWeightage = (type, value) => {
    const sanitizedValue = value.replace(/[^\d.]/g, '');

    setQTypeConfigs((prev) => {
      const next = {
        ...prev,
        [type]: { ...prev[type], reportWeightage: sanitizedValue },
      };
      return syncAutoWeightage(next, selectedQTypes);
    });

    setErrors((prev) => clearWeightageErrors(prev));
  };

  const reportWeightageSummary = getReportWeightageSummary(selectedQTypes, qTypeConfigs);
  const reportWeightageError = getReportWeightageError(selectedQTypes, qTypeConfigs);
  const totalDurationMinutes = selectedQTypes.reduce((sum, qType) => sum + (parseInt(qTypeConfigs[qType]?.duration, 10) || 0), 0);
  const totalQuestions = selectedQTypes.reduce((sum, qType) => sum + (parseInt(qTypeConfigs[qType]?.noOfQues, 10) || 0), 0);

  const formatMinutesSummary = (minutes) => {
    if (!minutes) return '0h 00min';
    return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;
  };

  const removeCategory = (type, cat) => {
    setQTypeConfigs((prev) => ({
      ...prev,
      [type]: { ...prev[type], categories: prev[type].categories.filter((c) => c !== cat) },
    }));
  };

  return (
    <div className="create-assessment">
      {/* Top bar */}
      <div className="ca-topbar">
        <div className="ca-topbar-left">
          <button className="ca-back" onClick={onBack}><ArrowLeft size={18} /></button>
          <span className="ca-topbar-title">Create Assessment</span>
        </div>
        <div className="ca-topbar-center">
          <button className={`ca-progress-step ${step === 1 ? 'ca-progress-step--active' : 'ca-progress-step--done'}`} onClick={() => setStep(1)}>
            {step > 1 ? <Check size={14} /> : null} 1 &nbsp;Assessment Details
          </button>
          <div className="ca-progress-connector" />
          <button className={`ca-progress-step ${step === 2 ? 'ca-progress-step--active' : ''}`} onClick={() => setStep(2)}>
            2 &nbsp;Question Type
          </button>
        </div>
        <div className="ca-topbar-right">
          {step === 2 && <button className="ca-btn-draft" onClick={() => setStep(1)}>Previous</button>}
          {step === 1 && <button className="ca-btn-draft">Save Draft</button>}
          {step === 1 ? (
            <button className="ca-btn-next" onClick={handleNext}>Next Step</button>
          ) : (
            <button className="ca-btn-next ca-btn-submit" onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>

      <div className="ca-scroll">
        <div className="ca-body">
          <div className="ca-form-main">
            {step === 1 ? (
              <>
                {/* STEP 1 — All the cards */}
                <div className="ca-card" id="s-visibility">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--purple"><Eye size={18} /></div>
                    <div><div className="ca-card-title">Assessment Visibility</div><div className="ca-card-subtitle">Choose who can see and take this assessment</div></div>
                  </div>
                  <p className="ca-hint">Once selected and submitted, it cannot be unchecked again</p>
                  <div className="ca-checkbox-row">
                    {vis.map((o) => (
                      <label key={o} className="ca-checkbox-label">
                        <input type="checkbox" className="ca-checkbox" checked={f.visibility.includes(o)} onChange={() => toggleVis(o)} /><span>{o}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="ca-card" id="s-basic">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--blue"><Bookmark size={18} /></div>
                    <div><div className="ca-card-title">Basic Information</div><div className="ca-card-subtitle">Name, description, evaluation criteria, and links</div></div>
                  </div>
                  <div className="ca-field"><label className="ca-lbl">Assessment Name <span className="ca-req">*</span></label><input id="field-assessmentName" type="text" className={`ca-input ${errors.assessmentName ? 'ca-error' : ''}`} placeholder="e.g. Fundamentals of Financial Audit" value={f.assessmentName} onChange={(e) => u('assessmentName', e.target.value)} />{errors.assessmentName && <span className="ca-error-msg">{errors.assessmentName}</span>}</div>
                  <div className="ca-field"><label className="ca-lbl">Assessment Description <span className="ca-req">*</span></label><div id="field-description" className={`ca-editor ${errors.description ? 'ca-error' : ''}`}><Toolbar /><textarea className="ca-editor-area" placeholder="Describe the assessment purpose and scope..." value={f.description} onChange={(e) => u('description', e.target.value)} rows={5} /><div className="ca-char-count">Characters : {f.description.length}</div></div>{errors.description && <span className="ca-error-msg">{errors.description}</span>}</div>
                  <div className="ca-field"><label className="ca-lbl">Evaluation Criteria <span className="ca-req">*</span></label><div id="field-evaluationCriteria" className={`ca-editor ${errors.evaluationCriteria ? 'ca-error' : ''}`}><Toolbar /><textarea className="ca-editor-area" placeholder="Define how participants will be evaluated..." value={f.evaluationCriteria} onChange={(e) => u('evaluationCriteria', e.target.value)} rows={5} /><div className="ca-char-count">Characters : {f.evaluationCriteria.length}</div></div>{errors.evaluationCriteria && <span className="ca-error-msg">{errors.evaluationCriteria}</span>}</div>
                  <div className="ca-field"><label className="ca-lbl">Quick Links <span className="ca-optional">(optional)</span></label><span className="ca-hint">Format: &lt;URL_LABEL&gt;https://example.com</span><textarea className="ca-textarea" placeholder="Enter quick links..." value={f.quickLinks} onChange={(e) => u('quickLinks', e.target.value)} rows={2} /></div>
                </div>

                <div className="ca-card" id="s-config">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--amber"><Settings size={18} /></div>
                    <div><div className="ca-card-title">Configuration</div><div className="ca-card-subtitle">Retake limits, duration, evaluator, and instruction video</div></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl">Enter Max. Retake <span className="ca-req">*</span></label><CustomSelect value={f.maxRetake} onChange={(v) => u('maxRetake', v)} options={['No Retake', '1', '2', '3']} /></div>
                    <div className="ca-grid-item">
                      <label className="ca-lbl">Upload Instruction Video</label>
                      <div className="ca-file-wrap">
                        <label className="ca-file-btn">
                          Choose File
                          <input type="file" className="ca-file-input-hidden" onChange={(e) => u('instructionVideo', e.target.files[0])} />
                        </label>
                        <span className="ca-file-name">{f.instructionVideo ? f.instructionVideo.name : 'No file chosen'}</span>
                      </div>
                    </div>
                    <div className="ca-grid-item"><label className="ca-lbl">Who will Evaluate this Assessment?</label><CustomSelect value={f.evaluator} onChange={(v) => u('evaluator', v)} options={[{ value: '', label: 'Nothing selected' }, 'Admin', 'Evaluator']} placeholder="Nothing selected" /></div>
                  </div>
                </div>

                <div className="ca-card" id="s-preferences">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--green"><Sliders size={18} /></div>
                    <div><div className="ca-card-title">Preferences & Classification</div><div className="ca-card-subtitle">Answer visibility, question ordering, proctoring, domain, and certificate settings</div></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Do you want allow user to view answers at the end of the Assessment?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="va" checked={f.allowViewAnswers==='Yes'} onChange={()=>u('allowViewAnswers','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="va" checked={f.allowViewAnswers==='No'} onChange={()=>u('allowViewAnswers','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl-bold">How do you want questions to appear in Assessment? <span className="ca-req">*</span></label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="qo" checked={f.questionOrder==='Randomly'} onChange={()=>u('questionOrder','Randomly')} /><span>Random</span></label><label className="ca-radio-label"><input type="radio" name="qo" checked={f.questionOrder==='Manual Selection'} onChange={()=>u('questionOrder','Manual Selection')} /><span>Manual</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Allow this Assessment to download the assessment report?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="dr" checked={f.downloadReport==='Only For Admin'} onChange={()=>u('downloadReport','Only For Admin')} /><span>Admin</span></label><label className="ca-radio-label"><input type="radio" name="dr" checked={f.downloadReport==='Both (Admin & Candidates)'} onChange={()=>u('downloadReport','Both (Admin & Candidates)')} /><span>Both</span></label><label className="ca-radio-label"><input type="radio" name="dr" checked={f.downloadReport==='No'} onChange={()=>u('downloadReport','No')} /><span>No</span></label></div></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Allow secure browser with Proctoring for this Assessment?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="sb" checked={f.secureBrowser==='Yes'} onChange={()=>u('secureBrowser','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="sb" checked={f.secureBrowser==='No'} onChange={()=>u('secureBrowser','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Allow Proctoring for this Assessment?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="ap" checked={f.allowProctoring==='Yes'} onChange={()=>u('allowProctoring','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="ap" checked={f.allowProctoring==='No'} onChange={()=>u('allowProctoring','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Assessment Level <span className="ca-req">*</span></label><CheckboxDropdown placeholder="Select Level" options={DIFFICULTY_LEVELS} selected={f.assessmentLevel} onChange={handleLevelChange} /></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl">Assessment Domain</label><CustomSelect value={f.assessmentDomain} onChange={handleDomainChange} options={[{ value: '', label: 'Please Select' }, 'Accounting', 'Auditing', 'Tax', 'Others']} placeholder="Please Select" /></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Topic</label><CustomSelect value={f.topic} onChange={(v) => u('topic', v)} options={[{ value: '', label: 'Please Select' }, ...TOPICS]} placeholder="Please Select" /></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Role</label><CustomSelect value={f.role} onChange={(v) => u('role', v)} options={[{ value: '', label: 'Nothing selected' }, ...getAvailableRoles()]} placeholder="Nothing selected" /></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Allow user to download Certificate?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="ac" checked={f.allowCertificate==='Yes'} onChange={()=>u('allowCertificate','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="ac" checked={f.allowCertificate==='No'} onChange={()=>u('allowCertificate','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Country</label><CheckboxDropdown placeholder="Please Select" options={COUNTRIES} selected={f.country} onChange={(updated) => u('country', updated)} dropUp /></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Profile <span className="ca-optional">(Multiple)</span></label><CheckboxDropdown placeholder="Select Profiles" options={PROFILES} selected={f.profiles} onChange={(updated) => u('profiles', updated)} dropUp /></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* STEP 2 — Question Type */}
                <div className="ca-card">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--purple"><List size={18} /></div>
                    <div>
                      <div className="ca-card-title">Type of Questions <span className="ca-optional">(Multiple Selection)</span> <span className="ca-req">*</span></div>
                      <div className="ca-card-subtitle">Select one or more question types for this assessment</div>
                    </div>
                  </div>
                  <div id="field-qTypes">
                    <CheckboxDropdown
                      placeholder="Select question types"
                      options={QUESTION_TYPES}
                      selected={selectedQTypes}
                      onChange={(t) => { handleQTypeChange(t); setErrors((prev) => { const n = { ...prev }; delete n.qTypes; return n; }); }}
                      labels={QUESTION_TYPE_LABELS}
                      error={!!errors.qTypes}
                    />
                  </div>
                  {errors.qTypes && <span className="ca-error-msg">{errors.qTypes}</span>}
                  <p className="ca-hint" style={{ marginTop: 12 }}>
                    If you change the categories, number of questions, or types of questions, any previously selected questions will be removed from this test.
                  </p>
                </div>

                {/* Table view */}
                {selectedQTypes.length > 0 && (
                  <div className="ca-card">
                    <div className="ca-card-header">
                      <div className="ca-card-icon ca-card-icon--amber"><Settings size={18} /></div>
                      <div>
                        <div className="ca-card-title">Total number of questions in category</div>
                        <div className="ca-card-subtitle">Configure each question type with difficulty, passing %, report weightage, questions count, and categories. When only one question type is still blank, we suggest the remaining percentage and you can still edit it.</div>
                      </div>
                    </div>

                    <div className="ca-s2-table-wrap">
                      <table className="ca-s2-table">
                        <thead>
                          <tr>
                            <th>Question Type</th>
                            <th>Difficulty Level</th>
                            <th>Passing %</th>
                            <th>Report Weightage (%)</th>
                            <th>Duration (Min)</th>
                            <th>No. of Ques</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedQTypes.map((qType) => {
                            const config = qTypeConfigs[qType];
                            if (!config) return null;

                            return (
                              <tr key={qType}>
                                <td className="ca-s2-qtype"><div className="ca-s2-qtype-inner">{qType}</div></td>
                                <td>
                                  <CustomSelect value={config.difficulty} onChange={(v) => updateConfig(qType, 'difficulty', v)} options={DIFFICULTY_LEVELS} className="ca-s2-csel" />
                                </td>
                                <td>
                                  <input id={`field-${qType}_passing`} type="text" className={`ca-s2-input ${errors[`${qType}_passing`] ? 'ca-error' : ''}`} placeholder="20" value={config.passingPercent} onChange={(e) => { updateConfig(qType, 'passingPercent', e.target.value); setErrors((prev) => { const n = { ...prev }; delete n[`${qType}_passing`]; return n; }); }} />
                                </td>
                                <td>
                                  <div className="ca-s2-weightage-wrap">
                                    <input
                                      id={`field-${qType}_reportWeightage`}
                                      type="text"
                                      className={`ca-s2-input ca-s2-weightage-input ${errors[`${qType}_reportWeightage`] ? 'ca-error' : ''}`}
                                      placeholder="0"
                                      value={config.reportWeightage}
                                      onChange={(e) => updateReportWeightage(qType, e.target.value)}
                                    />
                                    <span className="ca-s2-weightage-symbol">%</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="ca-duration-wrap">
                                    <input id={`field-${qType}_duration`} type="text" className={`ca-s2-input ca-duration-input ${errors[`${qType}_duration`] ? 'ca-error' : ''}`} placeholder="Min" value={config.duration} onChange={(e) => { updateConfig(qType, 'duration', e.target.value); setErrors((prev) => { const n = { ...prev }; delete n[`${qType}_duration`]; return n; }); }} />
                                    <span className="ca-duration-hint">
                                      {(() => { const m = parseInt(config.duration) || 0; return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}min`; })()}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <input id={`field-${qType}_noOfQues`} type="text" className={`ca-s2-input ${errors[`${qType}_noOfQues`] ? 'ca-error' : ''}`} placeholder="5" value={config.noOfQues} onChange={(e) => { updateConfig(qType, 'noOfQues', e.target.value); setErrors((prev) => { const n = { ...prev }; delete n[`${qType}_noOfQues`]; return n; }); }} />
                                </td>
                                <td>
                                  <div className="ca-s2-cat-vertical">
                                    {config.categories.map((cat) => (
                                      <div key={cat} className="ca-s2-cat-row">
                                        <span className="ca-s2-cat-name">{cat}</span>
                                        <button className="ca-s2-cat-remove" onClick={() => removeCategory(qType, cat)}><X size={14} /></button>
                                      </div>
                                    ))}
                                    <button className="ca-s2-add-btn" onClick={() => setModalOpen(qType)} type="button">
                                      <Plus size={13} /> Add
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="ca-s2-totals-row" id="field-reportWeightageTotal">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <div className={`ca-s2-total-chip ${reportWeightageError ? 'ca-s2-total-chip--error' : ''}`}>
                                <span className="ca-s2-total-label">SUM</span>
                                <span className="ca-s2-total-value">{formatWeightage(reportWeightageSummary.total)}%</span>
                              </div>
                            </td>
                            <td>
                              <div className="ca-s2-total-chip">
                                <span className="ca-s2-total-label">SUM</span>
                                <span className="ca-s2-total-value">{formatMinutesSummary(totalDurationMinutes)}</span>
                              </div>
                            </td>
                            <td>
                              <div className="ca-s2-total-chip">
                                <span className="ca-s2-total-label">SUM</span>
                                <span className="ca-s2-total-value">{totalQuestions}</span>
                              </div>
                            </td>
                            <td>
                              <span className="ca-s2-totals-status">
                                {reportWeightageSummary.invalidCount > 0
                                  ? 'Fix invalid weightages'
                                  : reportWeightageSummary.total > REPORT_WEIGHTAGE_TOTAL
                                    ? `Over by ${formatWeightage(reportWeightageSummary.total - REPORT_WEIGHTAGE_TOTAL)}%`
                                    : reportWeightageSummary.missingCount > 0
                                      ? `${reportWeightageSummary.missingCount} field(s) pending`
                                      : 'All question types assigned'}
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {reportWeightageError && <span className="ca-error-msg">{reportWeightageError}</span>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ca-page-footer">
          <span className="ca-page-footer-copy">2026 &copy; www.my-cpe.com</span>
          <div className="ca-page-footer-links"><span>About</span><span>Team</span><span>Contact</span></div>
        </div>
      </div>

      {modalOpen && (
        <CategoryModal
          categories={CATEGORIES}
          selected={qTypeConfigs[modalOpen]?.categories || []}
          onSubmit={(cats) => setQTypeConfigs((prev) => ({ ...prev, [modalOpen]: { ...prev[modalOpen], categories: cats } }))}
          onClose={() => setModalOpen(null)}
        />
      )}
    </div>
  );
};

export default CreateAssessment;
