import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { EnhancedCanvas } from './EnhancedCanvas';
import NodePalette from './components/NodePalette';
import PropertiesPanel from './components/PropertiesPanel';
import { initialNodes, initialEdges } from './initialWorkflow';
import Icon from 'components/AppIcon';

const handleStyleGreen = { background: '#22c55e', width: 16, height: 16, borderRadius: '50%' };
const handleStyleBlue = { background: '#0ea5e9', width: 16, height: 16, borderRadius: '50%' };
const handleStyleYellow = { background: '#eab308', width: 16, height: 16, borderRadius: '50%' };

const dotStyle = {
  position: 'absolute',
  width: 12,
  height: 12,
  background: '#3b82f6',
  border: '2px solid #fff',
  borderRadius: '50%',
  zIndex: 2,
};

// Helper function to get conditional styles
const getConditionalStyles = (data) => {
  if (!data?.isConditional || !data?.condition) {
    return { borderColor: data?.outline || '#333', borderStyle: data?.outlineStyle || 'solid', textColor: data?.textColor || '#000' };
  }
  
  switch (data.condition) {
    case 'inactive':
      return { borderColor: '#ef4444', borderStyle: 'dashed', textColor: '#ef4444' };
    case 'active':
      return { borderColor: '#22c55e', borderStyle: 'solid', textColor: '#22c55e' };
    case 'wip':
      return { borderColor: '#eab308', borderStyle: 'solid', textColor: '#eab308' };
    default:
      return { borderColor: data?.outline || '#333', borderStyle: data?.outlineStyle || 'solid', textColor: data?.textColor || '#000' };
  }
};

// Helper for 4 side dots
const FourSideDots = ({ show }) => show ? <>
  <div style={{ ...dotStyle, left: '50%', top: -6, transform: 'translateX(-50%)' }} /> {/* Top */}
  <div style={{ ...dotStyle, left: '50%', bottom: -6, transform: 'translateX(-50%)' }} /> {/* Bottom */}
  <div style={{ ...dotStyle, top: '50%', left: -6, transform: 'translateY(-50%)' }} /> {/* Left */}
  <div style={{ ...dotStyle, top: '50%', right: -6, transform: 'translateY(-50%)' }} /> {/* Right */}
</> : null;

const FourSideHandles = ({ isConnectable, id }) => <>
  <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', background: '#3b82f6', border: '2px solid #fff', width: 12, height: 12 }} />
  <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', background: 'transparent', border: 'none', width: 12, height: 12 }} />
  <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', background: '#3b82f6', border: '2px solid #fff', width: 12, height: 12 }} />
  <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', background: 'transparent', border: 'none', width: 12, height: 12 }} />
  <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', background: '#3b82f6', border: '2px solid #fff', width: 12, height: 12 }} />
  <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', background: 'transparent', border: 'none', width: 12, height: 12 }} />
  <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', background: '#3b82f6', border: '2px solid #fff', width: 12, height: 12 }} />
  <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', background: 'transparent', border: 'none', width: 12, height: 12 }} />
</>;

// Helper for 4 resize handles
const ResizeHandles = ({ width, height, onResize, id }) => {
  const initialSize = useRef({ width, height });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const directionRef = useRef(null);

  const onMouseDown = (direction) => (e) => {
    e.stopPropagation();
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { width, height };
    directionRef.current = direction;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const direction = directionRef.current;
    let delta = { x: 0, y: 0 };
    if (direction.includes('left')) delta.x = -dx;
    if (direction.includes('right')) delta.x = dx;
    if (direction.includes('top')) delta.y = -dy;
    if (direction.includes('bottom')) delta.y = dy;
    onResize(id, direction, delta, initialSize.current);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      {/* Top-left */}
      <div className="resize-handle" style={{ position: 'absolute', left: -8, top: -8, width: 12, height: 12, background: '#2563eb', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} onMouseDown={onMouseDown('top-left')} />
      {/* Top-right */}
      <div className="resize-handle" style={{ position: 'absolute', right: -8, top: -8, width: 12, height: 12, background: '#2563eb', borderRadius: 2, cursor: 'nesw-resize', zIndex: 10 }} onMouseDown={onMouseDown('top-right')} />
      {/* Bottom-left */}
      <div className="resize-handle" style={{ position: 'absolute', left: -8, bottom: -8, width: 12, height: 12, background: '#2563eb', borderRadius: 2, cursor: 'nesw-resize', zIndex: 10 }} onMouseDown={onMouseDown('bottom-left')} />
      {/* Bottom-right */}
      <div className="resize-handle" style={{ position: 'absolute', right: -8, bottom: -8, width: 12, height: 12, background: '#2563eb', borderRadius: 2, cursor: 'nwse-resize', zIndex: 10 }} onMouseDown={onMouseDown('bottom-right')} />
    </>
  );
};

// Helper for action icons
const NodeActions = ({ onDelete, onCopy, onRotate }) => (
  <div style={{ position: 'absolute', top: -28, right: 0, display: 'flex', gap: 2, zIndex: 20 }}>
    <button onClick={onDelete} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 3, padding: 1, marginRight: 1, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete"><Icon name="Scissors" size={14} color="#2563eb" /></button>
    <button onClick={onCopy} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 3, padding: 1, marginRight: 1, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Copy"><Icon name="Copy" size={14} color="#2563eb" /></button>
    <button onClick={onRotate} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 3, padding: 1, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Rotate"><Icon name="RotateCcw" size={14} color="#2563eb" /></button>
  </div>
);

const RectangleNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 120, height = data.height || 60;
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  
  const conditionalStyles = getConditionalStyles(data);
  
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect 
          x="2" 
          y="2" 
          width={width-4} 
          height={height-4} 
          rx="4" 
          fill="transparent" 
          stroke={conditionalStyles.borderColor} 
          strokeWidth={data.outlineWidth || 2} 
          strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} 
        />
      </svg>
      {/* Handles at 4 sides */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ 
        zIndex: 1, 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        top: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: data.fontSize, 
        fontFamily: data.fontFamily, 
        fontWeight: data.fontWeight, 
        color: conditionalStyles.textColor 
      }}>
        {data.text}
      </span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
const EllipseNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 120, height = data.height || 60;
  const cx = width / 2, cy = height / 2, rx = width / 2 - 4, ry = height / 2 - 4;
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// DiamondNode
const DiamondNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const points = [
    { x: width / 2, y: 4 },
    { x: width - 4, y: height / 2 },
    { x: width / 2, y: height - 4 },
    { x: 4, y: height / 2 },
  ];
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// ParallelogramNode
const ParallelogramNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 120, height = data.height || 60;
  const offset = width * 0.25;
  const points = [
    { x: offset, y: 4 },
    { x: width - 4, y: 4 },
    { x: width - offset, y: height - 4 },
    { x: 4, y: height - 4 },
  ];
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// TrapezoidNode
const TrapezoidNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 120, height = data.height || 60;
  const topInset = width * 0.25;
  const bottomInset = width * 0.033;
  const points = [
    { x: topInset, y: 4 },
    { x: width - topInset, y: 4 },
    { x: width - bottomInset, y: height - 4 },
    { x: bottomInset, y: height - 4 },
  ];
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// Helper to calculate regular polygon vertices
function getPolygonVertices(cx, cy, radius, sides, rotation = 0) {
  const angleStep = (2 * Math.PI) / sides;
  return Array.from({ length: sides }, (_, i) => {
    const angle = rotation + i * angleStep;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}
// PentagonNode with dual handles
const PentagonNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) / 2 - 6;
  const points = getPolygonVertices(cx, cy, radius, 5, -Math.PI / 2);
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// HexagonNode with dynamic handles
const HexagonNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 100, height = data.height || 60;
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) / 2 - 6;
  const points = getPolygonVertices(cx, cy, radius, 6, -Math.PI / 2);
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// OctagonNode with dynamic handles
const OctagonNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) / 2 - 6;
  const points = getPolygonVertices(cx, cy, radius, 8, -Math.PI / 8);
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// StarNode
const StarNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) / 2 - 6;
  // Calculate 10 points for a 5-pointed star (outer and inner points)
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 10;
    const r = i % 2 === 0 ? radius : radius * 0.5;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <polygon 
          points={svgPoints} 
          fill="transparent" 
          stroke={conditionalStyles.borderColor} 
          strokeWidth={data.outlineWidth || 2} 
          strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} 
        />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ 
        zIndex: 1, 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        top: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: data.fontSize, 
        fontFamily: data.fontFamily, 
        fontWeight: data.fontWeight, 
        color: conditionalStyles.textColor 
      }}>
        {data.text}
      </span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// CrossNode
const CrossNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const bar = Math.max(10, Math.min(width, height) * 0.12);
  const barLong = Math.max(20, Math.min(width, height) * 0.9);
  const centerX = width / 2, centerY = height / 2;
  // Remove points/handlePoints logic for handles
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x={centerX - bar / 2} y={centerY - barLong / 2} width={bar} height={barLong} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x={centerX - barLong / 2} y={centerY - bar / 2} width={barLong} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// ArrowNode
const ArrowNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 120, height = data.height || 40;
  const shaftHeight = Math.max(4, height * 0.18);
  const shaftY = (height - shaftHeight) / 2;
  const headWidth = Math.min(width * 0.22, 32);
  const headHeight = Math.min(height * 0.7, 28);
  const headBaseY1 = (height - headHeight) / 2;
  const headBaseY2 = (height + headHeight) / 2;
  const shaftX = 4;
  const shaftW = width - headWidth - 8;
  const tipX = width - 4;
  const baseX = width - headWidth - 4;
  const trianglePoints = [
    { x: tipX, y: height / 2 },
    { x: baseX, y: headBaseY1 },
    { x: baseX, y: headBaseY2 },
  ];
  const baseLineY = height / 2 + headHeight * 0.32;
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const handlePoints = [
    { x: shaftX, y: height / 2 },
    { x: tipX, y: height / 2 }
  ];
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x={shaftX} y={shaftY} width={shaftW} height={shaftHeight} fill="none" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} />
        <polygon points={trianglePoints.map(pt => `${pt.x},${pt.y}`).join(' ')} fill="none" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} />
        <line x1={baseX - 1} y1={baseLineY} x2={baseX - 1 + headWidth + 2} y2={baseLineY} stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} />
      </svg>
      {/* Handles at start (base) and end (tip) of arrow */}
      <Handle
        type="target"
        position={Position.Left}
        id={`start-target-${id}`}
        isConnectable={isConnectable}
        style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`end-source-${id}`}
        isConnectable={isConnectable}
        style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }}
      />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// HouseNode
const HouseNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const roofHeight = height * 0.4;
  const bodyHeight = height - roofHeight - 4;
  const points = [
    { x: width / 2, y: 4 },
    { x: width - 4, y: roofHeight },
    { x: width - 4, y: height - 4 },
    { x: 4, y: height - 4 },
    { x: 4, y: roofHeight },
  ];
  const svgPoints = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const handlePoints = [
    { x: width / 2, y: 4 },
    { x: width - 4, y: roofHeight },
    { x: width - 4, y: height - 4 },
    { x: 4, y: height - 4 },
    { x: 4, y: roofHeight },
  ];
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><polygon points={svgPoints} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={data.outlineStyle === 'dashed' ? '6,3' : data.outlineStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {showHandles && handlePoints.map((pt, idx) => (
        <React.Fragment key={idx}>
          <Handle
            type="source"
            position={Position.Top}
            id={`corner${idx}-source-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`corner${idx}-target-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
        </React.Fragment>
      ))}
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// LShape1Node
const LShape1Node = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const bar = Math.max(10, Math.min(width, height) * 0.25);
  const barLong = Math.max(20, Math.min(width, height) * 0.75);
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x="4" y={height - bar - 4} width={barLong} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x="4" y="4" width={bar} height={barLong} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// LShape2Node
const LShape2Node = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const bar = Math.max(10, Math.min(width, height) * 0.25);
  const barLong = Math.max(20, Math.min(width, height) * 0.75);
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x={width - bar - 4} y="4" width={bar} height={barLong} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x="4" y="4" width={barLong} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// UShape1Node
const UShape1Node = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const bar = Math.max(10, Math.min(width, height) * 0.25);
  const barLong = Math.max(20, Math.min(width, height) * 0.75);
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x="4" y="4" width={bar} height={barLong} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x={width - bar - 4} y="4" width={bar} height={barLong} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x="4" y={height - bar - 4} width={barLong} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// UShape2Node
const UShape2Node = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const bar = Math.max(10, Math.min(width, height) * 0.25);
  const barLong = Math.max(20, Math.min(width, height) * 0.75);
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x="4" y="4" width={barLong} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x="4" y={height - bar - 4} width={bar} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x={width - bar - 4} y={height - bar - 4} width={bar} height={bar} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// CircleNode
const CircleNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const cx = width / 2, cy = height / 2;
  const r = Math.min(width, height) / 2 - 4;
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}><circle cx={cx} cy={cy} r={r} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} /></svg>
      {/* Handles at 4 sides, same as RectangleNode */}
      <Handle type="source" position={Position.Top} id={`top-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Top} id={`top-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', top: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Bottom} id={`bottom-source-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Bottom} id={`bottom-target-${id}`} isConnectable={isConnectable} style={{ left: '50%', bottom: -6, transform: 'translateX(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Left} id={`left-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Left} id={`left-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', left: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="source" position={Position.Right} id={`right-source-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <Handle type="target" position={Position.Right} id={`right-target-${id}`} isConnectable={isConnectable} style={{ top: '50%', right: -6, transform: 'translateY(-50%)', ...dotStyle, opacity: showHandles ? 1 : 0, pointerEvents: showHandles ? 'auto' : 'none' }} />
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// CylinderNode
const CylinderNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const cx = width / 2;
  const rx = width / 2 - 10;
  const ry = Math.max(10, height * 0.13);
  const bodyHeight = height - 2 * ry - 4;
  const handlePoints = [
    { x: cx, y: ry + 2 },
    { x: cx, y: height - ry - 2 },
    { x: cx - rx, y: ry + 2 },
    { x: cx + rx, y: ry + 2 },
    { x: cx - rx, y: height - ry - 2 },
    { x: cx + rx, y: height - ry - 2 },
  ];
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <ellipse cx={cx} cy={ry + 2} rx={rx} ry={ry} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x={cx - rx} y={ry + 2} width={2 * rx} height={bodyHeight} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <ellipse cx={cx} cy={height - ry - 2} rx={rx} ry={ry} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {showHandles && handlePoints.map((pt, idx) => (
        <React.Fragment key={idx}>
          <Handle
            type="source"
            position={Position.Top}
            id={`corner${idx}-source-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`corner${idx}-target-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
        </React.Fragment>
      ))}
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// DocumentNode
const DocumentNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 100;
  const bodyX = width * 0.125, bodyY = height * 0.1;
  const bodyW = width * 0.75, bodyH = height * 0.8;
  const foldX = bodyX + bodyW, foldY = bodyY;
  const foldW = width * 0.15, foldH = height * 0.2;
  const handlePoints = [
    { x: bodyX, y: bodyY },
    { x: bodyX + bodyW, y: bodyY },
    { x: bodyX + bodyW, y: bodyY + bodyH },
    { x: bodyX, y: bodyY + bodyH },
    { x: foldX, y: foldY + foldH },
    { x: foldX - foldW, y: foldY + foldH },
  ];
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <polyline points={`${foldX},${foldY} ${foldX},${foldY + foldH} ${foldX - foldW},${foldY + foldH}`} fill="none" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {showHandles && handlePoints.map((pt, idx) => (
        <React.Fragment key={idx}>
          <Handle
            type="source"
            position={Position.Top}
            id={`corner${idx}-source-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`corner${idx}-target-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
        </React.Fragment>
      ))}
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
  </div>
);
};
// DatabaseNode
const DatabaseNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 80, height = data.height || 80;
  const cx = width / 2;
  const rx = width / 2 - 10;
  const ry = Math.max(10, height * 0.13);
  const bodyHeight = height - 2 * ry - 4;
  const handlePoints = [
    { x: cx, y: ry + 2 },
    { x: cx, y: height - ry - 2 },
    { x: cx - rx, y: ry + 2 },
    { x: cx + rx, y: ry + 2 },
    { x: cx - rx, y: height - ry - 2 },
    { x: cx + rx, y: height - ry - 2 },
  ];
  const handleResize = (e, direction) => {
    e.stopPropagation();
    data.onResizeNode(id, direction, { x: 10, y: 10 });
  };
  const handleDelete = e => { e.stopPropagation(); data.onDeleteNode(id); };
  const handleCopy = e => { e.stopPropagation(); data.onCopyNode(id); };
  const handleRotate = e => { e.stopPropagation(); data.onRotateNode(id); };
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={width} height={height}>
        <ellipse cx={cx} cy={ry + 2} rx={rx} ry={ry} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <rect x={cx - rx} y={ry + 2} width={2 * rx} height={bodyHeight} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
        <ellipse cx={cx} cy={height - ry - 2} rx={rx} ry={ry} fill="transparent" stroke={conditionalStyles.borderColor} strokeWidth={data.outlineWidth || 2} strokeDasharray={conditionalStyles.borderStyle === 'dashed' ? '6,3' : conditionalStyles.borderStyle === 'dotted' ? '2,2' : undefined} />
      </svg>
      {showHandles && handlePoints.map((pt, idx) => (
        <React.Fragment key={idx}>
          <Handle
            type="source"
            position={Position.Top}
            id={`corner${idx}-source-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`corner${idx}-target-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
        </React.Fragment>
      ))}
      <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={handleResize} id={id} />}
      {isSelected && <NodeActions onDelete={handleDelete} onCopy={handleCopy} onRotate={handleRotate} />}
    </div>
  );
};
// HeaderNode
const HeaderNode = ({ data, id, isConnectable, isSelected, isConnecting }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const width = data.width || 120, height = data.height || 40;
  const handlePoints = [
    { x: 0, y: height / 2 },
    { x: width, y: height / 2 },
    { x: width / 2, y: 0 },
    { x: width / 2, y: height },
  ];
  const showHandles = isHovered || isSelected;
  const conditionalStyles = getConditionalStyles(data);
  return (
    <div
      style={{
        width, height,
        position: 'relative',
        background: '#fff',
        border: '2px solid #333',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        transform: data.rotation ? `rotate(${data.rotation}deg)` : undefined,
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showHandles && handlePoints.map((pt, idx) => (
        <React.Fragment key={idx}>
          <Handle
            type="source"
            position={Position.Top}
            id={`corner${idx}-source-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`corner${idx}-target-${id}`}
            isConnectable={isConnectable}
            style={{ ...dotStyle, left: pt.x - 6, top: pt.y - 6 }}
          />
        </React.Fragment>
      ))}
    <span style={{ zIndex: 1, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: data.fontSize, fontFamily: data.fontFamily, fontWeight: data.fontWeight, color: conditionalStyles.textColor }}>{data.text}</span>
      {isSelected && <ResizeHandles width={width} height={height} onResize={() => {}} />}
    {isSelected && <NodeActions onDelete={() => {}} onCopy={() => {}} onRotate={() => {}} />}
  </div>
);
};

// Helper HOC to inject isSelected from React Flow's selected prop
const withSelection = (NodeComponent) => (props) => {
  return <NodeComponent {...props}
    isSelected={props.selected}
    onDeleteNode={props.onDeleteNode}
    onCopyNode={props.onCopyNode}
    onRotateNode={props.onRotateNode}
    onResizeNode={props.onResizeNode}
  />;
};

const nodeTypes = {
  rectangle: withSelection(RectangleNode),
  ellipse: withSelection(EllipseNode),
  diamond: withSelection(DiamondNode),
  parallelogram: withSelection(ParallelogramNode),
  trapezoid: withSelection(TrapezoidNode),
  pentagon: withSelection(PentagonNode),
  hexagon: withSelection(HexagonNode),
  octagon: withSelection(OctagonNode),
  star: withSelection(StarNode),
  cross: withSelection(CrossNode),
  arrow: withSelection(ArrowNode),
  house: withSelection(HouseNode),
  lshape1: withSelection(LShape1Node),
  lshape2: withSelection(LShape2Node),
  ushape1: withSelection(UShape1Node),
  ushape2: withSelection(UShape2Node),
  circle: withSelection(CircleNode),
  cylinder: withSelection(CylinderNode),
  document: withSelection(DocumentNode),
  database: withSelection(DatabaseNode),
  header: withSelection(HeaderNode),
  // Add advanced shapes as needed
};

// Migration utility: move all properties from node.data.config to node.data, remove config, and ensure all style properties (fill, outline, outlineStyle, outlineWidth, textColor, fontSize, fontFamily, fontWeight) are present in node.data with defaults if missing. This ensures style is always included in the node JSON.
function migrateNodeData(nodes) {
  return nodes.map(node => {
    let newData = { ...node.data };
    // Move config properties up
    if (newData && newData.config && typeof newData.config === 'object') {
      newData = { ...newData, ...newData.config };
      delete newData.config;
    }
    // Ensure style properties are present with defaults
    newData.fill = newData.fill || '#fff';
    newData.outline = newData.outline || '#333';
    newData.outlineStyle = newData.outlineStyle || 'solid';
    newData.outlineWidth = newData.outlineWidth || 2;
    newData.textColor = newData.textColor || '#000';
    newData.fontSize = newData.fontSize || 15;
    newData.fontFamily = newData.fontFamily || 'Open Sans';
    newData.fontWeight = newData.fontWeight || 400;
    return {
      ...node,
      data: newData,
    };
  });
}

// Helper: get closest side for a point relative to center
function getClosestSide(cx, cy, x, y) {
  const angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
  if (angle >= -45 && angle < 45) return Position.Right;
  if (angle >= 45 && angle < 135) return Position.Bottom;
  if (angle >= -135 && angle < -45) return Position.Top;
  return Position.Left;
}

export const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(migrateNodeData(initialNodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Action handlers
  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeIds((ids) => ids.filter((nid) => nid !== id));
  }, [setNodes, setEdges]);

  const handleCopyNode = useCallback((id) => {
    setNodes((nds) => {
      const node = nds.find((n) => n.id === id);
      if (!node) return nds;
      const newId = `${node.type}-${Date.now()}`;
      const offset = 40;
      // Deselect all, select only the new node
      setSelectedNodeIds([newId]);
      return nds.concat({
        ...node,
        id: newId,
        position: { x: node.position.x + offset, y: node.position.y + offset },
        data: { ...node.data },
        selected: false, // ensure not selected by default
      });
    });
  }, [setNodes]);

  const handleRotateNode = useCallback((id) => {
    setNodes((nds) => nds.map((n) =>
      n.id === id ? { ...n, data: { ...n.data, rotation: ((n.data.rotation || 0) + 90) % 360 } } : n
    ));
  }, [setNodes]);

  const handleResizeNode = useCallback((id, direction, delta, initialSize) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id !== id) return n;
      const width = initialSize?.width || n.data.width || 120;
      const height = initialSize?.height || n.data.height || 60;
      let newWidth = width, newHeight = height;
      if (direction === 'left') newWidth = Math.max(40, width - delta.x);
      if (direction === 'right') newWidth = Math.max(40, width + delta.x);
      if (direction === 'top') newHeight = Math.max(40, height - delta.y);
      if (direction === 'bottom') newHeight = Math.max(40, height + delta.y);
      if (direction === 'top-left') {
        newWidth = Math.max(40, width - delta.x);
        newHeight = Math.max(40, height - delta.y);
      }
      if (direction === 'top-right') {
        newWidth = Math.max(40, width + delta.x);
        newHeight = Math.max(40, height - delta.y);
      }
      if (direction === 'bottom-left') {
        newWidth = Math.max(40, width - delta.x);
        newHeight = Math.max(40, height + delta.y);
      }
      if (direction === 'bottom-right') {
        newWidth = Math.max(40, width + delta.x);
        newHeight = Math.max(40, height + delta.y);
      }
      return { ...n, data: { ...n.data, width: newWidth, height: newHeight } };
    }));
  }, [setNodes]);

  // Helper to inject handlers into node data
  const addHandlersToNodes = useCallback((nodes) =>
    nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDeleteNode: handleDeleteNode,
        onCopyNode: handleCopyNode,
        onRotateNode: handleRotateNode,
        onResizeNode: handleResizeNode,
      },
    })),
  [handleDeleteNode, handleCopyNode, handleRotateNode, handleResizeNode]);

  // Add node to canvas at a default position, using the new JSON structure
  const handleNodeAdd = useCallback((nodeType, position = { x: 200, y: 200 }) => {
    // Extract defaultData but exclude conditional properties
    const { isConditional, condition, ...otherDefaultData } = nodeType.defaultData || {};
    
    const newNode = {
      id: `${nodeType.id}-${Date.now()}`,
      type: nodeType.type || 'default',
      position,
      size: nodeType.size || { width: 120, height: 80 },
      data: {
        label: nodeType.name,
        config: otherDefaultData,
        status: 'idle',
        isConditional: false,
        condition: undefined,
      },
      handles: [
        { id: 'top', type: 'target', position: { x: 60, y: 0 } },
        { id: 'bottom', type: 'source', position: { x: 60, y: 80 } }
      ],
      connections: [],
      meta: { selected: false, locked: false },
    };
    setNodes((nds) => nds.concat(newNode));
    setSelectedNodeIds([newNode.id]);
  }, [setNodes]);

  // When a connection is made, update the source node's connections array
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      setNodes((nds) => nds.map(node => {
        if (node.id === params.source) {
          return {
            ...node,
            connections: [
              ...(node.connections || []),
              {
                fromHandle: params.sourceHandle,
                toNodeId: params.target,
                toHandle: params.targetHandle,
                isConditional: false
              }
            ]
          };
        }
        return node;
      }));
    },
    [setEdges, setNodes]
  );

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');
    if (!data) return;
    const nodeType = JSON.parse(data);
    if (!reactFlowInstance) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    handleNodeAdd(nodeType, position);
  }, [reactFlowInstance, handleNodeAdd]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeIds([node.id]);
  }, []);

  // Handle selection change from React Flow
  const handleSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodeIds(nodes.map(n => n.id));
  }, []);

  // Find the selected node (single selection for now)
  const selectedNode = nodes.find(n => selectedNodeIds.includes(n.id));

  // Handler to update node data from PropertiesPanel
  const handleNodePropertyChange = (changes) => {
    if (!selectedNode) return;
    setNodes(prevNodes => prevNodes.map(node => {
      if (changes[node.id]) {
        return { ...node, data: { ...node.data, ...changes[node.id] } };
      }
      return node;
    }));
  };

  // Update node position when moved
  const handleNodeMove = useCallback((id, newPosition) => {
    setNodes(nds => nds.map(n =>
      n.id === id
        ? { ...n, position: newPosition }
        : n
    ));
  }, [setNodes]);

  // Update node size when resized (already handled in handleResizeNode)
  // No change needed here, as handleResizeNode updates n.data.width/height

  // Handler to close the panel (deselect node)
  const handleClosePanel = () => setSelectedNodeIds([]);

  // Helper to push current state to undo stack
  const pushToUndoStack = useCallback(() => {
    setUndoStack((stack) => [...stack, { nodes, edges }]);
    setRedoStack([]);
  }, [nodes, edges]);

  // Wrap node/edge changes to support undo
  const handleNodesChange = useCallback((changes) => {
    pushToUndoStack();
    onNodesChange(changes);
  }, [onNodesChange, pushToUndoStack]);

  const handleEdgesChange = useCallback((changes) => {
    pushToUndoStack();
    onEdgesChange(changes);
  }, [onEdgesChange, pushToUndoStack]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      setRedoStack((redo) => [...redo, { nodes, edges }]);
      const prev = stack[stack.length - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      return stack.slice(0, -1);
    });
  }, [nodes, edges, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    setRedoStack((redo) => {
      if (redo.length === 0) return redo;
      setUndoStack((stack) => [...stack, { nodes, edges }]);
      const next = redo[redo.length - 1];
      setNodes(next.nodes);
      setEdges(next.edges);
      return redo.slice(0, -1);
    });
  }, [nodes, edges, setNodes, setEdges]);

  // Expose to window for toolbar
  useEffect(() => {
    window.onUndo = handleUndo;
    window.onRedo = handleRedo;
    window.canUndo = undoStack.length > 0;
    window.canRedo = redoStack.length > 0;
    return () => {
      window.onUndo = undefined;
      window.onRedo = undefined;
      window.canUndo = undefined;
      window.canRedo = undefined;
    };
  }, [handleUndo, handleRedo, undoStack, redoStack]);

  // Log updated nodes JSON to the console whenever nodes change
  useEffect(() => {
    console.log('Current nodes JSON:', nodes);
  }, [nodes]);

  return (
    <ReactFlowProvider>
      <div className="h-screen w-full flex bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-auto">
        {/* Left Sidebar: Node Palette */}
        <div style={{ width: 300, background: '#f8fafc', borderRight: '1px solid #e5e7eb', minWidth: 220 }}>
          <NodePalette onNodeAdd={handleNodeAdd} onClose={() => {}} />
        </div>
        <div className="flex-1 flex flex-col min-w-0 relative">
          <div className="flex-1 flex relative">
            <div className="flex-1 relative overflow-auto">
              <EnhancedCanvas
                nodes={addHandlersToNodes(nodes)}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                isExecuting={isExecuting}
                selectedNodes={selectedNodeIds}
                onSelectionChange={handleSelectionChange}
                onNodeMove={handleNodeMove}
              />
              {/* Properties Panel on right */}
              <PropertiesPanel node={selectedNode} onChange={change => handleNodePropertyChange({ [selectedNode.id]: change })} onClose={handleClosePanel} />
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}; 