import React, { useState, useRef, useEffect } from 'react';
import {
  Search, ChevronDown, Star, Upload, Pencil, Eye, Trash2, X, Check,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import CreateMCQ from './CreateMCQ';
import CreateSimulationJournal from './CreateSimulationJournal';
import CreateSimulationOptions from './CreateSimulationOptions';
import CreateSubjective from './CreateSubjective';
import CreateAIInterview from './CreateAIInterview';
import CreateVideoQuestion from './CreateVideoQuestion';
import CreateEssayQuestion from './CreateEssayQuestion';
import './QAQuestions.css';

const PARENT_CATEGORIES = [
  'US CPA Firms Overview', 'US Individual Tax - Foundation', 'Recrutiment - Internal',
  'Bascis of Accounting - Foundation', 'US Accounting - Foundation', 'US Accounting - Intermediate',
  'CFP Exam Prep', 'US Auditing - Foundation', 'US Auditing - Intermediate',
  'Basic Communication - Offshore - Internal', 'EA Test', 'EBP Audit - PTC',
  'US Individual Tax - Intermediate', 'AI in Accounting - Internal', 'Canada CPA Firms',
  'Cannabis Business', 'Restaurant Accounting - Foundation', 'US Business Tax - Foundation',
  'IRS - Foundation', 'Not-for-Profit Audit - US', 'CMA Part 1',
];

const CHILD_CATEGORIES_MAP = {
  'US CPA Firms Overview': ['Firm Management', 'Client Relations', 'Billing & Collections'],
  'US Individual Tax - Foundation': ['Filing Requirements & Filing Status', 'Due Dates & Extensions', 'SSN& ITIN', 'Dependents', 'Injured & Innocent Spouse'],
  'Bascis of Accounting - Foundation': ['Bank Reconciliation Workflow', 'Accounting Equation', 'Business Documents', 'Terminology', 'Timesheets'],
  'US Accounting - Foundation': ['Accounting Periods & Methods', 'Revenue Recognition', 'Financial Statements'],
};

const CREATED_BY = [
  'Shawn Parikh', 'Gary Morya', 'Raghav MyCPE', 'Bhargav MyCPE', 'Parth MyCPE',
  'Saumil MyCPE', 'Nikhil MyCPE', 'Harshal Trivedi', 'Swapnil Alani', 'Nilesh Mycpe',
  'Kinjal Mycpe', 'Ankit Parikh', 'Soham Buch', 'Himanshu Naik', 'Snehal Gajjar',
  'Shachi Shah', 'Amrit MY-cpe', 'dhaval shishangiya', 'Nikunj Patel', 'Nilesh Prajapati',
];

const QUESTION_TYPES = ['MCQ', 'Video', 'AI Video', 'Subjective', 'Simulation', 'Essay'];
const LEVELS = ['Basic', 'Intermediate', 'Advanced'];
const STATUSES = ['Active', 'Inactive', 'Deleted'];
const YES_NO = ['Yes', 'No'];
const DOMAINS = ['Accounting', 'Auditing', 'Tax', 'Others'];

const ADD_QUESTION_TYPES = [
  { key: 'MCQ', label: 'Multiple Choice (MCQ)', desc: 'Standard multiple choice questions' },
  { key: 'Video', label: 'Video Question', desc: 'Video-based assessment questions' },
  { key: 'AI Video', label: 'AI Interview', desc: 'AI-powered interview questions' },
  { key: 'Subjective', label: 'AI Subjective', desc: 'AI-powered written answers' },
  { key: 'Simulation', label: 'Simulation', desc: 'Interactive simulation questions' },
  { key: 'Essay', label: 'Essay', desc: 'Long-form written responses' },
];

const MCQ_TYPES = ['MCQ', 'Yes/No', 'True/False'];

const QUESTIONS_DATA = [
  { id: 'Q00072787', name: 'To review what was reconciled last month, Daniel Ortiz at BrightLine Advisory needs to see the reconciliation history for Harbor Street Salon LLC in QBO. Which feature should he use?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'To review what was reconciled last month, Daniel Ortiz at BrightLine Advisory needs to see the reconciliation history for Harbor Street Salon LLC in QBO. Which feature should he use?', options: [{ label: 'A', text: 'Reports > Balance Sheet > Prior Month', isCorrect: false, explanation: '' }, { label: 'B', text: 'Accounting > Reconcile > History by Account', isCorrect: true, explanation: 'QBO stores completed reconciliation reports under Accounting > Reconcile > History by Account, allowing users to view any prior reconciliation by account.' }, { label: 'C', text: 'Banking > Bank Feeds > Categorized', isCorrect: false, explanation: '' }, { label: 'D', text: 'Transactions > Chart of Accounts > View Register', isCorrect: false, explanation: '' }], explanation: 'The History by Account option within the Reconcile screen in QBO displays a list of all completed reconciliations, including the period, ending balance, and a link to the reconciliation report.' },
  { id: 'Q00072786', name: 'A transaction was saved to the wrong bank account, so it never shows in the correct reconciliation for Riverstone Studio LLC. What should Kevin Walker do first to fix this?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'A transaction was saved to the wrong bank account, so it never shows in the correct reconciliation for Riverstone Studio LLC. What should Kevin Walker do first to fix this?', options: [{ label: 'A', text: 'Mark the transaction as cleared in the wrong account reconciliation', isCorrect: false, explanation: '' }, { label: 'B', text: 'Delete the transaction and re-enter it in the correct bank account', isCorrect: true, explanation: 'Deleting the incorrectly posted transaction and recreating it against the correct bank account ensures it appears in the right register and reconciliation screen.' }, { label: 'C', text: 'Create a journal entry to move the amount between accounts', isCorrect: false, explanation: '' }, { label: 'D', text: 'Void the transaction and leave it unreconciled', isCorrect: false, explanation: '' }], explanation: 'When a transaction is posted to the wrong bank account, the most direct fix in QBO is to delete it from the incorrect account and re-enter it under the correct account so it flows into the proper reconciliation.' },
  { id: 'Q00072785', name: 'One check amount differs by $100 between the bank statement and QBO for Meadowbrook HOA. What QBO step should Julian Mercer take so the item clears correctly?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'One check amount differs by $100 between the bank statement and QBO for Meadowbrook HOA. What QBO step should Julian Mercer take so the item clears correctly?', options: [{ label: 'A', text: 'Add a $100 adjusting entry at the end of reconciliation', isCorrect: false, explanation: '' }, { label: 'B', text: 'Ignore the difference and finish the reconciliation', isCorrect: false, explanation: '' }, { label: 'C', text: 'Edit the QBO transaction to match the bank statement amount', isCorrect: true, explanation: 'The bank statement is the authoritative source. Editing the QBO transaction to reflect the actual cleared amount ensures the reconciliation balances without creating artificial adjustments.' }, { label: 'D', text: 'Contact the bank to reverse the check', isCorrect: false, explanation: '' }], explanation: 'When a check amount in QBO does not match what cleared the bank, the QBO record should be corrected to the bank statement amount before attempting to clear the item in reconciliation.' },
  { id: 'Q00072784', name: 'A deposit shown on the statement does not exist in QBO for BrightWave Tutors LLC. What should Marcus Lee enter so the deposit appears in the bank account register?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'A deposit shown on the statement does not exist in QBO for BrightWave Tutors LLC. What should Marcus Lee enter so the deposit appears in the bank account register?', options: [{ label: 'A', text: 'Create an Invoice for the deposit amount', isCorrect: false, explanation: '' }, { label: 'B', text: 'Create a Bank Deposit for the missing amount', isCorrect: true, explanation: 'A Bank Deposit transaction in QBO adds funds directly to the bank account register, matching the deposit shown on the statement and allowing it to be cleared during reconciliation.' }, { label: 'C', text: 'Use the Reconcile Adjustment feature to add the deposit', isCorrect: false, explanation: '' }, { label: 'D', text: 'Record a Sales Receipt with no product or service', isCorrect: false, explanation: '' }], explanation: 'Missing deposits that appear on the bank statement but not in QBO should be recorded as Bank Deposit transactions so they appear in the register and can be checked off during reconciliation.' },
  { id: 'Q00072783', name: "Statement interest posted for Birchview Properties LLC, but Fiona O'Connor cannot clear it because it is not recorded in QBO. Which entry should she create?", type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: "Statement interest posted for Birchview Properties LLC, but Fiona O'Connor cannot clear it because it is not recorded in QBO. Which entry should she create?", options: [{ label: 'A', text: 'An Invoice for interest receivable', isCorrect: false, explanation: '' }, { label: 'B', text: 'A Journal Entry debiting Cash and crediting Interest Income', isCorrect: true, explanation: 'Bank interest earned increases the cash balance (debit Cash) and represents income (credit Interest Income), making it the correct journal entry to record unbooked interest shown on the statement.' }, { label: 'C', text: 'A Credit Memo applied to the bank account', isCorrect: false, explanation: '' }, { label: 'D', text: 'An Expense posted to Interest Expense', isCorrect: false, explanation: '' }], explanation: 'Interest earned that appears on the bank statement but is missing in QBO must be recorded as a journal entry debiting Cash and crediting Interest Income to reflect the earned income and allow the item to clear.' },
  { id: 'Q00072782', name: "Bank service charges appear on Meadowline Catering LLC's statement, but Trevor Collins cannot find them to clear. Which QBO transaction should he create?", type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: "Bank service charges appear on Meadowline Catering LLC's statement, but Trevor Collins cannot find them to clear. Which QBO transaction should he create?", options: [{ label: 'A', text: 'A Bill payable to the bank for the charges', isCorrect: false, explanation: '' }, { label: 'B', text: 'A Journal Entry debiting Bank Service Charges and crediting Cash', isCorrect: false, explanation: '' }, { label: 'C', text: 'An Expense transaction posting charges to Bank Service Charges account', isCorrect: true, explanation: 'Recording bank fees as an Expense transaction (debit Bank Service Charges, credit Bank Account) in QBO properly reduces the bank balance and makes the item available to clear during reconciliation.' }, { label: 'D', text: 'A Transfer from the bank account to a suspense account', isCorrect: false, explanation: '' }], explanation: 'Bank service charges not yet recorded in QBO should be entered as Expense transactions allocated to the Bank Service Charges expense account so they appear in the reconciliation register.' },
  { id: 'Q00072781', name: 'When Olivia Grant opens Reconcile for Harbor Stone LLC, QBO shows the prior month reconciliation is still in progress. Which action should she choose?', type: 'MCQ', level: 'Intermediate', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'When Olivia Grant opens Reconcile for Harbor Stone LLC, QBO shows the prior month reconciliation is still in progress. Which action should she choose?', options: [{ label: 'A', text: 'Start a new reconciliation for the current month and ignore the prior one', isCorrect: false, explanation: '' }, { label: 'B', text: 'Delete the prior reconciliation and begin fresh', isCorrect: false, explanation: '' }, { label: 'C', text: 'Resume the prior reconciliation to complete it before starting a new one', isCorrect: true, explanation: 'QBO saves in-progress reconciliations. Completing the prior reconciliation first ensures the beginning balance is correct for the current month and prevents cumulative discrepancies.' }, { label: 'D', text: 'Force-finish the prior reconciliation using the auto-adjust feature', isCorrect: false, explanation: '' }], explanation: 'If a prior reconciliation is in progress, it must be completed before beginning a new one. Skipping it would carry forward unresolved differences and corrupt the running reconciled balance.' },
  { id: 'Q00072780', name: 'From the Reconcile list, Grace Kim sees a check that cleared on the statement but the QBO transaction date is after the statement end date. What should she do?', type: 'MCQ', level: 'Intermediate', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'nipun dutta', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'From the Reconcile list, Grace Kim sees a check that cleared on the statement but the QBO transaction date is after the statement end date. What should she do?', options: [{ label: 'A', text: 'Skip the item and address it in the next reconciliation period', isCorrect: false, explanation: '' }, { label: 'B', text: 'Check the item in the current reconciliation even if the date is outside the statement period', isCorrect: true, explanation: 'QBO reconciliation is driven by cleared items matching the bank statement, not the transaction date. If the bank confirms the item cleared, it should be checked off to match the statement regardless of the QBO transaction date.' }, { label: 'C', text: 'Change the QBO transaction date to fall within the statement period', isCorrect: false, explanation: '' }, { label: 'D', text: 'Create a duplicate transaction with the correct date and delete the original', isCorrect: false, explanation: '' }], explanation: 'A check that has physically cleared the bank belongs in the current reconciliation. The QBO transaction date does not prevent an item from being cleared if the bank statement confirms it.' },
  { id: 'Q00072770', name: 'Which of the following best describes the matching principle in accrual accounting as applied under US GAAP?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Accounting Periods & Methods', createdBy: 'Shawn Parikh', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Which of the following best describes the matching principle in accrual accounting as applied under US GAAP?', options: [{ label: 'A', text: 'Revenue should be recorded when cash is received from customers', isCorrect: false, explanation: '' }, { label: 'B', text: 'Expenses should be recognized in the same period as the revenues they helped generate', isCorrect: true, explanation: 'The matching principle requires that expenses be recorded in the period when the related revenues are earned, not when cash is paid, ensuring accurate period profitability reporting.' }, { label: 'C', text: 'Assets should always equal liabilities on the balance sheet', isCorrect: false, explanation: '' }, { label: 'D', text: 'Financial statements must be prepared on a quarterly basis', isCorrect: false, explanation: '' }], explanation: 'Under US GAAP, the matching principle (a cornerstone of accrual accounting) dictates that costs incurred to generate revenue are expensed in the same accounting period as that revenue, regardless of cash timing.' },
  { id: 'Q00072769', name: 'Under GAAP, which financial statement shows revenues and expenses over a period and results in net income or net loss?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Financial Statements', createdBy: 'Gary Morya', status: 'Inactive', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under GAAP, which financial statement shows revenues and expenses over a period and results in net income or net loss?', options: [{ label: 'A', text: 'Balance Sheet', isCorrect: false, explanation: '' }, { label: 'B', text: 'Statement of Cash Flows', isCorrect: false, explanation: '' }, { label: 'C', text: 'Income Statement', isCorrect: true, explanation: 'The Income Statement (also called the Profit & Loss Statement) summarizes revenues earned and expenses incurred over a specific period, culminating in net income or net loss.' }, { label: 'D', text: 'Statement of Retained Earnings', isCorrect: false, explanation: '' }], explanation: 'The Income Statement is the financial statement that presents a summary of revenues, costs, and expenses during a specified period, showing the bottom-line net income or net loss for that period.' },
  { id: 'Q00072760', name: 'Record the journal entries for a business obtaining a $50,000 bank loan and using the proceeds to purchase equipment.', type: 'Simulation', subType: 'journal', level: 'Intermediate', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Financial Statements', createdBy: 'Shawn Parikh', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'Yes', question: 'Record the journal entries for a business obtaining a $50,000 bank loan and using the proceeds to purchase equipment.' },
  { id: 'Q00072759', name: 'Complete the adjusting journal entry to record one month of depreciation on office equipment purchased for $24,000 with a 4-year useful life and no salvage value.', type: 'Simulation', subType: 'journal', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Accounting Equation', createdBy: 'Gary Morya', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'Yes', question: 'Complete the adjusting journal entry to record one month of depreciation on office equipment purchased for $24,000 with a 4-year useful life and no salvage value.' },
  { id: 'Q00072758', name: 'Prepare the year-end adjusting entries for accrued salaries of $8,500 owed to employees for the last three days of December not yet paid.', type: 'Simulation', subType: 'journal', level: 'Advanced', domain: 'Accounting', parentCategory: 'US Accounting - Intermediate', childCategory: '-', createdBy: 'Raghav MyCPE', status: 'Inactive', fileUploadAllowed: 'Yes', accountingJournalBased: 'Yes', question: 'Prepare the year-end adjusting entries for accrued salaries of $8,500 owed to employees for the last three days of December not yet paid.' },
  { id: 'Q00072750', name: 'Fill in the blanks: The accounting equation states that Assets equal %%Blank1%% plus %%Blank2%%, which must always remain in balance.', type: 'Simulation', subType: 'options', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Accounting Equation', createdBy: 'Bhargav MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Fill in the blanks: The accounting equation states that Assets equal %%Blank1%% plus %%Blank2%%, which must always remain in balance.' },
  { id: 'Q00072749', name: 'In a bank reconciliation, outstanding checks are %%Blank1%% from the bank balance, while deposits in transit are %%Blank2%% to the bank balance.', type: 'Simulation', subType: 'options', level: 'Intermediate', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'Parth MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'In a bank reconciliation, outstanding checks are %%Blank1%% from the bank balance, while deposits in transit are %%Blank2%% to the bank balance.' },
  { id: 'Q00072748', name: 'Under GAAP, revenue is recognized when it is %%Blank1%% and when the amount of revenue can be reliably %%Blank2%%.', type: 'Simulation', subType: 'options', level: 'Intermediate', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Revenue Recognition', createdBy: 'Saumil MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under GAAP, revenue is recognized when it is %%Blank1%% and when the amount of revenue can be reliably %%Blank2%%.' },
  { id: 'Q00072740', name: 'Explain the difference between cash basis and accrual basis accounting.', type: 'Subjective', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Terminology', createdBy: 'Nikhil MyCPE', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Explain the difference between cash basis and accrual basis accounting.' },
  { id: 'Q00072739', name: 'Describe the steps involved in the bank reconciliation process and explain why it is a critical internal control procedure for a business.', type: 'Subjective', level: 'Intermediate', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Bank Reconciliation Workflow', createdBy: 'Harshal Trivedi', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Describe the steps involved in the bank reconciliation process and explain why it is a critical internal control procedure for a business.' },
  { id: 'Q00072738', name: 'Analyze the impact of ASC 606 on revenue recognition for long-term software subscription contracts compared to legacy percentage-of-completion methods.', type: 'Subjective', level: 'Advanced', domain: 'Auditing', parentCategory: 'US Auditing - Foundation', childCategory: '-', createdBy: 'Swapnil Alani', status: 'Inactive', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Analyze the impact of ASC 606 on revenue recognition for long-term software subscription contracts compared to legacy percentage-of-completion methods.' },
  { id: 'Q00072730', name: 'Write a comprehensive essay discussing the role of internal auditing in preventing financial fraud in large publicly-traded organizations, citing relevant standards.', type: 'Essay', level: 'Advanced', domain: 'Auditing', parentCategory: 'US Auditing - Intermediate', childCategory: '-', createdBy: 'Nilesh Mycpe', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Write a comprehensive essay discussing the role of internal auditing in preventing financial fraud in large publicly-traded organizations, citing relevant standards.' },
  { id: 'Q00072729', name: 'Discuss the key differences between US GAAP and IFRS accounting standards and their practical implications for multinational corporations preparing consolidated financials.', type: 'Essay', level: 'Intermediate', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Accounting Periods & Methods', createdBy: 'Kinjal Mycpe', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Discuss the key differences between US GAAP and IFRS accounting standards and their practical implications for multinational corporations preparing consolidated financials.' },
  { id: 'Q00071100', name: 'Under US GAAP, which depreciation method allocates the highest depreciation expense in the earliest years of an asset\'s useful life?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Accounting Periods & Methods', createdBy: 'Ankit Parikh', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under US GAAP, which depreciation method allocates the highest depreciation expense in the earliest years of an asset\'s useful life?', options: [{ label: 'A', text: 'Straight-line method', isCorrect: false, explanation: '' }, { label: 'B', text: 'Units-of-production method', isCorrect: false, explanation: '' }, { label: 'C', text: 'Double-declining balance method', isCorrect: true, explanation: 'The double-declining balance (DDB) method applies twice the straight-line rate to the book value each year, resulting in significantly higher depreciation in the early years compared to later years.' }, { label: 'D', text: 'Sum-of-the-years\'-digits method allocates less than straight-line in year one', isCorrect: false, explanation: '' }], explanation: 'Accelerated depreciation methods such as double-declining balance front-load expense recognition. DDB applies 2x the straight-line rate to the declining book value, producing the highest early-year depreciation of common GAAP methods.' },
  { id: 'Q00071101', name: 'A company uses FIFO inventory valuation during a period of rising prices. Compared to LIFO, FIFO will result in which of the following?', type: 'MCQ', level: 'Intermediate', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Financial Statements', createdBy: 'Shawn Parikh', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'A company uses FIFO inventory valuation during a period of rising prices. Compared to LIFO, FIFO will result in which of the following?', options: [{ label: 'A', text: 'Lower ending inventory and higher cost of goods sold', isCorrect: false, explanation: '' }, { label: 'B', text: 'Higher ending inventory and lower cost of goods sold', isCorrect: true, explanation: 'Under FIFO during rising prices, older (cheaper) costs flow into COGS first, leaving newer (higher) costs in ending inventory—resulting in higher inventory values and lower COGS compared to LIFO.' }, { label: 'C', text: 'The same net income as LIFO regardless of price changes', isCorrect: false, explanation: '' }, { label: 'D', text: 'Lower ending inventory and lower cost of goods sold', isCorrect: false, explanation: '' }], explanation: 'FIFO assigns the oldest (lower) costs to COGS and retains the newest (higher) costs in ending inventory during inflationary periods. This produces higher reported inventory and net income relative to LIFO.' },
  { id: 'Q00071102', name: 'On the statement of cash flows prepared using the indirect method, which of the following is added back to net income in the operating activities section?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Financial Statements', createdBy: 'Gary Morya', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'On the statement of cash flows prepared using the indirect method, which of the following is added back to net income in the operating activities section?', options: [{ label: 'A', text: 'Gain on sale of equipment', isCorrect: false, explanation: '' }, { label: 'B', text: 'Increase in accounts receivable', isCorrect: false, explanation: '' }, { label: 'C', text: 'Depreciation expense', isCorrect: true, explanation: 'Depreciation is a non-cash expense deducted in calculating net income. Under the indirect method, it is added back to reconcile net income to operating cash flows.' }, { label: 'D', text: 'Decrease in accounts payable', isCorrect: false, explanation: '' }], explanation: 'The indirect method starts with net income and adjusts for non-cash items. Depreciation reduces net income but requires no cash outflow, so it is added back to arrive at cash from operating activities.' },
  { id: 'Q00071103', name: 'Under IRC Section 179, which of the following best describes the primary benefit available to a qualifying business?', type: 'MCQ', level: 'Basic', domain: 'Tax', parentCategory: 'US Business Tax - Foundation', childCategory: '-', createdBy: 'Saumil MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under IRC Section 179, which of the following best describes the primary benefit available to a qualifying business?', options: [{ label: 'A', text: 'Deferral of tax liability to a future period', isCorrect: false, explanation: '' }, { label: 'B', text: 'Immediate expensing of the full cost of qualifying depreciable property in the year placed in service', isCorrect: true, explanation: 'Section 179 allows businesses to deduct the full purchase price of qualifying equipment and software in the year it is placed in service, rather than depreciating it over multiple years.' }, { label: 'C', text: 'A 50% credit against the business\'s tax liability for equipment purchases', isCorrect: false, explanation: '' }, { label: 'D', text: 'Exclusion of capital gains on the sale of business equipment', isCorrect: false, explanation: '' }], explanation: 'IRC Section 179 provides an election to expense (rather than capitalize and depreciate) qualifying business property up to an annual dollar limit, providing an immediate reduction in taxable income for the year of acquisition.' },
  { id: 'Q00071104', name: 'Which of the following types of audit evidence is generally considered the most reliable under AICPA auditing standards?', type: 'MCQ', level: 'Intermediate', domain: 'Auditing', parentCategory: 'US Auditing - Foundation', childCategory: '-', createdBy: 'Harshal Trivedi', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Which of the following types of audit evidence is generally considered the most reliable under AICPA auditing standards?', options: [{ label: 'A', text: 'Oral representations from the client\'s management', isCorrect: false, explanation: '' }, { label: 'B', text: 'Internally generated documents reviewed only by client personnel', isCorrect: false, explanation: '' }, { label: 'C', text: 'Externally generated evidence obtained directly by the auditor', isCorrect: true, explanation: 'Evidence obtained directly from independent external sources (e.g., bank confirmations, attorney letters) is considered most reliable because it is free from client influence and bias.' }, { label: 'D', text: 'Client-prepared schedules reconciled by the same employee who prepared them', isCorrect: false, explanation: '' }], explanation: 'Under AU-C Section 500, audit evidence is more reliable when it is obtained from independent external sources and obtained directly by the auditor, rather than originating from or passing through the client.' },
  { id: 'Q00071105', name: 'Under ASC 606, how many steps are in the revenue recognition model that entities must follow?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Revenue Recognition', createdBy: 'Nikhil MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under ASC 606, how many steps are in the revenue recognition model that entities must follow?', options: [{ label: 'A', text: 'Three steps', isCorrect: false, explanation: '' }, { label: 'B', text: 'Four steps', isCorrect: false, explanation: '' }, { label: 'C', text: 'Five steps', isCorrect: true, explanation: 'ASC 606 prescribes a five-step model: (1) identify the contract, (2) identify performance obligations, (3) determine the transaction price, (4) allocate the transaction price, and (5) recognize revenue when obligations are satisfied.' }, { label: 'D', text: 'Six steps', isCorrect: false, explanation: '' }], explanation: 'ASC 606\'s five-step revenue recognition framework replaced industry-specific guidance with a single comprehensive model applicable across all sectors and contract types.' },
  { id: 'Q00071106', name: 'Which of the following is an example of a preventive internal control in an accounts payable department?', type: 'MCQ', level: 'Intermediate', domain: 'Auditing', parentCategory: 'US Auditing - Foundation', childCategory: '-', createdBy: 'Swapnil Alani', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Which of the following is an example of a preventive internal control in an accounts payable department?', options: [{ label: 'A', text: 'Monthly bank reconciliation performed by the controller', isCorrect: false, explanation: '' }, { label: 'B', text: 'Requiring three-way matching of purchase order, receiving report, and vendor invoice before payment', isCorrect: true, explanation: 'Three-way matching prevents unauthorized or erroneous payments by verifying that goods were ordered, received, and correctly invoiced before any payment is processed—stopping errors before they occur.' }, { label: 'C', text: 'Reviewing vendor statements quarterly for discrepancies', isCorrect: false, explanation: '' }, { label: 'D', text: 'Reconciling accounts payable subsidiary ledger to the general ledger annually', isCorrect: false, explanation: '' }], explanation: 'Preventive controls stop errors or fraud before they occur. Three-way matching is a classic preventive control that gatekeeps payment approval, ensuring each payment is supported by matching documentation.' },
  { id: 'Q00071107', name: 'In a general partnership for tax purposes, how is partnership income generally taxed?', type: 'MCQ', level: 'Basic', domain: 'Tax', parentCategory: 'US Business Tax - Foundation', childCategory: '-', createdBy: 'Kinjal Mycpe', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'In a general partnership for tax purposes, how is partnership income generally taxed?', options: [{ label: 'A', text: 'The partnership pays tax at the corporate rate on all net income', isCorrect: false, explanation: '' }, { label: 'B', text: 'Partners pay tax on their distributive share of income on their individual returns, regardless of whether it was distributed', isCorrect: true, explanation: 'Partnerships are pass-through entities under Subchapter K of the IRC. Each partner includes their allocable share of partnership income on their personal return, even if cash was not actually distributed.' }, { label: 'C', text: 'Income is only taxed when actually distributed as a cash payment to partners', isCorrect: false, explanation: '' }, { label: 'D', text: 'The partnership elects to pay tax at either the entity or individual level each year', isCorrect: false, explanation: '' }], explanation: 'A partnership is a pass-through entity that files Form 1065 but pays no entity-level federal income tax. Each partner\'s K-1 reports their distributive share, which is taxed on their individual Form 1040 whether or not cash was distributed.' },
  { id: 'Q00071108', name: 'Which of the following is a key tax advantage of an S corporation compared to a C corporation for an owner-employee?', type: 'MCQ', level: 'Intermediate', domain: 'Tax', parentCategory: 'US Business Tax - Foundation', childCategory: '-', createdBy: 'Ankit Parikh', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Which of the following is a key tax advantage of an S corporation compared to a C corporation for an owner-employee?', options: [{ label: 'A', text: 'S corporation income is not subject to any federal taxes at any level', isCorrect: false, explanation: '' }, { label: 'B', text: 'S corporations can deduct dividends paid to shareholders as a business expense', isCorrect: false, explanation: '' }, { label: 'C', text: 'Pass-through income distributed to S corporation shareholders is not subject to self-employment tax', isCorrect: true, explanation: 'S corporation distributions in excess of a reasonable salary are not subject to self-employment (FICA) taxes, unlike sole proprietor or partnership income—potentially reducing payroll tax burden for owner-employees.' }, { label: 'D', text: 'C corporation dividends receive a 100% dividends-received deduction for individual shareholders', isCorrect: false, explanation: '' }], explanation: 'An S corporation owner-employee must pay a reasonable salary (subject to FICA), but any additional pass-through distributions are not subject to self-employment tax, which is a significant advantage over a sole proprietorship or partnership.' },
  { id: 'Q00071109', name: 'A company has current assets of $480,000 and current liabilities of $160,000. What is the current ratio, and what does it indicate?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'CMA Part 1', childCategory: '-', createdBy: 'Raghav MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'A company has current assets of $480,000 and current liabilities of $160,000. What is the current ratio, and what does it indicate?', options: [{ label: 'A', text: '0.33, indicating the company has more liabilities than assets', isCorrect: false, explanation: '' }, { label: 'B', text: '3.0, indicating the company has $3 of current assets for every $1 of current liabilities', isCorrect: true, explanation: 'Current ratio = Current Assets / Current Liabilities = $480,000 / $160,000 = 3.0. A ratio above 1.0 indicates the company can cover its short-term obligations, with 3.0 suggesting strong short-term liquidity.' }, { label: 'C', text: '2.0, indicating moderate liquidity', isCorrect: false, explanation: '' }, { label: 'D', text: '1.5, indicating the company is at break-even on liquidity', isCorrect: false, explanation: '' }], explanation: 'The current ratio measures short-term liquidity. At 3.0, the company has three times more current assets than current liabilities, reflecting a comfortable cushion to meet near-term obligations.' },
  { id: 'Q00071110', name: 'Which of the following best describes the allowance method for recording uncollectible accounts receivable under GAAP?', type: 'MCQ', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Financial Statements', createdBy: 'Parth MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Which of the following best describes the allowance method for recording uncollectible accounts receivable under GAAP?', options: [{ label: 'A', text: 'Bad debts are expensed only when the specific account is deemed uncollectible', isCorrect: false, explanation: '' }, { label: 'B', text: 'An estimated expense and contra-asset account are recorded in the period the related sales occur', isCorrect: true, explanation: 'The allowance method matches bad debt expense with the period of sale by estimating uncollectibles and recording a debit to Bad Debt Expense and credit to Allowance for Doubtful Accounts in the same period as the revenue.' }, { label: 'C', text: 'Receivables are reduced directly when invoices are more than 90 days overdue', isCorrect: false, explanation: '' }, { label: 'D', text: 'A reserve account is funded with cash each quarter based on collections', isCorrect: false, explanation: '' }], explanation: 'GAAP requires the allowance method because it properly matches estimated bad debt expense with the revenues generated in the same period, rather than waiting until a specific account is written off (which is the direct write-off method, generally not GAAP-compliant).' },
  { id: 'Q00071111', name: 'An employer paid $10,000 in wages to an employee. What is the employer\'s share of FICA taxes owed to the IRS on this payment?', type: 'MCQ', level: 'Basic', domain: 'Tax', parentCategory: 'IRS - Foundation', childCategory: '-', createdBy: 'Bhargav MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'An employer paid $10,000 in wages to an employee. What is the employer\'s share of FICA taxes owed to the IRS on this payment?', options: [{ label: 'A', text: '$620 (Social Security only at 6.2%)', isCorrect: false, explanation: '' }, { label: 'B', text: '$765 (Social Security 6.2% + Medicare 1.45%)', isCorrect: true, explanation: 'The employer\'s FICA obligation mirrors the employee\'s: 6.2% Social Security tax plus 1.45% Medicare tax = 7.65% on $10,000 = $765. Both the employer and employee each pay 7.65%, for a combined rate of 15.3%.' }, { label: 'C', text: '$1,530 (full FICA rate of 15.3%)', isCorrect: false, explanation: '' }, { label: 'D', text: '$145 (Medicare only at 1.45%)', isCorrect: false, explanation: '' }], explanation: 'Employer FICA taxes equal 7.65% of wages: 6.2% for Social Security and 1.45% for Medicare. On $10,000, this is $620 + $145 = $765. The employee pays a matching 7.65%, bringing the total FICA contribution to $1,530.' },
  { id: 'Q00071112', name: 'A freelance consultant received $650 from a single client during the tax year. Is the client required to issue a Form 1099-NEC?', type: 'MCQ', level: 'Basic', domain: 'Tax', parentCategory: 'US Individual Tax - Foundation', childCategory: '-', createdBy: 'Nilesh Mycpe', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'A freelance consultant received $650 from a single client during the tax year. Is the client required to issue a Form 1099-NEC?', options: [{ label: 'A', text: 'Yes, because any payment to a self-employed person requires a 1099-NEC', isCorrect: false, explanation: '' }, { label: 'B', text: 'No, because the $600 threshold was not exceeded — $650 does exceed $600, so yes', isCorrect: false, explanation: '' }, { label: 'C', text: 'Yes, because the payment of $650 meets or exceeds the $600 reporting threshold', isCorrect: true, explanation: 'The IRS requires businesses to file Form 1099-NEC for non-employee compensation of $600 or more paid to any one individual or entity in a calendar year. $650 exceeds this threshold.' }, { label: 'D', text: 'No, because 1099-NEC only applies to payments exceeding $1,000', isCorrect: false, explanation: '' }], explanation: 'Businesses must issue Form 1099-NEC to each non-employee (e.g., independent contractor) who was paid $600 or more during the tax year for services rendered in the course of a trade or business.' },
  { id: 'Q00071113', name: 'An individual taxpayer filed their federal income tax return on April 15 but did not pay the full tax owed. Which IRS penalty is most likely to apply?', type: 'MCQ', level: 'Intermediate', domain: 'Tax', parentCategory: 'EA Test', childCategory: '-', createdBy: 'Saumil MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'An individual taxpayer filed their federal income tax return on April 15 but did not pay the full tax owed. Which IRS penalty is most likely to apply?', options: [{ label: 'A', text: 'Failure-to-file penalty at 5% per month', isCorrect: false, explanation: '' }, { label: 'B', text: 'Failure-to-pay penalty at 0.5% per month on the unpaid balance', isCorrect: true, explanation: 'When a return is filed on time but the tax due is not fully paid, the IRS imposes a failure-to-pay penalty of 0.5% per month (up to 25%) on the unpaid tax balance. The failure-to-file penalty applies only when no return is filed.' }, { label: 'C', text: 'Substantial understatement penalty of 20% of the underpayment', isCorrect: false, explanation: '' }, { label: 'D', text: 'No penalty applies if the return was filed on time', isCorrect: false, explanation: '' }], explanation: 'The failure-to-pay penalty under IRC Section 6651(a)(2) is 0.5% per month of the unpaid tax, distinct from the failure-to-file penalty. Filing on time does not eliminate the obligation to pay by the due date.' },
  { id: 'Q00071114', name: 'Under US Generally Accepted Auditing Standards (GAAS), which standard relates to the auditor\'s responsibility for due professional care?', type: 'MCQ', level: 'Intermediate', domain: 'Auditing', parentCategory: 'US Auditing - Intermediate', childCategory: '-', createdBy: 'Shawn Parikh', status: 'Inactive', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under US Generally Accepted Auditing Standards (GAAS), which standard relates to the auditor\'s responsibility for due professional care?', options: [{ label: 'A', text: 'The first general standard requiring adequate technical training and proficiency', isCorrect: false, explanation: '' }, { label: 'B', text: 'The third general standard requiring due professional care in performance and report preparation', isCorrect: true, explanation: 'The third general standard (now reflected in AU-C Section 200) requires that due professional care be exercised in planning and performing the audit and in preparing the report, encompassing professional skepticism and judgment.' }, { label: 'C', text: 'The second fieldwork standard requiring sufficient understanding of internal control', isCorrect: false, explanation: '' }, { label: 'D', text: 'The first reporting standard requiring the report to state whether financials are GAAP-compliant', isCorrect: false, explanation: '' }], explanation: 'The third general standard under GAAS requires due professional care, which includes exercising professional skepticism, maintaining appropriate independence in mental attitude, and applying diligent attention throughout all phases of the audit.' },
  { id: 'Q00071200', name: 'Record the payroll journal entries for a bi-weekly payroll period: gross wages $25,000, federal income tax withheld $3,750, Social Security withheld $1,550, Medicare withheld $363, and net pay $19,337.', type: 'Simulation', subType: 'journal', level: 'Intermediate', domain: 'Tax', parentCategory: 'IRS - Foundation', childCategory: '-', createdBy: 'Ankit Parikh', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'Yes', question: 'Record the payroll journal entries for a bi-weekly payroll period: gross wages $25,000, federal income tax withheld $3,750, Social Security withheld $1,550, Medicare withheld $363, and net pay $19,337.' },
  { id: 'Q00071201', name: 'Prepare the journal entry to record the purchase of $18,000 of merchandise inventory on account from a vendor, with terms 2/10 net 30.', type: 'Simulation', subType: 'journal', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Accounting Equation', createdBy: 'Parth MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'Yes', question: 'Prepare the journal entry to record the purchase of $18,000 of merchandise inventory on account from a vendor, with terms 2/10 net 30.' },
  { id: 'Q00071202', name: 'A retailer collected $5,300 in cash from customers, which includes $300 of sales tax at a 6% rate. Record the journal entry to properly separate sales revenue from the sales tax liability.', type: 'Simulation', subType: 'journal', level: 'Basic', domain: 'Tax', parentCategory: 'US Business Tax - Foundation', childCategory: '-', createdBy: 'Bhargav MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'Yes', question: 'A retailer collected $5,300 in cash from customers, which includes $300 of sales tax at a 6% rate. Record the journal entry to properly separate sales revenue from the sales tax liability.' },
  { id: 'Q00071300', name: 'The net realizable value of accounts receivable equals gross accounts receivable minus the %%Blank1%% for doubtful accounts, representing the amount the company expects to %%Blank2%%.', type: 'Simulation', subType: 'options', level: 'Basic', domain: 'Accounting', parentCategory: 'US Accounting - Foundation', childCategory: 'Financial Statements', createdBy: 'Nikhil MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'The net realizable value of accounts receivable equals gross accounts receivable minus the %%Blank1%% for doubtful accounts, representing the amount the company expects to %%Blank2%%.' },
  { id: 'Q00071301', name: 'Under the straight-line depreciation method, annual depreciation expense equals the asset\'s cost minus its %%Blank1%% value, divided by its estimated %%Blank2%% life.', type: 'Simulation', subType: 'options', level: 'Basic', domain: 'Accounting', parentCategory: 'Bascis of Accounting - Foundation', childCategory: 'Accounting Equation', createdBy: 'Harshal Trivedi', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under the straight-line depreciation method, annual depreciation expense equals the asset\'s cost minus its %%Blank1%% value, divided by its estimated %%Blank2%% life.' },
  { id: 'Q00071302', name: 'Under US GAAS, the auditor must maintain %%Blank1%% independence and %%Blank2%% independence from the audit client to issue an unbiased opinion.', type: 'Simulation', subType: 'options', level: 'Intermediate', domain: 'Auditing', parentCategory: 'US Auditing - Foundation', childCategory: '-', createdBy: 'Swapnil Alani', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Under US GAAS, the auditor must maintain %%Blank1%% independence and %%Blank2%% independence from the audit client to issue an unbiased opinion.' },
  { id: 'Q00071400', name: 'Discuss at least three tax planning strategies that a small business owner can implement before year-end to legally minimize their federal income tax liability.', type: 'Subjective', level: 'Intermediate', domain: 'Tax', parentCategory: 'US Individual Tax - Intermediate', childCategory: '-', createdBy: 'Kinjal Mycpe', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Discuss at least three tax planning strategies that a small business owner can implement before year-end to legally minimize their federal income tax liability.' },
  { id: 'Q00071401', name: 'Explain the concept of internal audit independence, the threats that can compromise it, and the safeguards auditors should employ to maintain objectivity.', type: 'Subjective', level: 'Advanced', domain: 'Auditing', parentCategory: 'US Auditing - Intermediate', childCategory: '-', createdBy: 'Raghav MyCPE', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Explain the concept of internal audit independence, the threats that can compromise it, and the safeguards auditors should employ to maintain objectivity.' },
  { id: 'Q00071402', name: 'Describe the factors an auditor considers when evaluating whether a substantial doubt about a client\'s ability to continue as a going concern has been mitigated.', type: 'Subjective', level: 'Advanced', domain: 'Auditing', parentCategory: 'Not-for-Profit Audit - US', childCategory: '-', createdBy: 'Nilesh Mycpe', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Describe the factors an auditor considers when evaluating whether a substantial doubt about a client\'s ability to continue as a going concern has been mitigated.' },
  { id: 'Q00071403', name: 'Interpret the following financial ratios for a manufacturing company and explain what they indicate about the company\'s financial health: current ratio of 1.2, debt-to-equity ratio of 3.5, and return on assets of 2%.', type: 'Subjective', level: 'Intermediate', domain: 'Accounting', parentCategory: 'CMA Part 1', childCategory: '-', createdBy: 'Ankit Parikh', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Interpret the following financial ratios for a manufacturing company and explain what they indicate about the company\'s financial health: current ratio of 1.2, debt-to-equity ratio of 3.5, and return on assets of 2%.' },
  { id: 'Q00071404', name: 'Discuss the ethical obligations of a CPA under the AICPA Code of Professional Conduct when they discover that a client has materially misstated financial statements that have already been issued to investors.', type: 'Subjective', level: 'Advanced', domain: 'Auditing', parentCategory: 'US Auditing - Foundation', childCategory: '-', createdBy: 'Shawn Parikh', status: 'Inactive', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Discuss the ethical obligations of a CPA under the AICPA Code of Professional Conduct when they discover that a client has materially misstated financial statements that have already been issued to investors.' },
  { id: 'Q00071500', name: 'Write a comprehensive essay evaluating how PCAOB Auditing Standards have strengthened audit quality and investor protection for publicly traded companies since the Sarbanes-Oxley Act of 2002, and identify areas where gaps remain.', type: 'Essay', level: 'Advanced', domain: 'Auditing', parentCategory: 'US Auditing - Intermediate', childCategory: '-', createdBy: 'Gary Morya', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Write a comprehensive essay evaluating how PCAOB Auditing Standards have strengthened audit quality and investor protection for publicly traded companies since the Sarbanes-Oxley Act of 2002, and identify areas where gaps remain.' },
  { id: 'Q00071501', name: 'Discuss the effects of significant US federal tax reform legislation (such as the Tax Cuts and Jobs Act of 2017) on C corporations, pass-through entities, and individual taxpayers, addressing both intended and unintended economic consequences.', type: 'Essay', level: 'Advanced', domain: 'Tax', parentCategory: 'US Business Tax - Foundation', childCategory: '-', createdBy: 'Harshal Trivedi', status: 'Active', fileUploadAllowed: 'Yes', accountingJournalBased: 'No', question: 'Discuss the effects of significant US federal tax reform legislation (such as the Tax Cuts and Jobs Act of 2017) on C corporations, pass-through entities, and individual taxpayers, addressing both intended and unintended economic consequences.' },
  { id: 'Q00071502', name: 'Analyze how emerging technologies—including artificial intelligence, data analytics, and blockchain—are transforming modern audit practices, and evaluate the risks and opportunities these technologies present for audit quality, independence, and the future of the profession.', type: 'Essay', level: 'Advanced', domain: 'Auditing', parentCategory: 'US Auditing - Intermediate', childCategory: '-', createdBy: 'Saumil MyCPE', status: 'Active', fileUploadAllowed: 'No', accountingJournalBased: 'No', question: 'Analyze how emerging technologies—including artificial intelligence, data analytics, and blockchain—are transforming modern audit practices, and evaluate the risks and opportunities these technologies present for audit quality, independence, and the future of the profession.' },
];

/* ===== Parent-Child Linked Dropdown ===== */
const ParentChildDropdown = ({ parentLabel, childLabel, parentOptions, childMap, selectedParent, onParentChange, selectedChild, onChildChange }) => {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState('');
  const parentRef = useRef(null);
  const childRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (parentRef.current && !parentRef.current.contains(e.target)) setParentOpen(false);
      if (childRef.current && !childRef.current.contains(e.target)) setChildOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredParents = parentSearch
    ? parentOptions.filter((p) => p.toLowerCase().includes(parentSearch.toLowerCase()))
    : parentOptions;

  const childOptions = selectedParent ? (childMap[selectedParent] || []) : [];

  return (
    <>
      <div className="qq-filter-group" ref={parentRef}>
        <label className="qq-filter-label">{parentLabel}</label>
        <div className="qq-dropdown-wrap">
          <button className={`qq-dropdown-btn ${parentOpen ? 'qq-dropdown-btn--open' : ''}`} onClick={() => setParentOpen(!parentOpen)}>
            <span className={selectedParent ? '' : 'qq-placeholder'}>{selectedParent || `Select ${parentLabel}`}</span>
            <ChevronDown size={14} className={`qq-chev ${parentOpen ? 'qq-chev--open' : ''}`} />
          </button>
          {parentOpen && (
            <div className="qq-dropdown-panel">
              <div className="qq-dropdown-search">
                <input type="text" value={parentSearch} onChange={(e) => setParentSearch(e.target.value)} placeholder="Search..." className="qq-dropdown-search-input" autoFocus />
              </div>
              <div className="qq-dropdown-list">
                <div className="qq-dropdown-item qq-dropdown-item--header" onClick={() => { onParentChange(''); onChildChange(''); setParentOpen(false); setParentSearch(''); }}>
                  Select {parentLabel}
                </div>
                {filteredParents.map((p) => (
                  <div key={p} className={`qq-dropdown-item ${selectedParent === p ? 'qq-dropdown-item--sel' : ''}`}
                    onClick={() => { onParentChange(p); onChildChange(''); setParentOpen(false); setParentSearch(''); }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="qq-filter-group" ref={childRef}>
        <label className="qq-filter-label">{childLabel}</label>
        <div className="qq-dropdown-wrap">
          <button className={`qq-dropdown-btn ${childOpen ? 'qq-dropdown-btn--open' : ''}`}
            onClick={() => { if (selectedParent) setChildOpen(!childOpen); }}>
            <span className={selectedChild ? '' : 'qq-placeholder'}>{selectedChild || 'Nothing selected'}</span>
            <ChevronDown size={14} className={`qq-chev ${childOpen ? 'qq-chev--open' : ''}`} />
          </button>
          {childOpen && (
            <div className="qq-dropdown-panel">
              <div className="qq-dropdown-list">
                {childOptions.length > 0 ? childOptions.map((c) => (
                  <div key={c} className={`qq-dropdown-item ${selectedChild === c ? 'qq-dropdown-item--sel' : ''}`}
                    onClick={() => { onChildChange(c); setChildOpen(false); }}>
                    {c}
                  </div>
                )) : (
                  <div className="qq-dropdown-empty">Select Parent Category First</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ===== Add Question Dropdown ===== */
const AddQuestionDropdown = ({ onSelectType }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div className="qq-add-wrap" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="qq-add-btn">
        Add Question <ChevronDown size={14} />
      </button>
      {open && (
        <div className="qq-add-panel">
          {ADD_QUESTION_TYPES.map((t) => (
            <div key={t.key} className="qq-add-item" onClick={() => { setOpen(false); onSelectType(t.key); }}>
              <span className="qq-add-item-label">{t.label}</span>
              <span className="qq-add-item-desc">{t.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== MCQ Type Selection Sub-Screen ===== */
const MCQTypeSelection = ({ onBack, onProceed }) => {
  const [selectedMCQType, setSelectedMCQType] = useState('');
  const [mcqDropdownOpen, setMcqDropdownOpen] = useState(false);
  const [mcqSearch, setMcqSearch] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const mcqDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const isTemplateUploaded = uploadedFile !== null;
  const isDropdownDisabled = isTemplateUploaded; // Dropdown disabled when template uploaded
  const isUploadDisabled = selectedMCQType !== ''; // Upload disabled when MCQ type selected

  useEffect(() => {
    const h = (e) => { if (mcqDropdownRef.current && !mcqDropdownRef.current.contains(e.target)) setMcqDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredMCQTypes = mcqSearch
    ? MCQ_TYPES.filter((t) => t.toLowerCase().includes(mcqSearch.toLowerCase()))
    : MCQ_TYPES;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleClearSelection = () => {
    setSelectedMCQType('');
    setMcqSearch('');
  };

  const handleProceed = () => {
    onProceed(selectedMCQType);
  };

  const handleDownloadTemplate = () => {
    alert('Downloading MCQ template file...');
  };

  return (
    <div className="qa-questions">
      <div className="qq-content">
        {/* Sub-screen Header */}
        <div className="mcq-sub-header">
          <button className="mcq-back-btn" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="mcq-sub-title">Add Question</h1>
        </div>
        <div className="mcq-sub-tag">
          <Star size={16} className="mcq-sub-tag-icon" />
          <span>Multiple Choice Question</span>
        </div>

        {/* Selection Card */}
        <div className="mcq-select-card">
          <h2 className="mcq-card-title">Choose how you want to add questions?</h2>
          <p className="mcq-card-desc">
            Use the dropdown to add questions manually, or upload a template to add questions in bulk.
          </p>

          {/* MCQ Type Dropdown with Clear */}
          <div className="mcq-type-row">
            <div className={`mcq-type-dropdown ${isDropdownDisabled ? 'mcq-type-dropdown--disabled' : ''}`} ref={mcqDropdownRef}>
              <button
                className={`mcq-type-btn ${mcqDropdownOpen ? 'mcq-type-btn--open' : ''} ${isDropdownDisabled ? 'mcq-type-btn--disabled' : ''}`}
                onClick={() => { if (!isDropdownDisabled) setMcqDropdownOpen(!mcqDropdownOpen); }}
                disabled={isDropdownDisabled}
              >
                <span className={selectedMCQType ? '' : 'qq-placeholder'}>
                  {selectedMCQType || 'Select MCQ Type'}
                </span>
                <ChevronDown size={14} className={`qq-chev ${mcqDropdownOpen ? 'qq-chev--open' : ''}`} />
              </button>
              {mcqDropdownOpen && (
                <div className="mcq-type-panel">
                  <div className="qq-dropdown-search">
                    <input
                      type="text"
                      value={mcqSearch}
                      onChange={(e) => setMcqSearch(e.target.value)}
                      placeholder="Search..."
                      className="qq-dropdown-search-input"
                      autoFocus
                    />
                  </div>
                  <div className="qq-dropdown-list">
                    <div
                      className="qq-dropdown-item qq-dropdown-item--header"
                      onClick={() => { setSelectedMCQType(''); setMcqDropdownOpen(false); setMcqSearch(''); }}
                    >
                      Select MCQ Type
                    </div>
                    {filteredMCQTypes.map((t) => (
                      <div
                        key={t}
                        className={`qq-dropdown-item ${selectedMCQType === t ? 'qq-dropdown-item--sel' : ''}`}
                        onClick={() => { setSelectedMCQType(t); setMcqDropdownOpen(false); setMcqSearch(''); }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedMCQType && (
              <button className="mcq-clear-btn" onClick={handleClearSelection}>
                Clear
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mcq-divider">
            <span className="mcq-divider-line" />
            <span className="mcq-divider-text">OR</span>
            <span className="mcq-divider-line" />
          </div>

          {/* Upload Template */}
          <div className={`mcq-upload-section ${isUploadDisabled ? 'mcq-upload-section--disabled' : ''}`}>
            {!isTemplateUploaded ? (
              <>
                <button
                  className={`mcq-upload-btn ${isUploadDisabled ? 'mcq-upload-btn--disabled' : ''}`}
                  onClick={() => { if (!isUploadDisabled) fileInputRef.current.click(); }}
                  disabled={isUploadDisabled}
                >
                  <Upload size={16} />
                  Select Template File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <div className="mcq-uploaded-file">
                <div className="mcq-uploaded-file-info">
                  <Upload size={16} className="mcq-uploaded-file-icon" />
                  <span className="mcq-uploaded-file-name">{uploadedFile.name}</span>
                  <span className="mcq-uploaded-file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button className="mcq-remove-file-btn" onClick={handleRemoveFile}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Download Template Link */}
          <button className="mcq-download-link" onClick={handleDownloadTemplate}>
            Download Template File
          </button>

          {/* Proceed CTA - inside card */}
          {selectedMCQType && (
            <button className="mcq-proceed-btn" onClick={handleProceed}>
              Proceed to Create MCQ Manually <span className="mcq-proceed-arrow">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== AI Subjective Type Selection Sub-Screen ===== */
const SubjectiveTypeSelection = ({ onBack, onProceed }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const isTemplateUploaded = uploadedFile !== null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleDownloadTemplate = () => {
    alert('Downloading AI Subjective template file...');
  };

  return (
    <div className="qa-questions">
      <div className="qq-content">
        <div className="mcq-sub-header">
          <button className="mcq-back-btn" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="mcq-sub-title">Add Question</h1>
        </div>
        <div className="mcq-sub-tag">
          <Star size={16} className="mcq-sub-tag-icon" />
          <span>AI Subjective</span>
        </div>

        <div className="mcq-select-card">
          <h2 className="mcq-card-title">Choose how you want to add questions?</h2>
          <p className="mcq-card-desc">
            Enter the question manually, or upload a template to add questions in bulk.
          </p>

          {/* Manual Entry Button */}
          <div className="mcq-type-row">
            {!isTemplateUploaded && (
              <button className="mcq-proceed-btn" onClick={() => onProceed('manual')}>
                Enter Question Manually <span className="mcq-proceed-arrow">→</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mcq-divider">
            <span className="mcq-divider-line" />
            <span className="mcq-divider-text">OR</span>
            <span className="mcq-divider-line" />
          </div>

          {/* Upload Template */}
          <div className="mcq-upload-section">
            {!isTemplateUploaded ? (
              <>
                <button
                  className="mcq-upload-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload size={16} />
                  Select Template File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <div className="mcq-uploaded-file">
                <div className="mcq-uploaded-file-info">
                  <Upload size={16} className="mcq-uploaded-file-icon" />
                  <span className="mcq-uploaded-file-name">{uploadedFile.name}</span>
                  <span className="mcq-uploaded-file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button className="mcq-remove-file-btn" onClick={handleRemoveFile}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Download Template Link */}
          <button className="mcq-download-link" onClick={handleDownloadTemplate}>
            Download Template File
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== AI Interview Type Selection Sub-Screen ===== */
const InterviewTypeSelection = ({ onBack, onProceed }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const isTemplateUploaded = uploadedFile !== null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleDownloadTemplate = () => {
    alert('Downloading AI Interview template file...');
  };

  return (
    <div className="qa-questions">
      <div className="qq-content">
        <div className="mcq-sub-header">
          <button className="mcq-back-btn" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="mcq-sub-title">Add Question</h1>
        </div>
        <div className="mcq-sub-tag">
          <Star size={16} className="mcq-sub-tag-icon" />
          <span>AI Interview</span>
        </div>

        <div className="mcq-select-card">
          <h2 className="mcq-card-title">Choose how you want to add questions?</h2>
          <p className="mcq-card-desc">
            Enter the question manually, or upload a template to add questions in bulk.
          </p>

          {/* Manual Entry Button */}
          <div className="mcq-type-row">
            {!isTemplateUploaded && (
              <button className="mcq-proceed-btn" onClick={() => onProceed('manual')}>
                Enter Question Manually <span className="mcq-proceed-arrow">→</span>
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mcq-divider">
            <span className="mcq-divider-line" />
            <span className="mcq-divider-text">OR</span>
            <span className="mcq-divider-line" />
          </div>

          {/* Upload Template */}
          <div className="mcq-upload-section">
            {!isTemplateUploaded ? (
              <>
                <button
                  className="mcq-upload-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload size={16} />
                  Select Template File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <div className="mcq-uploaded-file">
                <div className="mcq-uploaded-file-info">
                  <Upload size={16} className="mcq-uploaded-file-icon" />
                  <span className="mcq-uploaded-file-name">{uploadedFile.name}</span>
                  <span className="mcq-uploaded-file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button className="mcq-remove-file-btn" onClick={handleRemoveFile}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Download Template Link */}
          <button className="mcq-download-link" onClick={handleDownloadTemplate}>
            Download Template File
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== Confirm Modal ===== */
const ConfirmModal = ({ title, message, confirmLabel, variant, onConfirm, onCancel }) => (
  <div className="qq-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
    <div className="qq-modal">
      <div className="qq-modal-header">
        <h3 className="qq-modal-title">{title}</h3>
        <button className="qq-modal-close" onClick={onCancel}><X size={16} /></button>
      </div>
      <div className="qq-modal-body">
        <p className="qq-modal-message">{message}</p>
      </div>
      <div className="qq-modal-footer">
        <button className="qq-modal-btn qq-modal-btn--cancel" onClick={onCancel}>Cancel</button>
        <button className={`qq-modal-btn qq-modal-btn--${variant}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

/* ===== Simulation Type Selection ===== */
const SimulationTypeSelection = ({ onBack, onSelectJournal, onSelectOptions }) => (
  <div className="qa-questions">
    <div className="qq-content">
      <div className="mcq-sub-header">
        <button className="mcq-back-btn" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="mcq-sub-title">Add Question</h1>
      </div>
      <div className="mcq-sub-tag">
        <Star size={16} className="mcq-sub-tag-icon" />
        <span>Simulation</span>
      </div>
      <div className="mcq-select-card">
        <h2 className="mcq-card-title">Choose simulation type</h2>
        <p className="mcq-card-desc">Select how you want to create this simulation question.</p>
        <div className="sim-type-grid">
          <button className="sim-type-btn" onClick={onSelectJournal}>
            <span className="sim-type-label">Journal Entry</span>
            <span className="sim-type-desc">Create a journal entry simulation with a variable table</span>
          </button>
          <button className="sim-type-btn" onClick={onSelectOptions}>
            <span className="sim-type-label">Options</span>
            <span className="sim-type-desc">Fill-in-the-blank simulation with variable options</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ===== Main Component ===== */
const QAQuestions = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState([]);
  const [selectedFileUpload, setSelectedFileUpload] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subScreen, setSubScreen] = useState(null); // null | 'mcq' | 'createMCQ' | 'simulation' | 'createSimulationJournal' | 'createSimulationOptions' | 'subjective' | 'createSubjective' | 'createVideoQuestion' | 'createEssayQuestion' | 'aiInterview' | 'createAIInterview'
  const [selectedMCQTypeForCreate, setSelectedMCQTypeForCreate] = useState('');
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [questionStatuses, setQuestionStatuses] = useState({}); // { id: 'Active' | 'Inactive' }
  const [pendingAction, setPendingAction] = useState(null); // { type: 'delete'|'status'|'bulkDelete', q? }
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({
    parent: '', child: '', createdBy: [], types: [], levels: [], statuses: [],
    journal: [], fileUpload: [], domains: [], search: '',
  });

  const hasChecked = checkedRows.length > 0;

  // Pagination — computed after displayQuestions is defined below
  // (declarations here; actual slice happens after displayQuestions)

  const toggleRow = (id) => {
    setCheckedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const clearFilters = () => {
    setSelectedParent(''); setSelectedChild(''); setSelectedCreatedBy([]);
    setSelectedTypes([]); setSelectedLevels([]); setSelectedStatuses([]);
    setSelectedJournal([]); setSelectedFileUpload([]); setSelectedDomains([]);
    setSearchTerm('');
    setCurrentPage(1);
    setAppliedFilters({ parent: '', child: '', createdBy: [], types: [], levels: [], statuses: [], journal: [], fileUpload: [], domains: [], search: '' });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedFilters({
      parent: selectedParent, child: selectedChild, createdBy: selectedCreatedBy,
      types: selectedTypes, levels: selectedLevels, statuses: selectedStatuses,
      journal: selectedJournal, fileUpload: selectedFileUpload, domains: selectedDomains,
      search: searchTerm,
    });
  };

  const getStatus = (q) => questionStatuses[q.id] ?? q.status;

  const seenQuestionIds = new Set();
  const allQuestions = [...savedQuestions, ...QUESTIONS_DATA].filter((q) => {
    if (deletedIds.includes(q.id)) return false;
    if (seenQuestionIds.has(q.id)) return false;
    seenQuestionIds.add(q.id);
    return true;
  });

  const displayQuestions = allQuestions.filter((q) => {
    const af = appliedFilters;
    const status = getStatus(q);
    if (af.parent && q.parentCategory !== af.parent) return false;
    if (af.child && q.childCategory !== af.child) return false;
    if (af.createdBy.length && !af.createdBy.includes(q.createdBy)) return false;
    if (af.types.length && !af.types.includes(q.type)) return false;
    if (af.levels.length && !af.levels.includes(q.level)) return false;
    if (af.statuses.length && !af.statuses.includes(status)) return false;
    if (af.journal.length && !af.journal.includes(q.accountingJournalBased)) return false;
    if (af.fileUpload.length && !af.fileUpload.includes(q.fileUploadAllowed)) return false;
    if (af.domains.length && !af.domains.includes(q.domain)) return false;
    if (af.search) {
      const s = af.search.toLowerCase();
      if (!q.name.toLowerCase().includes(s) && !q.id.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(displayQuestions.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagedQuestions = displayQuestions.slice((safePage - 1) * perPage, safePage * perPage);

  const pageIds = pagedQuestions.map((q) => q.id);
  const allPageChecked = pageIds.length > 0 && pageIds.every((id) => checkedRows.includes(id));

  const toggleSelectAll = () => {
    if (allPageChecked) {
      setCheckedRows((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setCheckedRows((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const confirmDelete = () => {
    const { q } = pendingAction;
    setDeletedIds((prev) => [...prev, q.id]);
    setSavedQuestions((prev) => prev.filter((sq) => sq.id !== q.id));
    setCheckedRows((prev) => prev.filter((id) => id !== q.id));
    setPendingAction(null);
    if (showToast) showToast('Question deleted successfully!', 'success');
  };

  const confirmStatusChange = () => {
    const { q } = pendingAction;
    const current = getStatus(q);
    setQuestionStatuses((prev) => ({ ...prev, [q.id]: current === 'Active' ? 'Inactive' : 'Active' }));
    setPendingAction(null);
  };

  const handleEditQuestion = (q) => {
    setIsEditing(true);
    setEditingQuestion(q);
    if (q.type === 'MCQ' || q.type === 'Yes/No' || q.type === 'True/False') {
      setSelectedMCQTypeForCreate(q.type);
      setSubScreen('createMCQ');
    } else if (q.type === 'Simulation' && q.subType === 'journal') {
      setSubScreen('createSimulationJournal');
    } else if (q.type === 'Simulation' && q.subType === 'options') {
      setSubScreen('createSimulationOptions');
    } else if (q.type === 'Subjective' || q.type === 'Essay') {
      setSubScreen(q.type === 'Essay' ? 'createEssayQuestion' : 'createSubjective');
    } else if (q.type === 'Video') {
      setSubScreen('createVideoQuestion');
    } else if (q.type === 'AI Video') {
      setSubScreen('createAIInterview');
    } else {
      setIsEditing(false);
      setEditingQuestion(null);
      if (showToast) showToast(`Edit for "${q.type}" coming soon!`, 'success');
    }
  };

  const handleAddQuestionType = (type) => {
    setIsEditing(false);
    setEditingQuestion(null);
    if (type === 'MCQ') {
      setSubScreen('mcq');
    } else if (type === 'Simulation') {
      setSubScreen('simulation');
    } else if (type === 'Subjective') {
      setSubScreen('subjective');
    } else if (type === 'Essay') {
      setSubScreen('createEssayQuestion');
    } else if (type === 'Video') {
      setSubScreen('createVideoQuestion');
    } else if (type === 'AI Video') {
      setSubScreen('aiInterview');
    }
  };

  const getNextQuestionId = () => `Q${String(QUESTIONS_DATA.length + savedQuestions.length + 1).padStart(8, '0')}`;

  const upsertSavedQuestion = (question) => {
    setSavedQuestions((prev) => [question, ...prev.filter((item) => item.id !== question.id)]);
  };

  const handleMCQSave = (questionData) => {
    const nextId = `Q${String(QUESTIONS_DATA.length + savedQuestions.length + 1).padStart(8, '0')}`;
    const newQuestion = {
      id: nextId,
      name: questionData.question,
      type: questionData.selectType || 'MCQ',
      level: questionData.difficulty,
      domain: '-',
      parentCategory: questionData.category,
      childCategory: '-',
      createdBy: 'Admin',
      status: 'Active',
      fileUploadAllowed: 'No',
      accountingJournalBased: 'No',
    };
    setSavedQuestions((prev) => [newQuestion, ...prev]);
    setSubScreen(null);
    setIsEditing(false);
    if (showToast) showToast('Question created successfully!');
  };

  const handleSimulationJournalSave = (data) => {
    const nextId = `Q${String(QUESTIONS_DATA.length + savedQuestions.length + 1).padStart(8, '0')}`;
    const newQuestion = {
      id: nextId,
      name: data.simulationName,
      type: 'Simulation',
      subType: 'journal',
      level: data.difficulty,
      domain: '-',
      parentCategory: data.category,
      childCategory: '-',
      createdBy: 'Admin',
      status: 'Active',
      fileUploadAllowed: 'No',
      accountingJournalBased: 'Yes',
    };
    setSavedQuestions((prev) => [newQuestion, ...prev]);
    setSubScreen(null);
    setIsEditing(false);
    if (showToast) showToast('Simulation question created successfully!');
  };

  const handleSimulationOptionsSave = (data) => {
    const nextId = `Q${String(QUESTIONS_DATA.length + savedQuestions.length + 1).padStart(8, '0')}`;
    setSavedQuestions((prev) => [{
      id: nextId, name: data.simulationName, type: 'Simulation', subType: 'options',
      level: data.difficulty, domain: '-', parentCategory: data.category,
      childCategory: '-', createdBy: 'Admin', status: 'Active',
      fileUploadAllowed: 'No', accountingJournalBased: 'No',
    }, ...prev]);
    setSubScreen(null);
    setIsEditing(false);
    if (showToast) showToast('Simulation question created successfully!');
  };

  const handleSubjectiveSave = (data) => {
    const nextId = isEditing && editingQuestion ? editingQuestion.id : getNextQuestionId();
    upsertSavedQuestion({
      id: nextId, name: data.questionName, type: 'Subjective',
      level: data.difficulty, domain: '-', parentCategory: data.category,
      childCategory: '-', createdBy: editingQuestion?.createdBy || 'Admin', status: isEditing && editingQuestion ? getStatus(editingQuestion) : 'Active',
      fileUploadAllowed: data.allowUpload ? 'Yes' : 'No', accountingJournalBased: 'No',
    });
    setSubScreen(null);
    setIsEditing(false);
    setEditingQuestion(null);
    if (showToast) showToast('Question created successfully!');
  };

  const handleAIInterviewSave = (data) => {
    const nextId = isEditing && editingQuestion ? editingQuestion.id : getNextQuestionId();
    upsertSavedQuestion({
      id: nextId, name: data.interviewName, type: 'AI Video',
      level: data.difficulty, domain: '-', parentCategory: '-',
      childCategory: '-', createdBy: editingQuestion?.createdBy || 'Admin', status: isEditing && editingQuestion ? getStatus(editingQuestion) : 'Active',
      fileUploadAllowed: 'No', accountingJournalBased: 'No',
      totalQuestions: data.totalQuestions,
    });
    setSubScreen(null);
    setIsEditing(false);
    setEditingQuestion(null);
    if (showToast) showToast('AI Interview question created successfully!');
  };

  const handleVideoSave = (data) => {
    const nextId = isEditing && editingQuestion ? editingQuestion.id : getNextQuestionId();
    upsertSavedQuestion({
      ...(editingQuestion || {}),
      id: nextId,
      name: data.question,
      question: data.question,
      type: 'Video',
      level: data.difficulty,
      domain: '-',
      parentCategory: data.category,
      childCategory: '-',
      createdBy: editingQuestion?.createdBy || 'Admin',
      status: isEditing && editingQuestion ? getStatus(editingQuestion) : 'Active',
      fileUploadAllowed: 'Yes',
      accountingJournalBased: 'No',
      marks: data.marks,
      explanation: data.explanation,
      videoFile: data.videoFile || null,
      videoFileName: data.videoFileName || '',
      videoPreviewUrl: data.videoPreviewUrl || '',
      materialFiles: data.materialFiles || [],
    });
    setSubScreen(null);
    setIsEditing(false);
    setEditingQuestion(null);
    if (showToast) showToast('Video question created successfully!');
  };

  const handleEssaySave = (data) => {
    const nextId = isEditing && editingQuestion ? editingQuestion.id : getNextQuestionId();
    upsertSavedQuestion({
      ...(editingQuestion || {}),
      id: nextId,
      name: data.scenario,
      question: data.scenario,
      scenario: data.scenario,
      type: 'Essay',
      level: data.difficulty,
      domain: '-',
      parentCategory: data.category,
      childCategory: '-',
      createdBy: editingQuestion?.createdBy || 'Admin',
      status: isEditing && editingQuestion ? getStatus(editingQuestion) : 'Active',
      fileUploadAllowed: 'Yes',
      accountingJournalBased: 'No',
      questionBlocks: data.questionBlocks || [],
      materialFiles: data.materialFiles || [],
    });
    setSubScreen(null);
    setIsEditing(false);
    setEditingQuestion(null);
    if (showToast) showToast('Essay question created successfully!');
  };

  const handleBulkDelete = () => {
    setPendingAction({ type: 'bulkDelete' });
  };

  const confirmBulkDelete = () => {
    const count = checkedRows.length;
    setDeletedIds((prev) => [...prev, ...checkedRows]);
    setSavedQuestions((prev) => prev.filter((q) => !checkedRows.includes(q.id)));
    setCheckedRows([]);
    setPendingAction(null);
    if (showToast) showToast(`${count} question(s) deleted successfully!`, 'success');
  };

  const goBack = (fallbackScreen) => {
    setIsEditing(false);
    setEditingQuestion(null);
    setSubScreen(isEditing ? null : fallbackScreen);
  };

  if (subScreen === 'aiInterview') {
    return (
      <InterviewTypeSelection
        onBack={() => { setSubScreen(null); }}
        onProceed={() => { setSubScreen('createAIInterview'); }}
      />
    );
  }

  if (subScreen === 'createAIInterview') {
    return (
      <CreateAIInterview
        key={editingQuestion?.id || 'new-aiinterview'}
        onBack={() => goBack(isEditing ? null : 'aiInterview')}
        onSave={handleAIInterviewSave}
        isEditing={isEditing}
        initialData={editingQuestion}
      />
    );
  }

  if (subScreen === 'createVideoQuestion') {
    return (
      <CreateVideoQuestion
        key={editingQuestion?.id || 'new-video-question'}
        onBack={() => goBack(null)}
        onSave={handleVideoSave}
        isEditing={isEditing}
        initialData={editingQuestion}
      />
    );
  }

  if (subScreen === 'createEssayQuestion') {
    return (
      <CreateEssayQuestion
        key={editingQuestion?.id || 'new-essay-question'}
        onBack={() => goBack(null)}
        onSave={handleEssaySave}
        isEditing={isEditing}
        initialData={editingQuestion}
      />
    );
  }

  if (subScreen === 'subjective') {
    return (
      <SubjectiveTypeSelection
        onBack={() => { setSubScreen(null); }}
        onProceed={() => { setSubScreen('createSubjective'); }}
      />
    );
  }

  if (subScreen === 'createSubjective') {
    return (
      <CreateSubjective
        key={editingQuestion?.id || 'new-subjective'}
        onBack={() => goBack(isEditing ? null : 'subjective')}
        onSave={handleSubjectiveSave}
        isEditing={isEditing}
        initialData={editingQuestion}
      />
    );
  }

  if (subScreen === 'createSimulationOptions') {
    return <CreateSimulationOptions key={editingQuestion?.id || 'new-simopts'} onBack={() => goBack('simulation')} onSave={handleSimulationOptionsSave} initialData={editingQuestion} />;
  }

  if (subScreen === 'createSimulationJournal') {
    return <CreateSimulationJournal key={editingQuestion?.id || 'new-simjournal'} onBack={() => goBack('simulation')} onSave={handleSimulationJournalSave} initialData={editingQuestion} />;
  }

  if (subScreen === 'simulation') {
    return (
      <SimulationTypeSelection
        onBack={() => setSubScreen(null)}
        onSelectJournal={() => setSubScreen('createSimulationJournal')}
        onSelectOptions={() => setSubScreen('createSimulationOptions')}
      />
    );
  }

  if (subScreen === 'createMCQ') {
    return <CreateMCQ key={editingQuestion?.id || 'new-mcq'} mcqType={selectedMCQTypeForCreate} onBack={() => goBack('mcq')} onSave={handleMCQSave} initialData={editingQuestion} />;
  }

  if (subScreen === 'mcq') {
    return (
      <MCQTypeSelection
        onBack={() => setSubScreen(null)}
        onProceed={(type) => { setSelectedMCQTypeForCreate(type); setSubScreen('createMCQ'); }}
      />
    );
  }

  return (
    <div className="qa-questions">
      <div className="qq-content">
        <div className="qq-sticky">
          {/* Header */}
          <div className="qq-header">
            <div className="qq-header-left">
              <Star size={20} className="qq-star-icon" />
              <h1 className="qq-title">Question Bank</h1>
            </div>
            <div className="qq-header-right">
              <div className="header-search">
                <input type="text" placeholder="Search here" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="header-search-input" />
                <Search size={18} className="header-search-icon" />
              </div>
              <button className={`qq-delete-btn ${hasChecked ? 'qq-delete-btn--active' : ''}`} disabled={!hasChecked} onClick={handleBulkDelete}>
                <Trash2 size={15} /> Delete ({checkedRows.length})
              </button>
              <button className="export-btn"><Upload size={16} /> Export</button>
              <AddQuestionDropdown onSelectType={handleAddQuestionType} />
            </div>
          </div>

          {/* Filters Row 1 */}
          <div className="qq-filters">
            <ParentChildDropdown
              parentLabel="Parent Category"
              childLabel="Child Category"
              parentOptions={PARENT_CATEGORIES}
              childMap={CHILD_CATEGORIES_MAP}
              selectedParent={selectedParent}
              onParentChange={setSelectedParent}
              selectedChild={selectedChild}
              onChildChange={setSelectedChild}
            />
            <MultiSelectDropdown label="Created By" placeholder="Select User" options={CREATED_BY} selected={selectedCreatedBy} onChange={setSelectedCreatedBy} hasSearch={true} />
            <MultiSelectDropdown label="Question Type" placeholder="All" options={QUESTION_TYPES} selected={selectedTypes} onChange={setSelectedTypes} hasSearch={true} />
            <MultiSelectDropdown label="Level" placeholder="All" options={LEVELS} selected={selectedLevels} onChange={setSelectedLevels} hasSearch={true} />
          </div>

          {/* Filters Row 2 */}
          <div className="qq-filters">
            <MultiSelectDropdown label="Status" placeholder="All" options={STATUSES} selected={selectedStatuses} onChange={setSelectedStatuses} hasSearch={true} />
            <MultiSelectDropdown label="Accounting Journal Based" placeholder="All" options={YES_NO} selected={selectedJournal} onChange={setSelectedJournal} hasSearch={true} />
            <MultiSelectDropdown label="File Upload Allowed" placeholder="All" options={YES_NO} selected={selectedFileUpload} onChange={setSelectedFileUpload} hasSearch={true} />
            <MultiSelectDropdown label="Domain" placeholder="All" options={DOMAINS} selected={selectedDomains} onChange={setSelectedDomains} hasSearch={false} />

            <div className="qq-filter-actions">
              <button className="search-btn" onClick={handleSearch}>Search</button>
              <button className="clear-all-btn" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="qq-table-area">
          <table className="users-table qq-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" className="qq-checkbox" checked={allPageChecked} onChange={toggleSelectAll} /></th>
                <th>Question ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Level</th>
                <th>Domain</th>
                <th>Parent Category</th>
                <th>Child Category</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedQuestions.map((q) => {
                const status = getStatus(q);
                return (
                  <tr key={q.id} className={checkedRows.includes(q.id) ? 'qq-row--checked' : ''}>
                    <td><input type="checkbox" className="qq-checkbox" checked={checkedRows.includes(q.id)} onChange={() => toggleRow(q.id)} /></td>
                    <td className="qq-id">{q.id}</td>
                    <td className="qq-name">{q.name}</td>
                    <td>{q.type}</td>
                    <td>{q.level}</td>
                    <td>{q.domain}</td>
                    <td>{q.parentCategory}</td>
                    <td>{q.childCategory}</td>
                    <td>{q.createdBy}</td>
                    <td>
                      <span
                        className={`qq-status-badge qq-status-badge--clickable qq-status-badge--${status.toLowerCase()}`}
                        onClick={() => !hasChecked && setPendingAction({ type: 'status', q })}
                        title={`Click to make ${status === 'Active' ? 'Inactive' : 'Active'}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className={`qq-actions ${hasChecked ? 'qq-actions--disabled' : ''}`}>
                        <button className="qq-action-btn qq-action-btn--edit" disabled={hasChecked} onClick={() => handleEditQuestion(q)}><Pencil size={14} /></button>
                        <button className="qq-action-btn qq-action-btn--view" disabled={hasChecked}><Eye size={14} /></button>
                        <button className="qq-action-btn qq-action-btn--delete" disabled={hasChecked} onClick={() => setPendingAction({ type: 'delete', q })}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-left">
            Showing{' '}
            <div className="pagination-select-wrapper">
              <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }} className="pagination-select">
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
              <ChevronDown size={14} className="pagination-select-icon" />
            </div>
            {' '}{(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, displayQuestions.length)} of {displayQuestions.length} Questions
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

      {/* Delete Confirmation Modal */}
      {pendingAction?.type === 'delete' && (
        <ConfirmModal
          title="Delete Question"
          message={`Are you sure you want to delete "${pendingAction.q.name.slice(0, 60)}..."? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      {pendingAction?.type === 'bulkDelete' && (
        <ConfirmModal
          title={`Delete ${checkedRows.length} Question(s)`}
          message={`Are you sure you want to delete ${checkedRows.length} selected question(s)? This action cannot be undone.`}
          confirmLabel="Delete All"
          variant="danger"
          onConfirm={confirmBulkDelete}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {/* Status Toggle Confirmation Modal */}
      {pendingAction?.type === 'status' && (() => {
        const currentStatus = getStatus(pendingAction.q);
        const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        return (
          <ConfirmModal
            title={`Make Question ${nextStatus}`}
            message={`Do you want to make this question ${nextStatus}?`}
            confirmLabel={`Make ${nextStatus}`}
            variant={nextStatus === 'Active' ? 'success' : 'warning'}
            onConfirm={confirmStatusChange}
            onCancel={() => setPendingAction(null)}
          />
        );
      })()}
    </div>
  );
};

export default QAQuestions;
