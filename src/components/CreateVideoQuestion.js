import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ChevronDown, Eye, Upload, Circle, Square, Video, X,
} from 'lucide-react';
import './CreateMCQ.css';
import './CreateVideoQuestion.css';
import QuestionEditorToolbar from './QuestionEditorToolbar';
import ConfirmModal from './ConfirmModal';

const DIFFICULTY_LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Bascis of Accounting - Foundation',
  'US Accounting - Foundation', 'US Accounting - Intermediate', 'CFP Exam Prep',
  'US Auditing - Foundation', 'US Auditing - Intermediate', 'EA Test',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Firms',
  'Restaurant Accounting - Foundation', 'US Business Tax - Foundation', 'IRS - Foundation',
  'Not-for-Profit Audit - US', 'CMA Part 1',
];

const SelectDropdown = ({ label, placeholder, options, value, onChange, required, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = search ? options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className="cm-field" ref={ref}>
      <label className="cm-label">{label}{required && <span className="cm-req"> *</span>}</label>
      <div className="cm-select-wrap">
        <button
          type="button"
          className={`cm-select-btn ${open ? 'cm-select-btn--open' : ''} ${error ? 'cm-select-btn--error' : ''}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={value ? '' : 'cm-placeholder'}>{value || placeholder}</span>
          <ChevronDown size={14} className={`cm-chev ${open ? 'cm-chev--open' : ''}`} />
        </button>
        {open && (
          <div className="cm-select-panel">
            <div className="cm-select-search">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="cm-select-search-input"
                autoFocus
              />
            </div>
            <div className="cm-select-list">
              <div
                className="cm-select-item cm-select-item--header"
                onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
              >
                {placeholder}
              </div>
              {filtered.map((opt) => (
                <div
                  key={opt}
                  className={`cm-select-item ${value === opt ? 'cm-select-item--sel' : ''}`}
                  onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <span className="cm-error-msg">{error}</span>}
    </div>
  );
};

const CreateVideoQuestion = ({ onBack, onSave, isEditing = false, initialData }) => {
  const [difficulty, setDifficulty] = useState(initialData?.level || 'Basic');
  const [marks, setMarks] = useState(initialData?.marks ?? '');
  const [category, setCategory] = useState(initialData?.parentCategory || '');
  const [question, setQuestion] = useState(initialData?.question || initialData?.name || '');
  const [explanation, setExplanation] = useState(initialData?.explanation || '');
  const [videoFile, setVideoFile] = useState(initialData?.videoFile || null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(initialData?.videoPreviewUrl || initialData?.recordedBlobUrl || '');
  const [materialFiles, setMaterialFiles] = useState(initialData?.materialFiles || []);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const videoFileLabel = videoFile?.name || initialData?.videoFileName || '';

  const fileInputRef = useRef(null);
  const materialInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const markDirty = () => { if (!isDirty) setIsDirty(true); };
  const handleBack = () => { if (isDirty) setShowLeaveConfirm(true); else onBack(); };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isRecording && streamRef.current) {
      videoEl.srcObject = streamRef.current;
      videoEl.muted = true;
      videoEl.play().catch(() => {});
      return;
    }

    videoEl.srcObject = null;
    if (videoPreviewUrl) {
      videoEl.src = videoPreviewUrl;
      videoEl.load();
    } else {
      videoEl.removeAttribute('src');
      videoEl.load();
    }
  }, [isRecording, videoPreviewUrl]);

  useEffect(() => () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const updatePreviewUrl = (nextUrl) => {
    setVideoPreviewUrl(nextUrl);
  };

  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      updatePreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.videoFile;
        return next;
      });
      markDirty();
    }
    e.target.value = '';
  };

  const handleMaterialFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setMaterialFiles((prev) => [...prev, ...files]);
      markDirty();
    }
    e.target.value = '';
  };

  const removeMaterialFile = (idx) => {
    setMaterialFiles((prev) => prev.filter((_, i) => i !== idx));
    markDirty();
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    const MediaRecorderCtor = window.MediaRecorder;
    if (!navigator.mediaDevices?.getUserMedia || !MediaRecorderCtor) {
      setErrors((prev) => ({ ...prev, recording: 'Recording is not supported in this browser.' }));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorderCtor(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type || 'video/webm' });
        setVideoFile(file);
        updatePreviewUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.recording;
          delete next.videoFile;
          return next;
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.recording;
        return next;
      });
      markDirty();
    } catch (error) {
      void error;
      setErrors((prev) => ({
        ...prev,
        recording: 'Unable to access the camera and microphone. Please allow permission or upload a file instead.',
      }));
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!difficulty) nextErrors.difficulty = 'Required';
    if (!marks.toString().trim()) nextErrors.marks = 'Required';
    if (!category) nextErrors.category = 'Required';
    if (!question.trim()) nextErrors.question = 'Required';
    if (!videoFile && !videoPreviewUrl) nextErrors.videoFile = 'Upload or record a video';
    if (isRecording) nextErrors.recording = 'Stop the recording before saving';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.({
      difficulty,
      marks,
      category,
      question,
      explanation,
      videoFile,
      videoFileName: videoFileLabel,
      videoPreviewUrl,
      materialFiles,
    });
  };

  const renderVideoPreview = () => {
    if (isRecording || videoPreviewUrl) {
      return (
        <video
          ref={videoRef}
          className="cv-video-element"
          controls={!isRecording}
          autoPlay={isRecording}
          muted={isRecording}
          playsInline
        />
      );
    }

    return (
      <div className="cv-video-placeholder">
        <Video size={32} />
        <span>No video selected yet</span>
        <small>Upload a file or start recording to preview it here.</small>
      </div>
    );
  };

  return (
    <div className="cm-page">
      <div className="cm-scroll">
        <div className="cm-header">
          <button type="button" className="cm-back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="cm-page-title">{isEditing ? 'Edit Video Question' : 'Video'}</h1>
        </div>

        <div className="cv-top-row">
          <SelectDropdown
            label="Select Difficulty Level"
            placeholder="Select Difficulty Level"
            options={DIFFICULTY_LEVELS}
            value={difficulty}
            onChange={(value) => { setDifficulty(value); markDirty(); }}
            required
            error={errors.difficulty}
          />

          <div className="cm-field">
            <label className="cm-label">Marks <span className="cm-req">*</span></label>
            <input
              type="number"
              min="0"
              className={`cm-text-input ${errors.marks ? 'cm-text-input--error' : ''}`}
              placeholder="e.g. 10"
              value={marks}
              onChange={(e) => { setMarks(e.target.value); markDirty(); }}
            />
            {errors.marks && <span className="cm-error-msg">{errors.marks}</span>}
          </div>

          <SelectDropdown
            label="Select Category"
            placeholder="Nothing selected"
            options={CATEGORIES}
            value={category}
            onChange={(value) => { setCategory(value); markDirty(); }}
            required
            error={errors.category}
          />
        </div>

        <div className="cv-section">
          <label className="cm-label">Enter Question <span className="cm-req">*</span></label>
          <div className={`cm-editor-card ${errors.question ? 'cm-editor-card--error' : ''}`}>
            <QuestionEditorToolbar />
            <textarea
              className="cm-editor-area"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => { setQuestion(e.target.value); markDirty(); }}
              style={{ minHeight: 180 }}
            />
            <div className="cm-char-count">Characters : {question.length}</div>
          </div>
          {errors.question && <span className="cm-error-msg">{errors.question}</span>}
        </div>

        <div className="cv-media-grid">
          <div className="cv-media-left">
            <div className="cv-upload-section">
              <label className="cm-label">Upload Video File <span className="cm-req">*</span></label>
              <div className="cv-file-row">
                <input
                  type="text"
                  className={`cm-text-input cv-file-display ${errors.videoFile ? 'cm-text-input--error' : ''}`}
                  value={videoFileLabel}
                  placeholder="Choose file"
                  readOnly
                />
                <button type="button" className="cv-browse-btn" onClick={() => fileInputRef.current?.click()}>
                  Browse
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/*"
                  hidden
                  onChange={handleVideoFileSelect}
                />
              </div>
              <div className="cv-help-text">Allowed: mp4 | webm</div>
              {errors.videoFile && <span className="cm-error-msg">{errors.videoFile}</span>}
              {errors.recording && <span className="cm-error-msg">{errors.recording}</span>}

              <div className="cv-preview-shell">
                {renderVideoPreview()}
              </div>

              <div className="cv-record-row">
                <button
                  type="button"
                  className={`cv-record-btn ${isRecording ? 'cv-record-btn--stop' : ''}`}
                  onClick={startRecording}
                >
                  {isRecording ? <Square size={15} /> : <Circle size={15} />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </div>
            </div>

            <div className="cv-upload-section">
              <label className="cm-label">Upload Material</label>
              <div className="cv-upload-row">
                <button type="button" className="cv-material-btn" onClick={() => materialInputRef.current?.click()}>
                  <Upload size={15} />
                  Browse File
                </button>
                <input
                  ref={materialInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={handleMaterialFiles}
                />
              </div>
              {materialFiles.length > 0 && (
                <div className="cv-files-list">
                  {materialFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="cv-file-chip">
                      <span className="cv-file-chip-name">{file.name}</span>
                      <button type="button" className="cv-file-chip-remove" onClick={() => removeMaterialFile(index)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="cv-media-right">
            <label className="cm-label">Explanation :</label>
            <div className="cm-editor-card">
              <QuestionEditorToolbar />
              <textarea
                className="cm-editor-area"
                placeholder="Type Explanation: Why this answer is correct?"
                value={explanation}
                onChange={(e) => { setExplanation(e.target.value); markDirty(); }}
                style={{ minHeight: 430 }}
              />
              <div className="cm-char-count">Characters : {explanation.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cm-footer">
        <div className="cm-footer-inner">
          <button type="button" className="cm-btn cm-btn--save" onClick={handleSave}>
            {isEditing ? 'Update' : 'Save'}
          </button>
          <button type="button" className="cm-btn cm-btn--cancel" onClick={handleBack}>Cancel</button>
          <button type="button" className="cm-btn cm-btn--preview" onClick={() => setShowPreview(true)}>
            <Eye size={15} />
            Preview
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="cv-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="cv-preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="cv-preview-header">
              <div>
                <h2 className="cv-preview-title">Video Preview</h2>
                <p className="cv-preview-subtitle">Review the question before saving.</p>
              </div>
              <button type="button" className="cv-preview-close" onClick={() => setShowPreview(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="cv-preview-body">
              <div className="cv-preview-grid">
                <div>
                  <div className="cv-preview-label">Difficulty Level</div>
                  <div className="cv-preview-value">{difficulty || '-'}</div>
                </div>
                <div>
                  <div className="cv-preview-label">Marks</div>
                  <div className="cv-preview-value">{marks || '-'}</div>
                </div>
                <div>
                  <div className="cv-preview-label">Category</div>
                  <div className="cv-preview-value">{category || '-'}</div>
                </div>
                <div>
                  <div className="cv-preview-label">Video File</div>
                  <div className="cv-preview-value">{videoFileLabel || 'No file selected'}</div>
                </div>
              </div>

              <div>
                <div className="cv-preview-label">Question</div>
                <div className="cv-preview-text">{question || 'No question entered yet.'}</div>
              </div>

              <div>
                <div className="cv-preview-label">Explanation</div>
                <div className="cv-preview-text">{explanation || 'No explanation entered yet.'}</div>
              </div>

              <div>
                <div className="cv-preview-label">Video Player</div>
                {videoPreviewUrl ? (
                  <video className="cv-preview-video" controls src={videoPreviewUrl} />
                ) : (
                  <div className="cv-preview-empty">No video uploaded yet.</div>
                )}
              </div>
            </div>

            <div className="cv-preview-footer">
              <button type="button" className="cv-preview-ok" onClick={() => setShowPreview(false)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {showLeaveConfirm && (
        <ConfirmModal
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to leave?"
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

export default CreateVideoQuestion;
