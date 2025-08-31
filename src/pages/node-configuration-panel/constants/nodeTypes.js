// src/pages/node-configuration-panel/constants/nodeTypes.js

export const nodeTypes = {
  'api-call': {
    label: 'API Call',
    description: 'Make HTTP requests to external APIs',
    icon: 'Globe',
    color: 'bg-blue-500',
    category: 'Integration'
  },
  'data-transform': {
    label: 'Data Transform',
    description: 'Transform and manipulate data using scripts',
    icon: 'RefreshCw',
    color: 'bg-green-500',
    category: 'Processing'
  },
  'database': {
    label: 'Database Query',
    description: 'Execute queries against databases',
    icon: 'Database',
    color: 'bg-purple-500',
    category: 'Data'
  },
  'webhook': {
    label: 'Webhook',
    description: 'Send data to external webhook endpoints',
    icon: 'Send',
    color: 'bg-orange-500',
    category: 'Integration'
  },
  'email': {
    label: 'Email Notification',
    description: 'Send email notifications',
    icon: 'Mail',
    color: 'bg-red-500',
    category: 'Notification'
  },
  'condition': {
    label: 'Conditional Logic',
    description: 'Branch workflow based on conditions',
    icon: 'GitBranch',
    color: 'bg-yellow-500',
    category: 'Logic'
  },
  'timer': {
    label: 'Timer/Delay',
    description: 'Add delays or schedule executions',
    icon: 'Clock',
    color: 'bg-indigo-500',
    category: 'Control'
  },
  'file-processor': {
    label: 'File Processor',
    description: 'Process and manipulate files',
    icon: 'FileText',
    color: 'bg-teal-500',
    category: 'Processing'
  }
};

export const getDefaultConfig = (nodeType) => {
  const baseConfig = {
    basic: {
      name: `${nodeTypes[nodeType]?.label || 'Node'} ${Date.now()}`,
      description: '',
      enabled: true
    },
    advanced: {
      executionMode: 'sync',
      logLevel: 'info',
      maxMemory: 512,
      priority: 5,
      parallelWorkers: 1,
      continueOnError: false,
      enableCaching: false,
      cacheDuration: 60,
      headers: [],
      environmentVars: [],
      preExecutionScript: '',
      postExecutionScript: ''
    },
    input: {
      fieldMappings: {}
    },
    output: {
      outputFormat: 'json',
      compression: 'none',
      maxFileSize: 10,
      chunkSize: 1024,
      encoding: 'utf-8',
      outputFields: [],
      prettyPrint: false,
      includeMetadata: false,
      outputTransform: '',
      validationSchema: ''
    },
    connections: {
      inputs: {},
      outputs: {}
    }
  };

  // Node type specific defaults
  switch (nodeType) {
    case 'api-call':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          endpoint: '',
          method: 'GET',
          timeout: 30,
          retryCount: 3
        }
      };
      
    case 'data-transform':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          inputFormat: 'json',
          outputFormat: 'json',
          transformScript: '// Transform the input data\nreturn data;'
        }
      };
      
    case 'database':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          connectionString: '',
          query: 'SELECT * FROM table_name WHERE condition = ?'
        }
      };
      
    case 'webhook':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          webhookUrl: '',
          secretKey: ''
        }
      };
      
    case 'email':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          to: '',
          subject: '',
          template: 'default',
          priority: 'normal'
        }
      };
      
    case 'condition':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          conditionType: 'javascript',
          condition: 'return data.value > 0;',
          truthyAction: 'continue',
          falsyAction: 'skip'
        }
      };
      
    case 'timer':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          delayType: 'fixed',
          delayValue: 5,
          delayUnit: 'seconds'
        }
      };
      
    case 'file-processor':
      return {
        ...baseConfig,
        basic: {
          ...baseConfig.basic,
          operation: 'read',
          filePath: '',
          encoding: 'utf-8',
          format: 'text'
        }
      };
      
    default:
      return baseConfig;
  }
};

export const getNodeCategories = () => {
  const categories = {};
  
  Object.entries(nodeTypes).forEach(([key, nodeType]) => {
    const category = nodeType.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ key, ...nodeType });
  });
  
  return categories;
};