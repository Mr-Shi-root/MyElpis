module.exports = (app) => {
    return class TestController {
        /**
         * 渲染页面
         * @param {object} ctx 上下文
         * 
         * 
         */
        async renderPage(ctx) {
            console.log('ctx: ', ctx, ctx.params);
            
            await ctx.render(`output/entry.${ctx.params.page}`);
        }
    }
}