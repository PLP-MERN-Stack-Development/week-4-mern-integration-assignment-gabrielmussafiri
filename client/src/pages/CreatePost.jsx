import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';

const CreatePost = () => {
  const { categories, createPost } = usePosts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      if (image) {
        formData.append('featuredImage', image);
      }
      await createPost(formData);
      navigate('/');
    } catch {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto card mt-8">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="input"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            className="input"
            rows={8}
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            className="input"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 