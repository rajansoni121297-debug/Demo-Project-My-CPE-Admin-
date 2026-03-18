import React, { useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ChevronLeft, LayoutGrid, BarChart3, FileText, ListChecks, FolderTree, ClipboardList, UserCheck, Users, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  {
    label: 'Questions and Assessments',
    icon: LayoutGrid,
    subItems: [
      { label: 'Questions', icon: FileText },
      { label: 'Assessments', icon: ListChecks },
      { label: 'Category', icon: FolderTree },
      { label: 'Report', icon: ClipboardList },
      { label: 'Role', icon: UserCheck },
    ],
  },
  {
    label: 'Assessments',
    icon: BarChart3,
    subItems: [
      { label: 'Assessment Listing', icon: ListChecks },
      { label: 'User List', icon: Users },
    ],
  },
];

const Sidebar = ({ collapsed, onToggleCollapse, onNavChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({ 1: true });
  const [activeItem, setActiveItem] = useState('User List');

  const toggleMenu = (index) => {
    if (collapsed) return;
    setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="8,4 24,14 8,24" fill="white" />
            </svg>
          </div>
        </div>

        {/* Nav items */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const isExpanded = !collapsed && !!expandedMenus[index];
            const Icon = item.icon;

            return (
              <div key={index} className="sidebar-menu-group">
                <button
                  className={`sidebar-menu-btn ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleMenu(index)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {!collapsed && (
                    <>
                      <span className="sidebar-menu-label">{item.label}</span>
                      <span className="sidebar-menu-chevron">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="sidebar-submenu">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.label}
                          className={`sidebar-submenu-item ${activeItem === sub.label ? 'active' : ''}`}
                          onClick={() => { setActiveItem(sub.label); onNavChange && onNavChange(sub.label); }}
                        >
                          <SubIcon size={16} strokeWidth={1.8} />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
