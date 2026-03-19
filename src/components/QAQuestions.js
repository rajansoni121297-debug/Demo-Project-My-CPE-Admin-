import React, { useState, useRef, useEffect } from 'react';
import {
  Search, ChevronDown, Star, Upload, Pencil, Eye, Trash2, X, Check,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import CreateMCQ from './CreateMCQ';
import './QAQuestions.css';

const PARENT_CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Recrutiment - Internal',
  'Bascis of Accounting - Foundation', 'US Accounting - Foundation', 'US Accounting - Intermediate',
  'CFP Exam Prep', 'US Auditing - Foundation', 'US Auditing - Intermediate',
  'Basic Communication - Offshore - Internal', 'EA Test', 'EBP Audit - PTC',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Firms',
  'Cannabis Business', 'Restaurant Accounting - Foundation', 'US Business Tax - Foundation',
  'IRS - Foundation', 'Not-for-Profit Audit - US', 'CMA Part 1',
];

const CHILD_CATEGORIES_MAP = {
  'US CPA Firms Overview': ['Firm Management', 'Client Relations', 'Billing & Collections'],
  'US Individual Tax - Foundation': ['Filing Requirements & Filing Status', 'Due Dates & Extensions', 'SSN& ITIN', 'Dependents', 'Injured & Innocent Spouse'],
  'Bascis of Accounting - Foundation': ['Bank Reconciliation Workflow', 'Accounting Equation', 'Business Documents', 'Terminology', 'Timesheets'],
  'US Accounting - Foundation': ['Accounting Periods & Methods', 'Revenue Recognition', 'Financial Statements'],
};

const CREATED_BY = [
  'Shawn Parikh', 'Gary Morya', 'Raghav MyCPE', 'Bhargav MyCPE', 'Parth MyCPE',
  'Saumil MyCPE', 'Nikhil MyCPE', 'Harshal Trivedi', 'Swapnil Alani', 'Nilesh Mycpe',
  'Kinjal Mycpe', 'Ankit Parikh', 'Soham Buch', 'Himanshu Naik', 'Snehal Gajjar',
  'Shachi Shah', 'Amrit MY-cpe', 'dhaval shishangiya', 'Nikunj Patel', 'Nilesh Prajapati',
];

const QUESTION_TYPES = ['MCQ', 'Video', 'AI Video', 'Subjective', 'Simulation', 'Essay'];
const LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const STATUSES = ['Active', 'Inactive', 'Deleted'];
const YES_NO = ['Yes', 'No'];
const DOMAINS = ['Accounting', 'Auditing', 'Tax', 'Others'];

const ADD_QUESTION_TYPES = [
  { key: 'MCQ', label: 'Multiple Choice (MCQ)', desc: 'Standard multiple choice questions' },
  { key: 'Video', label: 'Video Question', desc: 'Video-based assessment questions' },
  { key: 'AI Video', label: 'AI Video Question', desc: 'AI-generated video questions' },
  { key: 'Subjective', label: 'Subjective', desc: 'Open-ended written answers' },
  { key: 'Simulation', label: 'Simulation', desc: 'Interactive simulation questions' },
  { key: 'Essay', label: 'Essay', desc: 'Long-form written responses' },
];

const MCQ_TYPES = ['MCQ', 'Yes/No', 'True/False'];

