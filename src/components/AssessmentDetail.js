import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import './AssessmentDetail.css';

const FIRM_ADMINS = [
  { name: 'Anya Petrova', email: 'inquiries@stellartech.net' },
  { name: 'Priya Sharma', email: 'service@innovatechsolutions...' },
  { name: 'Carlos Mendez', email: 'admin@globalventures.co' },
  { name: 'Lena Fischer', email: 'contact@brightpath.io' },
  { name: 'Tomoko Nakamura', email: 'info@nexuspartners.jp' },
];

const USER_NAMES = [
  { name: 'Esther Howard', email: 'support@sunnyhorizon.com' },
  { name: 'Robert Fox', email: 'info@blueoceanconsulting.com' },
  { name: 'Jane Cooper', email: 'contact@futuretechsolutions.com' },
  { name: 'Darlene Robertson', email: 'hello@elevateyourbusiness.com' },
  { name: 'Eleanor Pena', email: 'reachus@visionaryideas.com' },
  { name: 'Jacob Jones', email: 'queries@innovativeworld.com' },
  { name: 'Cameron Williams', email: 'cameron@brightpathsolutions.com' },
  { name: 'Brooklyn Simmons', email: 'brooklyn@nexusgroupllc.com' },
];

const SUBSCRIPTIONS = ['Teams', 'Standalone'];

const generateDetailData = (count, filterType) => {
  const data = [];
  const statuses = filterType === 'completions'
    ? ['Completed']
    : ['Pending', 'Lapsed', 'Completed'];

  for (let i = 0; i < count; i++) {
    const firm = FIRM_ADMINS[i % FIRM_ADMINS.length];
    const user = USER_NAMES[i % USER_NAMES.length];
    const status = statuses[i % statuses.length];
    const isCompleted = status === 'Completed';
    const isPassed = isCompleted ? Math.random() > 0.3 : false;
    const score = isCompleted ? `${Math.floor(Math.random() * 60 + 20)}%` : '-';
    const userType = i % 2 === 0 ? 'External' : 'Teams';
    const subscription = SUBSCRIPTIONS[i % 2];
    const revenue = userType === 'External' ? `$ ${Math.floor(Math.random() * 100 + 1)}` : '$ 0';

    const feedbackVariants = [
      {
        submitted: true,
        overallExperience: 4,
        assessmentClearBadge: 'Yes',
        assessmentClearText: null,
        hadIssuesBadge: 'Minor Issues',
        issueDetail: 'Slight lag during the screen transition.',
        improvement: 'Maybe add a few more example questions at the beginning.',
      },
      {
        submitted: true,
        overallExperience: 4,
        assessmentClearBadge: null,
        assessmentClearText: '-',
        hadIssuesBadge: 'No Issues',
        issueDetail: null,
        improvement: 'The terminology used in the second section regarding deferred tax assets was highly technical and seemed to conflict with standard GAAP definitions I\'m familiar with from previous certifications. Specifically, question 14 felt ambiguous because it didn\'t specify the jurisdiction clearly enough to provide a single correct answer without making assumptions.',
      },
      {
        submitted: false,
      },
    ];
    const feedback = feedbackVariants[i % 3];

    data.push({
      firmAdminName: firm.name,
      firmAdminEmail: firm.email,
      userName: user.name,
      userEmail: user.email,
      assignedOn: 'Nov 12, 2024',
      result: isCompleted ? (isPassed ? 'Pass' : 'Fail') : '-',
      score,
      status,
      completedOn: isCompleted ? 'Nov 12, 2024' : '-',
      userType,
      revenue,
      subscription,
      feedback,
    });
  }

  let external = 0;
  let teams = 0;
  data.forEach((d) => {
    if (d.userType === 'External') external++;
    else teams++;
  });

  const totalRevenue = data.reduce((sum, d) => {
    const val = parseInt(d.revenue.replace(/[$ ,]/g, ''), 10) || 0;
    return sum + val;
  }, 0);

  return { data, external, teams, totalRevenue: `$${totalRevenue.toLocaleString()}` };
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
  const classMap = {
    Completed: 'ad-status--completed',
    Pending: 'ad-status--pending',
    Lapsed: 'ad-status--lapsed',
  };
  return (
    <span className={`ad-status-badge ${classMap[status] || ''}`}>
      {status}
    </span>
  );
};

