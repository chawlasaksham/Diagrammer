import React from 'react';
import Icon from 'components/AppIcon';

const ExecutionControls = ({ status, onControl }) => {
  const controls = [
    {
      action: 'start',
      icon: 'Play',
      label: 'Start',
      variant: 'success',
      disabled: status === 'running'
    },
    {
      action: 'pause',
      icon: 'Pause',
      label: 'Pause',
      variant: 'warning',
      disabled: status !== 'running'
    },
    {
      action: 'stop',
      icon: 'Square',
      label: 'Stop',
      variant: 'error',
      disabled: status === 'idle' || status === 'stopped'
    },
    {
      action: 'restart',
      icon: 'RotateCcw',
      label: 'Restart',
      variant: 'secondary',
      disabled: false
    }
  ];

  const getButtonVariant = (variant, disabled) => {
    if (disabled) {
      return 'bg-secondary-100 text-text-tertiary cursor-not-allowed';
    }

    const variants = {
      success: 'bg-success text-white hover:bg-success-500',
      warning: 'bg-warning text-white hover:bg-warning-500',
      error: 'bg-error text-white hover:bg-error-500',
      secondary: 'bg-secondary-100 text-text-primary hover:bg-secondary-200'
    };
    return variants[variant] || variants.secondary;
  };

  return (
    <div className="flex items-center space-x-2">
      {controls.map((control) => (
        <button
          key={control.action}
          onClick={() => !control.disabled && onControl(control.action)}
          disabled={control.disabled}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-body-medium
            transition-micro focus:outline-none focus:ring-2 focus:ring-offset-2
            ${getButtonVariant(control.variant, control.disabled)}
            ${!control.disabled ? 'hover-scale focus:ring-primary' : ''}
          `}
          title={control.label}
        >
          <Icon name={control.icon} size={16} />
          <span className="hidden sm:inline">{control.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ExecutionControls;