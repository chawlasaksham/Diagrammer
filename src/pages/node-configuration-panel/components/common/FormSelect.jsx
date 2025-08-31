// src/pages/node-configuration-panel/components/common/FormSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option...', 
  error, 
  required, 
  disabled,
  size = 'default',
  className = '',
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-3',
    lg: 'px-4 py-4 text-lg'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (event.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`space-y-2 ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-body-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full text-left border rounded-lg transition-all duration-200 flex items-center justify-between
            ${sizeClasses[size]}
            ${
              error
                ? 'border-error bg-error-50 text-error-700 focus:border-error focus:ring-error' :'border-border bg-surface text-text-primary focus:border-primary focus:ring-primary'
            }
            ${
              disabled
                ? 'bg-secondary-100 text-text-tertiary cursor-not-allowed' :'hover:border-primary focus:ring-2 focus:ring-opacity-20 cursor-pointer'
            }
          `}
        >
          <span className={selectedOption ? 'text-text-primary' : 'text-text-tertiary'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <Icon 
            name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
            size={18} 
            className="text-text-tertiary"
          />
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-modal z-dropdown max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-secondary-50 transition-colors flex items-center justify-between
                      ${value === option.value ? 'bg-primary-50 text-primary' : 'text-text-primary'}
                    `}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-text-tertiary text-center">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-error">
          <Icon name="AlertCircle" size={14} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormSelect;