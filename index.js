// 引入ElpisCore
const ElpisCore = require('./elpis-core/index.js');

// 启动
ElpisCore.start({
    name: 'Elpis',
    homePage: ''
});


 


// const Koa = require('koa');

// // koa 实例
// const app = new Koa();

// // 启动服务
// try {
//     const port = process.env.PORT || 8080;
//     const host = process.env.IP || '0.0.0.0';
//     console.log(`Server running on http://${host}:${port}`);
//     console.log(`Search ${process.env.HOST} & ${process.env.IP}`);
//     app.listen(port, host)
// } catch (error) {
//     console.log(error);
    
// }
