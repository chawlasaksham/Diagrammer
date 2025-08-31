import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ConnectionMode,
  MiniMap,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
// Removed: import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Grid, Eye, EyeOff, Download } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array} props.nodes
 * @param {Array} props.edges
 * @param {Function} props.onNodesChange
 * @param {Function} props.onEdgesChange
 * @param {Function} props.onConnect
 * @param {Function} props.onInit
 * @param {Function} props.onDrop
 * @param {Function} props.onDragOver
 * @param {Function} props.onNodeClick
 * @param {Object} props.nodeTypes
 * @param {boolean} props.isExecuting
 * @param {Array} props.selectedNodes
 */
export const EnhancedCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onDrop,
  onDragOver,
  onNodeClick,
  nodeTypes,
  isExecuting,
  selectedNodes = [],
  onSelectionChange,
}) => {
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [backgroundVariant, setBackgroundVariant] = useState(BackgroundVariant.Dots);
  const [canvasMode, setCanvasMode] = useState('design');
  const reactFlowInstance = useRef(null);

  const handleInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
    onInit(instance);
    // Auto-fit view on initialization
    instance.fitView({ padding: 0.1 });
  }, [onInit]);

  const fitView = () => {
    reactFlowInstance.current?.fitView({ padding: 0.1 });
  };

  const zoomIn = () => {
    reactFlowInstance.current?.zoomIn();
  };

  const zoomOut = () => {
    reactFlowInstance.current?.zoomOut();
  };

  const downloadImage = async () => {
    if (!reactFlowInstance.current) return;

    try {
      // Get the current viewport
      const viewport = reactFlowInstance.current.getViewport();
      // Export workflow data as JSON
      const workflowData = {
        nodes,
        edges,
        viewport,
        timestamp: new Date().toISOString(),
        metadata: {
          nodeCount: nodes.length,
          edgeCount: edges.length,
          version: '1.0.0'
        }
      };
      const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading workflow:', error);
    }
  };

  useEffect(() => {
    setCanvasMode(isExecuting ? 'execution' : 'design');
  }, [isExecuting]);

  return (
    <div className="relative w-full h-full">
      {/* Dynamic background overlay based on execution state */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
        isExecuting 
          ? 'bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-cyan-100/40' 
          : 'bg-gradient-to-br from-gray-100/30 via-slate-100/30 to-gray-50/30'
      }`} />
      {isExecuting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200 px-6 py-3 rounded-full shadow-2xl animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-900 font-semibold">Workflow Executing...</span>
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={handleInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className={`transition-all duration-500 bg-white ${
          canvasMode === 'execution' ? 'brightness-105 contrast-100' : ''
        }`}
        fitView
        attributionPosition="bottom-left"
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Ctrl']}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        selectNodesOnDrag={false}
        selectedNodes={selectedNodes}
        onSelectionChange={onSelectionChange}
      >
        <Controls 
          className="bg-white-600/90 border border-white-700 rounded-xl shadow-lg"
          style={{ color: 'black', fill: 'white', stroke: 'white' }}
          position="bottom-left"
        />
        <Background 
          color={canvasMode === 'execution' ? "#93c5fd" : "#e5e7eb"} 
          gap={20} 
          size={1}
          variant={backgroundVariant}
          className={`transition-all duration-500 ${
            canvasMode === 'execution' ? 'opacity-70' : 'opacity-40'
          }`}
        />
        {showMiniMap && (
          <MiniMap
            style={{
              backgroundColor: '#f3f4f6',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
              width: 200,
              height: 150
            }}
            nodeColor={(node) => {
              switch (node.data?.status) {
                case 'running': return '#3b82f6';
                case 'success': return '#10b981';
                case 'error': return '#ef4444';
                default: return '#6b7280';
              }
            }}
            nodeStrokeColor="#e5e7eb"
            nodeStrokeWidth={1}
            maskColor="rgba(243, 244, 246, 0.7)"
            pannable={true}
            zoomable={true}
            position="bottom-right"
          />
        )}
        <Panel position="top-right" className="space-y-2">
          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-2xl">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={zoomIn}
                className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 bg-transparent border-none rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={zoomOut}
                className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 bg-transparent border-none rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={fitView}
                className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 bg-transparent border-none rounded"
                title="Fit View"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button
                type="button"
                onClick={() => setShowMiniMap(!showMiniMap)}
                className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 bg-transparent border-none rounded"
                title="Toggle Minimap"
              >
                {showMiniMap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setBackgroundVariant(
                  backgroundVariant === BackgroundVariant.Dots ? BackgroundVariant.Lines : 
                  backgroundVariant === BackgroundVariant.Lines ? BackgroundVariant.Cross : BackgroundVariant.Dots
                )}
                className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 bg-transparent border-none rounded"
                title="Change Background"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={downloadImage}
                className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-700 bg-transparent border-none rounded"
                title="Download Workflow"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xl text-sm">
            <div className="text-gray-900 space-y-1">
              <div className="flex justify-between">
                <span>Nodes:</span>
                <span className="text-blue-600 font-medium">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Connections:</span>
                <span className="text-green-600 font-medium">{edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className={`font-medium ${canvasMode === 'execution' ? 'text-orange-500' : 'text-gray-500'}`}>{canvasMode === 'execution' ? 'Executing' : 'Design'}</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}; 