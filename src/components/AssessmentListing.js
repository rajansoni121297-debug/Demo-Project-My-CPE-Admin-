import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
    assigned: { count: 450, detail: '350 External / 100 Teams' },
    completions: { count: 380, detail: '295 External / 85 Teams' },
    engagementPercent: 84,
    status: 'Active',
    mappedProfiles: ['Staff Accountant', 'Junior Accountant'],
  },
  {
    name: 'Accounting Fundamentals fo...',
    level: 'Intermediate',
    domain: 'Auditing',
    lastUpdated: 'Nov 12, 2024',
    purchases: 89,
    revenue: '$8,811',
    assigned: { count: 210, detail: '160 External / 50 Teams' },
    completions: { count: 195, detail: '148 External / 47 Teams' },
    engagementPercent: 93,
    status: 'Active',
    mappedProfiles: ['Audit Associate', 'Audit Senior', 'Audit Supervisor', 'Audit Manager'],
  },
  {
    name: 'Ethics and Professional Con...',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Nov 12, 2024',
    purchases: 230,
    revenue: '$22,770',
    assigned: { count: 800, detail: '595 External / 205 Teams' },
    completions: { count: 720, detail: '535 External / 185 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Tax Manager', 'Tax Director', 'Senior Tax Manager', 'Tax Supervisor', 'Partner – Tax Advisory & Compliance', 'Senior Tax Accountant', 'Junior Tax Accountant', 'Tax Associate', 'Tax Intern', 'CPA'],
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
    mappedProfiles: [],
  },
  {
    name: 'Consolidated Financial State...',
    level: 'Basic',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 45,
    revenue: '$4,455',
    assigned: { count: 120, detail: '88 External / 32 Teams' },
    completions: { count: 105, detail: '77 External / 28 Teams' },
    engagementPercent: 88,
    status: 'Inactive',
    mappedProfiles: ['Accounting Intern', 'Staff Accountant', 'Junior Accountant'],
  },
  {
    name: 'Lease Accounting and Repor...',
    level: 'Intermediate',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 67,
    revenue: '$6,633',
    assigned: { count: 150, detail: '110 External / 40 Teams' },
    completions: { count: 140, detail: '103 External / 37 Teams' },
    engagementPercent: 93,
    status: 'Active',
    mappedProfiles: ['Senior Accountant', 'Account Manager', 'Account Supervisor', 'Finance Manager', 'Accounting Director', 'CFO'],
  },
  {
    name: 'Individual Income Tax – Form 1040',
    level: 'Basic',
    domain: 'Tax',
    lastUpdated: 'Dec 3, 2024',
    purchases: 98,
    revenue: '$9,702',
    assigned: { count: 310, detail: '228 External / 82 Teams' },
    completions: { count: 280, detail: '205 External / 75 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Junior Tax Accountant', 'Tax Associate', 'Tax Intern'],
  },
  {
    name: 'Partnership Tax – Schedule K-1',
    level: 'Intermediate',
    domain: 'Tax',
    lastUpdated: 'Dec 3, 2024',
    purchases: 54,
    revenue: '$5,346',
    assigned: { count: 180, detail: '132 External / 48 Teams' },
    completions: { count: 162, detail: '118 External / 44 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Tax Manager', 'Tax Supervisor', 'Senior Tax Accountant'],
  },
  {
    name: 'Corporate Tax – Form 1120',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Jan 15, 2025',
    purchases: 76,
    revenue: '$7,524',
    assigned: { count: 240, detail: '175 External / 65 Teams' },
    completions: { count: 210, detail: '153 External / 57 Teams' },
    engagementPercent: 88,
    status: 'Active',
    mappedProfiles: ['Tax Director', 'Senior Tax Manager', 'Tax Manager', 'Partner – Tax Advisory & Compliance'],
  },
  {
    name: 'Estate & Gift Tax Fundamentals',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Jan 15, 2025',
    purchases: 32,
    revenue: '$3,168',
    assigned: { count: 95, detail: '70 External / 25 Teams' },
    completions: { count: 80, detail: '58 External / 22 Teams' },
    engagementPercent: 84,
    status: 'Active',
    mappedProfiles: ['Tax Director', 'Senior Tax Manager'],
  },
  {
    name: 'Payroll Tax Compliance',
    level: 'Basic',
    domain: 'Tax',
    lastUpdated: 'Nov 12, 2024',
    purchases: 112,
    revenue: '$11,088',
    assigned: { count: 390, detail: '285 External / 105 Teams' },
    completions: { count: 355, detail: '260 External / 95 Teams' },
    engagementPercent: 91,
    status: 'Active',
    mappedProfiles: ['Tax Associate', 'Junior Tax Accountant', 'Tax Intern', 'Staff Accountant', 'Accounting Intern'],
  },
  {
    name: 'Multistate Tax Nexus & Apportionment',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Dec 3, 2024',
    purchases: '-',
    revenue: '-',
    assigned: { count: '-', detail: '' },
    completions: { count: '-', detail: '' },
    engagementPercent: null,
    status: 'Draft',
    mappedProfiles: [],
  },
  {
    name: 'Sales & Use Tax Fundamentals',
    level: 'Basic',
    domain: 'Tax',
    lastUpdated: 'Jan 15, 2025',
    purchases: 88,
    revenue: '$8,712',
    assigned: { count: 275, detail: '200 External / 75 Teams' },
    completions: { count: 248, detail: '180 External / 68 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Junior Tax Accountant', 'Tax Associate'],
  },
  {
    name: 'Tax Credits & Deductions Overview',
    level: 'Basic',
    domain: 'Tax',
    lastUpdated: 'Nov 12, 2024',
    purchases: 140,
    revenue: '$13,860',
    assigned: { count: 480, detail: '348 External / 132 Teams' },
    completions: { count: 432, detail: '314 External / 118 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Tax Intern', 'Tax Associate', 'Junior Tax Accountant', 'Tax Supervisor', 'Senior Tax Accountant', 'Tax Manager'],
  },
  {
    name: 'International Tax – GILTI & BEAT',
    level: 'Advance',
    domain: 'Tax',
    lastUpdated: 'Jan 15, 2025',
    purchases: '-',
    revenue: '-',
    assigned: { count: '-', detail: '' },
    completions: { count: '-', detail: '' },
    engagementPercent: null,
    status: 'Draft',
    mappedProfiles: [],
  },
  {
    name: 'Revenue Recognition – ASC 606',
    level: 'Intermediate',
    domain: 'Accounting',
    lastUpdated: 'Dec 3, 2024',
    purchases: 95,
    revenue: '$9,405',
    assigned: { count: 320, detail: '233 External / 87 Teams' },
    completions: { count: 295, detail: '215 External / 80 Teams' },
    engagementPercent: 92,
    status: 'Active',
    mappedProfiles: ['Account Manager', 'Senior Accountant', 'Account Supervisor'],
  },
  {
    name: 'Lease Accounting – ASC 842',
    level: 'Intermediate',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 72,
    revenue: '$7,128',
    assigned: { count: 230, detail: '167 External / 63 Teams' },
    completions: { count: 207, detail: '150 External / 57 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Account Manager', 'Finance Manager', 'Senior Accountant'],
  },
  {
    name: 'Financial Statement Analysis Basics',
    level: 'Basic',
    domain: 'Accounting',
    lastUpdated: 'Jan 15, 2025',
    purchases: 160,
    revenue: '$15,840',
    assigned: { count: 540, detail: '393 External / 147 Teams' },
    completions: { count: 486, detail: '354 External / 132 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Staff Accountant', 'Junior Accountant', 'Accounting Intern'],
  },
  {
    name: 'Consolidations & Intercompany Elim...',
    level: 'Advance',
    domain: 'Accounting',
    lastUpdated: 'Dec 3, 2024',
    purchases: 48,
    revenue: '$4,752',
    assigned: { count: 145, detail: '105 External / 40 Teams' },
    completions: { count: 128, detail: '93 External / 35 Teams' },
    engagementPercent: 88,
    status: 'Active',
    mappedProfiles: ['Accounting Director', 'Finance Manager', 'CFO', 'Partner – Accounting & Advisory'],
  },
  {
    name: 'Business Combinations – ASC 805',
    level: 'Advance',
    domain: 'Accounting',
    lastUpdated: 'Jan 15, 2025',
    purchases: 38,
    revenue: '$3,762',
    assigned: { count: 110, detail: '80 External / 30 Teams' },
    completions: { count: 95, detail: '69 External / 26 Teams' },
    engagementPercent: 86,
    status: 'Active',
    mappedProfiles: ['Accounting Director', 'Finance Manager', 'Partner – Accounting & Advisory', 'CFO'],
  },
  {
    name: 'Government & Nonprofit Accounting',
    level: 'Intermediate',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 55,
    revenue: '$5,445',
    assigned: { count: 170, detail: '124 External / 46 Teams' },
    completions: { count: 150, detail: '109 External / 41 Teams' },
    engagementPercent: 88,
    status: 'Active',
    mappedProfiles: ['Senior Accountant', 'Account Supervisor'],
  },
  {
    name: 'Managerial Accounting & Cost Analysis',
    level: 'Basic',
    domain: 'Accounting',
    lastUpdated: 'Dec 3, 2024',
    purchases: 105,
    revenue: '$10,395',
    assigned: { count: 360, detail: '262 External / 98 Teams' },
    completions: { count: 324, detail: '236 External / 88 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Staff Accountant', 'Junior Accountant', 'Accounting Intern', 'Account Manager'],
  },
  {
    name: 'Cash Flow Statement Preparation',
    level: 'Basic',
    domain: 'Accounting',
    lastUpdated: 'Jan 15, 2025',
    purchases: 120,
    revenue: '$11,880',
    assigned: { count: 410, detail: '298 External / 112 Teams' },
    completions: { count: 369, detail: '268 External / 101 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Junior Accountant', 'Staff Accountant'],
  },
  {
    name: 'ASC 740 – Income Tax Accounting',
    level: 'Advance',
    domain: 'Accounting',
    lastUpdated: 'Nov 12, 2024',
    purchases: 42,
    revenue: '$4,158',
    assigned: { count: 125, detail: '91 External / 34 Teams' },
    completions: { count: 110, detail: '80 External / 30 Teams' },
    engagementPercent: 88,
    status: 'Active',
    mappedProfiles: ['Accounting Director', 'Finance Manager', 'CFO', 'Partner – Accounting & Advisory', 'Account Manager'],
  },
  {
    name: 'Forensic Accounting & Litigation...',
    level: 'Advance',
    domain: 'Accounting',
    lastUpdated: 'Dec 3, 2024',
    purchases: 28,
    revenue: '$2,772',
    assigned: { count: 82, detail: '60 External / 22 Teams' },
    completions: { count: 70, detail: '51 External / 19 Teams' },
    engagementPercent: 85,
    status: 'Active',
    mappedProfiles: ['Finance Manager', 'Accounting Director'],
  },
  {
    name: 'Risk-Based Audit Approach',
    level: 'Intermediate',
    domain: 'Auditing',
    lastUpdated: 'Jan 15, 2025',
    purchases: 63,
    revenue: '$6,237',
    assigned: { count: 195, detail: '142 External / 53 Teams' },
    completions: { count: 175, detail: '127 External / 48 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Audit Manager', 'Audit Supervisor', 'Audit Senior'],
  },
  {
    name: 'Internal Controls & COSO Framework',
    level: 'Advance',
    domain: 'Auditing',
    lastUpdated: 'Nov 12, 2024',
    purchases: 58,
    revenue: '$5,742',
    assigned: { count: 185, detail: '135 External / 50 Teams' },
    completions: { count: 165, detail: '120 External / 45 Teams' },
    engagementPercent: 89,
    status: 'Active',
    mappedProfiles: ['Assurance Partner', 'Audit Director', 'Senior Audit Manager', 'Audit Manager'],
  },
  {
    name: 'Fraud Detection & Prevention',
    level: 'Advance',
    domain: 'Auditing',
    lastUpdated: 'Dec 3, 2024',
    purchases: 80,
    revenue: '$7,920',
    assigned: { count: 260, detail: '190 External / 70 Teams' },
    completions: { count: 234, detail: '171 External / 63 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Assurance Partner', 'Audit Director', 'Senior Audit Manager', 'Audit Manager', 'Audit Supervisor', 'Audit Senior', 'Audit Staff', 'Audit Associate'],
  },
  {
    name: 'Audit Sampling & Evidence',
    level: 'Intermediate',
    domain: 'Auditing',
    lastUpdated: 'Jan 15, 2025',
    purchases: 46,
    revenue: '$4,554',
    assigned: { count: 140, detail: '102 External / 38 Teams' },
    completions: { count: 125, detail: '91 External / 34 Teams' },
    engagementPercent: 89,
    status: 'Active',
    mappedProfiles: ['Audit Senior', 'Audit Supervisor'],
  },
  {
    name: 'IT Audit & General Controls',
    level: 'Intermediate',
    domain: 'Auditing',
    lastUpdated: 'Nov 12, 2024',
    purchases: 52,
    revenue: '$5,148',
    assigned: { count: 165, detail: '120 External / 45 Teams' },
    completions: { count: 148, detail: '108 External / 40 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Audit Manager', 'Audit Supervisor', 'Audit Senior', 'Audit Staff'],
  },
  {
    name: 'Auditing Employee Benefit Plans',
    level: 'Advance',
    domain: 'Auditing',
    lastUpdated: 'Dec 3, 2024',
    purchases: 35,
    revenue: '$3,465',
    assigned: { count: 105, detail: '76 External / 29 Teams' },
    completions: { count: 91, detail: '66 External / 25 Teams' },
    engagementPercent: 87,
    status: 'Active',
    mappedProfiles: ['Senior Audit Manager', 'Audit Director'],
  },
  {
    name: 'Compilation & Review Engagements',
    level: 'Basic',
    domain: 'Auditing',
    lastUpdated: 'Jan 15, 2025',
    purchases: 74,
    revenue: '$7,326',
    assigned: { count: 240, detail: '174 External / 66 Teams' },
    completions: { count: 216, detail: '157 External / 59 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Audit Staff', 'Audit Associate'],
  },
  {
    name: 'Group Audits & Component Auditors',
    level: 'Advance',
    domain: 'Auditing',
    lastUpdated: 'Nov 12, 2024',
    purchases: 22,
    revenue: '$2,178',
    assigned: { count: 65, detail: '47 External / 18 Teams' },
    completions: { count: 55, detail: '40 External / 15 Teams' },
    engagementPercent: 85,
    status: 'Inactive',
    mappedProfiles: ['Assurance Partner', 'Audit Director'],
  },
  {
    name: 'Audit Quality & Peer Review Standards',
    level: 'Intermediate',
    domain: 'Auditing',
    lastUpdated: 'Dec 3, 2024',
    purchases: 40,
    revenue: '$3,960',
    assigned: { count: 122, detail: '89 External / 33 Teams' },
    completions: { count: 107, detail: '78 External / 29 Teams' },
    engagementPercent: 88,
    status: 'Active',
    mappedProfiles: ['Audit Manager', 'Senior Audit Manager', 'Audit Director'],
  },
  {
    name: 'Qualified Business Income Deduction',
    level: 'Intermediate',
    domain: 'Tax',
    lastUpdated: 'Jan 15, 2025',
    purchases: 61,
    revenue: '$6,039',
    assigned: { count: 190, detail: '138 External / 52 Teams' },
    completions: { count: 171, detail: '124 External / 47 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Tax Manager', 'Tax Supervisor', 'Senior Tax Accountant'],
  },
  {
    name: 'S-Corporation Tax – Form 1120-S',
    level: 'Intermediate',
    domain: 'Tax',
    lastUpdated: 'Nov 12, 2024',
    purchases: 49,
    revenue: '$4,851',
    assigned: { count: 152, detail: '110 External / 42 Teams' },
    completions: { count: 137, detail: '99 External / 38 Teams' },
    engagementPercent: 90,
    status: 'Active',
    mappedProfiles: ['Tax Supervisor', 'Tax Manager', 'Senior Tax Accountant'],
  },
];