const SubscriptionBadge = ({ type }) => {
  const isTeams = type === 'Teams';
  return (
    <span className={`ad-sub-badge ${isTeams ? 'ad-sub-badge--teams' : 'ad-sub-badge--standalone'}`}>
      {type}
    </span>
  );
};

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? '#2563eb' : 'none'} stroke={star <= rating ? '#2563eb' : '#d1d5db'} strokeWidth="1.5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
  </div>
);

const FeedbackDrawer = ({ open, onClose, feedback, userName, assessmentName }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fb-overlay ${open ? 'fb-overlay--visible' : ''}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div className={`fb-drawer ${open ? 'fb-drawer--open' : ''}`}>
        {/* Header */}
        <div className="fb-header">
          <div>
            <h2 className="fb-title">Assessment Feedback</h2>
            <p className="fb-subtitle">{userName} • {assessmentName}</p>
          </div>
          <button className="fb-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="fb-divider" />

        {/* Body */}
        <div className="fb-body">
          {!feedback || !feedback.submitted ? (
            <div className="fb-empty">
              <div className="fb-empty-icon-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7162EA" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="4" y1="4" x2="20" y2="20" />
                </svg>
              </div>
              <p className="fb-empty-text">Feedback Not Submitted</p>
            </div>
          ) : (
            <ol className="fb-questions">
              {/* Q1 */}
              <li className="fb-question-item">
                <p className="fb-question-text">How was your overall experience?</p>
                <StarRating rating={feedback.overallExperience} />
              </li>

              {/* Q2 */}
              <li className="fb-question-item">
                <p className="fb-question-text">Was the assessment clear and effective?</p>
                {feedback.assessmentClearBadge ? (
                  <span className="fb-badge fb-badge--yes">{feedback.assessmentClearBadge}</span>
                ) : (
                  <div className="fb-text-box">{feedback.assessmentClearText}</div>
                )}
              </li>

              {/* Q3 */}
              <li className="fb-question-item">
                <p className="fb-question-text">Did you face any issues while performing?</p>
                <span className={`fb-badge ${feedback.hadIssuesBadge === 'No Issues' ? 'fb-badge--no-issues' : 'fb-badge--minor-issues'}`}>
                  {feedback.hadIssuesBadge}
                </span>
                {feedback.issueDetail && (
                  <div className="fb-text-box" style={{ marginTop: 10 }}>{feedback.issueDetail}</div>
                )}
              </li>

              {/* Q4 */}
              <li className="fb-question-item">
                <p className="fb-question-text">Is there anything we could improve?</p>
                {feedback.improvement && (
                  <div className="fb-text-box">{feedback.improvement}</div>
                )}
              </li>
            </ol>
          )}
        </div>
      </div>
    </>
  );
};

