import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter, Search } from 'lucide-react';

const Home = () => {
  const { posts, categories, loading, pagination, fetchPosts, searchPosts } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const search = searchParams.get('search');

  useEffect(() => {
    if (search) {
      setSearchQuery(search);
      searchPosts(search);
    } else {
      fetchPosts(currentPage, 10, selectedCategory);
    }
  }, [currentPage, selectedCategory, search]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    if (searchQuery) {
      setSearchQuery('');
      setSearchParams({});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams({});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {search ? `Search Results for "${search}"` : 'Latest Blog Posts'}
        </h1>
        <p className="text-gray-600">
          {search ? `Found ${posts.length} posts` : 'Discover amazing stories and insights'}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Filter by:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {(selectedCategory || search) && (
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {search ? 'No posts found' : 'No posts yet'}
          </h3>
          <p className="text-gray-600">
            {search 
              ? 'Try adjusting your search terms or browse all posts'
              : 'Be the first to share your story!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (pagination.next || pagination.prev) && (
        <div className="flex justify-center space-x-2">
          {pagination.prev && (
            <button
              onClick={() => handlePageChange(pagination.prev.page)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage}
          </span>
          {pagination.next && (
            <button
              onClick={() => handlePageChange(pagination.next.page)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home; 