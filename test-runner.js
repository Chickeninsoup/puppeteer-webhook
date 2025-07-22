import handler from './index.js';

// Mock parameters
const params = {
  appToken: 'test-token',
  tableId: 'test-table',
  viewId: 'test-view', 
  inputFieldId: 'url',
  outputFieldId: 'summary'
};

// Mock context with API methods
const results = {};
const context = {
  api: {
    getRecords: async () => ({
      records: [{
        recordId: 'rec1', 
        fields: {
          url: 'https://www.cornellcollege.edu/financial-assistance/cost-of-attendance.shtml'
        }
      }]
    }),
    updateRecord: async (data) => {
      results[data.recordId] = data.fields[params.outputFieldId];
    }
  }
};

// Mock logger
const logger = {
  info: console.log,
  warn: console.warn,
  error: console.error
};

// Run the handler
await handler(params, context, logger);
console.log('爬取结果:', results);
