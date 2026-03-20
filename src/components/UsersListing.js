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
  {
    name: 'Ava Mitchell',
    firmName: 'Brightfield Advisory LLC',
    teamSize: '5',
    email: 'ava.mitchell@brightfieldadv.com',
    phone: '(555) 789-0123',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 7, detail: '3 External / 4 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'James Porter',
    firmName: 'Keystone Tax Partners',
    teamSize: '-',
    email: 'james.porter@keystonetax.com',
    phone: '(555) 890-1234',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 2, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Sophia Turner',
    firmName: 'Meridian Accounting Group',
    teamSize: '5',
    email: 'sophia.turner@meridianacct.com',
    phone: '(555) 901-2345',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 9, detail: '4 External / 5 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'William Carter',
    firmName: 'Summit Financial Services',
    teamSize: '-',
    email: 'william.carter@summitfin.com',
    phone: '(555) 012-3456',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 3, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Isabella Moore',
    firmName: 'Clearview CPA Firm',
    teamSize: '5',
    email: 'isabella.moore@clearviewcpa.com',
    phone: '(555) 123-6789',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 11, detail: '5 External / 6 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'Henry Bennett',
    firmName: 'Pinnacle Tax Consultants',
    teamSize: '-',
    email: 'henry.bennett@pinnacletax.com',
    phone: '(555) 234-7890',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 1, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Mia Thompson',
    firmName: 'Atlas Audit Partners',
    teamSize: '5',
    email: 'mia.thompson@atlasaudit.com',
    phone: '(555) 345-8901',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 6, detail: '2 External / 4 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Alexander Ross',
    firmName: 'Horizon Accounting LLC',
    teamSize: '-',
    email: 'alexander.ross@horizonacct.com',
    phone: '(555) 456-9012',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 4, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Charlotte Hughes',
    firmName: 'Apex Finance Group',
    teamSize: '5',
    email: 'charlotte.hughes@apexfin.com',
    phone: '(555) 567-0123',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 8, detail: '3 External / 5 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'Benjamin Ward',
    firmName: 'Northgate CPA Associates',
    teamSize: '-',
    email: 'benjamin.ward@northgatecpa.com',
    phone: '(555) 678-1234',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 2, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Amelia Rivera',
    firmName: 'Crossroads Tax Solutions',
    teamSize: '5',
    email: 'amelia.rivera@crossroadstax.com',
    phone: '(555) 789-2345',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 14, detail: '7 External / 7 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Daniel Kim',
    firmName: 'Westbrook Audit LLC',
    teamSize: '-',
    email: 'daniel.kim@westbrookaudit.com',
    phone: '(555) 890-3456',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 5, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Harper Collins',
    firmName: 'Blueridge Tax Group',
    teamSize: '5',
    email: 'harper.collins@blueridgetax.com',
    phone: '(555) 901-4567',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 10, detail: '4 External / 6 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'Samuel Evans',
    firmName: 'Riverdale Finance Co.',
    teamSize: '-',
    email: 'samuel.evans@riverdalefin.com',
    phone: '(555) 012-5678',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 3, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Grace Nelson',
    firmName: 'Trident Accounting Partners',
    teamSize: '5',
    email: 'grace.nelson@tridentacct.com',
    phone: '(555) 123-6780',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 12, detail: '6 External / 6 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Christopher Young',
    firmName: 'Sterling Tax Advisors',
    teamSize: '-',
    email: 'christopher.young@sterlingtax.com',
    phone: '(555) 234-7891',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 1, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Lily Martinez',
    firmName: 'Crestwood CPA Group',
    teamSize: '5',
    email: 'lily.martinez@crestwoodcpa.com',
    phone: '(555) 345-8902',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 9, detail: '4 External / 5 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'Andrew Walker',
    firmName: 'Lakewood Tax Solutions',
    teamSize: '-',
    email: 'andrew.walker@lakewoodtax.com',
    phone: '(555) 456-9013',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 4, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Zoe Adams',
    firmName: 'Greenfield Accounting LLC',
    teamSize: '5',
    email: 'zoe.adams@greenfieldasct.com',
    phone: '(555) 567-0124',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 16, detail: '8 External / 8 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Ryan Scott',
    firmName: 'Harbourview Tax Partners',
    teamSize: '-',
    email: 'ryan.scott@harbourviewtax.com',
    phone: '(555) 678-1235',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 2, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Chloe Baker',
    firmName: 'Redwood CPA Associates',
    teamSize: '5',
    email: 'chloe.baker@redwoodcpa.com',
    phone: '(555) 789-2346',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 7, detail: '3 External / 4 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'Nathan Hall',
    firmName: 'Ironwood Financial Group',
    teamSize: '-',
    email: 'nathan.hall@ironwoodfin.com',
    phone: '(555) 890-3457',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 5, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Ellie Green',
    firmName: 'Maple Leaf Tax Advisors',
    teamSize: '5',
    email: 'ellie.green@mapleleaftax.com',
    phone: '(555) 901-4568',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 11, detail: '5 External / 6 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Kevin White',
    firmName: 'Falcon Ridge Accounting',
    teamSize: '-',
    email: 'kevin.white@falconridgeacct.com',
    phone: '(555) 012-5679',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 3, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Penelope Harris',
    firmName: 'Oakdale Financial Services',
    teamSize: '5',
    email: 'penelope.harris@oakdalefin.com',
    phone: '(555) 123-6781',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 13, detail: '6 External / 7 Teams' },
    status: 'Teams',
    revenue: '$499',
  },
  {
    name: 'Tyler Lewis',
    firmName: 'Sunridge CPA Firm',
    teamSize: '-',
    email: 'tyler.lewis@sunridgecpa.com',
    phone: '(555) 234-7892',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 2, detail: '' },
    status: 'Standalone',
    revenue: '$199',
  },
  {
    name: 'Natalie Robinson',
    firmName: 'Wavecrest Tax Solutions',
    teamSize: '5',
    email: 'natalie.robinson@wavecreasttax.com',
    phone: '(555) 345-8903',
    signedUp: 'Jan 15, 2025',
    assessments: { count: 8, detail: '3 External / 5 Teams' },
    status: 'Teams',
    revenue: '$297',
  },
  {
    name: 'Dylan Clark',
    firmName: 'Pinehurst Audit LLC',
    teamSize: '-',
    email: 'dylan.clark@pinehurstaudit.com',
    phone: '(555) 456-9014',
    signedUp: 'Nov 12, 2024',
    assessments: { count: 6, detail: '' },
    status: 'Standalone',
    revenue: '$297',
  },
  {
    name: 'Layla Wright',
    firmName: 'Cornerstone Accounting Group',
    teamSize: '5',
    email: 'layla.wright@cornerstoneacct.com',
    phone: '(555) 567-0125',
    signedUp: 'Dec 3, 2024',
    assessments: { count: 15, detail: '7 External / 8 Teams' },
    status: 'Teams',
    revenue: '$499',
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
    .filter((u) => !teamSizeFilter || u.teamSize === teamSizeFilter)
    .filter((u) => !searchTerm || (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ));

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
            onClick={() => { setStatusFilter(''); setTeamSizeFilter(''); setSearchTerm(''); }}
          >
            Clear All
          </button>
          <button className="search-btn">Search</button>
        </div>
      </div>
      </div>

      <div className="users-listing-scrollable">
      {/* Table (Desktop / Tablet) */}
      <div className="users-table-area">
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
