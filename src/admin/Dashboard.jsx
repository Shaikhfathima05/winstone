import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Building2, Trophy, Quote, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    awards: 0,
    testimonials: 0,
    messages: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: pCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    const { count: aCount } = await supabase.from('awards').select('*', { count: 'exact', head: true });
    const { count: tCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });
    const { count: mCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });

    setStats({
      projects: pCount || 0,
      awards: aCount || 0,
      testimonials: tCount || 0,
      messages: mCount || 0,
    });
  };

  return (
    <div>
      <header className="page-header">
        <h1>Administrative Overview</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Total Projects</span>
            <Building2 size={20} color="#d4af37" />
          </div>
          <h2>{stats.projects}</h2>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Awards Won</span>
            <Trophy size={20} color="#d4af37" />
          </div>
          <h2>{stats.awards}</h2>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Client Reviews</span>
            <Quote size={20} color="#d4af37" />
          </div>
          <h2>{stats.testimonials}</h2>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Inquiries</span>
            <MessageSquare size={20} color="#d4af37" />
          </div>
          <h2>{stats.messages}</h2>
        </div>
      </div>

      <div className="admin-card">
        <h3>Welcome, Admin</h3>
        <p style={{ color: '#a0a0a0', marginTop: '10px' }}>
          This central dashboard allows you to manage the real-time content of Winstone Projects UAE. 
          Use the lateral navigation to manage your portfolio, recognition, and client feedback.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
