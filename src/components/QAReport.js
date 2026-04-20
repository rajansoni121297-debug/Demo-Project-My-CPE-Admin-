import React, { useState, useRef, useEffect } from 'react';
import { Star, Search, Eye, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './QAReport.css';

const SearchableDropdown = ({ label, placeholder, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = search ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className="qr2-filter-group" ref={ref}>
      <label className="qr2-filter-label">{label}</label>
      <div className="qr2-dropdown-wrap">
        <button
          type="button"
          className={`qr2-dropdown-btn ${open ? 'qr2-dropdown-btn--open' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <span className={value ? '' : 'qr2-placeholder'}>{value || placeholder}</span>
          <ChevronDown size={14} className={`qr2-chev ${open ? 'qr2-chev--open' : ''}`} />
        </button>
        {open && (
          <div className="qr2-dropdown-panel">
            <div className="qr2-dropdown-search">
              <input
                type="text"
                className="qr2-dropdown-search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="qr2-dropdown-list">
              <div
                className={`qr2-dropdown-item qr2-dropdown-item--header ${!value ? 'qr2-dropdown-item--sel' : ''}`}
                onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
              >
                {placeholder}
              </div>
              {filtered.map((o) => (
                <div
                  key={o}
                  className={`qr2-dropdown-item ${value === o ? 'qr2-dropdown-item--sel' : ''}`}
                  onClick={() => { onChange(o); setOpen(false); setSearch(''); }}
                >
                  {o}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CATEGORIES = [
  'Accounting Industry', 'Auditing', 'International Taxes', 'Taxes', 'Critical Thinking',
  'Banking Reconciliation', 'Accounting Equation', 'Accounts Receivables',
  'Accrual, cash and Deferral accounting', 'Sales Tax in US', 'Accounting Periods & Methods',
  'Due Dates & Extensions', 'Filing Requirements & Filing Status',
  'Preliminary work to prepare tax returns', 'SSN& ITIN', 'Dependents',
  'Injured & Innocent Spouse', 'Simulation', 'Conceptual Accounting framework',
  'Adjustment to Income', 'Credits', 'Agent Communication Programs',
  'Bank Reconciliation Workflow', 'Financial Statements', 'Revenue Recognition',
];

const REPORT_DATA = [
  { category: "'AMERICAN ESSENTIALS: SOCIAL SECURITY, ADDRESS & CURRENCY'", mcqs: 15, subjectives: 0, evalQues: 15, practiceQues: 0 },
  { category: '1.1 Preliminary Work to Prepare Tax Returns', mcqs: 69, subjectives: 0, evalQues: 69, practiceQues: 0 },
  { category: '1.1. Business Entities', mcqs: 9, subjectives: 0, evalQues: 9, practiceQues: 0 },
  { category: '1.1. Practice before the IRS', mcqs: 8, subjectives: 0, evalQues: 8, practiceQues: 0 },
  { category: '1.2. Partnerships', mcqs: 64, subjectives: 0, evalQues: 64, practiceQues: 0 },
  { category: '1.2. Requirements for Enrolled Agents', mcqs: 28, subjectives: 0, evalQues: 28, practiceQues: 0 },
  { category: '1.3. Corporations in General', mcqs: 22, subjectives: 0, evalQues: 22, practiceQues: 0 },
  { category: '1.3. Sanctionable Acts', mcqs: 11, subjectives: 0, evalQues: 11, practiceQues: 0 },
  { category: '1.4. Forming a Corporation', mcqs: 13, subjectives: 0, evalQues: 13, practiceQues: 0 },
  { category: '1.4. Rules and Penalties', mcqs: 13, subjectives: 0, evalQues: 13, practiceQues: 0 },
  { category: '1.5. S Corporations', mcqs: 39, subjectives: 0, evalQues: 39, practiceQues: 0 },
  { category: '10 Best Practices in QuickBooks Online', mcqs: 8, subjectives: 0, evalQues: 8, practiceQues: 0 },
  { category: '1040 Evaluation', mcqs: 0, subjectives: 0, evalQues: 0, practiceQues: 0 },
  { category: 'Accounting Equation', mcqs: 12, subjectives: 3, evalQues: 15, practiceQues: 5 },
  { category: 'Accounting Periods & Methods', mcqs: 18, subjectives: 2, evalQues: 20, practiceQues: 8 },
  { category: 'Accounts Receivables', mcqs: 14, subjectives: 1, evalQues: 14, practiceQues: 3 },
  { category: 'Accrual, Cash and Deferral Accounting', mcqs: 20, subjectives: 4, evalQues: 24, practiceQues: 6 },
  { category: 'Adjustment to Income', mcqs: 31, subjectives: 0, evalQues: 31, practiceQues: 0 },
  { category: 'Agent Communication Programs', mcqs: 7, subjectives: 2, evalQues: 9, practiceQues: 2 },
  { category: 'Auditing Standards Overview', mcqs: 25, subjectives: 5, evalQues: 30, practiceQues: 10 },
  { category: 'Bank Reconciliation Workflow', mcqs: 16, subjectives: 0, evalQues: 16, practiceQues: 4 },
  { category: 'Banking Reconciliation', mcqs: 19, subjectives: 1, evalQues: 20, practiceQues: 5 },
  { category: 'Business Documents', mcqs: 10, subjectives: 0, evalQues: 10, practiceQues: 2 },
  { category: 'Conceptual Accounting Framework', mcqs: 22, subjectives: 3, evalQues: 25, practiceQues: 7 },
  { category: 'Credits', mcqs: 44, subjectives: 0, evalQues: 44, practiceQues: 0 },
  { category: 'Critical Thinking', mcqs: 11, subjectives: 6, evalQues: 17, practiceQues: 4 },
  { category: 'Dependents', mcqs: 17, subjectives: 0, evalQues: 17, practiceQues: 3 },
  { category: 'Due Dates & Extensions', mcqs: 9, subjectives: 0, evalQues: 9, practiceQues: 1 },
  { category: 'Filing Requirements & Filing Status', mcqs: 21, subjectives: 0, evalQues: 21, practiceQues: 5 },
  { category: 'Financial Statements', mcqs: 16, subjectives: 4, evalQues: 20, practiceQues: 6 },
  { category: 'Injured & Innocent Spouse', mcqs: 6, subjectives: 0, evalQues: 6, practiceQues: 0 },
  { category: 'International Taxes', mcqs: 33, subjectives: 2, evalQues: 35, practiceQues: 8 },
  { category: 'Preliminary Work to Prepare Tax Returns', mcqs: 45, subjectives: 0, evalQues: 45, practiceQues: 0 },
  { category: 'Revenue Recognition', mcqs: 14, subjectives: 3, evalQues: 17, practiceQues: 5 },
  { category: 'Sales Tax in US', mcqs: 18, subjectives: 1, evalQues: 19, practiceQues: 4 },
  { category: 'Simulation', mcqs: 0, subjectives: 0, evalQues: 8, practiceQues: 12 },
  { category: 'SSN & ITIN', mcqs: 5, subjectives: 0, evalQues: 5, practiceQues: 0 },
  { category: 'Taxes', mcqs: 52, subjectives: 3, evalQues: 55, practiceQues: 10 },
  { category: 'Timesheets', mcqs: 7, subjectives: 0, evalQues: 7, practiceQues: 2 },
];

const QAReport = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    setAppliedCategory(categoryFilter);
    setAppliedSearch(search);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setCategoryFilter('');
    setSearch('');
    setAppliedCategory('');
    setAppliedSearch('');
    setCurrentPage(1);
  };

  const displayData = REPORT_DATA.filter((row) => {
    if (appliedCategory && !row.category.toLowerCase().includes(appliedCategory.toLowerCase())) return false;
    if (appliedSearch && !row.category.toLowerCase().includes(appliedSearch.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(displayData.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagedData = displayData.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <div className="qa-report">
      <div className="qr2-content">

        {/* Fixed top */}
        <div className="qr2-sticky">
          {/* Header */}
          <div className="qr2-header">
            <div className="qr2-header-left">
              <Star size={20} className="qr2-star-icon" />
              <h1 className="qr2-title">Question Category Report</h1>
            </div>
            <div className="qr2-header-right">
              <div className="qr2-search-wrap">
                <input
                  type="text"
                  className="qr2-search-input"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search size={16} className="qr2-search-icon" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="qr2-filters">
            <SearchableDropdown
              label="Question Category"
              placeholder="Select Category"
              options={CATEGORIES}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
            <div className="qr2-filter-actions">
              <button className="qr2-clear-btn" onClick={handleClear}>Clear Filter</button>
              <button className="qr2-search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="qr2-table-area">
          <table className="users-table qr2-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Category</th>
                <th>MCQs</th>
                <th>Subjectives</th>
                <th>No of Evaluation Ques</th>
                <th>No of Practice Ques</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((row, idx) => (
                <tr key={idx}>
                  <td><span className="qr2-category-name">{row.category}</span></td>
                  <td><span className="qr2-mcq-count">{row.mcqs > 0 ? `${row.mcqs}(E)` : row.mcqs}</span></td>
                  <td>{row.subjectives > 0 ? `${row.subjectives}(E)` : row.subjectives}</td>
                  <td>{row.evalQues}</td>
                  <td>{row.practiceQues}</td>
                  <td>
                    <button className="qr2-view-btn" title="View">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination qr2-pagination">
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
            {' '}{(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, displayData.length)} of {displayData.length} Categories
          </div>
          <div className="pagination-right">
            <button className="page-btn" disabled={safePage <= 1} onClick={() => setCurrentPage(1)}><ChevronsLeft size={16} /></button>
            <button className="page-btn" disabled={safePage <= 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft size={16} /></button>
            <input type="text" className="page-input" value={safePage} readOnly />
            <span className="page-of">of {String(totalPages).padStart(2, '0')} pages</span>
            <button className="page-btn" disabled={safePage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight size={16} /></button>
            <button className="page-btn" disabled={safePage >= totalPages} onClick={() => setCurrentPage(totalPages)}><ChevronsRight size={16} /></button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QAReport;
