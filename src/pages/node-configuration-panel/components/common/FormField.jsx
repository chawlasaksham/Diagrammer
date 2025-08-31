// src/pages/node-configuration-panel/components/common/FormField.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FormField = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  error, 
  required, 
  disabled,
  icon,
  size = 'default',
  className = '',
  min,
  max,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-4 py-3',
    lg: 'px-4 py-4 text-lg'
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-body-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
            <Icon name={icon} size={18} />
          </div>
        )}
        
        <input
          type={inputType}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full border rounded-lg transition-all duration-200 
            ${sizeClasses[size]}
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${
              error
                ? 'border-error bg-error-50 text-error-700 focus:border-error focus:ring-error' :'border-border bg-surface text-text-primary focus:border-primary focus:ring-primary'
            }
            ${
              disabled
                ? 'bg-secondary-100 text-text-tertiary cursor-not-allowed' :'focus:ring-2 focus:ring-opacity-20'
            }
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
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

export default FormField;