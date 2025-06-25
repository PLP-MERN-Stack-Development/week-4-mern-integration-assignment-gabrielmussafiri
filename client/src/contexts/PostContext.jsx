import React, { createContext, useContext, useState, useEffect } from 'react';
import { postService, categoryService } from '../services/api';
import toast from 'react-hot-toast';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [pagination, setPagination] = useState({});

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async (page = 1, limit = 10, category = null, search = null) => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts(page, limit, category);
      setPosts(response.data);
      setPagination(response.pagination || {});
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (id) => {
    setLoading(true);
    try {
      const response = await postService.getPost(id);
      setCurrentPost(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch post');
      console.error('Error fetching post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await postService.createPost(postData);
      setPosts(prev => [response.data, ...prev]);
      toast.success('Post created successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create post');
      throw error;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await postService.updatePost(id, postData);
      setPosts(prev => prev.map(post => 
        post._id === id ? response.data : post
      ));
      if (currentPost && currentPost._id === id) {
        setCurrentPost(response.data);
      }
      toast.success('Post updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update post');
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts(prev => prev.filter(post => post._id !== id));
      if (currentPost && currentPost._id === id) {
        setCurrentPost(null);
      }
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete post');
      throw error;
    }
  };

  const addComment = async (postId, commentData) => {
    try {
      const response = await postService.addComment(postId, commentData);
      if (currentPost && currentPost._id === postId) {
        setCurrentPost(response.data);
      }
      toast.success('Comment added successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add comment');
      throw error;
    }
  };

  const searchPosts = async (query) => {
    setLoading(true);
    try {
      const response = await postService.searchPosts(query);
      setPosts(response.data);
      setPagination(response.pagination || {});
    } catch (error) {
      toast.error('Failed to search posts');
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    posts,
    categories,
    loading,
    currentPost,
    pagination,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    addComment,
    searchPosts,
    fetchCategories,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
}; 