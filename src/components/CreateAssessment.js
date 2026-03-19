import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Eye, Bookmark, Settings, Sliders, FolderTree, Check, ChevronDown, X, Plus, Trash2,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Pen, Droplet, PenTool, Highlighter,
  Pilcrow, AlignLeft, AlignCenter, List, ListOrdered, AlignRight, AlignJustify, Quote,
  Link, Image, Film, Columns3, Table, Smile, DollarSign, Minus, Play, Triangle,
  Save, FileCode, HelpCircle, Code, Undo, Redo,
} from 'lucide-react';
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

const QUESTION_TYPE_COLORS = {
  MCQ: '#7162EA',
  SUB: '#2563eb',
  AVS: '#d97706',
  'AI Video': '#0891b2',
  SIM: '#16a34a',
  ESSAY: '#e11d48',
};

const CATEGORIES = [
  'Business Documents', 'Terminology', 'Timesheets', 'Accounting Industry',
  'Trial Balance', 'Financial Statements', 'Tax Compliance', 'Audit Standards',
  'Ethics & Governance', 'Payroll Processing', 'Revenue Recognition',
];

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advance'];

/* ===== Multi-select checkbox dropdown ===== */
const CheckboxDropdown = ({ placeholder, options, selected, onChange, labels, error }) => {
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
  const display = selected.length > 0 ? selected.join(', ') : placeholder;

  return (
    <div className="ca-cbdrop" ref={ref}>
      <button className={`ca-cbdrop-btn ${open ? 'ca-cbdrop-btn--open' : ''} ${error ? 'ca-error' : ''}`} onClick={() => setOpen(!open)} type="button">
        <span className={selected.length > 0 ? '' : 'ca-placeholder'}>{display}</span>
        <ChevronDown size={16} className={`ca-cbdrop-chev ${open ? 'ca-cbdrop-chev--open' : ''}`} />
      </button>
      {open && (
        <div className="ca-cbdrop-panel">
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
    quickLinks: '', maxRetake: 'No Retake', evaluator: '', duration: '',
    allowViewAnswers: 'No', questionOrder: 'Randomly', downloadReport: 'No',
    secureBrowser: 'No', allowProctoring: 'No', assessmentLevel: '',
    assessmentDomain: '', topic: '', role: '', allowCertificate: 'No', country: '',
  });
  const u = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; }); };
  const vis = ['Commercial Subscription', 'Prospective Hire', 'Offshoring Client (Offshore Staff)', 'Internal Team', 'Others'];
  const toggleVis = (o) => u('visibility', f.visibility.includes(o) ? f.visibility.filter((v) => v !== o) : [...f.visibility, o]);

  const validateStep1 = () => {
    const e = {};
    if (!f.assessmentName.trim()) e.assessmentName = 'Assessment name is required';
    if (!f.description.trim()) e.description = 'Description is required';
    if (!f.evaluationCriteria.trim()) e.evaluationCriteria = 'Evaluation criteria is required';
    if (!f.duration.trim()) e.duration = 'Duration is required';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      document.querySelector(`.ca-error`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (selectedQTypes.length === 0) e.qTypes = 'Select at least one question type';
    selectedQTypes.forEach((qt) => {
      const c = qTypeConfigs[qt];
      if (c) {
        if (!c.passingPercent) e[`${qt}_passing`] = true;
        if (!c.noOfQues) e[`${qt}_noOfQues`] = true;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = () => {
    if (validateStep2() && onSuccess) onSuccess();
  };

  // Step 2 state
  const [modalOpen, setModalOpen] = useState(null); // qType string or null
  const [selectedQTypes, setSelectedQTypes] = useState([]);
  const [qTypeConfigs, setQTypeConfigs] = useState({});

  const initConfig = (types) => {
    const newConfigs = { ...qTypeConfigs };
    types.forEach((t) => {
      if (!newConfigs[t]) {
        newConfigs[t] = {
          difficulty: 'Basic',
          passingPercent: '',
          noOfQues: '',
          categories: [],
        };
      }
    });
    Object.keys(newConfigs).forEach((k) => {
      if (!types.includes(k)) delete newConfigs[k];
    });
    setQTypeConfigs(newConfigs);
  };

  const handleQTypeChange = (types) => {
    setSelectedQTypes(types);
    initConfig(types);
  };

  const updateConfig = (type, field, value) => {
    setQTypeConfigs((prev) => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
  };

  const toggleCategory = (type, cat) => {
    setQTypeConfigs((prev) => {
      const cats = prev[type].categories;
      const updated = cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat];
      return { ...prev, [type]: { ...prev[type], categories: updated } };
    });
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
                  <div className="ca-field"><label className="ca-lbl">Assessment Name <span className="ca-req">*</span></label><input type="text" className={`ca-input ${errors.assessmentName ? 'ca-error' : ''}`} placeholder="e.g. Fundamentals of Financial Audit" value={f.assessmentName} onChange={(e) => u('assessmentName', e.target.value)} />{errors.assessmentName && <span className="ca-error-msg">{errors.assessmentName}</span>}</div>
                  <div className="ca-field"><label className="ca-lbl">Assessment Description <span className="ca-req">*</span></label><div className={`ca-editor ${errors.description ? 'ca-error' : ''}`}><Toolbar /><textarea className="ca-editor-area" placeholder="Describe the assessment purpose and scope..." value={f.description} onChange={(e) => u('description', e.target.value)} rows={5} /><div className="ca-char-count">Characters : {f.description.length}</div></div>{errors.description && <span className="ca-error-msg">{errors.description}</span>}</div>
                  <div className="ca-field"><label className="ca-lbl">Evaluation Criteria <span className="ca-req">*</span></label><div className={`ca-editor ${errors.evaluationCriteria ? 'ca-error' : ''}`}><Toolbar /><textarea className="ca-editor-area" placeholder="Define how participants will be evaluated..." value={f.evaluationCriteria} onChange={(e) => u('evaluationCriteria', e.target.value)} rows={5} /><div className="ca-char-count">Characters : {f.evaluationCriteria.length}</div></div>{errors.evaluationCriteria && <span className="ca-error-msg">{errors.evaluationCriteria}</span>}</div>
                  <div className="ca-field"><label className="ca-lbl">Quick Links <span className="ca-optional">(optional)</span></label><span className="ca-hint">Format: &lt;URL_LABEL&gt;https://example.com</span><textarea className="ca-textarea" placeholder="Enter quick links..." value={f.quickLinks} onChange={(e) => u('quickLinks', e.target.value)} rows={2} /></div>
                </div>

                <div className="ca-card" id="s-config">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--amber"><Settings size={18} /></div>
                    <div><div className="ca-card-title">Configuration</div><div className="ca-card-subtitle">Retake limits, duration, evaluator, and instruction video</div></div>
                  </div>
                  <div className="ca-grid ca-grid--4">
                    <div className="ca-grid-item"><label className="ca-lbl">Max. Retake <span className="ca-req">*</span></label><select className="ca-select" value={f.maxRetake} onChange={(e) => u('maxRetake', e.target.value)}><option>No Retake</option><option>1</option><option>2</option><option>3</option></select></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Instruction Video</label><input type="file" className="ca-file-input" /></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Evaluator</label><select className="ca-select" value={f.evaluator} onChange={(e) => u('evaluator', e.target.value)}><option value="">Nothing selected</option><option>Admin</option><option>Evaluator</option></select></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Duration (min) <span className="ca-req">*</span></label><input type="text" className={`ca-input ${errors.duration ? 'ca-error' : ''}`} placeholder="0-120" value={f.duration} onChange={(e) => u('duration', e.target.value)} />{errors.duration && <span className="ca-error-msg">{errors.duration}</span>}</div>
                  </div>
                </div>

                <div className="ca-card" id="s-preferences">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--green"><Sliders size={18} /></div>
                    <div><div className="ca-card-title">Preferences</div><div className="ca-card-subtitle">Answer visibility, question ordering, proctoring, and reports</div></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Show answers after test?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="va" checked={f.allowViewAnswers==='Yes'} onChange={()=>u('allowViewAnswers','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="va" checked={f.allowViewAnswers==='No'} onChange={()=>u('allowViewAnswers','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Question order <span className="ca-req">*</span></label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="qo" checked={f.questionOrder==='Randomly'} onChange={()=>u('questionOrder','Randomly')} /><span>Random</span></label><label className="ca-radio-label"><input type="radio" name="qo" checked={f.questionOrder==='Manual Selection'} onChange={()=>u('questionOrder','Manual Selection')} /><span>Manual</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Download report?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="dr" checked={f.downloadReport==='Only For Admin'} onChange={()=>u('downloadReport','Only For Admin')} /><span>Admin</span></label><label className="ca-radio-label"><input type="radio" name="dr" checked={f.downloadReport==='Both (Admin & Candidates)'} onChange={()=>u('downloadReport','Both (Admin & Candidates)')} /><span>Both</span></label><label className="ca-radio-label"><input type="radio" name="dr" checked={f.downloadReport==='No'} onChange={()=>u('downloadReport','No')} /><span>No</span></label></div></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Secure browser?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="sb" checked={f.secureBrowser==='Yes'} onChange={()=>u('secureBrowser','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="sb" checked={f.secureBrowser==='No'} onChange={()=>u('secureBrowser','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Allow proctoring?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="ap" checked={f.allowProctoring==='Yes'} onChange={()=>u('allowProctoring','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="ap" checked={f.allowProctoring==='No'} onChange={()=>u('allowProctoring','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Assessment Level</label><select className="ca-select" value={f.assessmentLevel} onChange={(e)=>u('assessmentLevel',e.target.value)}><option value="">Please Select</option><option>Basic</option><option>Intermediate</option><option>Advance</option></select></div>
                  </div>
                </div>

                <div className="ca-card" id="s-classification">
                  <div className="ca-card-header">
                    <div className="ca-card-icon ca-card-icon--rose"><FolderTree size={18} /></div>
                    <div><div className="ca-card-title">Classification</div><div className="ca-card-subtitle">Domain, topic, role, country, and certificate settings</div></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl">Assessment Domain</label><select className="ca-select" value={f.assessmentDomain} onChange={(e)=>u('assessmentDomain',e.target.value)}><option value="">Please Select</option><option>Accounting</option><option>Auditing</option><option>Tax</option></select></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Topic</label><select className="ca-select" value={f.topic} onChange={(e)=>u('topic',e.target.value)}><option value="">Please Select</option></select></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Role</label><select className="ca-select" value={f.role} onChange={(e)=>u('role',e.target.value)}><option value="">Nothing selected</option></select></div>
                  </div>
                  <div className="ca-grid ca-grid--3">
                    <div className="ca-grid-item"><label className="ca-lbl-bold">Allow certificate?</label><div className="ca-radio-group"><label className="ca-radio-label"><input type="radio" name="ac" checked={f.allowCertificate==='Yes'} onChange={()=>u('allowCertificate','Yes')} /><span>Yes</span></label><label className="ca-radio-label"><input type="radio" name="ac" checked={f.allowCertificate==='No'} onChange={()=>u('allowCertificate','No')} /><span>No</span></label></div></div>
                    <div className="ca-grid-item"><label className="ca-lbl">Country</label><select className="ca-select" value={f.country} onChange={(e)=>u('country',e.target.value)}><option value="">Please Select</option></select></div>
                    <div className="ca-grid-item" />
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
                  <CheckboxDropdown
                    placeholder="Select question types"
                    options={QUESTION_TYPES}
                    selected={selectedQTypes}
                    onChange={(t) => { handleQTypeChange(t); setErrors((prev) => { const n = { ...prev }; delete n.qTypes; return n; }); }}
                    labels={QUESTION_TYPE_LABELS}
                    error={!!errors.qTypes}
                  />
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
                        <div className="ca-card-subtitle">Configure each question type with difficulty, passing %, questions count, and categories</div>
                      </div>
                    </div>

                    <div className="ca-s2-table-wrap">
                      <table className="ca-s2-table">
                        <thead>
                          <tr>
                            <th>Question Type</th>
                            <th>Difficulty Level</th>
                            <th>Passing %</th>
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
                                <td className="ca-s2-qtype">{qType}</td>
                                <td>
                                  <select className="ca-s2-select" value={config.difficulty} onChange={(e) => updateConfig(qType, 'difficulty', e.target.value)}>
                                    {DIFFICULTY_LEVELS.map((l) => <option key={l}>{l}</option>)}
                                  </select>
                                </td>
                                <td>
                                  <input type="text" className={`ca-s2-input ${errors[`${qType}_passing`] ? 'ca-error' : ''}`} placeholder="20" value={config.passingPercent} onChange={(e) => { updateConfig(qType, 'passingPercent', e.target.value); setErrors((prev) => { const n = { ...prev }; delete n[`${qType}_passing`]; return n; }); }} />
                                </td>
                                <td>
                                  <input type="text" className={`ca-s2-input ${errors[`${qType}_noOfQues`] ? 'ca-error' : ''}`} placeholder="5" value={config.noOfQues} onChange={(e) => { updateConfig(qType, 'noOfQues', e.target.value); setErrors((prev) => { const n = { ...prev }; delete n[`${qType}_noOfQues`]; return n; }); }} />
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
                      </table>
                    </div>
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
