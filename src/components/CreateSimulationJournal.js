import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ChevronDown, Eye, X, Info, Plus, Trash2,
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Paintbrush, Highlighter, Link, Image, Table, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Code, Minus, Quote,
} from 'lucide-react';
import './CreateMCQ.css';
import './CreateSimulationJournal.css';
import ConfirmModal from './ConfirmModal';

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Bascis of Accounting - Foundation',
  'US Accounting - Foundation', 'US Accounting - Intermediate', 'CFP Exam Prep',
  'US Auditing - Foundation', 'US Auditing - Intermediate', 'EA Test',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Farms',
  'Restaurant Accounting - Foundation', 'US Business Tax - Foundation', 'IRS - Foundation',
];

const CELL_TYPE_OPTIONS = [
  'Column Heading', 'Row Heading', 'Journal Entry', 'Label',
  'Input Text', 'Input Date', 'Input Amount', 'Input Number',
  'Input Percentage', 'Multiple Choice Options', 'Formula', 'Copy', 'Paste',
];

const getColLabel = (index) => {
  let label = '';
  let i = index;
  do { label = String.fromCharCode(65 + (i % 26)) + label; i = Math.floor(i / 26) - 1; } while (i >= 0);
  return label;
};

let _tid = 0;
const makeEmptyCell = () => ({ type: null, value: '', options: [] });
const makeEmptyRow = (cols) => Array.from({ length: cols }, makeEmptyCell);
const makeEmptyGrid = (rows, cols) => Array.from({ length: rows }, () => makeEmptyRow(cols));
const makeTableCard = () => ({
  id: ++_tid,
  rowInput: '', colInput: '', rangeOfCorrect: '0',
  accountingJournalBased: false,
  tableCreated: false,
  numRows: 0, numCols: 0,
  cellData: [],
  materialFiles: [],
});

