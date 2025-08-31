import React, { useState } from 'react';

const EditProfile = () => {
  const [form, setForm] = useState({
    name: 'Sysadmin',
    company: 'RIS',
    email: 'sysadmin',
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    // No real logic for now
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 bg-primary text-white text-2xl font-bold">S</div>
        <div className="text-xl font-bold mb-2">Sure Diagrammer</div>
        <div className="text-xl font-bold mb-6">Edit Profile</div>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block mb-1 font-medium">Name</label>
          <input className="w-full border rounded px-3 py-2 mb-4" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
          <label className="block mb-1 font-medium">Company</label>
          <input className="w-full border rounded px-3 py-2 mb-4" name="company" value={form.company} onChange={handleChange} placeholder="Enter your company" required />
          <label className="block mb-1 font-medium">Email</label>
          <input className="w-full border rounded px-3 py-2 mb-6" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
          <button className="w-full bg-primary text-white py-2 rounded font-medium" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 