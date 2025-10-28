module.exports = (app, router) => {
    const { project: ProjectController } = app.controller;

    router.post('/api/project/list', ProjectController.renderPage.bind(ProjectController));
}