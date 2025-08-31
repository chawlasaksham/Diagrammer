import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    navigate('/');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
          <span className="text-4xl font-bold text-white">S</span>
        </div>
        <h2 className="text-2xl font-heading-bold mb-1">Sysadmin</h2>
        <div className="text-text-secondary mb-4">RIS</div>
        <hr className="w-full mb-4" />
        <div className="w-full mb-4">
          <div className="flex justify-between mb-2"><span className="font-body-medium">Name:</span> <span>Sysadmin</span></div>
          <div className="flex justify-between mb-2"><span className="font-body-medium">Company:</span> <span>RIS</span></div>
          <div className="flex justify-between mb-2"><span className="font-body-medium">Email:</span> <span>sysadmin</span></div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white py-2 rounded font-body-medium" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
            <button className="flex-1 bg-error text-white py-2 rounded font-body-medium" onClick={handleLogout}>Logout</button>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-success text-white py-2 rounded font-body-medium" onClick={() => navigate('/diagram-dashboard')}>Home Page</button>
            <button className="flex-1 bg-warning text-white py-2 rounded font-body-medium" onClick={() => navigate('/reset-password')}>Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 