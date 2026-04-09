import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

// Admin Components
import Layout from './admin/Layout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ProjectsManager from './admin/ProjectsManager';
import AwardsManager from './admin/AwardsManager';
import TestimonialsManager from './admin/TestimonialsManager';
import MessagesManager from './admin/MessagesManager';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#050505', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" />} 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/*" 
          element={
            session ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<ProjectsManager />} />
                  <Route path="/awards" element={<AwardsManager />} />
                  <Route path="/testimonials" element={<TestimonialsManager />} />
                  <Route path="/messages" element={<MessagesManager />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
