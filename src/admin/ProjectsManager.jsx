import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Residential',
    location: '',
    year: '',
    price: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('winstone-media')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('winstone-media')
      .getPublicUrl(filePath);

    setFormData({ ...formData, image_url: publicUrl });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', editingProject.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([formData]);
      if (error) alert(error.message);
    }

    setLoading(false);
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({ title: '', category: 'Residential', location: '', year: '', price: '', description: '', image_url: '' });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) alert(error.message);
      fetchProjects();
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData(project);
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="page-header">
        <h1>Direct Portfolio Management</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          New Project
        </button>
      </header>

      <div className="admin-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <img src={project.image_url} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ fontWeight: '600' }}>{project.title}</td>
                <td><span className="p-badge-v3" style={{ fontSize: '9px', padding: '4px 8px', margin: 0 }}>{project.category}</span></td>
                <td>{project.location}</td>
                <td style={{ color: '#666', fontSize: '12px' }}>{new Date(project.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="nav-item" onClick={() => openEditModal(project)} style={{ padding: '8px' }}><Edit2 size={16} /></button>
                    <button className="nav-item" onClick={() => handleDelete(project.id)} style={{ padding: '8px', color: '#ff4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingProject(null); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Project Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option>Residential</option>
                    <option>Lifestyle</option>
                    <option>Township</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Year</label>
                  <input type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Starting Price</label>
                  <input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label>Project Image</label>
                <div style={{ border: '2px dashed var(--border-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  {formData.image_url ? (
                    <div style={{ position: 'relative' }}>
                      <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button type="button" onClick={() => setFormData({...formData, image_url: ''})} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: 'white', padding: '5px' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label style={{ cursor: 'pointer' }}>
                      <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*" />
                      <ImageIcon size={40} color="#333" style={{ marginBottom: '10px' }} />
                      <p>{loading ? 'Uploading...' : 'Click to Upload Image'}</p>
                    </label>
                  )}
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Processing...' : (editingProject ? 'Update Portfolio' : 'Publish Project')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
