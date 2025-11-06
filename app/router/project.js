module.exports = (app, router) => {
    const { project: ProjectController } = app.controller;

    router.get('/api/project/model_list', ProjectController.getModelList.bind(ProjectController));
}