import React from 'react';

const ConnectionLine = ({
  connection,
  sourceNode,
  targetNode,
  zoom,
  position,
  isSelected
}) => {
  // Calculate connection points
  const sourceX = (sourceNode.position.x + 200) * zoom + position.x; // Right edge of source node
  const sourceY = (sourceNode.position.y + 50) * zoom + position.y; // Middle of source node
  const targetX = targetNode.position.x * zoom + position.x; // Left edge of target node
  const targetY = (targetNode.position.y + 50) * zoom + position.y; // Middle of target node

  // Calculate control points for smooth curve
  const controlOffset = Math.abs(targetX - sourceX) * 0.5;
  const sourceControlX = sourceX + controlOffset;
  const targetControlX = targetX - controlOffset;

  // Create SVG path for curved connection
  const pathData = `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceY} ${targetControlX} ${targetY} ${targetX} ${targetY}`;

  const getConnectionColor = () => {
    if (isSelected) return '#2563EB'; // Primary blue
    switch (connection.type) {
      case 'data': return '#64748B'; // Slate
      case 'error': return '#DC2626'; // Red
      case 'success': return '#059669'; // Green
      default: return '#64748B';
    }
  };

  const getConnectionWidth = () => {
    return isSelected ? 3 : 2;
  };

  return (
    <g className="pointer-events-auto">
      {/* Connection path */}
      <path
        d={pathData}
        fill="none"
        stroke={getConnectionColor()}
        strokeWidth={getConnectionWidth()}
        className="transition-all cursor-pointer hover:stroke-primary"
        markerEnd="url(#arrowhead)"
      />
      
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={getConnectionColor()}
          />
        </marker>
      </defs>

      {/* Connection label (if needed) */}
      {connection.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          className="text-xs fill-text-tertiary pointer-events-none"
        >
          {connection.label}
        </text>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <path
          d={pathData}
          fill="none"
          stroke="#2563EB"
          strokeWidth="6"
          opacity="0.3"
          className="pointer-events-none"
        />
      )}
    </g>
  );
};

export default ConnectionLine;