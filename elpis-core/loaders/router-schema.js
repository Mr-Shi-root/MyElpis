const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 * 
 * router-schema loader 
 * @param { object } app  Koa 实例
 * 
 * 通过 'json-schema & ajv' 对 API 规则进行约束， 配合 api-params-verify 中间件使用
 * 
 * app/routerSchema/**.js
 * 
 * 输出：
 * app-rouSchema = {
 *     `${api1}`: ${jsonSchema},
 *     `${api2}`: ${jsonSchema},
 *     `${api3}`: ${jsonSchema},
 *     `${api4}`: ${jsonSchema},
 * } 
 * 
 * 通过 koa-router-schema 插件，实现路由自动生成
 * 定制路由规则，并且做路由的前置校验
 * 
 * 
 * @returns 
 */


module.exports = (app) => {
    // 读取 router-schema/**/**.js 下所有的文件
    // 读取 app/routerSchema/**/**.js 下所有的文件
    const routerSchemaPath = path.resolve(app.businessPath,  `.${sep}router-schema`); // 获取 routerSchema 文件目录
    const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`));

    let routerSchema = {};
    fileList.forEach(file => {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
    })

    app.routerSchema = routerSchema;
}