/**
 * @param {Object} params       // 入参配置，如 appToken、tableId、viewId、inputFieldId、outputFieldId
 * @param {Object} context      // 包含 api：多维表格操作接口
 * @param {Object} logger       // 日志工具
 */
export default async function(params, context, logger) {
  const { appToken, tableId, viewId, inputFieldId, outputFieldId } = params;
  const axios = (await import('axios')).default;

  // 1. 获取记录
  const records = await context.api.getRecords({ tableId, viewId });

  for (const record of records.records) {
    const url = record.fields[inputFieldId];
    if (!url) continue;

    try {
      // 2. 发请求给爬虫服务
      const response = await axios.post('http://localhost:3000/crawl', { url });

      // 3. 更新正文结果回飞书
      if (response.data && response.data.status === 'success') {
        const summary = response.data.text.slice(0, 1000); // 最多写入1000字符
        await context.api.updateRecord({
          tableId,
          recordId: record.recordId,
          fields: {
            [outputFieldId]: summary
          }
        });
        logger.info(`✅ 爬取并更新成功：${url}`);
      } else {
        logger.warn(`⚠️ 爬取失败：${url}`);
      }

    } catch (err) {
      logger.error(`❌ 错误处理 ${url}：${err.message}`);
    }
  }

  logger.info('✅ 插件执行完成');
};
