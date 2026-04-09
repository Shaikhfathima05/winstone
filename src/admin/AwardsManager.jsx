import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const AwardsManager = () => {
  const [awards, setAwards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: '',
    description: ''
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    const { data } = await supabase.from('awards').select('*').order('year', { ascending: false });
    if (data) setAwards(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAward) {
      await supabase.from('awards').update(formData).eq('id', editingAward.id);
    } else {
      await supabase.from('awards').insert([formData]);
    }
    setIsModalOpen(false);
    setEditingAward(null);
    setFormData({ title: '', organization: '', year: '', description: '' });
    fetchAwards();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this award?')) {
      await supabase.from('awards').delete().eq('id', id);
      fetchAwards();
    }
  };

  return (
    <div>
      <header className="page-header">
        <h1>Recognition & Awards</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Award
        </button>
      </header>

      <div className="admin-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Award Title</th>
              <th>Organization</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {awards.map((award) => (
              <tr key={award.id}>
                <td>{award.title}</td>
                <td>{award.organization}</td>
                <td>{award.year}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="nav-item" onClick={() => { setEditingAward(award); setFormData(award); setIsModalOpen(true); }}><Edit2 size={16} /></button>
                    <button className="nav-item" onClick={() => handleDelete(award.id)} style={{ color: '#ff4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2>{editingAward ? 'Edit Award' : 'Add New Award'}</h2>
            <form onSubmit={handleSubmit} className="admin-form" style={{ marginTop: '25px' }}>
              <div className="form-group">
                <label>Award Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Organization</label>
                <input type="text" value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button className="btn-primary" type="submit">Save Award</button>
                <button className="btn-secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardsManager;