/* ===== Rich Toolbar ===== */
const RichToolbar = () => (
  <div className="cm-toolbar">
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Bold size={16} /></button>
      <button type="button" className="cm-tb-btn"><Italic size={16} /></button>
      <button type="button" className="cm-tb-btn"><Underline size={16} /></button>
      <button type="button" className="cm-tb-btn"><Strikethrough size={16} /></button>
      <button type="button" className="cm-tb-btn"><Subscript size={16} /></button>
      <button type="button" className="cm-tb-btn"><Superscript size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Type size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Paintbrush size={16} /></button>
      <button type="button" className="cm-tb-btn"><Highlighter size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><AlignLeft size={16} /></button>
      <button type="button" className="cm-tb-btn"><AlignCenter size={16} /></button>
      <button type="button" className="cm-tb-btn"><AlignRight size={16} /></button>
      <button type="button" className="cm-tb-btn"><AlignJustify size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><List size={16} /></button>
      <button type="button" className="cm-tb-btn"><ListOrdered size={16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn"><Quote size={16} /></button>
      <button type="button" className="cm-tb-btn"><Link size={16} /></button>
      <button type="button" className="cm-tb-btn"><Image size={16} /></button>
      <button type="button" className="cm-tb-btn"><Table size={16} /></button>
      <button type="button" className="cm-tb-btn"><Code size={16} /></button>
      <button type="button" className="cm-tb-btn"><Minus size={16} /></button>
    </div>
  </div>
);

/* ===== Searchable Dropdown ===== */
const SelectDropdown = ({ label, placeholder, options, value, onChange, required, error }) => {
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
    <div className="cm-field" ref={ref}>
      <label className="cm-label">{label}{required && <span className="cm-req"> *</span>}</label>
      <div className="cm-select-wrap">
        <button type="button"
          className={`cm-select-btn ${open ? 'cm-select-btn--open' : ''} ${error ? 'cm-select-btn--error' : ''}`}
          onClick={() => setOpen(!open)}>
          <span className={value ? '' : 'cm-placeholder'}>{value || placeholder}</span>
          <ChevronDown size={14} className={`cm-chev ${open ? 'cm-chev--open' : ''}`} />
        </button>
        {open && (
          <div className="cm-select-panel">
            <div className="cm-select-search">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." className="cm-select-search-input" autoFocus />
            </div>
            <div className="cm-select-list">
              <div className="cm-select-item cm-select-item--header"
                onClick={() => { onChange(''); setOpen(false); setSearch(''); }}>{placeholder}</div>
              {filtered.map((o) => (
                <div key={o} className={`cm-select-item ${value === o ? 'cm-select-item--sel' : ''}`}
                  onClick={() => { onChange(o); setOpen(false); setSearch(''); }}>{o}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <span className="cm-error-msg">{error}</span>}
    </div>
  );
};

/* ===== Base Modal ===== */
const Modal = ({ title, onClose, children, wide }) => (
  <div className="csj-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={`csj-modal ${wide ? 'csj-modal--wide' : ''}`}>
      <div className="csj-modal-header">
        <h3 className="csj-modal-title">{title}</h3>
        <button type="button" className="csj-modal-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="csj-modal-body">{children}</div>
    </div>
  </div>
);

/* ===== Accounting Journal Info Modal ===== */
const AccountingJournalInfoModal = ({ onClose }) => (
  <Modal title="Pointers To Remember For Accounting Journal Based Question" onClose={onClose} wide>
    <ul className="csj-info-list">
      <li>Check the checkbox of 'Accounting Journal Based'</li>
      <li>Select 'Journal Entry' for every case or question</li>
      <li>
        There are 4 columns only so set the column headings as follows:
        <ul className="csj-info-sublist">
          <li>Date (select Input Date)</li>
          <li>Accounting Heads (Select Multiple Selection option)</li>
          <li>Dr/Cr (Select Multiple Selection option)</li>
          <li>Amount (Select Input Amount)</li>
        </ul>
      </li>
      <li>For another case study use again 'Journal Entry'</li>
    </ul>
  </Modal>
);

/* ===== Multiple Choice Options Modal ===== */
const MCOptionsModal = ({ initialOptions = [], onSave, onClose }) => {
  const [opts, setOpts] = useState(initialOptions.length > 0 ? initialOptions : ['', '']);
  return (
    <Modal title="Multiple Choice Options" onClose={onClose}>
      <div className="csj-mc-options">
        {opts.map((opt, i) => (
          <div key={i} className="csj-mc-option-row">
            <input type="text" className="csj-mc-option-input" placeholder={`Option ${i + 1}`}
              value={opt} onChange={(e) => setOpts((p) => p.map((o, idx) => idx === i ? e.target.value : o))} />
            {opts.length > 2 && (
              <button type="button" className="csj-mc-remove-btn"
                onClick={() => setOpts((p) => p.filter((_, idx) => idx !== i))}>
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button type="button" className="csj-mc-add-btn" onClick={() => setOpts((p) => [...p, ''])}>
          <Plus size={14} /> Add Option
        </button>
      </div>
      <div className="csj-modal-footer">
        <button type="button" className="csj-modal-save-btn" onClick={() => onSave(opts)}>Save</button>
      </div>
    </Modal>
  );
};

/* ===== Text Input Modal ===== */
const TextInputModal = ({ title, placeholder, initialValue, onSave, onClose }) => {
  const [value, setValue] = useState(initialValue || '');
  return (
    <Modal title={title} onClose={onClose}>
      <div className="csj-modal-input-group">
        <input type="text" className="csj-modal-input" placeholder={placeholder} value={value}
          onChange={(e) => setValue(e.target.value)} autoFocus
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(value); }} />
      </div>
      <div className="csj-modal-footer">
        <button type="button" className="csj-modal-save-btn" onClick={() => onSave(value)}>Save</button>
      </div>
    </Modal>
  );
};

/* ===== Variable Table Grid ===== */
const VariableTable = ({ cellData, setCellData, numRows, setNumRows, numCols, setNumCols }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [modal, setModal] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const h = () => setOpenMenu(null);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const closeMenu = () => setOpenMenu(null);

  const addRowAbove = (ri) => { setCellData((p) => [...p.slice(0, ri), makeEmptyRow(numCols), ...p.slice(ri)]); setNumRows((n) => n + 1); closeMenu(); };
  const addRowBelow = (ri) => { setCellData((p) => [...p.slice(0, ri + 1), makeEmptyRow(numCols), ...p.slice(ri + 1)]); setNumRows((n) => n + 1); closeMenu(); };
  const deleteRow = (ri) => { if (numRows <= 1) return; setCellData((p) => p.filter((_, i) => i !== ri)); setNumRows((n) => n - 1); closeMenu(); };
  const addColLeft = (ci) => { setCellData((p) => p.map((row) => [...row.slice(0, ci), makeEmptyCell(), ...row.slice(ci)])); setNumCols((n) => n + 1); closeMenu(); };
  const addColRight = (ci) => { setCellData((p) => p.map((row) => [...row.slice(0, ci + 1), makeEmptyCell(), ...row.slice(ci + 1)])); setNumCols((n) => n + 1); closeMenu(); };
  const deleteCol = (ci) => { if (numCols <= 1) return; setCellData((p) => p.map((row) => row.filter((_, i) => i !== ci))); setNumCols((n) => n - 1); closeMenu(); };

  const clearCell = (ri, ci) => {
    setCellData((p) => p.map((row, r) => row.map((cell, c) => r === ri && c === ci ? makeEmptyCell() : cell)));
  };

  const updateCellValue = (ri, ci, value) => {
    setCellData((p) => p.map((row, r) => row.map((cell, c) => r === ri && c === ci ? { ...cell, value } : cell)));
  };

  const setCell = (ri, ci, updates) => {
    setCellData((p) => p.map((row, r) => row.map((cell, c) => r === ri && c === ci ? { ...cell, ...updates } : cell)));
  };

  const handleCellTypeSelect = (type, ri, ci) => {
    closeMenu();
    if (type === 'Copy') { setClipboard({ ...cellData[ri][ci] }); return; }
    if (type === 'Paste') { if (clipboard) setCell(ri, ci, clipboard); return; }
    const needsModal = ['Column Heading', 'Row Heading', 'Label', 'Formula'];
    if (needsModal.includes(type)) { setModal({ type, ri, ci, value: cellData[ri][ci].value || '' }); return; }
    if (type === 'Multiple Choice Options') { setModal({ type, ri, ci, options: cellData[ri][ci].options || [] }); return; }
    setCell(ri, ci, { type });
  };

  const isOpen = (kind, ri, ci) => openMenu && openMenu.kind === kind && openMenu.ri === ri && openMenu.ci === ci;

  const toggleMenu = (e, kind, ri, ci) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (isOpen(kind, ri, ci)) { setOpenMenu(null); return; }
    setOpenMenu({ kind, ri, ci, x: rect.left, y: rect.bottom + 4 });
  };

  const renderCellContent = (cell, ri, ci) => {
    const hasEntry = cell.type !== null;
    const stop = (e) => e.stopPropagation();

    const content = (() => {
      switch (cell.type) {
        case 'Column Heading': case 'Row Heading':
          return <span className="csj-cell-heading">{cell.value || <em className="csj-cell-type-tag">{cell.type}</em>}</span>;
        case 'Label':
          return <span className="csj-cell-label-text">{cell.value || <em className="csj-cell-type-tag">Label</em>}</span>;
        case 'Journal Entry': case 'Input Text':
          return <input type="text" className="csj-cell-input" value={cell.value}
            onChange={(e) => updateCellValue(ri, ci, e.target.value)} onClick={stop} />;
        case 'Input Date':
          return <input type="date" className="csj-cell-input" value={cell.value}
            onChange={(e) => updateCellValue(ri, ci, e.target.value)} onClick={stop} />;
        case 'Input Amount':
          return <div className="csj-cell-amount" onClick={stop}>
            <span className="csj-cell-prefix">$</span>
            <input type="number" className="csj-cell-input" value={cell.value}
              onChange={(e) => updateCellValue(ri, ci, e.target.value)} onClick={stop} />
          </div>;
        case 'Input Number':
          return <input type="number" className="csj-cell-input" value={cell.value}
            onChange={(e) => updateCellValue(ri, ci, e.target.value)} onClick={stop} />;
        case 'Input Percentage':
          return <div className="csj-cell-amount" onClick={stop}>
            <input type="number" className="csj-cell-input" value={cell.value}
              onChange={(e) => updateCellValue(ri, ci, e.target.value)} onClick={stop} />
            <span className="csj-cell-suffix">%</span>
          </div>;
        case 'Multiple Choice Options':
          return <select className="csj-cell-select" onClick={stop}>
            {(cell.options || []).map((o, i) => <option key={i}>{o}</option>)}
          </select>;
        case 'Formula':
          return <span className="csj-cell-formula">{cell.value || <em className="csj-cell-type-tag">Formula</em>}</span>;
        default:
          return null;
      }
    })();

    return (
      <div className="csj-cell-inner">
        <div className="csj-cell-content">{content}</div>
        {hasEntry && (
          <button className="csj-cell-clear-btn"
            onClick={(e) => { e.stopPropagation(); clearCell(ri, ci); }}
            onMouseDown={(e) => e.stopPropagation()}
            title="Clear cell">
            <X size={12} />
          </button>
        )}
      </div>
    );
  };

  const renderFloatingMenu = () => {
    if (!openMenu) return null;
    const { kind, ri, ci, x, y } = openMenu;
    const items = (() => {
      if (kind === 'row') return [
        { label: 'Add One Row Above', onClick: () => addRowAbove(ri) },
        { label: 'Add One Row Below', onClick: () => addRowBelow(ri) },
        ...(numRows > 1 ? [{ label: 'Delete Row', onClick: () => deleteRow(ri), danger: true }] : []),
      ];
      if (kind === 'col') return [
        ...(ci > 0 ? [{ label: 'Add One Column Left', onClick: () => addColLeft(ci) }] : []),
        { label: 'Add One Column Right', onClick: () => addColRight(ci) },
        ...(numCols > 1 ? [{ label: 'Delete Column', onClick: () => deleteCol(ci), danger: true }] : []),
      ];
      if (kind === 'cell') return CELL_TYPE_OPTIONS.map((opt) => ({
        label: opt, danger: false, utility: opt === 'Copy' || opt === 'Paste',
        onClick: () => handleCellTypeSelect(opt, ri, ci),
      }));
      return [];
    })();

    return (
      <div className="csj-floating-menu" style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }}
        onMouseDown={(e) => e.stopPropagation()}>
        {items.map((item, i) => (
          <div key={i}
            className={`csj-menu-item${item.danger ? ' csj-menu-item--danger' : ''}${item.utility ? ' csj-menu-item--utility' : ''}`}
            onClick={(e) => { e.stopPropagation(); item.onClick(); }}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  const getModalConfig = () => {
    if (!modal) return null;
    const configs = {
      'Column Heading': { title: 'Column Header', placeholder: 'Enter Column Header' },
      'Row Heading': { title: 'Row Header', placeholder: 'Enter Row Header' },
      'Label': { title: 'Label', placeholder: 'Enter Label Text' },
      'Formula': { title: 'Formula', placeholder: 'Enter Formula' },
    };
    return configs[modal.type];
  };

  const mc = getModalConfig();

  return (
    <div className="csj-table-wrap" ref={tableRef}>
      <div className="csj-table-scroll">
        <table className="csj-table">
          <thead>
            <tr>
              <th className="csj-th-hash">#</th>
              {Array.from({ length: numCols }, (_, ci) => (
                <th key={ci} className="csj-th-col">
                  <div className="csj-th-col-inner">
                    <span className="csj-col-label">{getColLabel(ci)}</span>
                    <button type="button" className="csj-col-drop-btn"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => toggleMenu(e, 'col', -1, ci)}>
                      <ChevronDown size={11} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cellData.map((row, ri) => (
              <tr key={ri}>
                <td className="csj-td-row-header">
                  <div className="csj-row-header-inner">
                    <span className="csj-row-label">{ri + 1}</span>
                    <button type="button" className="csj-row-drop-btn"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => toggleMenu(e, 'row', ri, -1)}>
                      <ChevronDown size={11} />
                    </button>
                  </div>
                </td>
                {row.map((cell, ci) => (
                  <td key={ci}
                    className={`csj-td-cell${cell.type ? ` csj-td-cell--${cell.type.toLowerCase().replace(/ /g, '-')}` : ''}`}
                    onClick={(e) => toggleMenu(e, 'cell', ri, ci)}>
                    {renderCellContent(cell, ri, ci)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderFloatingMenu()}

      {modal && mc && (
        <TextInputModal title={mc.title} placeholder={mc.placeholder} initialValue={modal.value}
          onSave={(val) => { setCell(modal.ri, modal.ci, { type: modal.type, value: val }); setModal(null); }}
          onClose={() => setModal(null)} />
      )}
      {modal && modal.type === 'Multiple Choice Options' && (
        <MCOptionsModal initialOptions={modal.options}
          onSave={(opts) => { setCell(modal.ri, modal.ci, { type: 'Multiple Choice Options', options: opts }); setModal(null); }}
          onClose={() => setModal(null)} />
      )}
    </div>
  );
};

/* ===== Table Card ===== */
const TableCard = ({ table, tableIndex, tableCount, onUpdate, onDelete }) => {
  const { id, rowInput, colInput, rangeOfCorrect, accountingJournalBased,
    tableCreated, numRows, numCols, cellData, materialFiles } = table;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const materialFileRef = useRef(null);

  const upd = (updates) => onUpdate(id, updates);

  const handleCreateGrid = () => {
    const r = parseInt(rowInput);
    const c = parseInt(colInput);
    if (!r || r < 1 || r > 100 || !c || c < 1 || c > 20) return;
    upd({ numRows: r, numCols: c, cellData: makeEmptyGrid(r, c), tableCreated: true });
  };

  const wrapSetter = (key, currentVal) => (updater) => {
    upd({ [key]: typeof updater === 'function' ? updater(currentVal) : updater });
  };

  const handleMaterialFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) upd({ materialFiles: [...materialFiles, ...files] });
    e.target.value = '';
  };

  return (
    <div className="csj-table-card">
      {/* Card Header */}
      <div className="csj-table-card-header">
        <div className="csj-table-card-title-row">
          <span className="csj-table-card-index">Table {tableIndex + 1}</span>
          {tableCreated && (
            <span className="csj-table-card-dims">{numRows} × {numCols}</span>
          )}
        </div>
        {tableCount > 1 && (
          <button type="button" className="csj-delete-table-btn" onClick={() => onDelete(id)}>
            <Trash2 size={13} /> Delete Table
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="csj-vt-controls">
        <div className="csj-vt-control-group">
          <label className="csj-vt-control-label">Row <span className="cm-req">*</span></label>
          <input type="number" min={1} max={100} className="csj-vt-input" placeholder="1–100"
            value={rowInput} onChange={(e) => upd({ rowInput: e.target.value })} />
        </div>
        <span className="csj-vt-x">X</span>
        <div className="csj-vt-control-group">
          <label className="csj-vt-control-label">Column <span className="cm-req">*</span></label>
          <input type="number" min={1} max={20} className="csj-vt-input" placeholder="1–20"
            value={colInput} onChange={(e) => upd({ colInput: e.target.value })} />
        </div>
        <div className="csj-vt-control-group">
          <label className="csj-vt-control-label">Range of Correct answer (In %) <span className="cm-req">*</span></label>
          <input type="number" min={0} max={100} className="csj-vt-input"
            value={rangeOfCorrect} onChange={(e) => upd({ rangeOfCorrect: e.target.value })} />
        </div>
        <div className="csj-vt-control-group csj-vt-control-group--checkbox">
          <label className="csj-vt-control-label">Accounting Journal Based</label>
          <div className="csj-vt-checkbox-row">
            <input type="checkbox" className="csj-vt-checkbox"
              checked={accountingJournalBased}
              onChange={(e) => upd({ accountingJournalBased: e.target.checked })} />
            <button type="button" className="csj-info-btn" onClick={() => setShowInfoModal(true)}>
              <Info size={14} />
            </button>
          </div>
        </div>
        <div className="csj-vt-control-group">
          <label className="csj-vt-control-label csj-invisible-label">.</label>
          <button type="button" className="csj-vt-create-btn" onClick={handleCreateGrid}>Create</button>
        </div>
      </div>

      {/* Table Grid */}
      {tableCreated && cellData.length > 0 ? (
        <VariableTable
          cellData={cellData}
          setCellData={wrapSetter('cellData', cellData)}
          numRows={numRows}
          setNumRows={wrapSetter('numRows', numRows)}
          numCols={numCols}
          setNumCols={wrapSetter('numCols', numCols)}
        />
      ) : (
        <div className="csj-table-empty" />
      )}

      {/* Per-table Upload Material */}
      <div className="csj-card-upload-section">
        <div className="csj-upload-material-row">
          <span className="csj-upload-material-label">Upload Material</span>
          <button type="button" className="csj-browse-btn" onClick={() => materialFileRef.current.click()}>
            Browse File
          </button>
          <input ref={materialFileRef} type="file" multiple style={{ display: 'none' }} onChange={handleMaterialFiles} />
        </div>
        {materialFiles.length > 0 && (
          <div className="csj-material-files-list">
            {materialFiles.map((f, i) => (
              <div key={i} className="csj-material-file-item">
                <span className="csj-material-file-name">{f.name}</span>
                <button type="button" className="csj-material-file-remove"
                  onClick={() => upd({ materialFiles: materialFiles.filter((_, idx) => idx !== i) })}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showInfoModal && <AccountingJournalInfoModal onClose={() => setShowInfoModal(false)} />}
    </div>
  );
};

/* ===== Main Component ===== */
const CreateSimulationJournal = ({ onBack, onSave, initialData }) => {
  const [difficulty, setDifficulty] = useState(initialData?.level || '');
  const [category, setCategory] = useState(initialData?.parentCategory || '');
  const [simulationName, setSimulationName] = useState(initialData?.name || '');
  const [question, setQuestion] = useState(initialData?.question || '');
  const [tables, setTables] = useState([makeTableCard()]);
  const [allowFileUpload, setAllowFileUpload] = useState(initialData?.fileUploadAllowed === 'Yes');
  const [solutionFile, setSolutionFile] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const solutionFileRef = useRef(null);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleBack = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  const clearError = (k) => {
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const updateTable = (id, updates) => {
    setTables((p) => p.map((t) => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTable = (id) => {
    setTables((p) => p.filter((t) => t.id !== id));
  };

  const addTable = () => {
    setTables((p) => [...p, makeTableCard()]);
  };

  const validate = () => {
    const e = {};
    if (!difficulty) e.difficulty = 'Select difficulty level';
    if (!category) e.category = 'Select a category';
    if (!simulationName.trim()) e.simulationName = 'Simulation name is required';
    if (!question.trim()) e.question = 'Enter a question';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate() && onSave) {
      onSave({ difficulty, category, simulationName, question, tables, allowFileUpload, solutionFile, explanation });
    }
  };

  return (
    <div className="cm-page">
      <div className="cm-scroll">
        {/* Header */}
        <div className="cm-header">
          <button type="button" className="cm-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="cm-page-title">Journal Entries</h1>
        </div>

        {/* Fields Row */}
        <div className="csj-fields-row">
          <SelectDropdown label="Difficulty Level" placeholder="Select Difficulty Level"
            options={DIFFICULTY_LEVELS} value={difficulty}
            onChange={(v) => { setDifficulty(v); clearError('difficulty'); markDirty(); }}
            required error={errors.difficulty} />
          <SelectDropdown label="Category" placeholder="Nothing selected"
            options={CATEGORIES} value={category}
            onChange={(v) => { setCategory(v); clearError('category'); markDirty(); }}
            required error={errors.category} />
        </div>

        {/* Simulation Name */}
        <div className="cm-section">
          <label className="cm-label">Simulation Name <span className="cm-req">*</span></label>
          <input type="text"
            className={`cm-text-input csj-full-input ${errors.simulationName ? 'cm-text-input--error' : ''}`}
            value={simulationName}
            onChange={(e) => { setSimulationName(e.target.value); clearError('simulationName'); markDirty(); }} />
          {errors.simulationName && <span className="cm-error-msg">{errors.simulationName}</span>}
        </div>

        {/* Enter Question */}
        <div className="cm-section">
          <label className="cm-label">Enter Question <span className="cm-req">*</span></label>
          <div className={`cm-editor-card ${errors.question ? 'cm-editor-card--error' : ''}`}>
            <RichToolbar />
            <textarea className="cm-editor-area" value={question} rows={6}
              onChange={(e) => { setQuestion(e.target.value); clearError('question'); markDirty(); }} />
            <div className="cm-char-count">Characters : {question.length}</div>
          </div>
          {errors.question && <span className="cm-error-msg">{errors.question}</span>}
        </div>

        {/* Variable Table Section */}
        <div className="csj-vt-section">
          <div className="csj-vt-section-header">
            <span className="csj-vt-title">Variable Table</span>
            <button type="button" className="csj-add-table-btn" onClick={addTable}>
              <Plus size={14} /> Add Table
            </button>
          </div>

          <div className="csj-tables-list">
            {tables.map((table, index) => (
              <TableCard
                key={table.id}
                table={table}
                tableIndex={index}
                tableCount={tables.length}
                onUpdate={updateTable}
                onDelete={deleteTable}
              />
            ))}
          </div>
        </div>

        {/* Allow file upload */}
        <div className="csj-checkbox-row">
          <label className="csj-checkbox-label">
            <input type="checkbox" className="csj-checkbox"
              checked={allowFileUpload} onChange={(e) => setAllowFileUpload(e.target.checked)} />
            Allow user to upload their file
          </label>
        </div>

        {/* Upload Solution Material */}
        <div className="csj-solution-upload-row">
          <div className="csj-solution-input-wrap">
            <input type="text" className="csj-solution-input" placeholder="Upload Solution Material"
              value={solutionFile ? solutionFile.name : ''} readOnly />
          </div>
          <button type="button" className="csj-solution-browse-btn" onClick={() => solutionFileRef.current.click()}>
            Browse
          </button>
          <input ref={solutionFileRef} type="file" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files[0]) setSolutionFile(e.target.files[0]); e.target.value = ''; }} />
        </div>

        {/* Explanation */}
        <div className="cm-section">
          <label className="cm-label">Explanation :</label>
          <div className="cm-editor-card">
            <RichToolbar />
            <textarea className="cm-editor-area" rows={6}
              placeholder="Type Explanation: Why this answer is correct?"
              value={explanation} onChange={(e) => setExplanation(e.target.value)} />
            <div className="cm-char-count">Characters : {explanation.length}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="cm-footer">
        <div className="cm-footer-inner">
          <button type="button" className="cm-btn csj-btn--submit" onClick={handleSave}>Submit</button>
          <button type="button" className="cm-btn cm-btn--cancel" onClick={handleBack}>Cancel</button>
          <button type="button" className="cm-btn csj-btn--save-continue" onClick={handleSave}>Save and Continue</button>
          <button type="button" className="cm-btn cm-btn--preview"><Eye size={16} /> Preview</button>
        </div>
      </div>

      {showLeaveConfirm && (
        <ConfirmModal
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to leave? All changes will be lost."
          confirmLabel="Leave"
          cancelLabel="Stay"
          variant="warning"
          onConfirm={onBack}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}
    </div>
  );
};

export default CreateSimulationJournal;
