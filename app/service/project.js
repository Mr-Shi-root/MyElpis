module.exports = (app) => {
    const BaseService = require('./base')(app);

    const ModelList = require('../../model/index.js')(app);
    console.log(JSON.stringify(ModelList));
    
    return class ProjectService extends BaseService {
        async getModelList() {            
            return ModelList;
        } 
    }
}