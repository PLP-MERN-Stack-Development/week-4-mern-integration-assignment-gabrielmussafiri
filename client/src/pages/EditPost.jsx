import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

const EditPost = () => {
  const { id } = useParams();
  const { categories, fetchPost, currentPost, updatePost, loading } = usePosts();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (currentPost) {
      setForm({
        title: currentPost.title || '',
        content: currentPost.content || '',
        category: currentPost.category?._id || '',
      });
    }
  }, [currentPost]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      if (image) {
        formData.append('featuredImage', image);
      }
      await updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch {
      // error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto card mt-8">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
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
          {currentPost.featuredImage && (
            <img
              src={`/uploads/${currentPost.featuredImage}`}
              alt="Current featured"
              className="w-32 h-20 object-cover rounded mt-2"
            />
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditPost; 