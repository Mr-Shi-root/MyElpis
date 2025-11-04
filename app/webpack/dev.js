// 本地开发启动 devServer
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const hotMiddleware = require('webpack-hot-middleware');
const devMiddleware = require('webpack-dev-middleware');
const consoler = require('consoler');

const app = express();

// 从 webpack.dev.js 获取 webpack配置 和 devServer配置
const {
    webpackConfig,
    DEV_SERVER_CONFIG
} = require('./config/webpack.dev.js')

const compiler = webpack(webpackConfig)

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist')));

// 引入 devMiddleware 中间件 （监控文件改动）
app.use(devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => { return filePath.endsWith('.tpl') },
    
    // 资源路径 （与编译后的文件路径一致，以便内存保存路径提取）
    publicPath: webpackConfig.output.publicPath,

    // headers 配置 健壮性 防止跨域等
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
        "Access-Control-Headers": 'X-Request-With, content-type, Authorization',
    },
    stats: {
        colors: true
    }
}))

app.use(hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: ()=>{}
}))

// 引用 hotMiddleware 中间件 （实现热更新通讯）

consoler.info('请等待webpack初次构建完成提示...')

// 启动 devServer
const port = DEV_SERVER_CONFIG.PORT;
app.listen(port, () => {
    console.log(`app listending on port ${port}`);
})

// module.exports = ()