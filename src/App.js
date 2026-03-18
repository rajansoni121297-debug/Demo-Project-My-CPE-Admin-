import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import UsersListing from './components/UsersListing';
import AssignedAssessment from './components/AssignedAssessment';
import InvoiceHistory from './components/InvoiceHistory';
import AssessmentListing from './components/AssessmentListing';
import AssessmentDetail from './components/AssessmentDetail';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentFilterType, setAssessmentFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavChange = (item) => {
    if (item === 'User List') {
      setCurrentScreen('users');
    } else if (item === 'Assessment Listing') {
      setCurrentScreen('assessmentListing');
    }
    setSelectedUser(null);
    setSelectedAssessment(null);
    setAssessmentFilterType(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'assessment':
        return (
          <AssignedAssessment
            user={selectedUser}
            onBack={() => { setCurrentScreen('users'); setSelectedUser(null); }}
          />
        );
      case 'invoice':
        return (
          <InvoiceHistory
            user={selectedUser}
            onBack={() => { setCurrentScreen('users'); setSelectedUser(null); }}
          />
        );
      case 'assessmentListing':
        return (
          <AssessmentListing
            onViewAssigned={(assessment) => {
              setSelectedAssessment(assessment);
              setAssessmentFilterType('assigned');
              setCurrentScreen('assessmentDetail');
            }}
            onViewCompletions={(assessment) => {
              setSelectedAssessment(assessment);
              setAssessmentFilterType('completions');
              setCurrentScreen('assessmentDetail');
            }}
          />
        );
      case 'assessmentDetail':
        return (
          <AssessmentDetail
            assessment={selectedAssessment}
            filterType={assessmentFilterType}
            onBack={() => {
              setCurrentScreen('assessmentListing');
              setSelectedAssessment(null);
              setAssessmentFilterType(null);
            }}
          />
        );
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
    </div>
  );
}

export default App;
