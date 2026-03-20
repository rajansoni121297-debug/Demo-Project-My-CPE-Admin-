import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Star,
  Plus,
  Upload,
  ClipboardEdit,
  Trash2,
} from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import './QARoles.css';

const STATUS_OPTIONS = ['Active', 'Inactive'];
const LEVEL_OPTIONS = ['Basic', 'Intermediate', 'Advance'];
const DOMAIN_OPTIONS = ['Tax', 'Auditing', 'Accounting'];

const ROLE_DATA = [
  { name: 'Partner – Tax Advisory & Compliance', level: 'Advance', domain: 'Tax', status: 'Active' },
  { name: 'Tax Director', level: 'Advance', domain: 'Tax', status: 'Active' },
  { name: 'Senior Tax Manager', level: 'Advance', domain: 'Tax', status: 'Active' },
  { name: 'Tax Manager', level: 'Intermediate', domain: 'Tax', status: 'Active' },
  { name: 'Tax Supervisor', level: 'Intermediate', domain: 'Tax', status: 'Active' },
  { name: 'Senior Tax Accountant', level: 'Intermediate', domain: 'Tax', status: 'Active' },
  { name: 'Junior Tax Accountant', level: 'Basic', domain: 'Tax', status: 'Active' },
  { name: 'Tax Associate', level: 'Basic', domain: 'Tax', status: 'Active' },
  { name: 'Tax Intern', level: 'Basic', domain: 'Tax', status: 'Active' },
  { name: 'Assurance Partner', level: 'Advance', domain: 'Auditing', status: 'Active' },
  { name: 'Audit Director', level: 'Advance', domain: 'Auditing', status: 'Active' },
  { name: 'Senior Audit Manager', level: 'Advance', domain: 'Auditing', status: 'Active' },
  { name: 'Audit Manager', level: 'Intermediate', domain: 'Auditing', status: 'Active' },
  { name: 'Audit Supervisor', level: 'Intermediate', domain: 'Auditing', status: 'Active' },
  { name: 'Audit Senior', level: 'Intermediate', domain: 'Auditing', status: 'Active' },
  { name: 'Audit Staff', level: 'Basic', domain: 'Auditing', status: 'Active' },
  { name: 'Audit Associate', level: 'Basic', domain: 'Auditing', status: 'Active' },
  { name: 'Partner – Accounting & Advisory', level: 'Advance', domain: 'Accounting', status: 'Active' },
  { name: 'Accounting Director', level: 'Advance', domain: 'Accounting', status: 'Active' },
  { name: 'Finance Manager', level: 'Advance', domain: 'Accounting', status: 'Active' },
  { name: 'Account Manager', level: 'Intermediate', domain: 'Accounting', status: 'Active' },
  { name: 'Account Supervisor', level: 'Intermediate', domain: 'Accounting', status: 'Active' },
  { name: 'Senior Accountant', level: 'Intermediate', domain: 'Accounting', status: 'Active' },
  { name: 'Junior Accountant', level: 'Basic', domain: 'Accounting', status: 'Active' },
  { name: 'Staff Accountant', level: 'Basic', domain: 'Accounting', status: 'Active' },
  { name: 'Accounting Intern', level: 'Basic', domain: 'Accounting', status: 'Active' },
];

const QARoles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(50);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({ status: [], level: [], domain: [], search: '' });
  const [deletedNames, setDeletedNames] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const baseItems = ROLE_DATA.filter((item) => !deletedNames.includes(item.name));

  const displayItems = baseItems.filter((item) => {
    const af = appliedFilters;
    if (af.status.length && !af.status.includes(item.status)) return false;
    if (af.level.length && !af.level.includes(item.level)) return false;
    if (af.domain.length && !af.domain.includes(item.domain)) return false;
    if (af.search && !item.name.toLowerCase().includes(af.search.toLowerCase())) return false;
    return true;
  });

  const totalItems = displayItems.length;

  const handleSearch = () => {
    setAppliedFilters({ status: selectedStatus, level: selectedLevel, domain: selectedDomain, search: searchTerm });
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedLevel([]);
    setSelectedDomain([]);
    setSearchTerm('');
    setAppliedFilters({ status: [], level: [], domain: [], search: '' });
  };

  return (
    <div className="qa-roles">
      <div className="qr-content">
      <div className="qr-sticky">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-header-left">
            <Star size={20} className="qr-star-icon" />
            <h1 className="qr-title">Role List</h1>
          </div>

          <div className="qr-header-right">
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
            <button className="qr-link-btn">Download Sample</button>
            <button className="qr-create-btn">
              <Plus size={16} />
              Create Role
            </button>
            <button className="qr-import-btn">
              <Upload size={16} />
              Import
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="qr-filters">
          <MultiSelectDropdown
            label="Status"
            placeholder="All"
            options={STATUS_OPTIONS}
            selected={selectedStatus}
            onChange={setSelectedStatus}
            hasSearch={false}
          />
          <MultiSelectDropdown
            label="Level"
            placeholder="All"
            options={LEVEL_OPTIONS}
            selected={selectedLevel}
            onChange={setSelectedLevel}
            hasSearch={false}
          />
          <MultiSelectDropdown
            label="Domain"
            placeholder="All"
            options={DOMAIN_OPTIONS}
            selected={selectedDomain}
            onChange={setSelectedDomain}
            hasSearch={false}
          />

          <div className="qr-filter-actions">
            <button className="clear-all-btn" onClick={clearFilters}>Clear Filter</button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

        {/* Table */}
        <div className="qr-table-area">
          <table className="users-table qr-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Level</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, idx) => (
                <tr key={idx}>
                  <td><span className="qr-role-name">{item.name}</span></td>
                  <td>{item.level}</td>
                  <td>{item.domain}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className="qr-actions">
                      <button className="qr-action-btn qr-action-btn--edit" title="Edit">
                        <ClipboardEdit size={15} />
                      </button>
                      <button className="qr-action-btn qr-action-btn--delete" title="Delete" onClick={() => setConfirmDelete(item.name)}>
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
        <div className="qr-pagination">
          <div className="qr-pagination-left">
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
            <span className="qr-pagination-info">Showing 1 – {totalItems} of {totalItems}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', width: 380, boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Delete Role?</h3>
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

export default QARoles;

