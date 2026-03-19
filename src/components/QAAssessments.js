import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
  Plus,
  Pencil,
  Eye,
  Users,
  PlusCircle,
} from 'lucide-react';
import './QAAssessments.css';

const TABS = [
  { label: 'All', count: 1530 },
  { label: 'Commercial Subscription', count: 53 },
  { label: 'Prospective Hire', count: 9 },
  { label: 'Offshoring Client (Offshore Staff)', count: 0 },
  { label: 'Internal Team', count: 1277 },
  { label: 'Others', count: 1 },
];

const QUESTION_TYPES = ['MCQ', 'Video', 'AI Video', 'Subjective', 'Simulation', 'Essay'];

const COURSES = [
  'Certified Data Analytics & Power BI Mastery (CDAPBM)',
  'Qlik Sense Professional Certificate Course (QSPCC)',
  'Certified ChatGPT and AI Tools Mastery (CCAITM)',
  'CFP Prep Course',
  'AI Masterclass Certification (AIMC)',
  'Certification in Practical AI Applications (CPAIA)',
  'Complete Guide to become a Catalyst CFO (CGCC)',
  'Leadership Mastery Certificate (LMC)',
  'Certificate Course in Data-Driven Decision-making (DDDM)',
  'Certified Client Advisory Professional (CCAP)',
  'Talent Management and Development Certification (TMDC)',
  'Certificate in Organizational Development and Intervention Strategies (CODIS)',
  'Canada - Caseware- Working Paper Software Training',
  'Canada - CaseView - Financial Statement Training Templates',
  'Canada - Getting Ready for the New Compilation Standard - CSRS 4200',
  'Canada - Canadian SRED + R & D Tax Credit - 2023 Update',
];

const CREATED_BY = [
  'Shawn Parikh',
  'Gary Morya',
  'Raghav MyCPE',
  'Bhargav MyCPE',
  'Parth MyCPE',
  'Saumil MyCPE',
  'Nikhil MyCPE',
  'Harshal Trivedi',
  'Swapnil Alani',
  'Nilesh Mycpe',
  'Kinjal Mycpe',
  'Ankit Parikh',
  'Soham Buch',
  'Himanshu Naik',
  'Snehal Gajjar',
  'Shachi Shah',
];

const STATUS_OPTIONS = ['Draft', 'Active', 'Inactive'];

