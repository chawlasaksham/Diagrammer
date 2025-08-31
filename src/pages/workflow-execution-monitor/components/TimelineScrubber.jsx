import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const TimelineScrubber = ({ workflow, currentStep, onStepChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrubberRef = useRef(null);
  const playIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  if (!workflow || !workflow.nodes) {
    return null;
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging && e.type !== 'mousedown') return;
    
    const rect = scrubberRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const step = Math.round(percentage * (workflow.nodes.length - 1));
    
    onStepChange(step);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handlePlay = () => {
    if (isPlaying) {
      clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        onStepChange(prev => {
          const nextStep = prev + 1;
          if (nextStep >= workflow.nodes.length) {
            clearInterval(playIntervalRef.current);
            setIsPlaying(false);
            return workflow.nodes.length - 1;
          }
          return nextStep;
        });
      }, 1000);
    }
  };

  const handleStepForward = () => {
    onStepChange(Math.min(currentStep + 1, workflow.nodes.length - 1));
  };

  const handleStepBackward = () => {
    onStepChange(Math.max(currentStep - 1, 0));
  };

  const handleReset = () => {
    onStepChange(0);
    if (isPlaying) {
      clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    }
  };

  const progress = workflow.nodes.length > 0 ? (currentStep / (workflow.nodes.length - 1)) * 100 : 0;

  return (
    <div className="bg-surface border-t border-border p-4">
      <div className="flex items-center space-x-4">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-micro"
            title="Reset to start"
          >
            <Icon name="SkipBack" size={16} />
          </button>
          
          <button
            onClick={handleStepBackward}
            disabled={currentStep === 0}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous step"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          
          <button
            onClick={handlePlay}
            className="p-2 bg-primary text-white hover:bg-primary-700 rounded-lg transition-micro"
            title={isPlaying ? "Pause replay" : "Play replay"}
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
          </button>
          
          <button
            onClick={handleStepForward}
            disabled={currentStep === workflow.nodes.length - 1}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next step"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 flex items-center space-x-4">
          <span className="text-sm text-text-secondary whitespace-nowrap">
            Step {currentStep + 1} of {workflow.nodes.length}
          </span>
          
          <div className="flex-1 relative">
            <div
              ref={scrubberRef}
              className="h-6 bg-secondary-100 rounded-full cursor-pointer relative"
              onMouseDown={handleMouseDown}
            >
              {/* Progress Track */}
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
              
              {/* Step Markers */}
              {workflow.nodes.map((node, index) => {
                const position = workflow.nodes.length > 1 ? (index / (workflow.nodes.length - 1)) * 100 : 0;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div
                    key={index}
                    className={`
                      absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2
                      transition-all duration-200 cursor-pointer
                      ${isCurrent 
                        ? 'bg-primary border-white scale-125 shadow-lg' 
                        : isActive 
                          ? 'bg-primary border-white' :'bg-secondary-300 border-white'
                      }
                    `}
                    style={{ left: `${position}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStepChange(index);
                    }}
                    title={node.name}
                  />
                );
              })}
              
              {/* Scrubber Handle */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>
          
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {workflow.executionTime}
          </span>
        </div>

        {/* Timeline Info */}
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={14} />
          <span>
            {workflow.startTime.toLocaleTimeString()}
          </span>
          {workflow.endTime && (
            <>
              <span>-</span>
              <span>{workflow.endTime.toLocaleTimeString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Current Step Info */}
      {workflow.nodes[currentStep] && (
        <div className="mt-3 p-3 bg-secondary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${workflow.nodes[currentStep].status === 'completed' ? 'bg-success text-white' :
                  workflow.nodes[currentStep].status === 'running' ? 'bg-warning text-white' :
                  workflow.nodes[currentStep].status === 'error'? 'bg-error text-white' : 'bg-secondary-300 text-text-secondary'}
              `}>
                <Icon 
                  name={
                    workflow.nodes[currentStep].status === 'completed' ? 'CheckCircle2' :
                    workflow.nodes[currentStep].status === 'running' ? 'Play' :
                    workflow.nodes[currentStep].status === 'error'? 'AlertCircle' : 'Clock'
                  } 
                  size={16} 
                />
              </div>
              <div>
                <h4 className="font-body-medium text-text-primary">
                  {workflow.nodes[currentStep].name}
                </h4>
                <p className="text-xs text-text-secondary capitalize">
                  {workflow.nodes[currentStep].status}
                  {workflow.nodes[currentStep].duration && ` • ${workflow.nodes[currentStep].duration}`}
                </p>
              </div>
            </div>
            
            {workflow.nodes[currentStep].data && (
              <button className="text-xs text-accent hover:text-accent-600 transition-micro">
                View Data
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineScrubber;