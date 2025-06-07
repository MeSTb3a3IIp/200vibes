// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Auth from './pages/Auth';
import TaskSolutions from './pages/TaskSolutions';
import TaskSolutionsTest from './pages/TaskSolutionsTest';
import TaskDetail from './pages/TaskDetail';
import Statistics from './pages/Statistics';
import TaskCreation from './pages/TaskCreation';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ['/auth'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  const content = (
    <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/tasks" element={<TaskSolutions />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks/:id/statistics" element={<Statistics />} />
            <Route path="/create-task" element={<TaskCreation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/test-tasks" element={<TaskSolutionsTest />} />
    </Routes>
  )
  return (
    <>
        {!shouldHideHeader && <Header />}
        {shouldHideHeader ? content : <div className="container">{content}</div>}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
