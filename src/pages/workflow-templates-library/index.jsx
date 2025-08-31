import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

import TemplateCard from './components/TemplateCard';
import TemplatePreviewModal from './components/TemplatePreviewModal';
import FilterSidebar from './components/FilterSidebar';
import FeaturedCarousel from './components/FeaturedCarousel';

const WorkflowTemplatesLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Mock template data
  const templates = [
    {
      id: 1,
      title: "Customer Onboarding Automation",
      description: "Streamline new customer registration with automated email sequences, account setup, and welcome workflows.",
      category: "marketing",
      complexity: "intermediate",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tags: ["email", "crm", "automation"],
      usageCount: 1250,
      rating: 4.8,
      author: "WorkflowPro Team",
      integrations: ["Gmail", "Salesforce", "Slack"],
      estimatedTime: "30 minutes",
      isFeatured: true,
      workflow: {
        nodes: 8,
        connections: 12,
        triggers: ["New Customer Registration"],
        actions: ["Send Welcome Email", "Create CRM Record", "Notify Team"]
      },
      reviews: [
        { user: "Sarah M.", rating: 5, comment: "Perfect for our onboarding process!" },
        { user: "Mike R.", rating: 4, comment: "Easy to customize and implement." }
      ]
    },
    {
      id: 2,
      title: "Invoice Processing Pipeline",
      description: "Automate invoice approval workflows with document parsing, validation, and payment processing integration.",
      category: "finance",
      complexity: "advanced",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      tags: ["finance", "approval", "documents"],
      usageCount: 890,
      rating: 4.6,
      author: "Finance Automation Co.",
      integrations: ["QuickBooks", "DocuSign", "Stripe"],
      estimatedTime: "45 minutes",
      isFeatured: true,
      workflow: {
        nodes: 12,
        connections: 18,
        triggers: ["Invoice Received"],
        actions: ["Parse Document", "Validate Data", "Route for Approval"]
      },
      reviews: [
        { user: "David L.", rating: 5, comment: "Saved us hours of manual work!" },
        { user: "Lisa K.", rating: 4, comment: "Great template, well documented." }
      ]
    },
    {
      id: 3,
      title: "Social Media Content Scheduler",
      description: "Schedule and publish content across multiple social media platforms with approval workflows and analytics tracking.",
      category: "marketing",
      complexity: "beginner",
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=250&fit=crop",
      tags: ["social media", "content", "scheduling"],
      usageCount: 2100,
      rating: 4.9,
      author: "Social Media Pro",
      integrations: ["Twitter", "Facebook", "LinkedIn", "Instagram"],
      estimatedTime: "20 minutes",
      isFeatured: false,
      workflow: {
        nodes: 6,
        connections: 8,
        triggers: ["Content Approval"],
        actions: ["Schedule Post", "Track Engagement", "Generate Report"]
      },
      reviews: [
        { user: "Emma T.", rating: 5, comment: "Simple and effective!" },
        { user: "John D.", rating: 5, comment: "Perfect for our marketing team." }
      ]
    },
    {
      id: 4,
      title: "IT Ticket Management System",
      description: "Automate IT support ticket routing, escalation, and resolution tracking with SLA monitoring.",
      category: "it",
      complexity: "intermediate",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
      tags: ["support", "tickets", "automation"],
      usageCount: 750,
      rating: 4.7,
      author: "IT Solutions Inc.",
      integrations: ["Jira", "ServiceNow", "Slack", "Teams"],
      estimatedTime: "35 minutes",
      isFeatured: false,
      workflow: {
        nodes: 10,
        connections: 15,
        triggers: ["New Ticket Created"],
        actions: ["Categorize Issue", "Assign Agent", "Track SLA"]
      },
      reviews: [
        { user: "Alex P.", rating: 5, comment: "Excellent for IT departments!" },
        { user: "Maria S.", rating: 4, comment: "Good structure, easy to modify." }
      ]
    },
    {
      id: 5,
      title: "Sales Lead Qualification",
      description: "Automatically score and qualify sales leads based on behavior, demographics, and engagement metrics.",
      category: "sales",
      complexity: "advanced",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      tags: ["sales", "leads", "scoring"],
      usageCount: 1450,
      rating: 4.8,
      author: "Sales Automation Hub",
      integrations: ["HubSpot", "Salesforce", "Marketo"],
      estimatedTime: "50 minutes",
      isFeatured: true,
      workflow: {
        nodes: 14,
        connections: 22,
        triggers: ["Lead Captured"],
        actions: ["Score Lead", "Assign to Rep", "Send Follow-up"]
      },
      reviews: [
        { user: "Robert K.", rating: 5, comment: "Dramatically improved our conversion rates!" },
        { user: "Jennifer L.", rating: 4, comment: "Complex but very powerful." }
      ]
    },
    {
      id: 6,
      title: "Employee Onboarding Checklist",
      description: "Comprehensive new hire onboarding with task assignments, document collection, and progress tracking.",
      category: "hr",
      complexity: "beginner",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop",
      tags: ["hr", "onboarding", "tasks"],
      usageCount: 980,
      rating: 4.5,
      author: "HR Workflow Solutions",
      integrations: ["BambooHR", "Workday", "Slack"],
      estimatedTime: "25 minutes",
      isFeatured: false,
      workflow: {
        nodes: 7,
        connections: 10,
        triggers: ["New Employee Added"],
        actions: ["Create Checklist", "Assign Tasks", "Track Progress"]
      },
      reviews: [
        { user: "Patricia W.", rating: 5, comment: "Makes onboarding so much smoother!" },
        { user: "Mark T.", rating: 4, comment: "Great starting point for HR automation." }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'Grid3X3', count: templates.length },
    { id: 'marketing', name: 'Marketing', icon: 'Megaphone', count: templates.filter(t => t.category === 'marketing').length },
    { id: 'sales', name: 'Sales', icon: 'TrendingUp', count: templates.filter(t => t.category === 'sales').length },
    { id: 'finance', name: 'Finance', icon: 'DollarSign', count: templates.filter(t => t.category === 'finance').length },
    { id: 'it', name: 'IT & Support', icon: 'Monitor', count: templates.filter(t => t.category === 'it').length },
    { id: 'hr', name: 'Human Resources', icon: 'Users', count: templates.filter(t => t.category === 'hr').length }
  ];

  const complexityLevels = [
    { id: 'all', name: 'All Levels', color: 'text-text-secondary' },
    { id: 'beginner', name: 'Beginner', color: 'text-success' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-warning' },
    { id: 'advanced', name: 'Advanced', color: 'text-error' }
  ];

  const sortOptions = [
    { id: 'popularity', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' },
    { id: 'alphabetical', name: 'A-Z' }
  ];

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'all' || template.complexity === selectedComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchQuery, selectedCategory, selectedComplexity, sortBy]);

  const featuredTemplates = templates.filter(template => template.isFeatured);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleUseTemplate = (template) => {
    // Navigate to editor with template data
    navigate('/visual-workflow-editor', { state: { template } });
  };

  const getComplexityColor = (complexity) => {
    const level = complexityLevels.find(l => l.id === complexity);
    return level ? level.color : 'text-text-secondary';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading-bold text-text-primary mb-2">
                Workflow Templates Library
              </h1>
              <p className="text-text-secondary max-w-2xl">
                Jumpstart your automation projects with pre-built workflow templates. Browse, customize, and deploy professional workflows in minutes.
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <button
                onClick={() => navigate('/visual-workflow-editor')}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro"
              >
                <Icon name="Plus" size={18} />
                <span>Create New</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
            />
            <input
              type="text"
              placeholder="Search templates by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-tertiary"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
            >
              <Icon name="Filter" size={18} />
              <span>Filters</span>
              <Icon name={showFilters ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
          </div>
        </div>

        {/* Featured Templates Carousel */}
        {featuredTemplates.length > 0 && (
          <div className="mb-8">
            <FeaturedCarousel 
              templates={featuredTemplates}
              onTemplateClick={handleTemplateClick}
              onUseTemplate={handleUseTemplate}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              categories={categories}
              complexityLevels={complexityLevels}
              selectedCategory={selectedCategory}
              selectedComplexity={selectedComplexity}
              onCategoryChange={setSelectedCategory}
              onComplexityChange={setSelectedComplexity}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-text-secondary">
                  Showing {filteredTemplates.length} of {templates.length} templates
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm text-text-secondary">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onTemplateClick={handleTemplateClick}
                    onUseTemplate={handleUseTemplate}
                    getComplexityColor={getComplexityColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Icon name="Search" size={32} className="text-text-tertiary" />
                </div>
                <h3 className="text-lg font-heading-medium text-text-primary mb-2">
                  No templates found
                </h3>
                <p className="text-text-secondary mb-4">
                  Try adjusting your search criteria or browse all categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedComplexity('all');
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          onUseTemplate={handleUseTemplate}
        />
      )}
    </div>
  );
};

export default WorkflowTemplatesLibrary;