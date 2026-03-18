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

const AssessmentDetail = ({ assessment, filterType, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);

  const count = filterType === 'completions'
    ? (assessment?.completions?.count || 6)
    : (assessment?.assigned?.count || 6);

  const { data: detailData, external: totalExternal, teams: totalTeams, totalRevenue } = useMemo(
    () => generateDetailData(Math.min(count, 50), filterType),
    [count, filterType]
  );

  const totalUsers = detailData.length;
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
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn">
                Assessment Name
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn">
                Subscription
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn ad-filter-btn--icon">
                Assigned On
                <Calendar size={14} />
              </button>
            </div>
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn ad-filter-btn--icon">
                Completed On
                <Calendar size={14} />
              </button>
            </div>
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn">
                Result
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn">
                Status
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="ad-filter-dropdown">
              <button className="ad-filter-btn">
                User Type
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="ad-filters-right">
            <button className="clear-all-btn">Clear All</button>
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      <div className="ad-scrollable">
        {/* Table */}
        <div className="table-wrapper">
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
              {detailData.slice(0, perPage).map((item, idx) => (
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
                  <td><span className="ad-feedback-link">View</span></td>
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

export default AssessmentDetail;
