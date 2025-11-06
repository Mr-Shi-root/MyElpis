
module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class ProjectController extends BaseController{
        
        // 获取所有模型与项目的结构化数据
        async getModelList(ctx) {
            const { project: projectService } = app.service;
            const modelList = await projectService.getModelList();

            // 对 service 返回的结果进行二次处理， service 数据更基础，更原始，更偏向数据库一点， 这里相当于进行业务层包装
            const dtoModelList = modelList.reduce((preList, item) => {
                const { model, project } = item;

                // 构造 model 关键数据
                const { key, name, desc } = model;
                const dtoModel = { key, name, desc}

                
                // 构造 project 关键数据
                const dtoProject = Object.keys(project).reduce((proObj, item) => {
                    const { key, name, desc, homePage } = item;
                    proObj[key] = { key, name, desc, homePage}
                    return proObj;
                }, {})

                preList.push({
                    model: dtoModel,
                    project: dtoProject
                })

                return preList;

            }, [])

            this.success(ctx, modelList)
        }
        
        
        /**
         * 请求接口
         * 获取项目列表
         * @param {object} ctx 上下文
         */
        // async renderPage(ctx) {
        //     const { project_key: projKey } = ctx.request.query;
        //     console.log('projKey~~~', projKey);
            
        //     const { project: Pr ojectService } = app.service;
        //     const projectList = await ProjectService.getList();
        //     // 这里不应该？？？判断吗
        //     this.success(ctx, projectList)
        // }
    }
}