import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="card flex flex-col h-full">
      <Link to={`/posts/${post._id}`} className="block mb-4">
        <img
          src={post.featuredImage ? `/uploads/${post.featuredImage}` : '/default-post.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
        <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{post.title}</h2>
      </Link>
      <div className="flex-1">
        <p className="text-gray-700 mb-2 line-clamp-3">{post.excerpt || post.content?.slice(0, 120) + '...'}</p>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>By {post.author?.name || 'Unknown'}</span>
        <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded">
          {post.category?.name || 'Uncategorized'}
        </span>
      </div>
    </div>
  );
};

export default PostCard; 