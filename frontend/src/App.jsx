import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import PrivacyPage from './pages/PrivacyPage';
import DocsPage from './pages/DocsPage';
import { api } from './services/api';

export default function App() {
  const [currentView, setView] = useState('landing'); // 'landing' | 'dashboard' | 'auth' | 'terms' | 'cookies' | 'privacy' | 'docs'
  const [bionicStatus, setBionicStatus] = useState({ online: false });
  const [stats, setStats] = useState({ total_documents: 0, total_chunks: 0 });

  // Persistent Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('contextos_authenticated') === 'true';
  });
  const [operatorId, setOperatorId] = useState(() => {
    return localStorage.getItem('contextos_operator') || 'ADMIN-01';
  });

  const handleLogin = (id) => {
    const op = id || 'ADMIN-01';
    setOperatorId(op);
    setIsAuthenticated(true);
    localStorage.setItem('contextos_authenticated', 'true');
    localStorage.setItem('contextos_operator', op);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('contextos_authenticated');
  };

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const fetchStatus = async () => {
    try {
      const data = await api.getStatus();
      setBionicStatus(data.bionic || { online: false });
      setStats(data.store || { total_documents: 0, total_chunks: 0 });
    } catch (err) {
      setBionicStatus({ online: false });
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        bionicStatus={bionicStatus} 
        isAuthenticated={isAuthenticated}
        operatorId={operatorId}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <>
            <LandingPage 
              setView={setView} 
              bionicStatus={bionicStatus} 
              stats={stats} 
            />
            <Footer setView={setView} />
          </>
        )}

        {currentView === 'dashboard' && (
          <Dashboard 
            bionicStatus={bionicStatus} 
            onRefreshStatus={fetchStatus} 
            setView={setView}
            isAuthenticated={isAuthenticated}
            operatorId={operatorId}
            onLoginRequest={() => setView('auth')}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'auth' && (
          <>
            <AuthPage 
              setView={setView} 
              isAuthenticated={isAuthenticated}
              operatorId={operatorId}
              onLoginSuccess={handleLogin}
              onLogout={handleLogout}
            />
            <Footer setView={setView} />
          </>
        )}

        {currentView === 'terms' && (
          <>
            <TermsPage setView={setView} />
            <Footer setView={setView} />
          </>
        )}

        {currentView === 'cookies' && (
          <>
            <CookiesPage setView={setView} />
            <Footer setView={setView} />
          </>
        )}

        {currentView === 'privacy' && (
          <>
            <PrivacyPage setView={setView} />
            <Footer setView={setView} />
          </>
        )}

        {currentView === 'docs' && (
          <>
            <DocsPage setView={setView} />
            <Footer setView={setView} />
          </>
        )}
      </div>
    </div>
  );
}

