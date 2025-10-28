const path = require('path');
const { sep } = path;

module.exports = (app) => { 
    // 配置静态根目录
    const koaStatic = require('koa-static');
    app.use(koaStatic(path.resolve(process.cwd(), `.${sep}app${sep}public`)));

    //  注册 中间件
    const koaNunjucks = require('koa-nunjucks-2');
    // 模版渲染引擎
    app.use(koaNunjucks({
        ext: 'tpl',
        path: path.resolve(process.cwd(), `.${sep}app${sep}public`),
        nunjucksConfig: {
            trimBlocks: true,
            nocache: true,
        }
    }));
    
}