/* ===== CheckboxDropdown ===== */
const CheckboxDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="ad-filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`ad-filter-btn ${open ? 'ad-filter-btn--open' : ''} ${value.length > 0 ? 'ad-filter-btn--active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {label}{value.length > 0 ? ` (${value.length})` : ''}
        <ChevronDown size={16} className={open ? 'ad-chev-open' : ''} />
      </button>
      {open && (
        <div className="ad-dropdown-panel">
          {options.map((opt) => (
            <label key={opt} className="ad-checkbox-item">
              <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== DateRangePicker ===== */
const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CAL_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

const DateRangePicker = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [localStart, setLocalStart] = useState(value?.start || null);
  const [localEnd, setLocalEnd] = useState(value?.end || null);
  const today = new Date();
  const [leftMonth, setLeftMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const rightMonth = {
    month: (leftMonth.month + 1) % 12,
    year: leftMonth.month === 11 ? leftMonth.year + 1 : leftMonth.year,
  };

  const prevMonth = () => setLeftMonth((p) => ({
    month: p.month === 0 ? 11 : p.month - 1,
    year: p.month === 0 ? p.year - 1 : p.year,
  }));

  const nextMonth = () => setLeftMonth((p) => ({
    month: p.month === 11 ? 0 : p.month + 1,
    year: p.month === 11 ? p.year + 1 : p.year,
  }));

  const handleDayClick = (ds) => {
    if (!localStart || (localStart && localEnd)) {
      setLocalStart(ds);
      setLocalEnd(null);
    } else {
      if (ds < localStart) { setLocalEnd(localStart); setLocalStart(ds); }
      else setLocalEnd(ds);
    }
  };

  const effectiveEnd = localEnd || hovered;

  const isStart = (ds) => ds === localStart;
  const isEnd = (ds) => {
    if (!localStart || !effectiveEnd) return false;
    return ds === (localStart <= effectiveEnd ? effectiveEnd : localStart);
  };
  const isInRange = (ds) => {
    if (!localStart || !effectiveEnd) return false;
    const [s, e] = localStart <= effectiveEnd ? [localStart, effectiveEnd] : [effectiveEnd, localStart];
    return ds > s && ds < e;
  };

  const renderCalendar = ({ year, month }) => {
    const dim = getDaysInMonth(year, month);
    const fd = getFirstDay(year, month);
    const cells = [];
    for (let i = 0; i < fd; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(d);
    return (
      <div className="drp-calendar">
        <div className="drp-cal-title">{CAL_MONTHS[month]} {year}</div>
        <div className="drp-days-header">
          {CAL_DAYS.map((d) => <span key={d} className="drp-day-name">{d}</span>)}
        </div>
        <div className="drp-days-grid">
          {cells.map((d, i) => {
            if (!d) return <span key={i} className="drp-day drp-day--empty" />;
            const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const start = isStart(ds);
            const end = isEnd(ds);
            const inRange = isInRange(ds);
            return (
              <span
                key={i}
                className={`drp-day${start ? ' drp-day--start' : ''}${end ? ' drp-day--end' : ''}${inRange ? ' drp-day--in-range' : ''}`}
                onClick={() => handleDayClick(ds)}
                onMouseEnter={() => setHovered(ds)}
                onMouseLeave={() => setHovered(null)}
              >
                {d}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const fmtDate = (ds) => {
    if (!ds) return '';
    const [y, m, d] = ds.split('-');
    return `${CAL_MONTHS[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}, ${y}`;
  };

  const handleApply = () => {
    if (localStart) onChange({ start: localStart, end: localEnd || localStart });
    setOpen(false);
  };

  const handleClear = () => {
    setLocalStart(null);
    setLocalEnd(null);
    onChange(null);
  };

  const displayValue = value?.start
    ? `${fmtDate(value.start)}${value.end && value.end !== value.start ? ' – ' + fmtDate(value.end) : ''}`
    : label;

  return (
    <div className="ad-filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`ad-filter-btn ad-filter-btn--icon ${open ? 'ad-filter-btn--open' : ''} ${value ? 'ad-filter-btn--active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontSize: value ? 12 : undefined }}>{displayValue}</span>
        <Calendar size={14} />
      </button>
      {open && (
        <div className="ad-dropdown-panel ad-dropdown-panel--date">
          <div className="drp-body">
            <button className="drp-nav-btn drp-nav-btn--left" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <div className="drp-calendars">
              {renderCalendar(leftMonth)}
              {renderCalendar(rightMonth)}
            </div>
            <button className="drp-nav-btn drp-nav-btn--right" onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
          <div className="drp-footer">
            <button className="drp-clear-btn" onClick={handleClear}>Clear</button>
            <button className="drp-apply-btn" onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AssessmentDetail = ({ assessment, filterType, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFeedback, setActiveFeedback] = useState(null);

  // Filter states
  const [resultFilter, setResultFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [userTypeFilter, setUserTypeFilter] = useState([]);
  const [assignedRange, setAssignedRange] = useState(null);
  const [completedRange, setCompletedRange] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({
    search: '', result: [], status: [], userType: [], assignedRange: null, completedRange: null,
  });

  const count = filterType === 'completions'
    ? (assessment?.completions?.count || 6)
    : (assessment?.assigned?.count || 6);

  const { data: detailData, external: totalExternal, teams: totalTeams, totalRevenue } = useMemo(
    () => generateDetailData(Math.min(count, 50), filterType),
    [count, filterType]
  );

  const handleSearch = () => {
    setAppliedFilters({
      search: searchTerm,
      result: resultFilter,
      status: statusFilter,
      userType: userTypeFilter,
      assignedRange,
      completedRange,
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setResultFilter([]);
    setStatusFilter([]);
    setUserTypeFilter([]);
    setAssignedRange(null);
    setCompletedRange(null);
    setAppliedFilters({ search: '', result: [], status: [], userType: [], assignedRange: null, completedRange: null });
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return detailData.filter((item) => {
      if (appliedFilters.search) {
        const s = appliedFilters.search.toLowerCase();
        if (!item.firmAdminName.toLowerCase().includes(s) &&
            !item.userName.toLowerCase().includes(s) &&
            !item.firmAdminEmail.toLowerCase().includes(s) &&
            !item.userEmail.toLowerCase().includes(s)) return false;
      }
      if (appliedFilters.result.length > 0 && !appliedFilters.result.includes(item.result)) return false;
      if (appliedFilters.status.length > 0 && !appliedFilters.status.includes(item.status)) return false;
      if (appliedFilters.userType.length > 0 && !appliedFilters.userType.includes(item.userType)) return false;
      return true;
    });
  }, [detailData, appliedFilters]);

  const totalUsers = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / perPage));

  return (
    <div className="assessment-detail">
      <div className="ad-fixed">
        {/* Header */}
        <div className="ad-header">
          <div className="ad-header-left">
            <button className="ad-back-btn" onClick={onBack}>
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <h1 className="ad-title">Assigned Assessment</h1>
          </div>

          <div className="ad-header-right">
            <div className="stats-pills">
              <div className="stat-pill">
                Total Revenue : <span className="stat-value stat-value--green">{totalRevenue}</span>
              </div>
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

        {/* Filters */}
        <div className="ad-filters-row">
          <div className="ad-filters-left">
            <DateRangePicker
              label="Assigned On"
              value={assignedRange}
              onChange={setAssignedRange}
            />
            <DateRangePicker
              label="Completed On"
              value={completedRange}
              onChange={setCompletedRange}
            />
            <CheckboxDropdown
              label="Result"
              options={['Pass', 'Fail', "Doesn't Match", 'Below Expectations', 'Meets Expectations', 'Exceeds Expectations']}
              value={resultFilter}
              onChange={setResultFilter}
            />
            <CheckboxDropdown
              label="Status"
              options={['Pending', 'Completed', 'Lapsed – Not Attempted']}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <CheckboxDropdown
              label="User Type"
              options={['External', 'Teams']}
              value={userTypeFilter}
              onChange={setUserTypeFilter}
            />
          </div>

          <div className="ad-filters-right">
            <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="ad-scrollable">
        {/* Table */}
        <div className="ad-table-area">
          <table className="users-table ad-table">
            <thead>
              <tr>
                <th>Firm Admin Name</th>
                <th>Name</th>
                <th>Assigned On</th>
                <th>Result</th>
                <th>Score</th>
                <th>Status</th>
                <th>Completed On</th>
                <th>User Type</th>
                <th>Revenue</th>
                <th>Feedback</th>
                <th>Subscription</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice((currentPage - 1) * perPage, currentPage * perPage).map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="ad-name-cell">
                      <span className="cell-name">{item.firmAdminName}</span>
                      <span className="ad-email">{item.firmAdminEmail}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ad-name-cell">
                      <span className="cell-name">{item.userName}</span>
                      <span className="ad-email">{item.userEmail}</span>
                    </div>
                  </td>
                  <td className="cell-date">{item.assignedOn}</td>
                  <td><ResultBadge result={item.result} /></td>
                  <td>{item.score}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td className="cell-date">{item.completedOn}</td>
                  <td>{item.userType}</td>
                  <td className="cell-revenue">{item.revenue}</td>
                  <td><span className="ad-feedback-link" onClick={() => setActiveFeedback(item)}>View</span></td>
                  <td><SubscriptionBadge type={item.subscription} /></td>
                  <td>
                    <button className="ad-download-btn">
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
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="pagination-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={14} className="pagination-select-icon" />
            </div>
            {' '}{totalUsers === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalUsers)} of {totalUsers} Events
          </div>

          <div className="pagination-right">
            <button className="page-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}><ChevronsLeft size={16} /></button>
            <button className="page-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft size={16} /></button>
            <input type="text" className="page-input" value={currentPage} readOnly />
            <span className="page-of">of {String(totalPages).padStart(2, '0')} pages</span>
            <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight size={16} /></button>
            <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}><ChevronsRight size={16} /></button>
          </div>
        </div>
      </div>
      <FeedbackDrawer
        open={activeFeedback !== null}
        onClose={() => setActiveFeedback(null)}
        feedback={activeFeedback?.feedback}
        userName={activeFeedback?.userName || ''}
        assessmentName="Fundamentals of Financial Audit"
      />
    </div>
  );
};

export default AssessmentDetail;
