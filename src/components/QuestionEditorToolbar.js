import React from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
  Type, Paintbrush, Highlighter, Link, Image, Table, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Code, Minus, Quote,
} from 'lucide-react';

const QuestionEditorToolbar = ({ compact = false }) => (
  <div className={`cm-toolbar ${compact ? 'cm-toolbar--compact' : ''}`}>
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Bold"><Bold size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Italic"><Italic size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Underline"><Underline size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Strikethrough"><Strikethrough size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Subscript"><Subscript size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Superscript"><Superscript size={compact ? 14 : 16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Font Size"><Type size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Text Color"><Paintbrush size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Highlight"><Highlighter size={compact ? 14 : 16} /></button>
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Align Left"><AlignLeft size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Align Center"><AlignCenter size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Align Right"><AlignRight size={compact ? 14 : 16} /></button>
      {!compact && <button type="button" className="cm-tb-btn" title="Justify"><AlignJustify size={16} /></button>}
    </div>
    <span className="cm-tb-sep" />
    <div className="cm-toolbar-group">
      <button type="button" className="cm-tb-btn" title="Bulleted List"><List size={compact ? 14 : 16} /></button>
      <button type="button" className="cm-tb-btn" title="Numbered List"><ListOrdered size={compact ? 14 : 16} /></button>
    </div>
    {!compact && (
      <>
        <span className="cm-tb-sep" />
        <div className="cm-toolbar-group">
          <button type="button" className="cm-tb-btn" title="Quote"><Quote size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Link"><Link size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Image"><Image size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Table"><Table size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Code"><Code size={16} /></button>
          <button type="button" className="cm-tb-btn" title="Divider"><Minus size={16} /></button>
        </div>
      </>
    )}
  </div>
);

export default QuestionEditorToolbar;