const VISIBLE_COUNT = 2;

const MappedProfiles = ({ profiles }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({});
  const badgeRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!popoverOpen) return;
    const handleOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          badgeRef.current && !badgeRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [popoverOpen]);

  const updatePopoverPos = () => {
    if (!badgeRef.current) return;
    const r = badgeRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < 200;
    setPopoverStyle(
      openUp
        ? { position: 'fixed', bottom: window.innerHeight - r.top + 4, left: r.left, zIndex: 9999 }
        : { position: 'fixed', top: r.bottom + 4, left: r.left, zIndex: 9999 }
    );
  };

  if (!profiles || profiles.length === 0) {
    return <span className="al-profiles-empty">—</span>;
  }

  const visible = profiles.slice(0, VISIBLE_COUNT);
  const hidden = profiles.slice(VISIBLE_COUNT);

  return (
    <div className="al-profiles-cell">
      <div className="al-profiles-chips">
        {visible.map((p) => (
          <span key={p} className="al-profile-chip">{p}</span>
        ))}
        {hidden.length > 0 && (
          <span
            ref={badgeRef}
            className="al-profile-more"
            onClick={() => { updatePopoverPos(); setPopoverOpen((v) => !v); }}
          >
            +{hidden.length}
          </span>
        )}
      </div>
      {popoverOpen && ReactDOM.createPortal(
        <div className="al-profiles-popover" ref={popoverRef} style={popoverStyle}>
          <div className="al-profiles-popover-title">All Mapped Profiles ({profiles.length})</div>
          <div className="al-profiles-popover-list">
            {profiles.map((p) => (
              <div key={p} className="al-profiles-popover-item">{p}</div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

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
  const [levelFilter, setLevelFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelOpen, setLevelOpen] = useState(false);
  const [domainOpen, setDomainOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedLevel, setAppliedLevel] = useState('');
  const [appliedDomain, setAppliedDomain] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');

  const totalRevenue = '$54,945';
  const totalAssigned = 571;
  const totalExternal = 555;
  const totalTeams = 16;

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedLevel(levelFilter);
    setAppliedDomain(domainFilter);
    setAppliedStatus(statusFilter);
    setLevelOpen(false); setDomainOpen(false); setStatusOpen(false);
  };

  const handleClear = () => {
    setSearchTerm(''); setLevelFilter(''); setDomainFilter(''); setStatusFilter('');
    setAppliedSearch(''); setAppliedLevel(''); setAppliedDomain(''); setAppliedStatus('');
    setLevelOpen(false); setDomainOpen(false); setStatusOpen(false);
  };

  const displayAssessments = ASSESSMENT_DATA.filter((a) => {
    if (appliedLevel && a.level !== appliedLevel) return false;
    if (appliedDomain && a.domain !== appliedDomain) return false;
    if (appliedStatus && a.status !== appliedStatus) return false;
    if (appliedSearch) {
      const s = appliedSearch.toLowerCase();
      if (!a.name.toLowerCase().includes(s)) return false;
    }
    return true;
  });

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
              <button className="filter-dropdown-btn" onClick={() => { setLevelOpen(!levelOpen); setDomainOpen(false); setStatusOpen(false); }}>
                {levelFilter || 'Level'}<ChevronDown size={16} />
              </button>
              {levelOpen && (
                <div className="filter-dropdown-menu">
                  {['', 'Basic', 'Intermediate', 'Advance'].map((v) => (
                    <div key={v} className="filter-dropdown-item" onClick={() => { setLevelFilter(v); setLevelOpen(false); }}>{v || 'All'}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown">
              <button className="filter-dropdown-btn" onClick={() => { setDomainOpen(!domainOpen); setLevelOpen(false); setStatusOpen(false); }}>
                {domainFilter || 'Domain'}<ChevronDown size={16} />
              </button>
              {domainOpen && (
                <div className="filter-dropdown-menu">
                  {['', 'Accounting', 'Auditing', 'Tax'].map((v) => (
                    <div key={v} className="filter-dropdown-item" onClick={() => { setDomainFilter(v); setDomainOpen(false); }}>{v || 'All'}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown">
              <button className="filter-dropdown-btn" onClick={() => { setStatusOpen(!statusOpen); setLevelOpen(false); setDomainOpen(false); }}>
                {statusFilter || 'Status'}<ChevronDown size={16} />
              </button>
              {statusOpen && (
                <div className="filter-dropdown-menu">
                  {['', 'Active', 'Inactive', 'Draft'].map((v) => (
                    <div key={v} className="filter-dropdown-item" onClick={() => { setStatusFilter(v); setStatusOpen(false); }}>{v || 'All'}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="filters-right">
            <button className="clear-all-btn" onClick={handleClear}>Clear All</button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="al-scrollable">
        {/* Table */}
        <div className="al-table-area">
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
                <th>Mapped Profiles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayAssessments.map((item, idx) => (
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
                  <td><MappedProfiles profiles={item.mappedProfiles} /></td>
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
