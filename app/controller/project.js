module.exports = (app) => {
    return class ProjectController {
        /**
         * 请求接口
         * 获取项目列表
         * @param {object} ctx 上下文
         */
        async renderPage(ctx) {
            const { project: projectService } = app.service;
            const data = await projectService.getList();
            
            ctx.status = 200;
            ctx.body = {
                code: 200,
                data,
                message: 'success'
            }
        }
    }
}