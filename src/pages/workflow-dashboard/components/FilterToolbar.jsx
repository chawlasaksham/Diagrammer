import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterToolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  resultCount
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: 'List' },
    { value: 'active', label: 'Active', icon: 'Play' },
    { value: 'draft', label: 'Draft', icon: 'FileText' },
    { value: 'error', label: 'Error', icon: 'AlertTriangle' },
    { value: 'paused', label: 'Paused', icon: 'Pause' }
  ];

  const sortOptions = [
    { value: 'modified', label: 'Last Modified' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'executions', label: 'Most Executions' },
    { value: 'success', label: 'Success Rate' }
  ];

  const getStatusLabel = (value) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option ? option.label : 'All Status';
  };

  const getSortLabel = (value) => {
    const option = sortOptions.find(opt => opt.value === value);
    return option ? option.label : 'Last Modified';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} className="text-text-secondary" />
          <span className="text-sm font-body-medium text-text-primary">
            Filters & Search
          </span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 text-text-tertiary hover:text-text-primary transition-micro rounded-lg hover:bg-secondary-50"
        >
          <Icon name={showFilters ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </button>
      </div>

      {/* Filter Content */}
      <div className={`space-y-4 lg:space-y-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Search Bar */}
        <div className="lg:flex lg:items-center lg:space-x-4">
          <div className="relative flex-1 mb-4 lg:mb-0">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
            />
            <input
              type="text"
              placeholder="Search workflows by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       transition-micro text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-micro"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none" 
              />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none" 
              />
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full appearance-none bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none" 
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none bg-background border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none" 
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-border lg:border-t-0 lg:pt-0">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="List" size={16} />
            <span>
              {resultCount} workflow{resultCount !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Active Filters */}
          <div className="flex items-center space-x-2">
            {searchQuery && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-accent-50 text-accent rounded-md text-xs">
                <Icon name="Search" size={12} />
                <span>Search</span>
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-accent-600 transition-micro"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-50 text-primary rounded-md text-xs">
                <Icon name="Filter" size={12} />
                <span>{getStatusLabel(statusFilter)}</span>
                <button
                  onClick={() => onStatusFilterChange('all')}
                  className="hover:text-primary-600 transition-micro"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;