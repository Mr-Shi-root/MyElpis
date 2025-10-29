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
    
    // 引入 ctx.body 解析中间件
    const bodyParser = require('koa-bodyparser');
    app.use(bodyParser({
        formLimit: '1000mb',
        enableTypes: ['json', 'form', 'text'],
    }));

    // 引入 middleware 目录下所有中间件， 异常捕获，需在第一个
    // -- 引入异常捕获中间件 --  
    app.use(app.middlewares.errorHandler)
    // -- 引入 api 签名验证中间件 --
    app.use(app.middlewares.apiSignVerify)
    // -- 引入 API 参数校验 --
    app.use(app.middlewares.apiParamsVerify)
}
