import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Trophy, MessageSquare, Quote, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Building2 size={20} /> },
    { name: 'Awards', path: '/awards', icon: <Trophy size={20} /> },
    { name: 'Testimonials', path: '/testimonials', icon: <Quote size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="https://www.winstoneprojects.com/winstonelogo.jpg" alt="Logo" />
          <span>WINSTONE ADMIN</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
