# 官方 Puppeteer 推荐镜像，带 Chromium，基于 Debian Slim
FROM ghcr.io/puppeteer/puppeteer:latest

# 设置工作目录
WORKDIR /app

# 拷贝项目代码
COPY . .

# 安装依赖（如果 node_modules 存在也会被重建）
RUN npm install

# 暴露端口
EXPOSE 3000

# 启动 express 服务
CMD ["node", "api/crawl.js"]
