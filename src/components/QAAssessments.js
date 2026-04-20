import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
  Plus,
  Pencil,
  Eye,
  Users,
  PlusCircle,
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import './QAAssessments.css';

const TABS = [
  { label: 'All', count: 1530 },
  { label: 'Commercial Subscription', count: 53 },
  { label: 'Prospective Hire', count: 9 },
  { label: 'Offshoring Client (Offshore Staff)', count: 0 },
  { label: 'Internal Team', count: 1277 },
  { label: 'Others', count: 1 },
];

const QUESTION_TYPES = ['MCQ', 'Video', 'AI Video', 'Subjective', 'Simulation', 'Essay'];

const COURSES = [
  'Certified Data Analytics & Power BI Mastery (CDAPBM)',
  'Qlik Sense Professional Certificate Course (QSPCC)',
  'Certified ChatGPT and AI Tools Mastery (CCAITM)',
  'CFP Prep Course',
  'AI Masterclass Certification (AIMC)',
  'Certification in Practical AI Applications (CPAIA)',
  'Complete Guide to become a Catalyst CFO (CGCC)',
  'Leadership Mastery Certificate (LMC)',
  'Certificate Course in Data-Driven Decision-making (DDDM)',
  'Certified Client Advisory Professional (CCAP)',
  'Talent Management and Development Certification (TMDC)',
  'Certificate in Organizational Development and Intervention Strategies (CODIS)',
  'Canada - Caseware- Working Paper Software Training',
  'Canada - CaseView - Financial Statement Training Templates',
  'Canada - Getting Ready for the New Compilation Standard - CSRS 4200',
  'Canada - Canadian SRED + R & D Tax Credit - 2023 Update',
];

const CREATED_BY = [
  'Shawn Parikh',
  'Gary Morya',
  'Raghav MyCPE',
  'Bhargav MyCPE',
  'Parth MyCPE',
  'Saumil MyCPE',
  'Nikhil MyCPE',
  'Harshal Trivedi',
  'Swapnil Alani',
  'Nilesh Mycpe',
  'Kinjal Mycpe',
  'Ankit Parikh',
  'Soham Buch',
  'Himanshu Naik',
  'Snehal Gajjar',
  'Shachi Shah',
];

const STATUS_OPTIONS = ['Draft', 'Active', 'Inactive'];

const CREATE_TO_LISTING_TYPE_LABEL = {
  MCQ: 'MCQ',
  SUB: 'Subjective',
  AVS: 'Video',
  'AI Video': 'AI Video',
  SIM: 'Simulation',
  ESSAY: 'Essay',
};

const normalizeQuestionType = (type) => CREATE_TO_LISTING_TYPE_LABEL[type] || type;

const buildQuestionTypeConfigsFromLegacy = (questionText) => {
  if (!questionText || typeof questionText !== 'string') return [];
  const matches = [...questionText.matchAll(/(\d+(?:\.\d+)?)\s+([A-Za-z][A-Za-z\s/-]*)/g)];
  if (matches.length === 0) return [];

  return matches.map((match) => ({
    type: normalizeQuestionType(match[2].trim()),
    noOfQues: match[1],
  }));
};

const formatQuestionSummary = (questionTypeConfigs = []) => {
  const validConfigs = questionTypeConfigs.filter((config) => config?.type && config?.noOfQues !== '' && config?.noOfQues != null);
  if (validConfigs.length === 0) return 'No question types configured';

  return validConfigs
    .map((config) => `${config.noOfQues} ${normalizeQuestionType(config.type)}`)
    .join(' + ');
};

const getAssessmentQuestionTypes = (assessment) => {
  const types = assessment.questionTypeConfigs?.map((config) => normalizeQuestionType(config.type)) || [];
  return [...new Set(types)];
};

const normalizeAssessment = (assessment) => {
  const questionTypeConfigs = assessment.questionTypeConfigs?.length
    ? assessment.questionTypeConfigs
    : buildQuestionTypeConfigsFromLegacy(assessment.questions);

  return {
    ...assessment,
    questionTypeConfigs,
  };
};

