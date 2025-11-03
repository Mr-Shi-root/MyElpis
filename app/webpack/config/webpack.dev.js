const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { template } = require('lodash');

const webpackConfig = merge.smart(baseConfig, {
    // 指定生产环境
    mode: 'development',

    // 本地环境的配置 (不同环境配置不同，需要重写，涉及热更新)
    output: {},
})

module.exports = webpackConfig;