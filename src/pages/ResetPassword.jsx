import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    // Simulate password reset logic
    setSuccess(true);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 bg-primary text-white text-2xl font-bold">S</div>
        <div className="text-xl font-bold mb-2">Sure Diagrammer</div>
        <div className="text-xl font-bold mb-6">Reset Password</div>
        {success ? (
          <>
            <div className="text-green-600 font-bold mb-4 text-center">Password reset successful! You may now sign in.</div>
            <button
              className="w-full bg-primary text-white py-2 rounded font-medium"
              onClick={() => navigate('/')}
            >
              Go to Sign In
            </button>
          </>
        ) : (
          <form className="w-full" onSubmit={handleSubmit}>
            <label className="block mb-1 font-medium">Email Address</label>
            <input className="w-full border rounded px-3 py-2 mb-4" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email address" required />
            <label className="block mb-1 font-medium">Username</label>
            <input className="w-full border rounded px-3 py-2 mb-4" name="username" value={form.username} onChange={handleChange} placeholder="Enter your username" required />
            <label className="block mb-1 font-medium">New Password</label>
            <input className="w-full border rounded px-3 py-2 mb-4" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Enter new password" required />
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input className="w-full border rounded px-3 py-2 mb-6" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" required />
            <button className="w-full bg-primary text-white py-2 rounded font-medium" type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 