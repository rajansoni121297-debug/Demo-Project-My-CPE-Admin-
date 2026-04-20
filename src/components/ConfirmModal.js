import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }) => {
  const btnColor = variant === 'danger' ? '#dc2626' : variant === 'warning' ? '#d97706' : '#16a34a';
  const btnHover = variant === 'danger' ? '#b91c1c' : variant === 'warning' ? '#b45309' : '#15803d';
  const iconColor = variant === 'danger' ? '#dc2626' : variant === 'warning' ? '#d97706' : '#16a34a';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 32px', width: 420, maxWidth: '92vw', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
          <AlertTriangle size={22} style={{ color: iconColor, flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            onClick={onCancel}
            style={{ padding: '8px 22px', border: '1px solid #e0e4ea', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '8px 22px', border: 'none', borderRadius: 8, background: btnColor, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'background 0.15s' }}
            onMouseOver={(e) => e.currentTarget.style.background = btnHover}
            onMouseOut={(e) => e.currentTarget.style.background = btnColor}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
