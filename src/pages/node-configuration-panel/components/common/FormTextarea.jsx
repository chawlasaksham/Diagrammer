// src/pages/node-configuration-panel/components/common/FormTextarea.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FormTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required, 
  disabled,
  rows = 4,
  maxLength,
  resizable = true,
  language,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value ? value.length : 0;

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const getLanguageIcon = (lang) => {
    switch (lang) {
      case 'javascript': return 'FileText';
      case 'json': return 'Braces';
      case 'sql': return 'Database';
      case 'xml': return 'Code2';
      default: return 'FileText';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-body-medium text-text-primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
          
          {language && (
            <div className="flex items-center space-x-1 text-xs text-text-tertiary">
              <Icon name={getLanguageIcon(language)} size={12} />
              <span className="uppercase">{language}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="relative">
        <textarea
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${language ? 'font-data' : 'font-body'}
            ${
              error
                ? 'border-error bg-error-50 text-error-700 focus:border-error focus:ring-error' :'border-border bg-surface text-text-primary focus:border-primary focus:ring-primary'
            }
            ${
              disabled
                ? 'bg-secondary-100 text-text-tertiary cursor-not-allowed' :'focus:ring-2 focus:ring-opacity-20'
            }
            ${resizable ? 'resize-y' : 'resize-none'}
          `}
          style={{
            minHeight: `${rows * 1.5}rem`
          }}
          {...props}
        />
        
        {/* Character Count */}
        {(maxLength || isFocused) && (
          <div className="absolute bottom-2 right-2 text-xs text-text-tertiary bg-surface px-2 py-1 rounded border border-border">
            {characterCount}{maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
      
      <div className="flex items-start justify-between">
        {error && (
          <div className="flex items-center space-x-2 text-error">
            <Icon name="AlertCircle" size={14} />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {maxLength && characterCount > maxLength * 0.9 && (
          <div className={`text-xs ml-auto ${
            characterCount >= maxLength ? 'text-error' : 'text-warning'
          }`}>
            {characterCount >= maxLength ? 'Character limit reached' : 'Approaching character limit'}
          </div>
        )}
      </div>
      
      {language && (
        <div className="text-xs text-text-tertiary flex items-center space-x-2">
          <Icon name="Info" size={12} />
          <span>
            {language === 'javascript' && 'JavaScript code will be executed in a secure sandbox'}
            {language === 'json' && 'JSON format will be validated before saving'}
            {language === 'sql' && 'SQL query will be validated for security'}
            {!['javascript', 'json', 'sql'].includes(language) && `${language.toUpperCase()} syntax highlighting enabled`}
          </span>
        </div>
      )}
    </div>
  );
};

export default FormTextarea;