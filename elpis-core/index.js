const Koa = require('koa');
const path = require('path');
const { sep } = path; // 回当前操作系统的路径分隔符。win是‘\’, linux是‘/’
const env = require('./env');

// 引入loaders
const midderwareLoader = require('./loaders/middleware');
const routerLoader = require('./loaders/router');
const controllerLoader = require('./loaders/controller');
const serviceLoader = require('./loaders/service');
const configLoader = require('./loaders/config');
const routerSchemaLoader = require('./loaders/router-schema');
const extendLoader = require('./loaders/extend');

module.exports = {
    /**
     * 启动服务
     * @param {Object} options 项目配置
     * 
     * 
     */
    start(options = {}) {
        // koa 实例
        const app = new Koa();

        // 应用配置
        app.options = options;

        // 基础路径
        app.baseDir = process.cwd();
        // console.log('基础路径：',app.baseDir);
        
        // 业务文件路径
        // ??? 需要在win上测试 `.${sep}app` 替换成`./app` 会不会正确输出路径
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`) 
        // console.log('业务文件路径：',app.businessPath);

        // 挂在环境函数
        app.env = env();
        console.log(`-- [start] env: ${app.env.get()} --`);
        
        // 调用loader,传入app，供初始化loader
        // 加载 midderwareLoader
        midderwareLoader(app);
        console.log(`-- [start] load midderwareLoader done --`);
        

        // 加载 routerSchema
        routerSchemaLoader(app);
        console.log(`-- [start] load routerSchemaLoader done --`);

        // 加载 controller
        controllerLoader(app);
        console.log(app.controller);
        console.log(`-- [start] load controllerLoader done --`);
        
        // 加载 service
        serviceLoader(app);
        console.log(`-- [start] load serviceLoader done --`);
        
        // 加载 config
        configLoader(app);
        console.log(`-- [start] load configLoader done --`);
        
        // 加载 extend
        extendLoader(app);
        console.log(`-- [start] load extendLoader done --`);

        // 注册路由（放在最后）
        routerLoader(app);
        console.log(`-- [start] load routerLoader done --`);
        


        // 测试process
        // console.log(process.argv);
        // console.log(process.pid);
        // console.log(process.platform);
        // console.log(process.env);
        // console.log(process.abort());
        // console.log(process.stdin);
        // console.log(process.stdout);
        // console.log(process.stderr);
        // console.log(process.cwd());
        // console.log(process.chdir(directory));
        // console.log(process.memoryUsage());
        // console.log(process.cpuUsage([previousValue]));

        // 启动服务
        try {
            const port = process.env.PORT || 8080;
            const host = process.env.IP || '0.0.0.0';
            console.log(`Server running on http://${host}:${port}`);
            console.log(`Search ${process.env.HOST} & ${process.env.IP}`);
            app.listen(port, host)
        } catch (error) {
            console.log(error);
            
        }
    }
}
