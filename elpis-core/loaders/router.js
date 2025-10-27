const KoaRouter = require('koa-router');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { sep } = path;

/**
 * 
 * router loader 
 * @param {
 *     object
 * } app koa 实例
 * @returns 
 * 
 * 解析所有 app/router 下所有 js 文件 加载到 KoaRouter 下
 * 
 * 
 * 
 */

module.exports = (app) => {

    // 找到路径
    const routerPath = path.resolve(app.businessPath, `.${sep}router`);

    // 获得路径下所有文件
    const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`));

    // 实例化 KoaRouter
    const router = new KoaRouter();
    
    // 注册所有路由
    fileList.forEach(file => {
        require(path.resolve(file))(app, router);
        // 调用后，每个路由文件的使用方法
        // module.exports = (app, router) {
        //     router.get('/', (ctx, next) => {})
        // }
    })

    // 路由兜底（为什么要兜底： 健壮性）
    router.get('*', async (ctx, next) => {
        ctx.status = 302; // 临时重定向
        ctx.redirect(`${app?.options?.homePage ?? '/'}`);
    })

    // 路由注册到 app 上  通用
    app.use(router.routes())
    app.use(router.allowedMethods())
    
}