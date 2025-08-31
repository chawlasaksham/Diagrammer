import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Icon from 'components/AppIcon';

const settingsOptions = [
  { label: 'Usage and plan', icon: 'BarChart2', path: '/settings/usage' },
  { label: 'Personal', icon: 'User', path: '/settings/personal' },
  { label: 'Users', icon: 'Users', path: '/settings/users' },
  { label: 'API', icon: 'Key', path: '/settings/api' },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-border flex flex-col h-screen">
        <div className="flex items-center h-16 px-8 border-b border-border">
          <span className="text-2xl font-bold text-primary">SureFlow</span>
        </div>
        <div className="px-8 py-6">
          <h2 className="text-xl font-heading-bold mb-6">Settings</h2>
          <nav className="flex flex-col gap-1">
            {settingsOptions.map(option => {
              const isActive = location.pathname.startsWith(option.path);
              return (
                <button
                  key={option.label}
                  onClick={() => navigate(option.path)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-body-medium transition-micro text-left ${isActive ? 'bg-primary-50 text-primary' : 'text-text-secondary hover:bg-secondary-100 hover:text-primary'}`}
                >
                  <Icon name={option.icon} size={18} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-12">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SettingsPage; 