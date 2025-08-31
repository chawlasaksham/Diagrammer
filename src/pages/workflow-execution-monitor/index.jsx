import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import ExecutionVisualization from './components/ExecutionVisualization';
import ExecutionLogs from './components/ExecutionLogs';

import ExecutionControls from './components/ExecutionControls';
import TimelineScrubber from './components/TimelineScrubber';

const WorkflowExecutionMonitor = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [executionStatus, setExecutionStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [logLevel, setLogLevel] = useState('all');
  const [timeRange, setTimeRange] = useState('1h');
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  // Mock workflow executions data
  const workflowExecutions = [
    {
      id: "exec-001",
      workflowId: "wf-001",
      workflowName: "Customer Onboarding Automation",
      status: "running",
      startTime: new Date(Date.now() - 300000),
      currentStep: 3,
      totalSteps: 8,
      progress: 37.5,
      executionTime: "5m 23s",
      nodes: [
        { id: "node-1", name: "Trigger: New Customer", status: "completed", duration: "0.2s", data: { processed: 1 } },
        { id: "node-2", name: "Validate Email", status: "completed", duration: "1.1s", data: { valid: true } },
        { id: "node-3", name: "Create Account", status: "running", duration: "2.3s", data: { accountId: "ACC-12345" } },
        { id: "node-4", name: "Send Welcome Email", status: "pending", duration: null, data: null },
        { id: "node-5", name: "Setup Default Settings", status: "pending", duration: null, data: null },
        { id: "node-6", name: "Assign Support Agent", status: "pending", duration: null, data: null },
        { id: "node-7", name: "Log Activity", status: "pending", duration: null, data: null },
        { id: "node-8", name: "Complete Onboarding", status: "pending", duration: null, data: null }
      ]
    },
    {
      id: "exec-002",
      workflowId: "wf-002",
      workflowName: "Invoice Processing Pipeline",
      status: "completed",
      startTime: new Date(Date.now() - 900000),
      endTime: new Date(Date.now() - 600000),
      currentStep: 6,
      totalSteps: 6,
      progress: 100,
      executionTime: "5m 0s",
      nodes: [
        { id: "node-1", name: "Receive Invoice", status: "completed", duration: "0.1s", data: { invoiceId: "INV-001" } },
        { id: "node-2", name: "Extract Data", status: "completed", duration: "2.1s", data: { amount: 1250.00 } },
        { id: "node-3", name: "Validate Vendor", status: "completed", duration: "0.8s", data: { vendorValid: true } },
        { id: "node-4", name: "Approval Workflow", status: "completed", duration: "1.2s", data: { approved: true } },
        { id: "node-5", name: "Update ERP", status: "completed", duration: "0.6s", data: { erpId: "ERP-789" } },
        { id: "node-6", name: "Send Confirmation", status: "completed", duration: "0.2s", data: { sent: true } }
      ]
    }
  ];

  const executionLogs = [
    {
      id: "log-001",
      timestamp: new Date(Date.now() - 180000),
      level: "info",
      nodeId: "node-3",
      nodeName: "Create Account",
      message: "Account creation initiated for customer john.doe@email.com",
      details: `Account creation process started with the following parameters:
Customer Email: john.doe@email.com
Customer Name: John Doe
Registration Source: Web Portal
Account Type: Standard
Initial Status: Pending Verification`,
      data: { customerId: "CUST-12345", email: "john.doe@email.com" }
    },
    {
      id: "log-002",
      timestamp: new Date(Date.now() - 120000),
      level: "success",
      nodeId: "node-2",
      nodeName: "Validate Email",
      message: "Email validation completed successfully",
      details: "Email format validation passed. Domain verification completed. MX record check successful.",
      data: { email: "john.doe@email.com", valid: true, domain: "email.com" }
    },
    {
      id: "log-003",
      timestamp: new Date(Date.now() - 90000),
      level: "warning",
      nodeId: "node-3",
      nodeName: "Create Account",
      message: "Database connection timeout, retrying...",
      details: "Initial database connection attempt failed due to timeout. Implementing retry logic with exponential backoff.",
      data: { retryAttempt: 1, timeout: "5s" }
    },
    {
      id: "log-004",
      timestamp: new Date(Date.now() - 60000),
      level: "error",
      nodeId: "node-3",
      nodeName: "Create Account",
      message: "Account creation failed: Duplicate email address",
      details: `Account creation failed due to duplicate email constraint violation.
Error Details:
- Email: john.doe@email.com already exists in the system
- Existing Account ID: ACC-98765
- Registration Date: 2024-01-15
- Account Status: Active

Recommended Actions:
1. Check if this is a legitimate duplicate registration
2. Consider account recovery flow instead
3. Notify customer of existing account`,
      data: { error: "DUPLICATE_EMAIL", existingAccountId: "ACC-98765" },
      stackTrace: `DatabaseError: duplicate key value violates unique constraint "users_email_key"
    at Connection.parseE (/app/node_modules/pg/lib/connection.js:614:13)
    at Connection.parseMessage (/app/node_modules/pg/lib/connection.js:413:19)
    at Socket.<anonymous> (/app/node_modules/pg/lib/connection.js:129:22)`
    }
  ];

  useEffect(() => {
    if (workflowExecutions.length > 0) {
      setSelectedWorkflow(workflowExecutions[0]);
    }
  }, []);

  const handleExecutionControl = (action) => {
    switch (action) {
      case 'start': setExecutionStatus('running');
        break;
      case 'pause': setExecutionStatus('paused');
        break;
      case 'stop': setExecutionStatus('stopped');
        break;
      case 'restart': setExecutionStatus('running');
        setCurrentStep(0);
        break;
      default:
        break;
    }
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };

  const handleLogLevelChange = (level) => {
    setLogLevel(level);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const filteredLogs = executionLogs.filter(log => {
    if (logLevel === 'all') return true;
    return log.level === logLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pt-14">
        {/* Top Controls Bar */}
        <div className="bg-surface border-b border-border px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Workflow Selection */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Activity" size={20} className="text-primary" />
                <h1 className="text-xl font-heading-semibold text-text-primary">
                  Execution Monitor
                </h1>
              </div>
              <div className="hidden lg:block w-px h-6 bg-border" />
              <select
                value={selectedWorkflow?.id || ''}
                onChange={(e) => {
                  const workflow = workflowExecutions.find(w => w.id === e.target.value);
                  setSelectedWorkflow(workflow);
                }}
                className="px-3 py-2 bg-secondary-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {workflowExecutions.map(workflow => (
                  <option key={workflow.id} value={workflow.id}>
                    {workflow.workflowName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status and Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  selectedWorkflow?.status === 'running' ? 'bg-success pulse-subtle' :
                  selectedWorkflow?.status === 'completed' ? 'bg-success' :
                  selectedWorkflow?.status === 'error'? 'bg-error' : 'bg-secondary-400'
                }`} />
                <span className="text-sm font-body-medium text-text-secondary capitalize">
                  {selectedWorkflow?.status || 'No workflow selected'}
                </span>
              </div>
              <ExecutionControls
                status={executionStatus}
                onControl={handleExecutionControl}
              />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)]">
          {/* Left Panel - Workflow Visualization */}
          <div className="flex-1 lg:w-2/3 border-r border-border bg-surface">
            <div className="h-full flex flex-col">
              {/* Visualization Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-lg font-heading-medium text-text-primary">
                  Workflow Visualization
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsRealTimeMode(!isRealTimeMode)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-micro ${
                      isRealTimeMode 
                        ? 'bg-success-50 text-success border border-success-100' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
                    }`}
                  >
                    <Icon name={isRealTimeMode ? "Wifi" : "WifiOff"} size={14} />
                    <span>Real-time</span>
                  </button>
                  <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-micro">
                    <Icon name="Maximize2" size={16} />
                  </button>
                </div>
              </div>

              {/* Visualization Content */}
              <div className="flex-1 relative">
                <ExecutionVisualization
                  workflow={selectedWorkflow}
                  currentStep={currentStep}
                  onNodeSelect={handleNodeSelect}
                  selectedNode={selectedNode}
                />
              </div>

              {/* Timeline Scrubber */}
              <div className="border-t border-border">
                <TimelineScrubber
                  workflow={selectedWorkflow}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Logs and Metrics */}
          <div className="lg:w-1/3 bg-surface flex flex-col">
            {/* Panel Tabs */}
            <div className="flex border-b border-border">
              <button className="flex-1 px-4 py-3 text-sm font-body-medium text-primary border-b-2 border-primary bg-primary-50">
                Execution Logs
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-body-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-micro">
                Metrics
              </button>
            </div>

            {/* Logs Panel */}
            <div className="flex-1 flex flex-col">
              {/* Log Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <select
                    value={logLevel}
                    onChange={(e) => handleLogLevelChange(e.target.value)}
                    className="px-2 py-1 text-xs bg-secondary-50 border border-border rounded"
                  >
                    <option value="all">All Levels</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="success">Success</option>
                  </select>
                  <select
                    value={timeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    className="px-2 py-1 text-xs bg-secondary-50 border border-border rounded"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                  </select>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded transition-micro">
                    <Icon name="Search" size={14} />
                  </button>
                  <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded transition-micro">
                    <Icon name="Download" size={14} />
                  </button>
                </div>
              </div>

              {/* Logs Content */}
              <div className="flex-1 overflow-hidden">
                <ExecutionLogs
                  logs={filteredLogs}
                  selectedNode={selectedNode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowExecutionMonitor;