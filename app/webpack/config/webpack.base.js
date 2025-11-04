// 基类 根据环境配置不同的打包服务
/**
 * webpack 基础配置
 */
const glob = require('glob');
const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 动态生成 entry 配置
const pageEntry = {};
const htmlWebpackPlugin = [];

// 获取 app/pages 下的所有入口文件 （entry.xx.js）
const entryList = glob.sync(path.resolve(process.cwd(), './app/pages/**/entry.*.js'));
entryList.forEach(file => {
    const entryName = path.basename(file, '.js');
    console.log('entry/:name', entryName);
    
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

console.log();


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
        crossOriginLoading: 'anonymous', //  解决跨域问题
        clean: true, 
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
            // 'process.env': {
            //     NODE_ENV: '"production"'
            // },
            __VUE_OPTIONS__API__: true, // 支持 vue 解析 optionsAPi
            __VUE_PROD_DEVTOOLS__: false, // 禁用 Vue 调试工具
            __VUE_PROD_HYDRATION__MISMATCH_DETAILS__: true, // 禁止生产环境显示 “水合” 信息
        }),
        // 构造最终渲染的页面模版
        ...htmlWebpackPlugin,
    ],
    // 配置 webpack 优化行为 eg：代码分割， 模块合并， 缓存， TreeShaking， 压缩等优化策略
    optimization: {
        // 分包处理 当多个文件引入的公共代码时，会进行代码分割
        /**
         * 把 js 文件打包成3中类型
         * 1. vender： 第三方 lib 库， 基本不会改动，除非以来版本升级
         * 2. common： 业务组件代码的公共部分抽取出来， 改动较少
         * 3. entry.{page}: 不用页面 entry 里的业务组件代码的差异部分，会经常改动
         * 目的： 把改动和引用频率不一样的 js 区分出来，以达到更好利用浏览器缓存的效果
         */
        splitChunks: {
            chunks: 'all', // 对同步和异步模块都进行分割
            // minSize: 30000,
            // maxSize: 0,
            // minChunks: 1,
            maxAsyncRequests: 10, // 最大异步请求数， 默认 5
            maxInitialRequests: 10, // 最大入口点初始化异步请求数， 默认 3
            // automaticNameDelimiter: '~',
            // automaticNameMaxLength: 30,
            cacheGroups: {
                vendor: { // 
                    test: /[\\/]node_modules[\\/]/, // 打包 node_module 中的文件
                    name: 'vender', // 缓存组名称
                    priority: 20, // 缓存组优先级， 数字越大，优先级越高
                    enforce: true, // 强制缓存组， 默认 false
                    reuseExistingChunk: true, // 重用已有的 chunk，不需要重新打包 默认 false
                },
                common: {
                    // test: /[\\/]app[\\/]pages[\\/]/, // 匹配 app/pages 下的文件 这里加个目录，也会匹配到 vue ，为啥 vue不会打包到 common里  
                    name: 'common', // 缓存组名称
                    minChunks: 2, // 引用次数 被 N 处地方引入即被归为公共模块
                    minSize: 1, // 公共模块文件大小 （ 1 byte ）
                    priority: 10, // 缓存组优先级， 默认 0 
                    reuseExistingChunk: true, // 重用已有的 chunk，不需要重新打包 默认 false
                }
            }
        },
        // 将 webpack 运行时生成的代码打包到 runtime.js
        runtimeChunk: true
    },
}