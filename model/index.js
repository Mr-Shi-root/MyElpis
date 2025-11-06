const glob = require('glob');
const path = require('path');
const { sep } = path;
const _ = require('lodash');

// project 继承 model 方法
const projectExtendModel = (model, project) => {
    return _.mergeWith({}, model, project, (modelValue, projectValue) => {
        
        // 处理数组合并的特殊情况
        if (Array.isArray(modelValue) && Array.isArray(projectValue)) {
            let result = [];
            // 因为 project 继承 model 所以需要处理修改和新增内容的情况
            // project 有的键值 model 也有 => 修改 （重载）
            // project 有的键值 model 没有 => 新增
            // model 有的键值 project 没有 => 保留 （继承）

            // 处理修改
            for (let i = 0; i < modelValue.length; ++i) {
                let  modelItem = modelValue[i];
                const projectItem = projectValue.find(item => item.key === modelItem.key);
                // 都有的话， 则递归调用 projectExtendModel 方法覆盖修改
                result.push(projectItem ? projectExtendModel(modelItem, projectItem) : modelItem);
            }

            // 处理新增
            for (let i = 0; i < projectValue.length; ++i) {
                const projectItem = projectValue[i];
                const modelItem = modelValue.find(item => item.key === projectItem.key);
                if (!modelItem) {
                    result.push(projectItem);
                }
            }

            return result;
        }
    })
}


/**
 * 解析 model 配置 ，并返回组织切记成后的数据机构
 * [{
 *      model: ${model},
 *      project: {
 *          proj1: ${proj1},
 *          proj2: ${proj2}
 *      }
 *  }]
 *  
 */

module.exports = (app) => { 
    const modelList = [];
    
    // 便利当前文件夹， 构造模型数据结构， 挂载到 modelList 上
    const modelPath = path.resolve(app.baseDir, `.${sep}model`);
    
    const filePath = glob.sync(path.resolve(modelPath, `.${sep}**${sep}**.js`));
    filePath.forEach(file => { 
        if(file.indexOf('index.js') > -1) { return; }
        
        // 区分配置类型 （ model  / project ）
        const type = file.indexOf(`${sep}project${sep}`) > -1 ? 'project' : 'model';
        console.log(type + ': ' +file);

        if (type === 'project') {
            const modelKey = file.match(/\/model\/(.*?)\/project/)?.[1]; 
            const projectKey = file.match(/\/project\/(.*?)\.js/)?.[1];
            
            let modelItem = modelList.find(item => item.model?.key === modelKey);
            if (!modelItem) {  // 初始化 model 数据结构
                modelItem = {}
                modelList.push(modelItem);
            }
            if (!modelItem.project) {
                modelItem.project = {};
            }
            if (projectKey == 'pdd') {
                console.log('pdd', projectKey);
                console.log('modelList:', modelList);
                console.log('modelItem:', modelItem);
                console.log(path.resolve(file));
            }
            
            
            modelItem.project[projectKey] = require(path.resolve(file));
            if (projectKey == 'pdd') {
                console.log('modelItem:', modelItem);
            }
            
            modelItem.project[projectKey].key = projectKey; // 注入 projectKey
            if (projectKey == 'bilibili') {
                console.log('bilibili', projectKey);
                console.log('modelList:', modelList);
                console.log('modelItem:', modelItem);
            }

        }

        if( type === 'model') {
            const modelKey = file.match(/\/model\/(.*?)\/model\.js/)?.[1];
            let modelItem = modelList.find(item => item.model?.key === modelKey);
            if (!modelItem) {
                modelItem = {}
                modelList.push(modelItem);
            }
            modelItem.model = require(path.resolve(file))
            modelItem.model.key = modelKey;
        }
    })

    // 数据进一步整理： project => 继承
    modelList.forEach(item => {
        const { model, project } = item;
        for(const projectKey in project) {
            project[projectKey] = projectExtendModel(model, project[projectKey]);
        }
    })

    return modelList;
}