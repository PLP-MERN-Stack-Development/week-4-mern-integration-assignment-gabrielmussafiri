import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PostDetail = () => {
  const { id } = useParams();
  const { fetchPost, currentPost, addComment, loading } = usePosts();
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost(id);
    // eslint-disable-next-line
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(id, { content: comment });
      setComment('');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentPost) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <img
        src={currentPost.featuredImage ? `/uploads/${currentPost.featuredImage}` : '/default-post.jpg'}
        alt={currentPost.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{currentPost.title}</h1>
      <div className="flex items-center space-x-4 text-gray-500 mb-4">
        <span>By {currentPost.author?.name || 'Unknown'}</span>
        <span>in {currentPost.category?.name || 'Uncategorized'}</span>
        <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
        <span>{currentPost.viewCount} views</span>
      </div>
      <div className="prose max-w-none mb-8">
        {currentPost.content}
      </div>

      {/* Comments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {currentPost.comments && currentPost.comments.length > 0 ? (
          <ul className="space-y-4">
            {currentPost.comments.map((c) => (
              <li key={c._id || c.createdAt} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-800">{c.user?.name || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700">{c.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Add Comment */}
      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <textarea
            className="input mb-2"
            rows={3}
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !comment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PostDetail; 