const getStatusTransitionConfig = (assessmentName, status) => {
  if (status === 'Draft') {
    return {
      nextStatus: 'Active',
      title: 'Make Assessment Live?',
      message: `The assessment "${assessmentName}" is currently in Draft. If you make it live, it will become visible for use as an Active assessment. You can still mark it Inactive later if needed, but it will not return to Draft status.`,
      confirmLabel: 'Go Live',
      variant: 'success',
    };
  }

  if (status === 'Active') {
    return {
      nextStatus: 'Inactive',
      title: 'Mark Assessment Inactive?',
      message: `The assessment "${assessmentName}" is currently Active. Marking it Inactive will stop it from being used as a live assessment until it is activated again. This change will remove it from active use, and Draft status will no longer be available.`,
      confirmLabel: 'Mark Inactive',
      variant: 'warning',
    };
  }

  if (status === 'Inactive') {
    return {
      nextStatus: 'Active',
      title: 'Activate Assessment Again?',
      message: `The assessment "${assessmentName}" is currently Inactive. Activating it again will make it live and available for use. Once reactivated, the status will become Active and it will not return to Draft status.`,
      confirmLabel: 'Activate',
      variant: 'success',
    };
  }

  return null;
};

export const INITIAL_ASSESSMENT_DATA = [
  {
    name: 'QuickBooks - QBO',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Intermediate',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ['Account Manager', 'Senior Accountant'],
  },
  {
    name: 'QuickBooks - QBO',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ['Staff Accountant', 'Junior Accountant', 'Accounting Intern'],
  },
  {
    name: 'CCH Axcess + ProSystem fx Audit Software',
    questions: '20 MCQ',
    invited: 1,
    completed: 0,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Staff","Audit Associate"],
  },
  {
    name: 'UltraTax Software',
    questions: '20 MCQ',
    invited: 1,
    completed: 0,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Associate","Junior Tax Accountant","Tax Intern"],
  },
  {
    name: 'Lacerte Tax Software',
    questions: '20 MCQ',
    invited: 1,
    completed: 0,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Associate","Junior Tax Accountant"],
  },
  {
    name: 'Drake Tax Software',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Junior Tax Accountant","Tax Intern"],
  },
  {
    name: 'CCH Axcess Tax Software',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Shubham Agrawal',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Associate","Junior Tax Accountant","Tax Intern"],
  },
  {
    name: 'NPO Audit',
    questions: '20 MCQ',
    invited: 1,
    completed: 1,
    evaluation: 0,
    pending: 0,
    level: 'Intermediate',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Associate","Audit Staff","Audit Senior"],
  },
  {
    name: 'Yellow Book (GAGAS)',
    questions: '20 MCQ',
    invited: 1,
    completed: 1,
    evaluation: 0,
    pending: 0,
    level: 'Intermediate',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Manager","Audit Supervisor","Audit Senior"],
  },
  {
    name: 'Individual Income Tax – Form 1040',
    questions: '20 MCQ',
    invited: 12,
    completed: 10,
    evaluation: 0,
    pending: 2,
    level: 'Basic',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Junior Tax Accountant","Tax Associate","Tax Intern"],
  },
  {
    name: 'Partnership Tax – Schedule K-1',
    questions: '20 MCQ',
    invited: 8,
    completed: 6,
    evaluation: 1,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Manager","Tax Supervisor","Senior Tax Accountant"],
  },
  {
    name: 'Corporate Tax – Form 1120',
    questions: '20 MCQ',
    invited: 15,
    completed: 12,
    evaluation: 0,
    pending: 3,
    level: 'Advanced',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Director","Senior Tax Manager","Tax Manager"],
  },
  {
    name: 'S-Corporation Tax – Form 1120-S',
    questions: '20 MCQ',
    invited: 6,
    completed: 5,
    evaluation: 0,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Supervisor","Tax Manager","Senior Tax Accountant"],
  },
  {
    name: 'Estate & Gift Tax Fundamentals',
    questions: '20 MCQ',
    invited: 4,
    completed: 3,
    evaluation: 0,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Director","Senior Tax Manager"],
  },
  {
    name: 'Tax Credits & Deductions Overview',
    questions: '20 MCQ',
    invited: 20,
    completed: 18,
    evaluation: 0,
    pending: 2,
    level: 'Basic',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Intern","Tax Associate","Junior Tax Accountant","Tax Supervisor","Senior Tax Accountant","Tax Manager"],
  },
  {
    name: 'Multistate Tax Nexus & Apportionment',
    questions: '20 MCQ',
    invited: 7,
    completed: 5,
    evaluation: 1,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Draft',
    usedInPtc: '-',
    mappedProfiles: ["Tax Director","Senior Tax Manager","Tax Manager"],
  },
  {
    name: 'Tax-Exempt Organizations & Form 990',
    questions: '20 MCQ',
    invited: 3,
    completed: 2,
    evaluation: 0,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Raghav MyCPE',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Supervisor","Senior Tax Accountant"],
  },
  {
    name: 'IRS Audit Representation & Appeals',
    questions: '20 MCQ',
    invited: 5,
    completed: 4,
    evaluation: 0,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Director","Senior Tax Manager","Tax Manager"],
  },
  {
    name: 'Revenue Recognition – ASC 606',
    questions: '20 MCQ',
    invited: 18,
    completed: 15,
    evaluation: 0,
    pending: 3,
    level: 'Intermediate',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Account Manager","Senior Accountant","Account Supervisor"],
  },
  {
    name: 'Lease Accounting – ASC 842',
    questions: '20 MCQ',
    invited: 11,
    completed: 9,
    evaluation: 0,
    pending: 2,
    level: 'Intermediate',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Account Manager","Finance Manager","Senior Accountant"],
  },
  {
    name: 'Financial Statement Analysis Basics',
    questions: '20 MCQ',
    invited: 25,
    completed: 22,
    evaluation: 0,
    pending: 3,
    level: 'Basic',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Staff Accountant","Junior Accountant","Accounting Intern"],
  },
  {
    name: 'Consolidations & Intercompany Eliminations',
    questions: '20 MCQ',
    invited: 9,
    completed: 7,
    evaluation: 1,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Accounting Director","Finance Manager","CFO"],
  },
  {
    name: 'Government & Nonprofit Accounting',
    questions: '20 MCQ',
    invited: 6,
    completed: 5,
    evaluation: 0,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Raghav MyCPE',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Senior Accountant","Account Supervisor"],
  },
  {
    name: 'Managerial Accounting & Cost Analysis',
    questions: '20 MCQ',
    invited: 14,
    completed: 12,
    evaluation: 0,
    pending: 2,
    level: 'Basic',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Staff Accountant","Junior Accountant","Accounting Intern","Account Manager"],
  },
  {
    name: 'Accounting Information Systems',
    questions: '20 MCQ',
    invited: 0,
    completed: 0,
    evaluation: 0,
    pending: 0,
    level: 'Basic',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Draft',
    usedInPtc: '-',
    mappedProfiles: ["Staff Accountant","Junior Accountant"],
  },
  {
    name: 'Risk-Based Audit Approach',
    questions: '20 MCQ',
    invited: 10,
    completed: 8,
    evaluation: 1,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Manager","Audit Supervisor","Audit Senior"],
  },
  {
    name: 'Audit Sampling & Evidence',
    questions: '20 MCQ',
    invited: 7,
    completed: 6,
    evaluation: 0,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Senior","Audit Supervisor"],
  },
  {
    name: 'Internal Controls & COSO Framework',
    questions: '20 MCQ',
    invited: 16,
    completed: 14,
    evaluation: 0,
    pending: 2,
    level: 'Advanced',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Assurance Partner","Audit Director","Senior Audit Manager","Audit Manager"],
  },
  {
    name: 'Auditing Employee Benefit Plans',
    questions: '20 MCQ',
    invited: 5,
    completed: 4,
    evaluation: 0,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Raghav MyCPE',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Senior Audit Manager","Audit Director"],
  },
  {
    name: 'IT Audit & General Controls',
    questions: '20 MCQ',
    invited: 8,
    completed: 6,
    evaluation: 1,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Manager","Audit Supervisor","Audit Senior","Audit Staff"],
  },
  {
    name: 'Fraud Detection & Prevention',
    questions: '20 MCQ',
    invited: 13,
    completed: 11,
    evaluation: 0,
    pending: 2,
    level: 'Advanced',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Assurance Partner","Audit Director","Senior Audit Manager","Audit Manager","Audit Supervisor","Audit Senior","Audit Staff","Audit Associate"],
  },
  {
    name: 'Group Audits & Component Auditors',
    questions: '20 MCQ',
    invited: 4,
    completed: 3,
    evaluation: 0,
    pending: 1,
    level: 'Advanced',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Inactive',
    usedInPtc: '-',
    mappedProfiles: ["Assurance Partner","Audit Director"],
  },
  {
    name: 'Compilation & Review Engagements',
    questions: '20 MCQ',
    invited: 9,
    completed: 8,
    evaluation: 0,
    pending: 1,
    level: 'Basic',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Audit Staff","Audit Associate"],
  },
  {
    name: 'Tax Planning Strategies for Individuals',
    questions: '20 MCQ',
    invited: 22,
    completed: 19,
    evaluation: 0,
    pending: 3,
    level: 'Intermediate',
    createdBy: 'Raghav MyCPE',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Manager","Tax Supervisor","Senior Tax Accountant"],
  },
  {
    name: 'Depreciation Methods & Section 179',
    questions: '20 MCQ',
    invited: 17,
    completed: 15,
    evaluation: 0,
    pending: 2,
    level: 'Basic',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Junior Tax Accountant","Tax Associate"],
  },
  {
    name: 'Qualified Business Income Deduction',
    questions: '20 MCQ',
    invited: 11,
    completed: 9,
    evaluation: 1,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Manager","Tax Supervisor","Senior Tax Accountant"],
  },
  {
    name: 'International Tax – GILTI & BEAT',
    questions: '20 MCQ',
    invited: 6,
    completed: 4,
    evaluation: 1,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Draft',
    usedInPtc: '-',
    mappedProfiles: ["Tax Director","Senior Tax Manager"],
  },
  {
    name: 'Payroll Tax Compliance',
    questions: '20 MCQ',
    invited: 30,
    completed: 27,
    evaluation: 0,
    pending: 3,
    level: 'Basic',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Tax Associate","Junior Tax Accountant","Tax Intern","Staff Accountant"],
  },
  {
    name: 'Sales & Use Tax Fundamentals',
    questions: '20 MCQ',
    invited: 14,
    completed: 12,
    evaluation: 0,
    pending: 2,
    level: 'Basic',
    createdBy: 'Raghav MyCPE',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Junior Tax Accountant","Tax Associate"],
  },
  {
    name: 'ASC 740 – Income Tax Accounting',
    questions: '20 MCQ',
    invited: 8,
    completed: 6,
    evaluation: 1,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Gary Morya',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Accounting Director","Finance Manager","CFO","Account Manager"],
  },
  {
    name: 'Forensic Accounting & Litigation Support',
    questions: '20 MCQ',
    invited: 5,
    completed: 4,
    evaluation: 0,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Shawn Parikh',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Finance Manager","Accounting Director"],
  },
  {
    name: 'Cash Flow Statement Preparation',
    questions: '20 MCQ',
    invited: 19,
    completed: 17,
    evaluation: 0,
    pending: 2,
    level: 'Basic',
    createdBy: 'nipun dutta',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Junior Accountant","Staff Accountant"],
  },
  {
    name: 'Business Combinations – ASC 805',
    questions: '20 MCQ',
    invited: 7,
    completed: 5,
    evaluation: 1,
    pending: 1,
    level: 'Advanced',
    createdBy: 'Harshal Trivedi',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Active',
    usedInPtc: '-',
    mappedProfiles: ["Accounting Director","Finance Manager","CFO"],
  },
  {
    name: 'Audit Quality & Peer Review Standards',
    questions: '20 MCQ',
    invited: 3,
    completed: 2,
    evaluation: 0,
    pending: 1,
    level: 'Intermediate',
    createdBy: 'Raghav MyCPE',
    assessmentReport: 'Allowed',
    sampleQuestion: 'Stored',
    status: 'Inactive',
    usedInPtc: '-',
    mappedProfiles: ["Audit Manager","Senior Audit Manager","Audit Director"],
  },
].map(normalizeAssessment);

