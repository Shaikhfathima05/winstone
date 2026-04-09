import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Edit2, Star } from 'lucide-react';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    feedback: '',
    rating: 5
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTesti) {
      await supabase.from('testimonials').update(formData).eq('id', editingTesti.id);
    } else {
      await supabase.from('testimonials').insert([formData]);
    }
    setIsModalOpen(false);
    setEditingTesti(null);
    setFormData({ name: '', feedback: '', rating: 5 });
    fetchTestimonials();
  };

  return (
    <div>
      <header className="page-header">
        <h1>Client Testimonials</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add Feedback
        </button>
      </header>

      <div className="admin-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Rating</th>
              <th>Feedback Snippet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testi) => (
              <tr key={testi.id}>
                <td style={{ fontWeight: '600' }}>{testi.name}</td>
                <td>
                  <div style={{ display: 'flex', gap: '2px', color: '#d4af37' }}>
                    {[...Array(testi.rating)].map((_, i) => <Star key={i} size={12} fill="#d4af37" />)}
                  </div>
                </td>
                <td style={{ color: '#a0a0a0', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {testi.feedback}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="nav-item" onClick={() => { setEditingTesti(testi); setFormData(testi); setIsModalOpen(true); }}><Edit2 size={16} /></button>
                    <button className="nav-item" onClick={() => { if(window.confirm('Delete?')) supabase.from('testimonials').delete().eq('id', testi.id).then(fetchTestimonials); }} style={{ color: '#ff4444' }}><Trash2 size={16} /></button>
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
            <h2>{editingTesti ? 'Edit Feedback' : 'New Feedback'}</h2>
            <form onSubmit={handleSubmit} className="admin-form" style={{ marginTop: '25px' }}>
              <div className="form-group">
                <label>Client Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="form-group">
                <label>Feedback Content</label>
                <textarea rows="4" value={formData.feedback} onChange={(e) => setFormData({...formData, feedback: e.target.value})} required></textarea>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button className="btn-primary" type="submit">Publish Review</button>
                <button className="btn-secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
