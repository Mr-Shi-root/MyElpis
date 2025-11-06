module.exports = (app) => {
    const BaseService = require('./base')(app);

    const ModelList = require('../../model/index.js')(app);
    console.log(JSON.stringify(ModelList));
    
    return class ProjectService extends BaseService {
        async getList() {
            return [
                {
                    name: 'project1',
                    desc: 'project1 desc'
                },
                {
                    name: 'project2',
                    desc: 'project2 desc'
                },
                {
                    name: 'project3',
                    desc: 'project3 desc'
                }
            ]
        }
    }
}