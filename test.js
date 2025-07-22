import pluginMain from './index.js'; // 飞书插件主逻辑
import fs from 'fs';

// 伪造 context.api
const mockContext = {
  api: {
    getRecords: async ({ tableId, viewId }) => {
      console.log(`📄 读取表格数据 tableId=${tableId} viewId=${viewId}`);
      return {
        records: [
          {
            recordId: 'rec1',
            fields: { urlField: 'https://www.williams.edu/sfs/manage-your-account/tuition-fees/' }
          },
          {
            recordId: 'rec2',
            fields: { urlField: 'https://www.cornellcollege.edu/financial-assistance/cost-of-attendance.shtml' }
          }
        ]
      };
    },
    updateRecord: async ({ tableId, recordId, fields }) => {
      console.log(`📝 更新记录 ${recordId} 成功：`, fields);
    }
  }
};

// 伪造 logger
const mockLogger = {
  info: console.log,
  warn: console.warn,
  error: console.error
};

// 设置插件参数
const params = {
  appToken: 'mock_app',
  tableId: 'tbl123',
  viewId: 'viw456',
  inputFieldId: 'urlField',        // 假设这一列是 URL
  outputFieldId: 'resultField'     // 要写回的列
};

pluginMain(params, mockContext, mockLogger);
