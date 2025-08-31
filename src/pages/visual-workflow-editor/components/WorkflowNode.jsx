import React, { useState, useCallback, useRef } from 'react';
import Icon from 'components/AppIcon';

const WorkflowNode = ({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onMove,
  onDelete,
  onConnectionStart,
  onConnectionEnd,
  zoom
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList && e.target.classList.contains('resize-handle')) return;
    e.stopPropagation();
    
    if (e.detail === 2) {
      // Double click - open configuration
      return;
    }

    const rect = nodeRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    onSelect(node.id, e.ctrlKey || e.metaKey);
  }, [node.id, onSelect]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = (e.clientX - dragOffset.x) / zoom;
      const newY = (e.clientY - dragOffset.y) / zoom;
      onMove(node.id, { x: newX, y: newY });
    }
  }, [isDragging, dragOffset, zoom, node.id, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle connection points
  const handleOutputClick = useCallback((e, outputId) => {
    e.stopPropagation();
    if (isConnecting) {
      return;
    }
    
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    onConnectionStart(node.id, outputId, { x, y });
  }, [isConnecting, node.id, onConnectionStart]);

  const handleInputClick = useCallback((e, inputId) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectionEnd(node.id, inputId);
    }
  }, [isConnecting, node.id, onConnectionEnd]);

  const getNodeStatusColor = () => {
    switch (node.status) {
      case 'running': return 'border-success bg-success-50';
      case 'error': return 'border-error bg-error-50';
      case 'completed': return 'border-success bg-success-50';
      case 'warning': return 'border-warning bg-warning-50';
      default: return 'border-border bg-surface';
    }
  };

  const getNodeTypeColor = () => {
    switch (node.category) {
      case 'triggers': return 'text-accent bg-accent-50';
      case 'actions': return 'text-success bg-success-50';
      case 'logic': return 'text-warning bg-warning-50';
      case 'data': return 'text-primary bg-primary-50';
      default: return 'text-text-secondary bg-secondary-100';
    }
  };

  const getConditionStyles = () => {
    if (!node.data?.isConditional || !node.data?.condition) {
      return { borderColor: '', borderStyle: '', textColor: '' };
    }
    
    switch (node.data.condition) {
      case 'inactive':
        return { borderColor: '#ef4444', borderStyle: 'dashed', textColor: '#ef4444' };
      case 'active':
        return { borderColor: '#22c55e', borderStyle: 'solid', textColor: '#22c55e' };
      case 'wip':
        return { borderColor: '#eab308', borderStyle: 'solid', textColor: '#eab308' };
      default:
        return { borderColor: '', borderStyle: '', textColor: '' };
    }
  };

  const conditionStyles = getConditionStyles();

  return (
    <div
      ref={nodeRef}
      className={`
        absolute pointer-events-auto select-none cursor-move
        ${isDragging ? 'z-50' : 'z-10'}
      `}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: 200,
        minHeight: 100
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className={`
          relative w-full min-h-full rounded-lg border-2 shadow-subtle transition-all
          ${isSelected ? 'border-primary shadow-elevation' : getNodeStatusColor()}
          ${isDragging ? 'shadow-modal' : ''}
          hover:shadow-elevation
        `}
        style={{
          borderColor: conditionStyles.borderColor || undefined,
          borderStyle: conditionStyles.borderStyle || undefined,
        }}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className={`
              flex-shrink-0 w-6 h-6 rounded flex items-center justify-center
              ${getNodeTypeColor()}
            `}>
              <Icon name={node.icon} size={14} />
            </div>
            <span 
              className="text-sm font-body-medium truncate"
              style={{ color: conditionStyles.textColor || undefined }}
            >
              {node.name}
            </span>
          </div>
          
          {/* Node Actions */}
          <div className="flex items-center space-x-1">
            {node.status === 'running' && (
              <div className="w-2 h-2 bg-success rounded-full pulse-subtle" />
            )}
            {node.status === 'error' && (
              <Icon name="AlertTriangle" size={12} className="text-error" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete([node.id]);
              }}
              className="p-1 text-text-tertiary hover:text-error transition-micro rounded opacity-0 group-hover:opacity-100"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        </div>

        {/* Node Content */}
        <div className="p-3">
          {/* Node Description */}
          <p className="text-xs text-text-tertiary mb-3 line-clamp-2">
            {node.description || 'No description available'}
          </p>

          {/* Node Data Preview */}
          {Object.keys(node.data).length > 0 && (
            <div className="space-y-1">
              {Object.entries(node.data).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-text-tertiary capitalize">{key}:</span>
                  <span className="text-text-secondary truncate ml-2 max-w-20">
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </span>
                </div>
              ))}
              {Object.keys(node.data).length > 2 && (
                <div className="text-xs text-text-tertiary">
                  +{Object.keys(node.data).length - 2} more...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Connection Points */}
        {node.inputs.length > 0 && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
            {node.inputs.map((input, index) => (
              <div
                key={input.id}
                onClick={(e) => handleInputClick(e, input.id)}
                className={`
                  w-3 h-3 rounded-full border-2 bg-surface cursor-pointer transition-all
                  ${isConnecting ? 'border-primary hover:bg-primary' : 'border-text-tertiary hover:border-primary'}
                  ${index > 0 ? 'mt-2' : ''}
                `}
                title={input.label}
                style={{ top: index * 20 }}
              />
            ))}
          </div>
        )}

        {/* Output Connection Points */}
        {node.outputs.length > 0 && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
            {node.outputs.map((output, index) => (
              <div
                key={output.id}
                onClick={(e) => handleOutputClick(e, output.id)}
                className={`
                  w-3 h-3 rounded-full border-2 bg-surface cursor-pointer transition-all
                  border-text-tertiary hover:border-primary
                  ${index > 0 ? 'mt-2' : ''}
                `}
                title={output.label}
                style={{ top: index * 20 }}
              />
            ))}
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -inset-1 border-2 border-primary rounded-lg pointer-events-none opacity-50" />
        )}

        {/* Execution Progress */}
        {node.status === 'running' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-100 rounded-b-lg overflow-hidden">
            <div className="h-full bg-success animate-pulse" style={{ width: '60%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowNode;