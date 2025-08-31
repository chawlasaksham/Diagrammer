import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from 'components/AppIcon';

const PerformanceMetrics = ({ workflow }) => {
  // Mock performance data
  const executionTimeData = [
    { time: '10:00', duration: 45 },
    { time: '10:05', duration: 52 },
    { time: '10:10', duration: 38 },
    { time: '10:15', duration: 61 },
    { time: '10:20', duration: 43 },
    { time: '10:25', duration: 55 },
    { time: '10:30', duration: 49 }
  ];

  const successRateData = [
    { time: '10:00', success: 95, failed: 5 },
    { time: '10:05', success: 98, failed: 2 },
    { time: '10:10', success: 92, failed: 8 },
    { time: '10:15', success: 97, failed: 3 },
    { time: '10:20', success: 94, failed: 6 },
    { time: '10:25', success: 99, failed: 1 },
    { time: '10:30', success: 96, failed: 4 }
  ];

  const nodePerformanceData = [
    { name: 'Trigger', avgDuration: 0.2, executions: 156 },
    { name: 'Validate', avgDuration: 1.1, executions: 156 },
    { name: 'Process', avgDuration: 2.8, executions: 152 },
    { name: 'Transform', avgDuration: 1.5, executions: 148 },
    { name: 'Store', avgDuration: 0.8, executions: 145 },
    { name: 'Notify', avgDuration: 0.3, executions: 145 }
  ];

  const metrics = [
    {
      label: 'Total Executions',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: 'Activity'
    },
    {
      label: 'Success Rate',
      value: '96.2%',
      change: '+2.1%',
      trend: 'up',
      icon: 'CheckCircle2'
    },
    {
      label: 'Avg Duration',
      value: '48.3s',
      change: '-5.2s',
      trend: 'down',
      icon: 'Clock'
    },
    {
      label: 'Error Rate',
      value: '3.8%',
      change: '-1.2%',
      trend: 'down',
      icon: 'AlertTriangle'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name={metric.icon} size={20} className="text-primary" />
              <span className={`text-xs font-body-medium ${
                metric.trend === 'up' ? 'text-success' : 'text-error'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-heading-semibold text-text-primary mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-text-secondary">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Execution Time Trend */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-heading-medium text-text-primary mb-4">
          Execution Time Trend
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={executionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-heading-medium text-text-primary mb-4">
          Success Rate
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="success" stackId="a" fill="#059669" />
              <Bar dataKey="failed" stackId="a" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Node Performance */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-heading-medium text-text-primary mb-4">
          Node Performance
        </h3>
        <div className="space-y-3">
          {nodePerformanceData.map((node, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="Circle" size={12} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-body-medium text-text-primary">
                    {node.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {node.executions} executions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-body-medium text-text-primary">
                  {node.avgDuration}s
                </div>
                <div className="text-xs text-text-secondary">
                  avg duration
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Usage */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-heading-medium text-text-primary mb-4">
          Resource Usage
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">CPU Usage</span>
              <span className="text-text-primary">23%</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '23%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Memory Usage</span>
              <span className="text-text-primary">67%</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{ width: '67%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Network I/O</span>
              <span className="text-text-primary">12%</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;