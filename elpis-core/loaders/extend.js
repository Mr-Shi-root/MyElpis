const { log } = require('console');
const glob = require('glob');
const path = require('path');
const { sep } = path;

/**
 * extend laoder
 * @param {object} app Koa 实例
 * 
 * 把所有 extend 挂载到 app.extend 中，方便调用
 * 
 * 加载所有 extend 可通过 'app.extend.${文件}' 访问
 * 
 * 例子：
 * app/extend
 *  |
 *  | -- custom-module
 *          |
 *          |  -- index.js
 *  
 * => app.extend.customModule.customeextend
 * 
 * @returns 
 */

module.exports = (app) => {
    // 读取 app/extend/**/**.js 下所有的文件
    const extendPath =  path.resolve(app.businessPath,  `.${sep}extend`); // 获取 middleware 文件目录
    // 读取所有文件 middleware文件夹下的所有文件
    const fileList = glob.sync(path.resolve(extendPath, `.${sep}**.js`));

    // 遍历所有文件目录，把内容加载到 app.extend 下
    fileList.forEach(file => {

        // 提取文件名称
        let name = path.resolve(file);

        // 截取路径 app/extend/custom-module.js => customModule
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.js'))

        // 把 '-' 统一改为驼峰式 custom-module => customModule
        name = name.replace(/[_-][a-z]/ig, (s) => {return s.substring(1).toUpperCase()})
        
        
        // 过滤 app 中已经存在的 key
        for(const key in app) {
            if (key === name) {
                console.log(`[extend load error] name: ${name} is exist in app`)
                return;
            }
        }

        // 挂载 extend 到内存 app对象中,
        app[name] = require(path.resolve(file))(app);
        
    })
}