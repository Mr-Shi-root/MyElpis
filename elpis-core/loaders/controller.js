const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 * controller laoder
 * @param {object} app Koa 实例
 * 
 * 把所有controller 挂载到 app.controller 中，方便调用
 * 
 * 加载所有 controller 可通过 'app.controller.${目录}.${文件}' 访问
 * 
 * 例子：
 * app/controller
 *  |
 *  | -- custom-module
 *          |
 *          |  -- index.js
 *  
 * => app.controller.customModule.customeController
 * 
 * @returns 
 */

module.exports = (app) => {
    // 读取 app/controller/**/**.js 下所有的文件
    const controllerPath = path.resolve(app.businessPath,  `.${sep}controller`); // 获取 middleware 文件目录

    // 读取所有文件 middleware文件夹下的所有文件
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`));

    // 遍历所有文件目录，把内容加载到 app.controller 下
    const controller = {};
    
    fileList.forEach(file => {
        // 提取文件名称
        // 截取路径
        // 把 '-' 统一改为驼峰式 custom-module => customModule
        // 挂载 middleware 到内存 app对象中

        // 提取文件名称
        let name = path.resolve(file);

        // 截取路径 app/controller/custom-module/index.js => custom-module/index.js
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.js'))

        // 把 '-' 统一改为驼峰式 custom-module => customModule
        name = name.replace(/[_-][a-z]/ig, (s) => {return s.substring(1).toUpperCase()})

        // 挂载 controller 到内存 app对象中, （不确定路径的层级，需要通过遍历嵌套）
        let tempController = controller;
        const names = name.split(sep);
        for(let i = 0, len = names.length; i < len; ++i) {
            // 最后一个才需要挂载
            if (i === len - 1) {
                // 挂载 controller 到内存 app对象中
                
                const ControllerModule = require(path.resolve(file))(app); // controller是一个class，所以需要new 
                tempController[names[i]] = new ControllerModule();
            } else {
                // 如果不存在，则创建
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {};
                }
                
                tempController = tempController[names[i]];
            
            }
        }
        

        // const fileName = path.basename(file, '.js');
        // const fileDir = path.dirname(file);
        // const fileDirName = path.basename(fileDir);
        // const filePath = path.resolve(fileDir, fileName);
        // const fileContent = require(filePath);

        // // 创建中间件对象 
        // const middleware = {
        //     name: fileName, 
        //     path: filePath,
        // }
    })
    
    app.controller = controller;
}