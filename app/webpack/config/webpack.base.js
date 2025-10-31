// 基类 根据环境配置不同的打包服务
/**
 * webpack 基础配置
 */
const glob = require('glob');
const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { constrainedMemory } = require('process');

// 动态生成 entry 配置
const pageEntry = {};
const htmlWebpackPlugin = [];

// 获取 app/pages 下的所有入口文件 （entry.xx.js）
const entryList = glob.sync(path.resolve(process.cwd(), './app/pages/**/entry.*.js'));
entryList.forEach(file => {
    const entryName = path.basename(file, '.js');
    // 构造 entry
    pageEntry[entryName] = file
    // 构造最终渲染的页面文件
    htmlWebpackPlugin.push(new HtmlWebpackPlugin({
        // html-webpack-plugin 辅助注入打包后的 bundle 文件到 tpl 文件中
        filename: path.resolve(process.cwd(), './app/public/dist/', entryName + '.tpl'),
        template: path.resolve(process.cwd(), './app/view/entry.tpl'),
        chunks: [entryName],
    }))
})

// webpack 环境配置
module.exports =  {
    // 入口配置
    entry: pageEntry,
    // 模块解析配置（决定了要加在解释那些模块，以及用什么方式去解释）
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                include:[
                    // 只对业务代码进行 babel 加快 webpack 打包速度
                    path.resolve(process.cwd(), './app/pages'),
                ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png | jpe?g | gif | svg )(\?.+)?&/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]?[hash:8]',
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}]
            },
            {
                test: /\.less$/,
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'less-loader'}]
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)(\?\S*)?&/,
                use: 'file-loader'
            }
        ]
    },
    // 产物输出路径
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod',
        crossOriginLoading: 'anonymous' //  解决跨域问题
    },
    // 配置模块解析的具体行为（定义 webpack 在打包时， 如何找到并解析具体模块的路径）
    // eg: import xxx from './xxx' // 不用写后缀
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css', '.json', '.scss', '.sass'],
        alias: { // 开发便捷性，节省一些根目录，通过 $pages 引用
            $pages: path.resolve(process.cwd(), './app/pages'),
            $common: path.resolve(process.cwd(), './app/pages/common'),
            $widgets: path.resolve(process.cwd(), './app/pages/widgets'),
            $store: path.resolve(process.cwd(), './app/pages/store'),
        }
    },   
    // 配置 webpack 插件
    plugins: [
        // 处理 .vue 文件，这个插件是必须的
        // 他的职能是将定义过的其他规则复制并应用到 .vue 应用里。
        // 例如：如果有一条匹配规则 /\.js$/ 的规则， 那么他会应用到 .vue 文件中的 <script> 板块中
        new VueLoaderPlugin(),
        // 把第三方库暴露到 window context 下
        new webpack.ProvidePlugin({
            $: 'jquery',
            Vue: 'vue',
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
            __VUE_OPTIONS__API__: true, // 支持 vue 解析 optionsAPi
            __VUE_PROD_DEVTOOLS__: false, // 禁用 Vue 调试工具
            __VUE_PROD_HYDRATION__MISMATCH_DETAILS__: true, // 禁止生产环境显示 “水合” 信息
        }),
        // 构造最终渲染的页面模版
        ...htmlWebpackPlugin,
    ],
    // 配置 webpack 优化行为 eg：代码分割， 模块合并， 缓存， TreeShaking， 压缩等优化策略
    optimization: {

    },
}