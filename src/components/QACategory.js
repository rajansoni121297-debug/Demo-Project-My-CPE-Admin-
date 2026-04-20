import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Star,
  Plus,
  Upload,
  ClipboardEdit,
  Trash2,
  X,
} from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import './QACategory.css';

const STATUS_OPTIONS = ['Active', 'Inactive'];
const DOMAIN_OPTIONS = ['Accounting', 'Auditing', 'Tax', 'Others'];

const PARENT_CATEGORIES = [
  'US CPA Firms Overview',
  'US Individual Tax - Foundation',
  'Recrutiment - Internal',
  'Bascis of Accounting - Foundation',
  'US Accounting - Foundation',
  'US Accounting - Intermediate',
  'CFP Exam Prep',
  'US Auditing - Foundation',
  'US Auditing - Intermediate',
  'Basic Communication - Offshore - Internal',
  'EA Test',
  'EBP Audit - PTC',
  'US Individual Tax - Intermediate',
  'AI in Accounting - Internal',
  'Canada CPA Firms',
  'Cannabis Business',
];

const KEYWORDS = [
  '1031 Exchange', '1040', '1065', '1099', '1099\'s', '199A', '401(k)',
  '403 (b)', 'A & A (Govt)', 'A & A Update', 'AccounTech', 'Accounting',
  'Accounting & Auditing', 'Accounting Adjustments', 'Accounting Software',
  'Accounts Payable',
];

