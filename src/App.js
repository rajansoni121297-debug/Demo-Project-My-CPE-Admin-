import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import UsersListing from './components/UsersListing';
import AssignedAssessment from './components/AssignedAssessment';
import InvoiceHistory from './components/InvoiceHistory';
import AssessmentListing from './components/AssessmentListing';
import AssessmentDetail from './components/AssessmentDetail';
import QAAssessments, { INITIAL_ASSESSMENT_DATA } from './components/QAAssessments';
import CreateAssessment from './components/CreateAssessment';
import QARoles from './components/QARoles';
import QACategory from './components/QACategory';
import CreateCategory from './components/CreateCategory';
import QAQuestions from './components/QAQuestions';
import QAReport from './components/QAReport';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('qaQuestions');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentFilterType, setAssessmentFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENT_DATA);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleNavChange = (item) => {
    if (item === 'User List') setCurrentScreen('users');
    else if (item === 'Assessment Listing') setCurrentScreen('assessmentListing');
    else if (item === 'QA-Assessments') setCurrentScreen('qaAssessments');
    else if (item === 'Role') setCurrentScreen('qaRoles');
    else if (item === 'Category') setCurrentScreen('qaCategory');
    else if (item === 'Report') setCurrentScreen('qaReport');
    else if (item === 'Questions') setCurrentScreen('qaQuestions');
    setSelectedUser(null);
    setSelectedAssessment(null);
    setAssessmentFilterType(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'assessment':
        return <AssignedAssessment user={selectedUser} onBack={() => { setCurrentScreen('users'); setSelectedUser(null); }} />;
      case 'invoice':
        return <InvoiceHistory user={selectedUser} onBack={() => { setCurrentScreen('users'); setSelectedUser(null); }} />;
      case 'assessmentListing':
        return (
          <AssessmentListing
            onViewAssigned={(a) => { setSelectedAssessment(a); setAssessmentFilterType('assigned'); setCurrentScreen('assessmentDetail'); }}
            onViewCompletions={(a) => { setSelectedAssessment(a); setAssessmentFilterType('completions'); setCurrentScreen('assessmentDetail'); }}
          />
        );
      case 'qaAssessments':
        return (
          <QAAssessments
            assessments={assessments}
            onCreateAssessment={() => setCurrentScreen('createAssessment')}
            onUpdateAssessmentStatus={(index, nextStatus) => {
              setAssessments((prev) => prev.map((assessment, assessmentIndex) => (
                assessmentIndex === index
                  ? { ...assessment, status: nextStatus }
                  : assessment
              )));
              showToast(`Assessment status updated to ${nextStatus}.`);
            }}
          />
        );
      case 'createAssessment':
        return (
          <CreateAssessment
            onBack={() => setCurrentScreen('qaAssessments')}
            onSuccess={(newAssessment) => {
              setAssessments((prev) => [newAssessment, ...prev]);
              setCurrentScreen('qaAssessments');
              showToast('Assessment created successfully!');
            }}
          />
        );
      case 'qaReport':
        return <QAReport />;
      case 'qaQuestions':
        return <QAQuestions showToast={showToast} />;
      case 'qaRoles':
        return <QARoles />;
      case 'qaCategory':
        return <QACategory onCreateCategory={() => setCurrentScreen('createCategory')} />;
      case 'createCategory':
        return (
          <CreateCategory
            onBack={() => setCurrentScreen('qaCategory')}
            onSuccess={() => { setCurrentScreen('qaCategory'); showToast('Category created successfully!'); }}
          />
        );
      case 'assessmentDetail':
        return <AssessmentDetail assessment={selectedAssessment} filterType={assessmentFilterType} onBack={() => { setCurrentScreen('assessmentListing'); setSelectedAssessment(null); setAssessmentFilterType(null); }} />;
      default:
        return (
          <UsersListing
            onViewAssessment={(user) => { setSelectedUser(user); setCurrentScreen('assessment'); }}
            onViewRevenue={(user) => { setSelectedUser(user); setCurrentScreen('invoice'); }}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavChange={handleNavChange}
      />
      <main className={`main-content ${sidebarCollapsed ? 'main-content--collapsed' : ''}`}>
        {renderScreen()}
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
