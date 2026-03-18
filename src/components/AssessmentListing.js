import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import './AssessmentListing.css';

const ASSESSMENT_DATA = [
  {
    name: 'Governmental Accounting an...',
    level: 'Basic',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 124,
    revenue: '$12,276',
    assigned: { count: 450, detail: '124 External / 52 Teams' },
    completions: { count: 380, detail: '100 External / 5 Teams' },
    engagementPercent: 84,
    status: 'Active',
  },
  {
    name: 'Accounting Fundamentals fo...',
    level: 'Intermediate',
    domain: 'Auditing',
    lastUpdated: 'Nov 12, 2024',
    purchases: 89,
    revenue: '$8,811',
    assigned: { count: 210, detail: '89 External / 25 Teams' },
    completions: { count: 195, detail: '0 External / 5 Teams' },
    engagementPercent: 93,
    status: 'Active',
  },
  {
    name: 'Ethics and Professional Con...',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Nov 12, 2024',
    purchases: 230,
    revenue: '$22,770',
    assigned: { count: 800, detail: '230 External / 15 Teams' },
    completions: { count: 720, detail: '0 External / 5 Teams' },
    engagementPercent: 90,
    status: 'Active',
  },
  {
    name: 'Emerging Trends in Financial...',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Nov 12, 2024',
    purchases: '-',
    revenue: '-',
    assigned: { count: '-', detail: '' },
    completions: { count: '-', detail: '' },
    engagementPercent: null,
    status: 'Draft',
  },
  {
    name: 'Consolidated Financial State...',
    level: 'Basic',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 45,
    revenue: '$4,455',
    assigned: { count: 120, detail: '45 External / 3 Teams' },
    completions: { count: 105, detail: '0 External / 5 Teams' },
    engagementPercent: 88,
    status: 'Inactive',
  },
  {
    name: 'Lease Accounting and Repor...',
    level: 'Intermediate',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 67,
    revenue: '$6,633',
    assigned: { count: 150, detail: '67 External / 5 Teams' },
    completions: { count: 140, detail: '0 External / 5 Teams' },
    engagementPercent: 93,
    status: 'Active',
  },
];

const StatusBadge = ({ status }) => {
  const classMap = {
    Active: 'al-status--active',
    Draft: 'al-status--draft',
    Inactive: 'al-status--inactive',
  };
  return (
    <span className={`al-status-badge ${classMap[status] || ''}`}>
      {status}
    </span>
  );
};

const EngagementBar = ({ percent }) => {
  if (percent === null || percent === undefined) return <span>-</span>;
  return (
    <div className="al-engagement">
      <div className="al-engagement-bar">
        <div className="al-engagement-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="al-engagement-text">{percent}% Success Rate</span>
    </div>
  );
};

const AssessmentListing = ({ onViewAssigned, onViewCompletions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);

  const totalRevenue = '$54,945';
  const totalAssigned = 571;
  const totalExternal = 555;
  const totalTeams = 16;

  return (
    <div className="assessment-listing">
      <div className="al-fixed">
        {/* Header */}
        <div className="al-header">
          <h1 className="al-title">Assessment Listing</h1>

          <div className="al-header-right">
            <div className="stats-pills">
              <div className="stat-pill">
                Total Revenue : <span className="stat-value stat-value--green">{totalRevenue}</span>
              </div>
              <div className="stat-pill">
                Total Assigned ({totalAssigned}) : <span className="stat-value stat-value--blue">{totalExternal}</span>{' '}
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
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="filters-left">
            <div className="filter-dropdown">
              <button className="filter-dropdown-btn">
                Level
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="filter-dropdown">
              <button className="filter-dropdown-btn">
                Domain
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="filter-dropdown">
              <button className="filter-dropdown-btn">
                Status
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="filters-right">
            <button className="clear-all-btn">Clear All</button>
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      <div className="al-scrollable">
        {/* Table */}
        <div className="table-wrapper">
          <table className="users-table al-table">
            <thead>
              <tr>
                <th>Assessment Name</th>
                <th>Level</th>
                <th>Domain</th>
                <th>Last Updated</th>
                <th>Purchases</th>
                <th>Revenue</th>
                <th>Assigned</th>
                <th>Completions</th>
                <th>Engagement %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ASSESSMENT_DATA.map((item, idx) => (
                <tr key={idx}>
                  <td className="cell-name">{item.name}</td>
                  <td>{item.level}</td>
                  <td>{item.domain}</td>
                  <td className="cell-date">{item.lastUpdated}</td>
                  <td>{item.purchases}</td>
                  <td>
                    <span className={item.revenue !== '-' ? 'al-revenue-link' : ''}>
                      {item.revenue}
                    </span>
                  </td>
                  <td>
                    <div className="al-assigned-cell">
                      <span
                        className={item.assigned.count !== '-' ? 'al-count-link' : ''}
                        onClick={() => item.assigned.count !== '-' && onViewAssigned && onViewAssigned(item)}
                      >
                        {item.assigned.count}
                      </span>
                      {item.assigned.detail && (
                        <span className="al-count-detail">{item.assigned.detail}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="al-assigned-cell">
                      <span
                        className={item.completions.count !== '-' ? 'al-count-link' : ''}
                        onClick={() => item.completions.count !== '-' && onViewCompletions && onViewCompletions(item)}
                      >
                        {item.completions.count}
                      </span>
                      {item.completions.detail && (
                        <span className="al-count-detail">{item.completions.detail}</span>
                      )}
                    </div>
                  </td>
                  <td><EngagementBar percent={item.engagementPercent} /></td>
                  <td><StatusBadge status={item.status} /></td>
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

export default AssessmentListing;
