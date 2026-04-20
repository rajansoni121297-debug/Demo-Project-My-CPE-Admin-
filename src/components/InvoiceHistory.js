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
} from 'lucide-react';
import './InvoiceHistory.css';

const SUBSCRIPTION_NAMES = [
  'External Pre Employment',
  'Teams Assessment Bundle',
  'Individual Tax Module',
  'Audit Compliance Package',
  'Financial Reporting Suite',
];

const PAYMENT_METHODS = ['CC - 8521', 'CC - 4312', 'CC - 7890', 'CC - 2156'];

const DATES = ['Jan 16, 2026', 'Dec 05, 2025', 'Nov 20, 2025', 'Oct 10, 2025', 'Sep 01, 2025'];

const generateInvoiceData = (revenueStr) => {
  const totalRevenue = parseInt(revenueStr.replace(/[$,]/g, ''), 10) || 297;
  const data = [];
  let remaining = totalRevenue;
  let idx = 0;

  while (remaining > 0) {
    const unitPrice = 99;
    const maxQty = Math.min(Math.floor(remaining / unitPrice), 5);
    if (maxQty <= 0) break;
    const qty = Math.min(maxQty, idx === 0 ? 2 : 1);
    const paid = qty * unitPrice;

    data.push({
      subscription: SUBSCRIPTION_NAMES[idx % SUBSCRIPTION_NAMES.length],
      noOfPurchase: qty,
      purchaseDate: DATES[idx % DATES.length],
      totalPaid: `$${paid}`,
      paymentMethod: PAYMENT_METHODS[idx % PAYMENT_METHODS.length],
    });

    remaining -= paid;
    idx++;
  }

  return { data, totalRevenue: `$${totalRevenue}` };
};

const InvoiceHistory = ({ user, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);

  const revenueStr = user?.revenue || '$297';

  const { data: invoiceData, totalRevenue } = useMemo(
    () => generateInvoiceData(revenueStr),
    [revenueStr]
  );

  const totalItems = invoiceData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  return (
    <div className="invoice-history">
      <div className="ih-fixed">
      {/* Header */}
      <div className="ih-header">
        <div className="ih-header-left">
          <button className="ih-back-btn" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <h1 className="ih-title">Invoice History{user?.name ? ` (${user.name})` : ''}</h1>
        </div>

        <div className="ih-header-right">
          <div className="stats-pills">
            <div className="stat-pill">
              Total Revenue : <span className="stat-value stat-value--green">{totalRevenue}</span>
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
      </div>

      <div className="ih-scrollable">
      {/* Table */}
      <div className="table-wrapper">
        <table className="users-table ih-table">
          <thead>
            <tr>
              <th>Subscriptions</th>
              <th>No of purchase</th>
              <th>Purchase Date</th>
              <th>Total Paid</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.slice(0, perPage).map((item, idx) => (
              <tr key={idx}>
                <td className="cell-name">{item.subscription}</td>
                <td>{item.noOfPurchase}</td>
                <td className="cell-date">{item.purchaseDate}</td>
                <td className="cell-revenue">{item.totalPaid}</td>
                <td>{item.paymentMethod}</td>
                <td>
                  <span className="ih-action-link">Invoice</span>
                  <span className="ih-action-divider">|</span>
                  <span className="ih-action-link">Receipt</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"></td>
              <td colSpan="3">
                <div className="ih-total-box">
                  <span className="ih-total-label">Total Revenue</span>
                  <span className="ih-total-value">{totalRevenue}</span>
                </div>
              </td>
            </tr>
          </tfoot>
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
          of {totalItems} Events
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

export default InvoiceHistory;