/* ===== Mapped Profiles Component ===== */
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
    const openUp = window.innerHeight - r.bottom < 200;
    setPopoverStyle(
      openUp
        ? { position: 'fixed', bottom: window.innerHeight - r.top + 4, left: r.left, zIndex: 9999 }
        : { position: 'fixed', top: r.bottom + 4, left: r.left, zIndex: 9999 }
    );
  };

  if (!profiles || profiles.length === 0) {
    return <span className="al-profiles-empty">—</span>;
  }

  const visible = profiles.slice(0, 2);
  const hidden = profiles.slice(2);

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

/* ===== Multi-Select Dropdown Component ===== */
const MultiSelectDropdown = ({ label, placeholder, options, selected, onChange, hasSearch, includeSelectAll = true, optionCounts = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (includeSelectAll && option === placeholder) {
      onChange(selected.length === options.length ? [] : [...options]);
      return;
    }
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  const filteredOptions = hasSearch && searchTerm
    ? options.filter((o) => o.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const displayText = selected.length > 0
    ? (selected.length === options.length ? placeholder : `${selected.length} selected`)
    : placeholder;

  return (
    <div className="qa-filter-group" ref={ref}>
      <label className="qa-filter-label">{label}</label>
      <div className="qa-multiselect">
        <button
          className="qa-multiselect-btn"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className="qa-multiselect-text">{displayText}</span>
          <ChevronDown size={14} className={`qa-multiselect-chevron ${isOpen ? 'qa-multiselect-chevron--open' : ''}`} />
        </button>

        {isOpen && (
          <div className="qa-multiselect-dropdown">
            {hasSearch && (
              <div className="qa-multiselect-search">
                <input
                  type="text"
                  placeholder=""
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="qa-multiselect-search-input"
                  autoFocus
                />
              </div>
            )}
            <div className="qa-multiselect-options">
              {includeSelectAll && (
                <label className="qa-multiselect-option">
                  <span className="qa-multiselect-option-text">{placeholder}</span>
                  <input
                    type="checkbox"
                    checked={selected.length === options.length}
                    onChange={() => toggleOption(placeholder)}
                  />
                </label>
              )}
              {filteredOptions.map((option) => (
                <label key={option} className="qa-multiselect-option">
                  <span className="qa-multiselect-option-text">
                    <span>{option}</span>
                    {typeof optionCounts[option] === 'number' && (
                      <span className="qa-multiselect-option-count">({optionCounts[option]})</span>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QAAssessments = ({ onCreateAssessment, onUpdateAssessmentStatus, assessments = INITIAL_ASSESSMENT_DATA }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Commercial Subscription');
  const [perPage, setPerPage] = useState(10);
  const [currentPage] = useState(1);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(['Active']);
  const [statusChangeTarget, setStatusChangeTarget] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    selectedQuestionTypes: [],
    selectedCourses: [],
    selectedCreatedBy: [],
    selectedStatus: ['Active'],
  });

  const clearFilters = () => {
    setSelectedQuestionTypes([]);
    setSelectedCourses([]);
    setSelectedCreatedBy([]);
    setSelectedStatus([]);
    setAppliedFilters({
      searchTerm: '',
      selectedQuestionTypes: [],
      selectedCourses: [],
      selectedCreatedBy: [],
      selectedStatus: [],
    });
  };

  const handleStatusClick = (item, index) => {
    const transition = getStatusTransitionConfig(item.name, item.status);
    if (!transition) return;
    setStatusChangeTarget({
      index,
      name: item.name,
      currentStatus: item.status,
      ...transition,
    });
  };

  const confirmStatusChange = () => {
    if (!statusChangeTarget || !onUpdateAssessmentStatus) return;
    onUpdateAssessmentStatus(statusChangeTarget.index, statusChangeTarget.nextStatus);
    setStatusChangeTarget(null);
  };

  const handleSearch = () => {
    setAppliedFilters({
      searchTerm,
      selectedQuestionTypes,
      selectedCourses,
      selectedCreatedBy,
      selectedStatus,
    });
  };

  const filteredAssessments = assessments.filter((item) => {
    const normalizedQuestionSummary = formatQuestionSummary(item.questionTypeConfigs).toLowerCase();
    const searchableText = [
      item.name,
      item.createdBy,
      item.level,
      item.status,
      item.topic,
      item.course,
      normalizedQuestionSummary,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const searchMatches = !appliedFilters.searchTerm.trim()
      || searchableText.includes(appliedFilters.searchTerm.trim().toLowerCase());

    const assessmentQuestionTypes = getAssessmentQuestionTypes(item);
    const questionTypeMatches = appliedFilters.selectedQuestionTypes.length === 0
      || appliedFilters.selectedQuestionTypes.every((type) => assessmentQuestionTypes.includes(type));

    const createdByMatches = appliedFilters.selectedCreatedBy.length === 0
      || appliedFilters.selectedCreatedBy.includes(item.createdBy);

    const statusMatches = appliedFilters.selectedStatus.length === 0
      || appliedFilters.selectedStatus.includes(item.status);

    const courseSearchableText = [item.course, item.topic, item.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const courseMatches = appliedFilters.selectedCourses.length === 0
      || appliedFilters.selectedCourses.some((course) => courseSearchableText.includes(course.toLowerCase()));

    return searchMatches && questionTypeMatches && createdByMatches && statusMatches && courseMatches;
  });

  const visibleAssessments = filteredAssessments.slice(0, perPage);
  const totalPages = Math.max(1, Math.ceil(filteredAssessments.length / perPage));
  const questionTypeCounts = QUESTION_TYPES.reduce((counts, type) => {
    counts[type] = assessments.filter((assessment) => getAssessmentQuestionTypes(assessment).includes(type)).length;
    return counts;
  }, {});

  return (
    <div className="qa-assessments">
      <div className="qa-content">
      <div className="qa-sticky">
        {/* Header */}
        <div className="qa-header">
          <div className="qa-header-left">
            <Star size={20} className="qa-star-icon" />
            <h1 className="qa-title">Assessment List</h1>
          </div>

          <div className="qa-header-right">
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
            <button className="qa-create-btn" onClick={onCreateAssessment}>
              <Plus size={16} />
              Create Assessment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="qa-filters">
          <MultiSelectDropdown
            label="Question Type"
            placeholder="Nothing selected"
            options={QUESTION_TYPES}
            selected={selectedQuestionTypes}
            onChange={setSelectedQuestionTypes}
            hasSearch={false}
            optionCounts={questionTypeCounts}
          />
          <MultiSelectDropdown
            label="Course"
            placeholder="Select Course"
            options={COURSES}
            selected={selectedCourses}
            onChange={setSelectedCourses}
            hasSearch={true}
          />
          <MultiSelectDropdown
            label="Created By"
            placeholder="Select User"
            options={CREATED_BY}
            selected={selectedCreatedBy}
            onChange={setSelectedCreatedBy}
            hasSearch={true}
          />
          <MultiSelectDropdown
            label="Status"
            placeholder="Active"
            options={STATUS_OPTIONS}
            selected={selectedStatus}
            onChange={setSelectedStatus}
            hasSearch={false}
            includeSelectAll={false}
          />

          <div className="qa-filter-actions">
            <button className="clear-all-btn" onClick={clearFilters}>Clear Filter</button>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="qa-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              className={`qa-tab ${activeTab === tab.label ? 'qa-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}{' '}
              <span className="qa-tab-count">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

        {/* Table */}
        <div className="qa-table-area">
          <table className="users-table qa-table">
            <thead>
              <tr>
                <th>Assessment Name & Questions</th>
                <th>Invited</th>
                <th>Completed</th>
                <th>Evaluation</th>
                <th>Pending</th>
                <th>Level</th>
                <th>Created By</th>
                <th>Assessment Report</th>
                <th>Sample Question</th>
                <th>Mapped Profiles</th>
                <th>Status</th>
                <th>Used in ptc</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleAssessments.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="qa-name-cell">
                      <span className="qa-assessment-name">{item.name}</span>
                      <span className="qa-question-count">{formatQuestionSummary(item.questionTypeConfigs)}</span>
                    </div>
                  </td>
                  <td>{item.invited}</td>
                  <td>{item.completed}</td>
                  <td>{item.evaluation}</td>
                  <td>{item.pending}</td>
                  <td>{item.level}</td>
                  <td>{item.createdBy}</td>
                  <td><span className="qa-report-link">{item.assessmentReport}</span></td>
                  <td>{item.sampleQuestion}</td>
                  <td><MappedProfiles profiles={item.mappedProfiles} /></td>
                  <td>
                    <button
                      type="button"
                      className={`qa-status-badge qa-status-badge--interactive qa-status--${item.status.toLowerCase()}`}
                      onClick={() => handleStatusClick(item, assessments.indexOf(item))}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td>{item.usedInPtc}</td>
                  <td>
                    <div className="qa-actions">
                      <button className="qa-action-btn" title="Edit"><Pencil size={15} /></button>
                      <button className="qa-action-btn" title="View"><Eye size={15} /></button>
                      <button className="qa-action-btn" title="Users"><Users size={15} /></button>
                      <button className="qa-action-btn" title="Add"><PlusCircle size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleAssessments.length === 0 && (
                <tr>
                  <td colSpan={13} className="qa-empty-state">No assessments match the selected filters.</td>
                </tr>
              )}
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
            of {filteredAssessments.length} Events
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
      {statusChangeTarget && (
        <ConfirmModal
          title={statusChangeTarget.title}
          message={statusChangeTarget.message}
          confirmLabel={statusChangeTarget.confirmLabel}
          cancelLabel="Cancel"
          variant={statusChangeTarget.variant}
          onConfirm={confirmStatusChange}
          onCancel={() => setStatusChangeTarget(null)}
        />
      )}
    </div>
  );
};

export default QAAssessments;