const ASSESSMENT_DATA = [
  {
    name: 'QuickBooks - QBO',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Intermediate',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'QuickBooks - QBO',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'CCH Axcess + ProSystem fx Audit Software',
    questions: '20 MCQ',
    invited: 1,
    completed: 0,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'UltraTax Software',
    questions: '20 MCQ',
    invited: 1,
    completed: 0,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'Lacerte Tax Software',
    questions: '20 MCQ',
    invited: 1,
    completed: 0,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'Drake Tax Software',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'CCH Axcess Tax Software',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'NPO Audit',
    questions: '20 MCQ',
    invited: 1,
    completed: 1,
    evaluation: 0,
    pending: 0,
    level: 'Intermediate',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
  {
    name: 'Yellow Book (GAGAS)',
    questions: '20 MCQ',
    invited: 1,
    completed: 1,
    evaluation: 0,
    pending: 0,
    level: 'Intermediate',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
  },
];

/* ===== Multi-Select Dropdown Component ===== */
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
    <div className="qa-filter-group" ref={ref}>
      <label className="qa-filter-label">{label}</label>
      <div className="qa-multiselect">
        <button
          className="qa-multiselect-btn"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className="qa-multiselect-text">{displayText}</span>
          <ChevronDown size={14} className={`qa-multiselect-chevron ${isOpen ? 'qa-multiselect-chevron--open' : ''}`} />
        </button>

        {isOpen && (
          <div className="qa-multiselect-dropdown">
            {hasSearch && (
              <div className="qa-multiselect-search">
                <input
                  type="text"
                  placeholder=""
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="qa-multiselect-search-input"
                  autoFocus
                />
              </div>
            )}
            <div className="qa-multiselect-options">
              {/* Select All */}
              <label className="qa-multiselect-option">
                <span>{placeholder}</span>
                <input
                  type="checkbox"
                  checked={selected.length === options.length}
                  onChange={() => toggleOption(placeholder)}
                />
              </label>
              {filteredOptions.map((option) => (
                <label key={option} className="qa-multiselect-option">
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

const QAAssessments = ({ onCreateAssessment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Commercial Subscription');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(['Active']);

  const clearFilters = () => {
    setSelectedQuestionTypes([]);
    setSelectedCourses([]);
    setSelectedCreatedBy([]);
    setSelectedStatus([]);
  };

  return (
    <div className="qa-assessments">
      <div className="qa-content">
      <div className="qa-sticky">
        {/* Header */}
        <div className="qa-header">
          <div className="qa-header-left">
            <Star size={20} className="qa-star-icon" />
            <h1 className="qa-title">Assessment List</h1>
          </div>

          <div className="qa-header-right">
            <div className="header-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="header-search-input"
              />
              <Search size={18} className="header-search-icon" />
            </div>
            <button className="qa-create-btn" onClick={onCreateAssessment}>
              <Plus size={16} />
              Create Assessment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="qa-filters">
          <MultiSelectDropdown
            label="Question Type"
            placeholder="Nothing selected"
            options={QUESTION_TYPES}
            selected={selectedQuestionTypes}
            onChange={setSelectedQuestionTypes}
            hasSearch={false}
          />
          <MultiSelectDropdown
            label="Course"
            placeholder="Select Course"
            options={COURSES}
            selected={selectedCourses}
            onChange={setSelectedCourses}
            hasSearch={true}
          />
          <MultiSelectDropdown
            label="Created By"
            placeholder="Select User"
            options={CREATED_BY}
            selected={selectedCreatedBy}
            onChange={setSelectedCreatedBy}
            hasSearch={true}
          />
          <MultiSelectDropdown
            label="Status"
            placeholder="Active"
            options={STATUS_OPTIONS}
            selected={selectedStatus}
            onChange={setSelectedStatus}
            hasSearch={false}
          />

          <div className="qa-filter-actions">
            <button className="clear-all-btn" onClick={clearFilters}>Clear Filter</button>
            <button className="search-btn">Search</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="qa-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              className={`qa-tab ${activeTab === tab.label ? 'qa-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}{' '}
              <span className="qa-tab-count">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="users-table qa-table">
            <thead>
              <tr>
                <th>Assessment Name & Questions</th>
                <th>Invited</th>
                <th>Completed</th>
                <th>Evaluation</th>
                <th>Pending</th>
                <th>Level</th>
                <th>Created By</th>
                <th>Assessment Report</th>
                <th>Sample Question</th>
                <th>Status</th>
                <th>Used in ptc</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ASSESSMENT_DATA.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="qa-name-cell">
                      <span className="qa-assessment-name">{item.name}</span>
                      <span className="qa-question-count">{item.questions}</span>
                    </div>
                  </td>
                  <td>{item.invited}</td>
                  <td>{item.completed}</td>
                  <td>{item.evaluation}</td>
                  <td>{item.pending}</td>
                  <td>{item.level}</td>
                  <td>{item.createdBy}</td>
                  <td><span className="qa-report-link">{item.assessmentReport}</span></td>
                  <td>{item.sampleQuestion}</td>
                  <td>
                    <span className={`qa-status-badge qa-status--${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.usedInPtc}</td>
                  <td>
                    <div className="qa-actions">
                      <button className="qa-action-btn" title="Edit"><Pencil size={15} /></button>
                      <button className="qa-action-btn" title="View"><Eye size={15} /></button>
                      <button className="qa-action-btn" title="Users"><Users size={15} /></button>
                      <button className="qa-action-btn" title="Add"><PlusCircle size={15} /></button>
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
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="pagination-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={14} className="pagination-select-icon" />
            </div>
            of 10 Events
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

export default QAAssessments;

