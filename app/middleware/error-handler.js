/**
 * 运行时异常错误处理 兜底所有异常
 * @param {
 *  [object]
 * } app koa 实例
 */
module.exports = (app) => {
    /**
     * 写中间件，要根据用法去写函数
     * app.use(function) use里面是一个函数， 所以需要一个上下文，和一个 next 方法，用来调用下一个中间件
     * 当中间件执行“瞬间”，会调用 next 方法， 才会进入下一个中间件
     */
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            // 错误处理
            const { status, message, detail } = err;

            // 1. 错误日志 这里没必要节省打印
            app.logger.info(JSON.stringify(err));
            app.logger.error('[-- exception --]:', err);
            app.logger.error('[-- exception --]:', status, message, detail)

            // 这里通过 router 可以请求 api，也可以请求 页面， 都会过这个 error-handle 中间件
            // 如果 页面路由不存在， 会报错 template not found
            if (message && message.indexOf('template not found') > -1 ) {
                // 重定向
                ctx.status = 302; // 临时重定向， 不用 301 永久重定向，如果服务器未重启，上了该路由，则会报错 
                ctx.redirect(`${app?.options?.homePage}`);
                return;
            }

            // 2. 错误信息
            const resBody = {
                code: 500,
                success: false,
                message: '网络异常，请稍后重新尝试～～'
            }
            ctx.status = 200;
            ctx.body = resBody
        }
    }
}