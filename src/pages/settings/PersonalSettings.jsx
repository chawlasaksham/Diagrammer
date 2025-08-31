import React, { useState } from 'react';

const PersonalSettings = () => {
  const [form, setForm] = useState({
    name: 'Saksham Chawla',
    email: 'user@example.com',
    timezone: 'UTC',
    language: 'English',
    emailNotifications: true,
    systemAlerts: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personal Settings</h2>
      <div className="bg-white rounded-xl shadow p-8">
        <div className="mb-4">
          <label className="font-bold block mb-1">Full Name</label>
          <input className="w-full border rounded px-3 py-2" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="font-bold block mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="font-bold block mb-1">Timezone</label>
          <input className="w-full border rounded px-3 py-2" name="timezone" value={form.timezone} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="font-bold block mb-1">Language</label>
          <input className="w-full border rounded px-3 py-2" name="language" value={form.language} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="emailNotifications" checked={form.emailNotifications} onChange={handleChange} />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="systemAlerts" checked={form.systemAlerts} onChange={handleChange} />
            System Alerts
          </label>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettings; 