const CATEGORY_DATA = [
  { name: 'NPO Reporting & Governance', parentCategory: 'Audit - Assessment', topics: ['NFP'], domain: '-', status: 'Active' },
  { name: 'NPO Internal Controls', parentCategory: 'Audit - Assessment', topics: ['NFP'], domain: '-', status: 'Active' },
  { name: 'Grant Compliance', parentCategory: 'Audit - Assessment', topics: ['NFP'], domain: '-', status: 'Active' },
  { name: 'NPO Risk Assessment', parentCategory: 'Audit - Assessment', topics: ['NFP'], domain: '-', status: 'Active' },
  { name: 'Peer Review & Remediation', parentCategory: 'Audit - Assessment', topics: ['Yellow Book'], domain: '-', status: 'Active' },
  { name: 'GAGAS Reporting Compliance', parentCategory: 'Audit - Assessment', topics: ['Yellow Book'], domain: '-', status: 'Active' },
  { name: 'Audit Evidence & Findings', parentCategory: 'Audit - Assessment', topics: ['Yellow Book'], domain: '-', status: 'Active' },
  { name: 'Fieldwork Supervision & Review', parentCategory: 'Audit - Assessment', topics: ['Yellow Book'], domain: '-', status: 'Active' },
  { name: 'Quality Control Systems', parentCategory: 'Audit - Assessment', topics: ['Yellow Book'], domain: '-', status: 'Active' },
  { name: 'Independence & Safeguards', parentCategory: 'Audit - Assessment', topics: ['Yellow Book'], domain: '-', status: 'Active' },
  { name: 'Rejection Analysis', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Electronic Filing', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Organizer Screens', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Client Setup', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Configuration & Navigation', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Collaboration & Packaging', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Binder Health Diagnostics', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Advanced TB Reporting', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Rollforward & Templates', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Sign-Offs & Audit Trail', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Journal Entries: Create, Post, Verify', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Workpaper Organization & Referencing', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'TB Import & Update', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Trial Balance & Grouping', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Engagement Setup & Navigation', parentCategory: 'Audit - Assessment', topics: [], domain: '-', status: 'Active' },
  { name: 'Extensions, Estimates, Payment Governance', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Multistate Dependency Checks', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Lead Review Controls', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Printing & Deliverables', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Diagnostics & Error Correction', parentCategory: 'Tax - Assessment', topics: ['Tax Software'], domain: '-', status: 'Active' },
  { name: 'Client Deliverables Governance', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Depreciation & Fixed Assets', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Form Dependency Checks', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Reviewer Controls & Standardization', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'E-File Workflow', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Client Intake & Document Collection', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Diagnostics & Review', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Core Input Workflow', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Client Profile & Return Options', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Setup & Navigation', parentCategory: 'Tax - Assessment', topics: ['Lacerte Tax Software'], domain: '-', status: 'Active' },
  { name: 'Extensions, Estimates, Payment Controls', parentCategory: 'Tax - Assessment', topics: ['Drake Software'], domain: '-', status: 'Active' },
];

const TopicTags = ({ topics }) => {
  return (
    <div className="qc-topic-cell">
      {topics.map((topic, i) => (
        <span key={i} className="qc-topic-tag">
          {topic}
          <X size={12} className="qc-topic-tag-x" />
        </span>
      ))}
    </div>
  );
};

const QACategory = ({ onCreateCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(50);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({ status: [], parent: [], keyword: [], domain: [], search: '' });
  const [deletedNames, setDeletedNames] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // item name

  const baseItems = CATEGORY_DATA.filter((item) => !deletedNames.includes(item.name));

  const displayItems = baseItems.filter((item) => {
    const af = appliedFilters;
    if (af.status.length && !af.status.includes(item.status)) return false;
    if (af.parent.length && !af.parent.includes(item.parentCategory)) return false;
    if (af.domain.length && !af.domain.includes(item.domain)) return false;
    if (af.search) {
      const s = af.search.toLowerCase();
      if (!item.name.toLowerCase().includes(s) && !item.parentCategory.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const totalItems = displayItems.length;

  const handleSearch = () => {
    setAppliedFilters({ status: selectedStatus, parent: selectedParentCategory, keyword: selectedKeyword, domain: selectedDomain, search: searchTerm });
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedParentCategory([]);
    setSelectedKeyword([]);
    setSelectedDomain([]);
    setSearchTerm('');
    setAppliedFilters({ status: [], parent: [], keyword: [], domain: [], search: '' });
  };

  return (
    <div className="qa-category">
      <div className="qc-content">
        <div className="qc-sticky">
          {/* Header */}
          <div className="qc-header">
            <div className="qc-header-left">
              <Star size={20} className="qc-star-icon" />
              <h1 className="qc-title">Category List</h1>
            </div>

            <div className="qc-header-right">
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
              <button className="qc-link-btn">Download Sample</button>
              <button className="qc-create-btn" onClick={onCreateCategory}>
                <Plus size={16} />
                Create Category
              </button>
              <button className="qc-import-btn">
                <Upload size={16} />
                Import
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="qc-filters">
            <MultiSelectDropdown
              label="Status"
              placeholder="All"
              options={STATUS_OPTIONS}
              selected={selectedStatus}
              onChange={setSelectedStatus}
              hasSearch={true}
            />
            <MultiSelectDropdown
              label="Parent Category"
              placeholder="All"
              options={PARENT_CATEGORIES}
              selected={selectedParentCategory}
              onChange={setSelectedParentCategory}
              hasSearch={true}
            />
            <MultiSelectDropdown
              label="Keyword"
              placeholder="All"
              options={KEYWORDS}
              selected={selectedKeyword}
              onChange={setSelectedKeyword}
              hasSearch={true}
            />
            <MultiSelectDropdown
              label="Domain"
              placeholder="Select Domain"
              options={DOMAIN_OPTIONS}
              selected={selectedDomain}
              onChange={setSelectedDomain}
              hasSearch={false}
            />

            <div className="qc-filter-actions">
              <button className="clear-all-btn" onClick={clearFilters}>Clear Filter</button>
              <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="qc-table-area">
          <table className="users-table qc-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Parent Category</th>
                <th>Topic</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="qc-category-name">{item.name}</span></td>
                  <td>{item.parentCategory}</td>
                  <td><TopicTags topics={item.topics} /></td>
                  <td>{item.domain}</td>
                  <td>
                    <span className="qc-status-badge qc-status--active">{item.status}</span>
                  </td>
                  <td>
                    <div className="qc-actions">
                      <button className="qc-action-btn qc-action-btn--edit" title="Edit">
                        <ClipboardEdit size={15} />
                      </button>
                      <button className="qc-action-btn qc-action-btn--delete" title="Delete" onClick={() => setConfirmDelete(item.name)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="qc-pagination">
          <div className="qc-pagination-left">
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
            <span className="qc-pagination-info">Showing 1 – {totalItems} of {totalItems}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', width: 380, boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Delete Category?</h3>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6b7280' }}>Are you sure you want to delete <strong>{confirmDelete}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', border: '1px solid #e0e4ea', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={() => { setDeletedNames((p) => [...p, confirmDelete]); setConfirmDelete(null); }} style={{ padding: '8px 20px', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QACategory;
