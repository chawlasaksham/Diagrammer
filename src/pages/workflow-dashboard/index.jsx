import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import WorkflowCard from './components/WorkflowCard';
import MetricsCard from './components/MetricsCard';
import RecentActivity from './components/RecentActivity';
import FilterToolbar from './components/FilterToolbar';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { useCallback } from 'react';

const navLinks = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Personal', icon: 'User' },
  { label: 'Shared with you', icon: 'Users' },
];

const tabList = [
  { label: 'Diagrams' },
];

// ProfilePage component for '/profile' route
const ProfilePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' }}>
          <span className="text-4xl font-bold text-white">S</span>
        </div>
        <h2 className="text-2xl font-heading-bold mb-1">Sysadmin</h2>
        <div className="text-text-secondary mb-4">RIS</div>
        <hr className="w-full mb-4" />
        <div className="w-full mb-4">
          <div className="flex justify-between mb-2"><span className="font-body-medium">Name:</span> <span>Sysadmin</span></div>
          <div className="flex justify-between mb-2"><span className="font-body-medium">Company:</span> <span>RIS</span></div>
          <div className="flex justify-between mb-2"><span className="font-body-medium">Email:</span> <span>sysadmin</span></div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white py-2 rounded font-body-medium">Edit Profile</button>
            <button className="flex-1 bg-error text-white py-2 rounded font-body-medium">Logout</button>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-success text-white py-2 rounded font-body-medium">Home Page</button>
            <button className="flex-1 bg-warning text-white py-2 rounded font-body-medium">Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('modified');
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Diagrams');
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Mock data for workflows (same as before)
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: "Customer Onboarding",
      description: "Automated customer registration and welcome email sequence",
      status: "active",
      lastModified: new Date(Date.now() - 86400000),
      executions: 156,
      successRate: 98.7,
      tags: ["customer", "email", "automation"],
      createdBy: "John Doe",
      nodes: 8
    },
    {
      id: 2,
      name: "Invoice Processing",
      description: "Extract data from invoices and update accounting system",
      status: "error",
      lastModified: new Date(Date.now() - 3600000),
      executions: 89,
      successRate: 85.4,
      tags: ["finance", "data", "processing"],
      createdBy: "Sarah Wilson",
      nodes: 12
    },
    {
      id: 3,
      name: "Social Media Scheduler",
      description: "Schedule and publish content across multiple platforms",
      status: "active",
      lastModified: new Date(Date.now() - 7200000),
      executions: 234,
      successRate: 96.2,
      tags: ["social", "content", "scheduling"],
      createdBy: "Mike Johnson",
      nodes: 6
    },
    {
      id: 4,
      name: "Lead Qualification",
      description: "Score and route leads based on predefined criteria",
      status: "draft",
      lastModified: new Date(Date.now() - 172800000),
      executions: 0,
      successRate: 0,
      tags: ["sales", "leads", "scoring"],
      createdBy: "Emily Chen",
      nodes: 15
    },
    {
      id: 5,
      name: "Inventory Sync",
      description: "Synchronize inventory levels across multiple sales channels",
      status: "active",
      lastModified: new Date(Date.now() - 43200000),
      executions: 445,
      successRate: 99.1,
      tags: ["inventory", "sync", "ecommerce"],
      createdBy: "David Brown",
      nodes: 10
    },
    {
      id: 6,
      name: "Support Ticket Routing",
      description: "Automatically categorize and assign support tickets",
      status: "paused",
      lastModified: new Date(Date.now() - 259200000),
      executions: 78,
      successRate: 92.3,
      tags: ["support", "tickets", "routing"],
      createdBy: "Lisa Garcia",
      nodes: 9
    }
  ]);

  // Mock metrics data
  const metrics = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === 'active').length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executions, 0),
    avgSuccessRate: workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length,
    errorCount: workflows.filter(w => w.status === 'error').length,
    trendsData: [
      { period: 'Last 7 days', executions: 1250, change: 12.5 },
      { period: 'Last 30 days', executions: 4890, change: 8.3 }
    ]
  };

  // Filter and sort workflows
  const filteredWorkflows = useMemo(() => {
    let filtered = workflows.filter(workflow => {
      const q = searchQuery.toLowerCase();
      return (
        workflow.name.toLowerCase().includes(q) ||
        workflow.description.toLowerCase().includes(q) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });

    // Sort diagrams
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'modified':
          return new Date(b.lastModified) - new Date(a.lastModified);
        case 'executions':
          return b.executions - a.executions;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workflows, searchQuery, sortBy]);

  const handleCreateWorkflow = () => {
    navigate('/visual-workflow-editor');
  };

  const handleWorkflowAction = (action, workflowId) => {
    switch (action) {
      case 'edit':
        navigate('/visual-workflow-editor', { state: { workflowId } });
        break;
      case 'run':
        navigate('/workflow-execution-monitor', { state: { workflowId } });
        break;
      case 'duplicate':
        console.log('Duplicating workflow:', workflowId);
        break;
      case 'delete':
        setWorkflows(prev => prev.filter(w => w.id !== workflowId));
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col h-screen">
        <div className="flex items-center h-16 px-6 border-b border-border">
          <span className="text-xl font-bold text-primary">sureflow</span>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.label} className={`flex items-center w-full px-6 py-3 text-left text-text-primary hover:bg-primary-50 transition-micro font-body-medium ${link.label === 'Overview' ? 'bg-primary-50 text-primary' : ''}`}>
              <Icon name={link.icon} size={18} className="mr-3" />
              {link.label}
            </button>
          ))}
        </nav>
        <div className="sticky bottom-0 p-6 border-t border-border bg-white">
          <button className="flex items-center space-x-2 text-text-secondary hover:text-primary mb-4" onClick={() => navigate('/settings')}>
            <Icon name="Settings" size={18} />
            <span>Settings</span>
          </button>
          <button
            className="flex items-center w-full mt-2 group"
            onClick={() => navigate('/profile')}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', color: 'white' }}>S</div>
            <span className="ml-3 font-body-medium text-text-primary group-hover:text-primary">Sysadmin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-16 px-8 border-b border-border bg-white">
          <h1 className="text-2xl font-heading-bold text-text-primary">Overview</h1>
          <button onClick={() => navigate('/visual-workflow-editor')} className="px-5 py-2 bg-primary text-white rounded-lg font-body-medium hover:bg-primary-700 transition-micro">
            Create Workflow
          </button>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-8">
          <div className="bg-white border border-border rounded-lg p-4 flex flex-col">
            <span className="text-text-secondary text-xs mb-1">Total Diagrams</span>
            <span className="text-2xl font-bold">{metrics.totalWorkflows}</span>
            <span className="text-success text-xs mt-1">+12% Increase</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 flex flex-col">
            <span className="text-text-secondary text-xs mb-1">Active Diagrams</span>
            <span className="text-2xl font-bold">{metrics.activeWorkflows}</span>
            <span className="text-success text-xs mt-1">+8% Increase</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 flex flex-col">
            <span className="text-text-secondary text-xs mb-1">Total Executions</span>
            <span className="text-2xl font-bold">{metrics.totalExecutions}</span>
            <span className="text-success text-xs mt-1">+15% Increase</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 flex flex-col">
            <span className="text-text-secondary text-xs mb-1">Avg Success Rate</span>
            <span className="text-2xl font-bold">{metrics.avgSuccessRate}%</span>
            <span className="text-success text-xs mt-1">+2.3% Increase</span>
          </div>
          <div className="bg-white border border-border rounded-lg p-4 flex flex-col items-center justify-center">
            {/* Placeholder for extra metric or empty */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-border px-8">
          <button
            key="Diagrams"
            className={`px-6 py-3 -mb-px font-body-medium border-b-2 transition-micro border-primary text-primary`}
            disabled
          >
            Diagrams
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            {/* Search and Sort */}
            <div className="flex items-center mb-6 gap-4">
              <input
                type="text"
                placeholder="Search diagrams..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg"
              />
              <div className="relative">
                <select
                  className="px-4 py-2 border border-border rounded-lg pr-8 appearance-none"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="modified">Sort by last updated</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="executions">Most Executions</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-text-tertiary">
                  <ChevronDown size={18} />
                </span>
              </div>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-body-medium hover:bg-primary-700 transition-micro"
                onClick={handleCreateWorkflow}
              >
                Add Diagram
              </button>
            </div>
            {/* Diagram List (simplified for now) */}
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="mb-4 font-body-medium text-text-secondary">Diagrams</div>
              {filteredWorkflows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWorkflows.map((workflow) => (
                    <div key={workflow.id} className="border border-border rounded-lg p-4 bg-white relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-heading-semibold text-lg text-text-primary">{workflow.name}</div>
                        <div className="relative">
                          <button
                            className="p-1 rounded hover:bg-secondary-100"
                            onClick={() => setMenuOpenId(menuOpenId === workflow.id ? null : workflow.id)}
                          >
                            <MoreVertical size={18} />
                          </button>
                          {menuOpenId === workflow.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-border rounded shadow-lg z-10">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-secondary-100 text-text-primary"
                                onClick={() => { setMenuOpenId(null); handleWorkflowAction('edit', workflow.id); }}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-error-50 text-error"
                                onClick={() => { setMenuOpenId(null); handleWorkflowAction('delete', workflow.id); }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-text-secondary mb-2">{workflow.description}</div>
                      <div className="flex items-center space-x-4 text-xs mb-2">
                        <span className="text-text-tertiary">{workflow.nodes} nodes</span>
                        <span className="text-text-tertiary">{workflow.executions} executions</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {workflow.tags.map(tag => (
                          <span key={tag} className="bg-secondary-100 text-text-secondary px-2 py-0.5 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-tertiary">
                        <span>Modified {Math.floor((Date.now() - workflow.lastModified) / 3600000)}h ago</span>
                        <span>by {workflow.createdBy}</span>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          className="px-4 py-1 bg-primary text-white rounded hover:bg-primary-700 text-sm font-body-medium transition-micro"
                          onClick={() => handleWorkflowAction('edit', workflow.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Icon name="Search" size={24} className="text-text-tertiary" />
                  </div>
                  <h3 className="text-lg font-heading-medium text-text-primary mb-2">
                    No diagrams found
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {searchQuery ?'Try adjusting your search criteria' :'Get started by creating your first diagram'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleCreateWorkflow}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro"
                    >
                      <Icon name="Plus" size={20} />
                      <span>Create Your First Diagram</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDashboard;