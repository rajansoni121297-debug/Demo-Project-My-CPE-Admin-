import React, { useState, useMemo } from 'react';
import {
  Search,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Calendar,
  Download,
} from 'lucide-react';
import './AssignedAssessment.css';

const ASSESSMENT_NAMES = [
  'Fundamentals of Financial Audit',
  'Tax Research & Citation',
  'Individual Tax',
  'Practical Application of the COS...',
  'State & Local Tax (SALT)',
  'Payroll & Employment Tax',
  'Corporate Tax Compliance',
  'Audit Planning & Risk Assessment',
  'Ethics in Accounting',
  'Advanced Financial Reporting',
  'International Tax Regulations',
  'Forensic Accounting Basics',
  'Government Auditing Standards',
];

const NAMES_EMAILS = [
  { name: 'Esther Howard', email: 'support@sunnyhorizon...' },
  { name: 'Robert Fox', email: 'info@blueoceanconsul...' },
  { name: 'Jane Cooper', email: 'contact@futuretechsol...' },
  { name: 'Darlene Robertson', email: 'hello@elevateyourbusi...' },
  { name: 'Eleanor Pena', email: 'reachus@visionaryidea...' },
  { name: 'Jacob Jones', email: 'queries@innovativewo...' },
  { name: 'Cameron Williams', email: 'cameron@brightpath...' },
  { name: 'Brooklyn Simmons', email: 'brooklyn@nexusgroup...' },
  { name: 'Leslie Alexander', email: 'leslie@pinnaclevent...' },
  { name: 'Guy Hawkins', email: 'guy@synergypartners...' },
  { name: 'Kristin Watson', email: 'kristin@visionaryst...' },
  { name: 'Savannah Nguyen', email: 'savannah@elevatent...' },
  { name: 'Courtney Henry', email: 'courtney@innovates...' },
];

const generateAssessmentData = (count, userDetail) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const person = NAMES_EMAILS[i % NAMES_EMAILS.length];
    const assessmentName = ASSESSMENT_NAMES[i % ASSESSMENT_NAMES.length];
    const isCompleted = Math.random() > 0.4;
    const isPassed = isCompleted ? Math.random() > 0.3 : false;
    const score = isCompleted ? `${Math.floor(Math.random() * 60 + 20)}%` : '-';
    const userTypes = ['External', 'Teams'];

    data.push({
      name: person.name,
      email: person.email,
      assessmentName,
      type: 'MCQ',
      assignedOn: 'Nov 12, 2024',
      result: isCompleted ? (isPassed ? 'Pass' : 'Fail') : '-',
      score,
      status: isCompleted ? 'Completed' : 'Pending',
      completedOn: isCompleted ? 'Nov 12, 2024' : '-',
      userType: userTypes[i % 2],
    });
  }

  // Calculate totals from detail string if available
  let external = 0;
  let teams = 0;
  if (userDetail) {
    const extMatch = userDetail.match(/(\d+)\s*External/);
    const teamMatch = userDetail.match(/(\d+)\s*Teams/);
    if (extMatch) external = parseInt(extMatch[1], 10);
    if (teamMatch) teams = parseInt(teamMatch[1], 10);
  } else {
    data.forEach((d) => {
      if (d.userType === 'External') external++;
      else teams++;
    });
  }

  return { data, external, teams };
};

const ResultBadge = ({ result }) => {
  if (result === '-') return <span>-</span>;
  const isPass = result === 'Pass';
  return (
    <span className={`result-badge ${isPass ? 'result-badge--pass' : 'result-badge--fail'}`}>
      {result}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const isCompleted = status === 'Completed';
  return (
    <span className={`aa-status-badge ${isCompleted ? 'aa-status-badge--completed' : 'aa-status-badge--pending'}`}>
      {status}
    </span>
  );
};

const AssignedAssessment = ({ user, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);

  const count = user?.assessments?.count || 6;
  const detail = user?.assessments?.detail || '';

  const { data: assessmentData, external: totalExternal, teams: totalTeams } = useMemo(
    () => generateAssessmentData(count, detail),
    [count, detail]
  );

  const totalUsers = assessmentData.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / perPage));

  return (
    <div className="assigned-assessment">
      <div className="aa-fixed">
      {/* Header */}
      <div className="aa-header">
        <div className="aa-header-left">
          <button className="aa-back-btn" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <h1 className="aa-title">Assigned Assessment{user?.name ? ` (${user.name})` : ''}</h1>
        </div>

        <div className="aa-header-right">
          <div className="stats-pills">
            <div className="stat-pill">
              Total Users ({totalUsers}) : <span className="stat-value stat-value--blue">{totalExternal}</span>{' '}
              External{' '}
              <span className="stat-divider">|</span>{' '}
              <span className="stat-value stat-value--blue">{totalTeams}</span>{' '}
              Teams
            </div>
          </div>

          <div className="header-search-export">
            <div className="header-search">
              <input
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="header-search-input"
              />
              <Search size={18} className="header-search-icon" />
            </div>
            <button className="export-btn">
              <Upload size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="aa-filters-row">
        <div className="aa-filters-left">
          <div className="aa-filter-dropdown">
            <button className="aa-filter-btn">
              Assessment Name
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="aa-filter-dropdown">
            <button className="aa-filter-btn aa-filter-btn--icon">
              Assigned On
              <Calendar size={14} />
            </button>
          </div>
          <div className="aa-filter-dropdown">
            <button className="aa-filter-btn aa-filter-btn--icon">
              Completed On
              <Calendar size={14} />
            </button>
          </div>
          <div className="aa-filter-dropdown">
            <button className="aa-filter-btn">
              Result
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="aa-filter-dropdown">
            <button className="aa-filter-btn">
              Status
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="aa-filter-dropdown">
            <button className="aa-filter-btn">
              User Type
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="aa-filters-right">
          <button className="clear-all-btn">Clear All</button>
          <button className="search-btn">Search</button>
        </div>
      </div>
      </div>

      <div className="aa-scrollable">
      {/* Table */}
      <div className="table-wrapper">
        <table className="users-table aa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Assessment Name</th>
              <th>Type</th>
              <th>Assigned On</th>
              <th>Result</th>
              <th>Score</th>
              <th>Status</th>
              <th>Completed On</th>
              <th>User Type</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assessmentData.slice(0, perPage).map((item, idx) => (
              <tr key={idx}>
                <td>
                  <div className="aa-name-cell">
                    <span className="cell-name">{item.name}</span>
                    <span className="aa-email">{item.email}</span>
                  </div>
                </td>
                <td className="cell-firm">{item.assessmentName}</td>
                <td>{item.type}</td>
                <td className="cell-date">{item.assignedOn}</td>
                <td><ResultBadge result={item.result} /></td>
                <td>{item.score}</td>
                <td><StatusBadge status={item.status} /></td>
                <td className="cell-date">{item.completedOn}</td>
                <td>{item.userType}</td>
                <td><span className="aa-feedback-link">View</span></td>
                <td>
                  <button className="aa-download-btn">
                    <Download size={16} />
                  </button>
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
          of {totalUsers} Events
        </div>

        <div className="pagination-right">
          <button className="page-btn" disabled><ChevronsLeft size={16} /></button>
          <button className="page-btn" disabled><ChevronLeft size={16} /></button>
          <input type="text" className="page-input" value={currentPage} readOnly />
          <span className="page-of">of {String(totalPages).padStart(2, '0')} pages</span>
          <button className="page-btn" disabled><ChevronRight size={16} /></button>
          <button className="page-btn" disabled><ChevronsRight size={16} /></button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AssignedAssessment;