const QUESTIONS_DATA = [
  { id: 'Q00072787', name: 'To review what was reconciled last month, Daniel Ortiz at BrightLine Advisory needs to see the reconciliation history for Harbor Street Salon LLC in Q', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072786', name: 'A transaction was saved to the wrong bank account, so it never shows in the correct reconciliation for Riverstone Studio LLC. What should Kevin Walker', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072785', name: 'One check amount differs by $100 between the statement and QBO for Meadowbrook HOA. What QBO step should Julian Mercer take so the item clears correct', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072784', name: 'A deposit shown on the statement does not exist in QBO for BrightWave Tutors LLC. What should Marcus Lee enter so the deposit appears in the bank acco', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072783', name: 'Statement Interest posted for Birchview Properties LLC, but Fiona O\'Connor cannot clear it because it is not recorded in QBO. Which entry should she', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072782', name: 'Bank service charges appear on Meadowline Catering LLC\'s statement, but Trevor Collins cannot find them to clear. Which QBO transaction should he cr', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072781', name: 'When Olivia Grant opens Reconcile for Harbor Stone LLC, QBO shows the prior month reconciliation is still in progress. Which action should she choose', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
  { id: 'Q00072780', name: 'From the Reconcile list, Grace Kim sees a check that cleared on the statement but the QBO transaction date is after the statement end date. What shoul', type: 'MCQ', level: 'Basic', domain: '-', parentCategory: 'Accounts - Assessment', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active' },
];

/* ===== Parent-Child Linked Dropdown ===== */
const ParentChildDropdown = ({ parentLabel, childLabel, parentOptions, childMap, selectedParent, onParentChange, selectedChild, onChildChange }) => {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState('');
  const parentRef = useRef(null);
  const childRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (parentRef.current && !parentRef.current.contains(e.target)) setParentOpen(false);
      if (childRef.current && !childRef.current.contains(e.target)) setChildOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredParents = parentSearch
    ? parentOptions.filter((p) => p.toLowerCase().includes(parentSearch.toLowerCase()))
    : parentOptions;

  const childOptions = selectedParent ? (childMap[selectedParent] || []) : [];

  return (
    <>
      <div className="qq-filter-group" ref={parentRef}>
        <label className="qq-filter-label">{parentLabel}</label>
        <div className="qq-dropdown-wrap">
          <button className={`qq-dropdown-btn ${parentOpen ? 'qq-dropdown-btn--open' : ''}`} onClick={() => setParentOpen(!parentOpen)}>
            <span className={selectedParent ? '' : 'qq-placeholder'}>{selectedParent || `Select ${parentLabel}`}</span>
            <ChevronDown size={14} className={`qq-chev ${parentOpen ? 'qq-chev--open' : ''}`} />
          </button>
          {parentOpen && (
            <div className="qq-dropdown-panel">
              <div className="qq-dropdown-search">
                <input type="text" value={parentSearch} onChange={(e) => setParentSearch(e.target.value)} placeholder="Search..." className="qq-dropdown-search-input" autoFocus />
              </div>
              <div className="qq-dropdown-list">
                <div className="qq-dropdown-item qq-dropdown-item--header" onClick={() => { onParentChange(''); onChildChange(''); setParentOpen(false); setParentSearch(''); }}>
                  Select {parentLabel}
                </div>
                {filteredParents.map((p) => (
                  <div key={p} className={`qq-dropdown-item ${selectedParent === p ? 'qq-dropdown-item--sel' : ''}`}
                    onClick={() => { onParentChange(p); onChildChange(''); setParentOpen(false); setParentSearch(''); }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="qq-filter-group" ref={childRef}>
        <label className="qq-filter-label">{childLabel}</label>
        <div className="qq-dropdown-wrap">
          <button className={`qq-dropdown-btn ${childOpen ? 'qq-dropdown-btn--open' : ''}`}
            onClick={() => { if (selectedParent) setChildOpen(!childOpen); }}>
            <span className={selectedChild ? '' : 'qq-placeholder'}>{selectedChild || 'Nothing selected'}</span>
            <ChevronDown size={14} className={`qq-chev ${childOpen ? 'qq-chev--open' : ''}`} />
          </button>
          {childOpen && (
            <div className="qq-dropdown-panel">
              <div className="qq-dropdown-list">
                {childOptions.length > 0 ? childOptions.map((c) => (
                  <div key={c} className={`qq-dropdown-item ${selectedChild === c ? 'qq-dropdown-item--sel' : ''}`}
                    onClick={() => { onChildChange(c); setChildOpen(false); }}>
                    {c}
                  </div>
                )) : (
                  <div className="qq-dropdown-empty">Select Parent Category First</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ===== Add Question Dropdown ===== */
const AddQuestionDropdown = ({ onSelectType }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="qq-add-wrap" ref={ref}>
      <button className="qq-add-btn" onClick={() => setOpen(!open)}>
        Add Question <ChevronDown size={14} />
      </button>
      {open && (
        <div className="qq-add-panel">
          {ADD_QUESTION_TYPES.map((t) => (
            <div key={t.key} className="qq-add-item" onClick={() => { setOpen(false); onSelectType(t.key); }}>
              <span className="qq-add-item-label">{t.label}</span>
              <span className="qq-add-item-desc">{t.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== MCQ Type Selection Sub-Screen ===== */
const MCQTypeSelection = ({ onBack, onProceed }) => {
  const [selectedMCQType, setSelectedMCQType] = useState('');
  const [mcqDropdownOpen, setMcqDropdownOpen] = useState(false);
  const [mcqSearch, setMcqSearch] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const mcqDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const isTemplateUploaded = uploadedFile !== null;
  const isDropdownDisabled = isTemplateUploaded; // Dropdown disabled when template uploaded
  const isUploadDisabled = selectedMCQType !== ''; // Upload disabled when MCQ type selected

  useEffect(() => {
    const h = (e) => { if (mcqDropdownRef.current && !mcqDropdownRef.current.contains(e.target)) setMcqDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredMCQTypes = mcqSearch
    ? MCQ_TYPES.filter((t) => t.toLowerCase().includes(mcqSearch.toLowerCase()))
    : MCQ_TYPES;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleClearSelection = () => {
    setSelectedMCQType('');
    setMcqSearch('');
  };

  const handleProceed = () => {
    onProceed(selectedMCQType);
  };

  const handleDownloadTemplate = () => {
    alert('Downloading MCQ template file...');
  };

  return (
    <div className="qa-questions">
      <div className="qq-content">
        {/* Sub-screen Header */}
        <div className="mcq-sub-header">
          <button className="mcq-back-btn" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="mcq-sub-title">Add Question</h1>
        </div>
        <div className="mcq-sub-tag">
          <Star size={16} className="mcq-sub-tag-icon" />
          <span>Multiple Choice Question</span>
        </div>

        {/* Selection Card */}
        <div className="mcq-select-card">
          <h2 className="mcq-card-title">Choose how you want to add questions?</h2>
          <p className="mcq-card-desc">
            Use the dropdown to add questions manually, or upload a template to add questions in bulk.
          </p>

          {/* MCQ Type Dropdown with Clear */}
          <div className="mcq-type-row">
            <div className={`mcq-type-dropdown ${isDropdownDisabled ? 'mcq-type-dropdown--disabled' : ''}`} ref={mcqDropdownRef}>
              <button
                className={`mcq-type-btn ${mcqDropdownOpen ? 'mcq-type-btn--open' : ''} ${isDropdownDisabled ? 'mcq-type-btn--disabled' : ''}`}
                onClick={() => { if (!isDropdownDisabled) setMcqDropdownOpen(!mcqDropdownOpen); }}
                disabled={isDropdownDisabled}
              >
                <span className={selectedMCQType ? '' : 'qq-placeholder'}>
                  {selectedMCQType || 'Select MCQ Type'}
                </span>
                <ChevronDown size={14} className={`qq-chev ${mcqDropdownOpen ? 'qq-chev--open' : ''}`} />
              </button>
              {mcqDropdownOpen && (
                <div className="mcq-type-panel">
                  <div className="qq-dropdown-search">
                    <input
                      type="text"
                      value={mcqSearch}
                      onChange={(e) => setMcqSearch(e.target.value)}
                      placeholder="Search..."
                      className="qq-dropdown-search-input"
                      autoFocus
                    />
                  </div>
                  <div className="qq-dropdown-list">
                    <div
                      className="qq-dropdown-item qq-dropdown-item--header"
                      onClick={() => { setSelectedMCQType(''); setMcqDropdownOpen(false); setMcqSearch(''); }}
                    >
                      Select MCQ Type
                    </div>
                    {filteredMCQTypes.map((t) => (
                      <div
                        key={t}
                        className={`qq-dropdown-item ${selectedMCQType === t ? 'qq-dropdown-item--sel' : ''}`}
                        onClick={() => { setSelectedMCQType(t); setMcqDropdownOpen(false); setMcqSearch(''); }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedMCQType && (
              <button className="mcq-clear-btn" onClick={handleClearSelection}>
                Clear
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mcq-divider">
            <span className="mcq-divider-line" />
            <span className="mcq-divider-text">OR</span>
            <span className="mcq-divider-line" />
          </div>

          {/* Upload Template */}
          <div className={`mcq-upload-section ${isUploadDisabled ? 'mcq-upload-section--disabled' : ''}`}>
            {!isTemplateUploaded ? (
              <>
                <button
                  className={`mcq-upload-btn ${isUploadDisabled ? 'mcq-upload-btn--disabled' : ''}`}
                  onClick={() => { if (!isUploadDisabled) fileInputRef.current.click(); }}
                  disabled={isUploadDisabled}
                >
                  <Upload size={16} />
                  Select Template File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <div className="mcq-uploaded-file">
                <div className="mcq-uploaded-file-info">
                  <Upload size={16} className="mcq-uploaded-file-icon" />
                  <span className="mcq-uploaded-file-name">{uploadedFile.name}</span>
                  <span className="mcq-uploaded-file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button className="mcq-remove-file-btn" onClick={handleRemoveFile}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Download Template Link */}
          <button className="mcq-download-link" onClick={handleDownloadTemplate}>
            Download Template File
          </button>

          {/* Proceed CTA - inside card */}
          {selectedMCQType && (
            <button className="mcq-proceed-btn" onClick={handleProceed}>
              Proceed to Create MCQ Manually <span className="mcq-proceed-arrow">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== Main Component ===== */
const QAQuestions = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState([]);
  const [selectedFileUpload, setSelectedFileUpload] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subScreen, setSubScreen] = useState(null); // null | 'mcq' | 'createMCQ'
  const [selectedMCQTypeForCreate, setSelectedMCQTypeForCreate] = useState('');
  const [savedQuestions, setSavedQuestions] = useState([]);

  const hasChecked = checkedRows.length > 0;

  const toggleRow = (id) => {
    setCheckedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedRows([]);
      setSelectAll(false);
    } else {
      setCheckedRows([...savedQuestions, ...QUESTIONS_DATA].map((q) => q.id));
      setSelectAll(true);
    }
  };

  const clearFilters = () => {
    setSelectedParent(''); setSelectedChild(''); setSelectedCreatedBy([]);
    setSelectedTypes([]); setSelectedLevels([]); setSelectedStatuses([]);
    setSelectedJournal([]); setSelectedFileUpload([]); setSelectedDomains([]);
  };

  const handleAddQuestionType = (type) => {
    if (type === 'MCQ') {
      setSubScreen('mcq');
    }
  };

  const handleMCQSave = (questionData) => {
    const nextId = `Q${String(QUESTIONS_DATA.length + savedQuestions.length + 1).padStart(8, '0')}`;
    const newQuestion = {
      id: nextId,
      name: questionData.question,
      type: questionData.selectType,
      level: questionData.difficulty,
      domain: '-',
      parentCategory: questionData.category,
      childCategory: '-',
      createdBy: 'Admin',
      status: 'Active',
    };
    setSavedQuestions((prev) => [newQuestion, ...prev]);
    setSubScreen(null);
    if (showToast) showToast('Question created successfully!');
  };

  if (subScreen === 'createMCQ') {
    return <CreateMCQ mcqType={selectedMCQTypeForCreate} onBack={() => setSubScreen('mcq')} onSave={handleMCQSave} />;
  }

  if (subScreen === 'mcq') {
    return (
      <MCQTypeSelection
        onBack={() => setSubScreen(null)}
        onProceed={(type) => { setSelectedMCQTypeForCreate(type); setSubScreen('createMCQ'); }}
      />
    );
  }

  return (
    <div className="qa-questions">
      <div className="qq-content">
        <div className="qq-sticky">
          {/* Header */}
          <div className="qq-header">
            <div className="qq-header-left">
              <Star size={20} className="qq-star-icon" />
              <h1 className="qq-title">Question Bank</h1>
            </div>
            <div className="qq-header-right">
              <div className="header-search">
                <input type="text" placeholder="Search here" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="header-search-input" />
                <Search size={18} className="header-search-icon" />
              </div>
              <button className={`qq-delete-btn ${hasChecked ? 'qq-delete-btn--active' : ''}`} disabled={!hasChecked}>
                <Trash2 size={15} /> Delete ({checkedRows.length})
              </button>
              <button className="export-btn"><Upload size={16} /> Export</button>
              <AddQuestionDropdown onSelectType={handleAddQuestionType} />
            </div>
          </div>

          {/* Filters Row 1 */}
          <div className="qq-filters">
            <ParentChildDropdown
              parentLabel="Parent Category"
              childLabel="Child Category"
              parentOptions={PARENT_CATEGORIES}
              childMap={CHILD_CATEGORIES_MAP}
              selectedParent={selectedParent}
              onParentChange={setSelectedParent}
              selectedChild={selectedChild}
              onChildChange={setSelectedChild}
            />
            <MultiSelectDropdown label="Created By" placeholder="Select User" options={CREATED_BY} selected={selectedCreatedBy} onChange={setSelectedCreatedBy} hasSearch={true} />
            <MultiSelectDropdown label="Question Type" placeholder="All" options={QUESTION_TYPES} selected={selectedTypes} onChange={setSelectedTypes} hasSearch={true} />
            <MultiSelectDropdown label="Level" placeholder="All" options={LEVELS} selected={selectedLevels} onChange={setSelectedLevels} hasSearch={true} />
          </div>

          {/* Filters Row 2 */}
          <div className="qq-filters">
            <MultiSelectDropdown label="Status" placeholder="All" options={STATUSES} selected={selectedStatuses} onChange={setSelectedStatuses} hasSearch={true} />
            <MultiSelectDropdown label="Accounting Journal Based" placeholder="All" options={YES_NO} selected={selectedJournal} onChange={setSelectedJournal} hasSearch={true} />
            <MultiSelectDropdown label="File Upload Allowed" placeholder="All" options={YES_NO} selected={selectedFileUpload} onChange={setSelectedFileUpload} hasSearch={true} />
            <MultiSelectDropdown label="Domain" placeholder="All" options={DOMAINS} selected={selectedDomains} onChange={setSelectedDomains} hasSearch={false} />

            <div className="qq-filter-actions">
              <button className="search-btn">Search</button>
              <button className="clear-all-btn" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="users-table qq-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" className="qq-checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
                <th>Question ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Level</th>
                <th>Domain</th>
                <th>Parent Category</th>
                <th>Child Category</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...savedQuestions, ...QUESTIONS_DATA].map((q) => (
                <tr key={q.id} className={checkedRows.includes(q.id) ? 'qq-row--checked' : ''}>
                  <td><input type="checkbox" className="qq-checkbox" checked={checkedRows.includes(q.id)} onChange={() => toggleRow(q.id)} /></td>
                  <td className="qq-id">{q.id}</td>
                  <td className="qq-name">{q.name}</td>
                  <td>{q.type}</td>
                  <td>{q.level}</td>
                  <td>{q.domain}</td>
                  <td>{q.parentCategory}</td>
                  <td>{q.childCategory}</td>
                  <td>{q.createdBy}</td>
                  <td><span className="qq-status-badge">{q.status}</span></td>
                  <td>
                    <div className={`qq-actions ${hasChecked ? 'qq-actions--disabled' : ''}`}>
                      <button className="qq-action-btn qq-action-btn--edit" disabled={hasChecked}><Pencil size={14} /></button>
                      <button className="qq-action-btn qq-action-btn--view" disabled={hasChecked}><Eye size={14} /></button>
                      <button className="qq-action-btn qq-action-btn--delete" disabled={hasChecked}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-left">
            Showing{' '}
            <div className="pagination-select-wrapper">
              <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="pagination-select">
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
              <ChevronDown size={14} className="pagination-select-icon" />
            </div>
            of {QUESTIONS_DATA.length + savedQuestions.length} Events
          </div>
          <div className="pagination-right">
            <button className="page-btn" disabled><ChevronsLeft size={16} /></button>
            <button className="page-btn" disabled><ChevronLeft size={16} /></button>
            <input type="text" className="page-input" value={currentPage} readOnly />
            <span className="page-of">of 01 pages</span>
            <button className="page-btn" disabled><ChevronRight size={16} /></button>
            <button className="page-btn" disabled><ChevronsRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAQuestions;
