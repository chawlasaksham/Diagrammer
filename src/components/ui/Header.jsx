import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/diagram-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Diagram management hub'
    },
    {
      label: 'Editor',
      path: '/visual-workflow-editor',
      icon: 'GitBranch',
      tooltip: 'Visual diagram design'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-surface border-b border-border shadow-subtle">
      <div className="max-w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Workflow" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading-semibold text-text-primary">
                Sure Diagrammer
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body-medium
                  transition-micro hover-scale group
                  ${isActiveRoute(item.path)
                    ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }
                `}
                title={item.tooltip}
              >
                <Icon 
                  name={item.icon} 
                  size={18} 
                  className={isActiveRoute(item.path) ? 'text-primary' : 'text-current'} 
                />
                <span>{item.label}</span>
                {isActiveRoute(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-micro hover-scale rounded-lg hover:bg-secondary-50">
              <Icon name="Bell" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full pulse-subtle" />
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 transition-micro" onClick={() => setShowUserMenu(v => !v)}>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <span className="hidden lg:block text-sm font-body-medium text-text-primary">
                  Admin
                </span>
                <Icon name="ChevronDown" size={16} className="hidden lg:block text-text-tertiary" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded shadow-lg z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-secondary-100 text-text-primary" onClick={handleLogout}>
                    <Icon name="LogOut" size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-micro rounded-lg hover:bg-secondary-50"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-micro
                    ${isActiveRoute(item.path)
                      ? 'bg-primary-50 text-primary border-l-4 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={isActiveRoute(item.path) ? 'text-primary' : 'text-current'} 
                  />
                  <span className="font-body-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;