import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, Mail, User, Calendar } from 'lucide-react';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      await supabase.from('contacts').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <div>
      <header className="page-header">
        <h1>Inbound Inquiries</h1>
      </header>

      <div className="admin-card">
        {messages.length === 0 ? (
          <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px' }}>No messages received yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                      <User size={16} /> {msg.name}
                    </h3>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      <Mail size={14} /> {msg.email}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#444' }}>
                      <Calendar size={14} /> {new Date(msg.created_at).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', marginTop: '10px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6' }}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManager;
