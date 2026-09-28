import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { api } from './services/api';

export default function App() {
  const [currentView, setView] = useState('landing'); // 'landing' | 'dashboard'
  const [bionicStatus, setBionicStatus] = useState({ online: false });
  const [stats, setStats] = useState({ total_documents: 0, total_chunks: 0 });

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
    <div className="min-h-screen flex flex-col bg-[#05070f] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        bionicStatus={bionicStatus} 
      />

      <div className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <>
            <LandingPage 
              setView={setView} 
              bionicStatus={bionicStatus} 
              stats={stats} 
            />
            <Footer setView={setView} />
          </>
        ) : (
          <Dashboard 
            bionicStatus={bionicStatus} 
            onRefreshStatus={fetchStatus} 
          />
        )}
      </div>
    </div>
  );
}
