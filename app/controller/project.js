
module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class ProjectController extends BaseController{
        /**
         * 请求接口
         * 获取项目列表
         * @param {object} ctx 上下文
         */
        async renderPage(ctx) {
            const { project_key: projKey } = ctx.request.query;
            console.log('projKey~~~', projKey);
            
            const { project: ProjectService } = app.service;
            const projectList = await ProjectService.getList();
            // 这里不应该？？？判断吗
            this.success(ctx, projectList)
            
        }
    }
}