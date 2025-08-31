import React, { forwardRef, useCallback, useRef, useEffect, useState } from 'react';
import Icon from 'components/AppIcon';
import WorkflowNode from './WorkflowNode';
import ConnectionLine from './ConnectionLine';

const WorkflowCanvas = forwardRef(({
  nodes,
  connections,
  selectedNodes,
  selectedConnections,
  zoom,
  position,
  isConnecting,
  connectionStart,
  onNodeSelect,
  onNodeDeselect,
  onNodeMove,
  onNodeDelete,
  onConnectionStart,
  onConnectionEnd,
  onConnectionCancel,
  onCanvasClick,
  onPositionChange,
  onZoomChange
}, ref) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Grid settings
  const gridSize = 20;
  const gridColor = '#e2e8f0';

  // Handle canvas drag
  const handleMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      if (e.shiftKey) {
        // Start selection box
        setIsSelecting(true);
        setSelectionBox({
          startX,
          startY,
          endX: startX,
          endY: startY
        });
      } else {
        // Start canvas drag
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y
        });
        onNodeDeselect();
      }
    }
  }, [position, onNodeDeselect]);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    if (isDragging) {
      onPositionChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isSelecting && selectionBox) {
      const rect = canvasRef.current.getBoundingClientRect();
      setSelectionBox(prev => ({
        ...prev,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
      }));
    }
  }, [isDragging, isSelecting, selectionBox, dragStart, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectionBox) {
      // Select nodes within selection box
      const selectedNodeIds = nodes.filter(node => {
        const nodeX = node.position.x * zoom + position.x;
        const nodeY = node.position.y * zoom + position.y;
        const nodeWidth = 200 * zoom;
        const nodeHeight = 100 * zoom;

        const boxLeft = Math.min(selectionBox.startX, selectionBox.endX);
        const boxRight = Math.max(selectionBox.startX, selectionBox.endX);
        const boxTop = Math.min(selectionBox.startY, selectionBox.endY);
        const boxBottom = Math.max(selectionBox.startY, selectionBox.endY);

        return nodeX < boxRight && nodeX + nodeWidth > boxLeft &&
               nodeY < boxBottom && nodeY + nodeHeight > boxTop;
      }).map(node => node.id);

      if (selectedNodeIds.length > 0) {
        selectedNodeIds.forEach((nodeId, index) => {
          onNodeSelect(nodeId, index > 0);
        });
      }

      setSelectionBox(null);
    }

    setIsDragging(false);
    setIsSelecting(false);
  }, [isSelecting, selectionBox, nodes, zoom, position, onNodeSelect]);

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const nodeType = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      
      // Snap to grid
      const snappedX = Math.round(x / gridSize) * gridSize;
      const snappedY = Math.round(y / gridSize) * gridSize;
      
      onNodeAdd(nodeType, { x: snappedX, y: snappedY });
    } catch (error) {
      console.error('Failed to parse dropped node data:', error);
    }
  }, [position, zoom, gridSize]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragover', handleDragOver);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('dragover', handleDragOver);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, handleDrop, handleDragOver]);

  // Generate grid pattern
  const generateGridPattern = () => {
    const scaledGridSize = gridSize * zoom;
    const offsetX = position.x % scaledGridSize;
    const offsetY = position.y % scaledGridSize;

    return (
      <defs>
        <pattern
          id="grid"
          width={scaledGridSize}
          height={scaledGridSize}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${scaledGridSize} 0 L 0 0 0 ${scaledGridSize}`}
            fill="none"
            stroke={gridColor}
            strokeWidth="1"
            opacity="0.5"
          />
        </pattern>
      </defs>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* SVG Grid and Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {generateGridPattern()}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Render connections */}
        {connections.map(connection => {
          const sourceNode = nodes.find(n => n.id === connection.source);
          const targetNode = nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              sourceNode={sourceNode}
              targetNode={targetNode}
              zoom={zoom}
              position={position}
              isSelected={selectedConnections.includes(connection.id)}
            />
          );
        })}

        {/* Active connection line */}
        {isConnecting && connectionStart && (
          <line
            x1={connectionStart.x}
            y1={connectionStart.y}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="pointer-events-none"
          />
        )}
      </svg>

      {/* Selection Box */}
      {isSelecting && selectionBox && (
        <div
          className="absolute border-2 border-primary bg-primary-50 bg-opacity-20 pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY)
          }}
        />
      )}

      {/* Render nodes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
        }}
      >
        {nodes.map(node => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={selectedNodes.includes(node.id)}
            isConnecting={isConnecting}
            onSelect={onNodeSelect}
            onMove={onNodeMove}
            onDelete={onNodeDelete}
            onConnectionStart={onConnectionStart}
            onConnectionEnd={onConnectionEnd}
            zoom={zoom}
          />
        ))}
      </div>

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => onZoomChange(Math.min(zoom * 1.2, 3))}
          className="p-2 bg-surface border border-border rounded-lg shadow-subtle hover:shadow-elevation transition-all"
        >
          <Icon name="Plus" size={16} className="text-text-secondary" />
        </button>
        <button
          onClick={() => onZoomChange(Math.max(zoom / 1.2, 0.1))}
          className="p-2 bg-surface border border-border rounded-lg shadow-subtle hover:shadow-elevation transition-all"
        >
          <Icon name="Minus" size={16} className="text-text-secondary" />
        </button>
        <button
          onClick={() => {
            onZoomChange(1);
            onPositionChange({ x: 0, y: 0 });
          }}
          className="p-2 bg-surface border border-border rounded-lg shadow-subtle hover:shadow-elevation transition-all"
        >
          <Icon name="Home" size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Icon name="Workflow" size={64} className="text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-heading-medium text-text-primary mb-2">Start Building Your Workflow</h3>
            <p className="text-text-secondary mb-4">Drag nodes from the palette or click to add them to the canvas</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-text-tertiary">
              <div className="flex items-center space-x-1">
                <Icon name="Mouse" size={16} />
                <span>Drag to pan</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MousePointer" size={16} />
                <span>Shift+drag to select</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Scroll" size={16} />
                <span>Scroll to zoom</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

WorkflowCanvas.displayName = 'WorkflowCanvas';

export default WorkflowCanvas;