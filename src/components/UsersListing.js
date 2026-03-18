import React, { useState } from 'react';
import {
  Search,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import './UsersListing.css';

const USERS_DATA = [
  {
    name: 'Oliver Grant',
    firmName: 'Innovate Solutions Inc.',
    teamSize: '-',
    email: 'jessica.bright2023@example.com',
    phone: '(555) 123-4567',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 13, detail: '5 External / 8 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Mason Blake',
    firmName: 'Pinnacle Ventures LLC',
    teamSize: '5',
    email: 'michael.smith89@example.com',
    phone: '(555) 234-5678',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 2, detail: '0 External / 2 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Ethan Cole',
    firmName: 'Nexus Consulting Group',
    teamSize: '-',
    email: 'sarah.connor77@example.com',
    phone: '(555) 345-6789',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 5, detail: '0 External / 5 Teams' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Liam Hayes',
    firmName: 'Synergy Partners Ltd.',
    teamSize: '5',
    email: 'david.jones2023@example.com',
    phone: '(555) 456-7890',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 3, detail: '' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Noah Reed',
    firmName: 'Visionary Strategies Co...',
    teamSize: '-',
    email: 'emily.watson88@example.com',
    phone: '(555) 567-8901',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 2, detail: '1 External / 1 Teams' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Lucas Shaw',
    firmName: 'Elevate Enterprises LLC',
    teamSize: '-',
    email: 'robert.brown2023@example.com',
    phone: '(555) 678-9012',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 4, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
];

const StatusBadge = ({ status }) => {
  const isTeams = status === 'Teams';
  return (
    <span className={`status-badge ${isTeams ? 'status-badge--teams' : 'status-badge--standalone'}`}>
      {status}
    </span>
  );
};

const UsersListing = ({ onViewAssessment, onViewRevenue }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [teamSizeFilter, setTeamSizeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);
  const [statusOpen, setStatusOpen] = useState(false);
  const [teamSizeOpen, setTeamSizeOpen] = useState(false);

  const totalRevenue = '$54,945';
  const totalExternal = 6;
  const totalTeams = 16;

  const filteredUsers = USERS_DATA
    .filter((u) => !statusFilter || u.status === statusFilter)
    .filter((u) => !teamSizeFilter || u.teamSize === teamSizeFilter);

  return (
    <div className="users-listing">
      <div className="users-listing-fixed">
      {/* Header Row */}
      <div className="users-header">
        <h1 className="users-title">Users Listing</h1>

        <div className="users-header-right">
          {/* Stats Pills */}
          <div className="stats-pills">
            <div className="stat-pill">
              Total Revenue : <span className="stat-value stat-value--green">{totalRevenue}</span>
            </div>
            <div className="stat-pill">
              Total Users : <span className="stat-value stat-value--blue">{totalExternal}</span>{' '}
              External{' '}
              <span className="stat-divider">|</span>{' '}
              <span className="stat-value stat-value--blue">{totalTeams}</span>{' '}
              Teams
            </div>
          </div>

          {/* Search + Export */}
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
      <div className="filters-row">
        <div className="filters-left">
          {/* Status Dropdown */}
          <div className="filter-dropdown">
            <button
              className="filter-dropdown-btn"
              onClick={() => { setStatusOpen(!statusOpen); setTeamSizeOpen(false); }}
            >
              Status
              <ChevronDown size={16} />
            </button>
            {statusOpen && (
              <div className="filter-dropdown-menu">
                <div className="filter-dropdown-item" onClick={() => { setStatusFilter(''); setStatusOpen(false); }}>
                  All
                </div>
                <div className="filter-dropdown-item" onClick={() => { setStatusFilter('Teams'); setStatusOpen(false); }}>
                  Teams
                </div>
                <div className="filter-dropdown-item" onClick={() => { setStatusFilter('Standalone'); setStatusOpen(false); }}>
                  Standalone
                </div>
              </div>
            )}
          </div>

          {/* Team Size Dropdown */}
          <div className="filter-dropdown">
            <button
              className="filter-dropdown-btn"
              onClick={() => { setTeamSizeOpen(!teamSizeOpen); setStatusOpen(false); }}
            >
              Team Size
              <ChevronDown size={16} />
            </button>
            {teamSizeOpen && (
              <div className="filter-dropdown-menu">
                <div className="filter-dropdown-item" onClick={() => { setTeamSizeFilter(''); setTeamSizeOpen(false); }}>
                  All
                </div>
                <div className="filter-dropdown-item" onClick={() => { setTeamSizeFilter('5'); setTeamSizeOpen(false); }}>
                  5
                </div>
                <div className="filter-dropdown-item" onClick={() => { setTeamSizeFilter('-'); setTeamSizeOpen(false); }}>
                  -
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="filters-right">
          <button
            className="clear-all-btn"
            onClick={() => { setStatusFilter(''); setTeamSizeFilter(''); }}
          >
            Clear All
          </button>
          <button className="search-btn">Search</button>
        </div>
      </div>
      </div>

      <div className="users-listing-scrollable">
      {/* Table (Desktop / Tablet) */}
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Firm Name</th>
              <th>Team Size</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Signed up on</th>
              <th>Assigned Assessment</th>
              <th>Status</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx}>
                <td className="cell-name">{user.name}</td>
                <td className="cell-firm">{user.firmName}</td>
                <td className="cell-team-size">{user.teamSize}</td>
                <td className="cell-email">{user.email}</td>
                <td className="cell-phone">{user.phone}</td>
                <td className="cell-date">{user.signedUp}</td>
                <td className="cell-assessment">
                  <span className="assessment-link" onClick={() => onViewAssessment && onViewAssessment(user)}>View ({user.assessments.count})</span>
                  {user.assessments.detail && (
                    <span className="assessment-detail">{user.assessments.detail}</span>
                  )}
                </td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td className="cell-revenue">
                  <span className="revenue-link" onClick={() => onViewRevenue && onViewRevenue(user)}>{user.revenue}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="mobile-cards">
        {filteredUsers.map((user, idx) => (
          <div className="user-card" key={idx}>
            <div className="user-card-header">
              <span className="user-card-name">{user.name}</span>
              <span className="user-card-revenue">{user.revenue}</span>
            </div>
            <div className="user-card-body">
              <div className="user-card-field">
                <span className="user-card-label">Firm</span>
                <span className="user-card-value">{user.firmName}</span>
              </div>
              <div className="user-card-field">
                <span className="user-card-label">Team Size</span>
                <span className="user-card-value">{user.teamSize}</span>
              </div>
              <div className="user-card-field full-width">
                <span className="user-card-label">Email</span>
                <span className="user-card-value">{user.email}</span>
              </div>
              <div className="user-card-field">
                <span className="user-card-label">Phone</span>
                <span className="user-card-value">{user.phone}</span>
              </div>
              <div className="user-card-field">
                <span className="user-card-label">Signed Up</span>
                <span className="user-card-value">{user.signedUp}</span>
              </div>
              <div className="user-card-field">
                <span className="user-card-label">Assessment</span>
                <span className="user-card-value">
                  <span className="assessment-link">View ({user.assessments.count})</span>
                  {user.assessments.detail && (
                    <span className="assessment-detail"> {user.assessments.detail}</span>
                  )}
                </span>
              </div>
            </div>
            <div className="user-card-footer">
              <StatusBadge status={user.status} />
            </div>
          </div>
        ))}
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
          <button className="page-btn" disabled>
            <ChevronsLeft size={16} />
          </button>
          <button className="page-btn" disabled>
            <ChevronLeft size={16} />
          </button>
          <input
            type="text"
            className="page-input"
            value={currentPage}
            readOnly
          />
          <span className="page-of">of 01 pages</span>
          <button className="page-btn" disabled>
            <ChevronRight size={16} />
          </button>
          <button className="page-btn" disabled>
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UsersListing;
