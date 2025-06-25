import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="mb-4">
        <span className="block font-medium text-gray-700">Name:</span>
        <span className="text-gray-900">{user.name}</span>
      </div>
      <div className="mb-4">
        <span className="block font-medium text-gray-700">Email:</span>
        <span className="text-gray-900">{user.email}</span>
      </div>
      <div className="mb-4">
        <span className="block font-medium text-gray-700">Role:</span>
        <span className="text-gray-900 capitalize">{user.role}</span>
      </div>
    </div>
  );
};

export default Profile; 