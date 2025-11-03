const path = require('path');
const merge = require('webpack-merge');
// 如果不用 happyPack 的话，可以用什么？
const os = require('os');
const HappyPack = require('happypack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')

// 多线程 build 设置
const happypackCommonConfig = () => { 
    debug: false;
    threadsPool: HappyPack.ThreadPool({size: os.cpus().length}); 
};

// 基类
const baseConfig = require('./webpack.base');

console.log('building start ...')

// 生产环境 webpack 配置
const webpackConfig = merge.smart(baseConfig, {
    // 指定生产环境
    mode: 'production',

    // 生产环境的配置 (不同环境配置不同，需要重写)
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod', // 试试 /assets/
        crossOriginLoading: 'anonymous', //  解决跨域问题
        clean: true, 
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  // 提取 CSS 到独立文件
                    "happypack/loader?id=css"     // 使用 HappyPack 并行处理
                ],
            },
            {
                test: /\.js$/,
                include: [ 
                    // 只对业务代码进行 babel 加快 webpack 打包速度
                    path.resolve(process.cwd(), './app/pages')
                ],
                use: [
                    "happypack/loader?id=js"
                ]
            }
        ],
    },
    // webpack 不会有大量 hints 信息， 默认为 warning
    performance: {
        hints: false,
    },
    plugins: [
        // 每次 build 前， 清空 public/dist 目录
        new CleanWebpackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/'),
            // else 其他变量
            exclude: [],
            verbose: true,
            dry: false,
        }),
        // 提取公共 css 的公共部分， 有效利用缓存（非公共部分使用 inline）
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css',
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
            ignoreOrder: false, // 忽略顺序警告
        }),
        // 优化并压缩 css 资源
        new CSSMinimizerPlugin(), 
        // 多线程打包 JS 加快打包速度
        new HappyPack({
            id: 'js',
            ...happypackCommonConfig,
            loaders: [`babel-loader?${JSON.stringify({
                presets: ['@babel/preset-env'],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            })}`]
        }),
        // 多线程打包 CSS 加快打包速度
        new HappyPack({
            id: 'css',
            ...happypackCommonConfig,
            loaders: [{
                path: 'css-loader',
                options: {
                    importLoaders: 1
                }
            }]
        }),
        // 浏览器在请求资源时不发送用户的身份凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossorigin: 'anonymous'
        })
    ],
    optimization: {
        // 使用 TerserWebpackPlugin 的并发和缓存， 提升压缩阶段的性能
        // 清除 console.log
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                cache: true, // 启动缓存来加速构建过程
                parallel: true, // 利用多核 cpu 的优势来加快压缩速度
                terserOptions: {
                    compress: {
                        drop_console: true // 清除所有 console
                    }
                }
            })
        ]
    }
})

module.exports = webpackConfig;