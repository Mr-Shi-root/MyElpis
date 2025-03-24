const glob = require('glob');
const path = require('path');
const { config } = require('process');
const { sep } = path;

/**
 * 
 * config loader
 * 
 * @param { object } app  koa 实例
 * 
 * 配置区别环境 本地/测试/生产 根据不同环境，返回不同环境配置
 * 
 * 通过 env 读取不同的环境文件配置 env.config
 * 通过 env.config 去代替 default.config 然后挂载到 app.config 中
 * 
 * 目录下对应的 config 配置
 * 
 * 默认配置：config/config.default.js
 * 
 * 本地配置：config/config.local.js
 * 测试配置：config/config.beta.js
 * 生产配置：config/config.prod.js
 * 
 * 下面的环境，merge给默认配置
 * 
 * @returns 
 */

module.exports = (app) => {
    // 找到 config 配置
    const configPath = path.resolve(app.baseDir,  `.${sep}config`)

    // 注意：架构设计 尽量不涉及具体变量值或者文件路径，否则一旦找不到，会报错，所以要进行trycatch处理
    // 获取 default.config
    let defaultConfig = {}
    try {
        defaultConfig = require(path.resolve(configPath , `.${sep}config.default.js`))
    } catch (error) {
        console.log('[exception] there is no default.config file');
        
    }

    // 获取 env.config
    let envConfig = {}
    try {
        if (app.env.isLocal()) {
            envConfig = require(path.resolve(configPath , `.${sep}config.local.js`))
        } else if (app.env.isBeta()) {
            envConfig = require(path.resolve(configPath , `.${sep}config.beta.js`))
        } else if (app.env.isProduction()) {
            envConfig = require(path.resolve(configPath , `.${sep}config.prod.js`))
        }
        console.log();
    } catch (error) {
        console.log('[exception] there is no env.config file');
    }

    app.config = Object.assign({}, defaultConfig, envConfig)

    // 覆盖并加载 default.config
    

}