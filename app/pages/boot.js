import { createApp } from "vue";
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';


// 数据缓存
import pinia from 'pinia';

// 路由
import { createRouter, createWebHashHistory } from 'vue-router'


// 公共 css
import './assets/custom.css'

/**
 * vue 页面主入口， 用于启动 vue
 * @params pageComponent vue 主入口
 * @params routes 路由列表
 * @params libs 页面依赖的第三方包
 */
export default (pageComponent, {routes = [], libs } = {}) => {
    console.log('init page');
    
    const app = createApp(pageComponent)
    app.use(ElementPlus)

    // 引入 pinia 
    app.use(pinia);

    // 多页面 ，需要动态引入第三方库
    if(libs && libs.length) {
        for(let i = 0; i < libs.length; i++) {
            app.use(libs[i])
        }
    }

    // 页面路由
    if (routes && routes.length) {
        const router = createRouter({
            history: createWebHashHistory(), // 采用 hash 模式
            routes
        })
        app.use(router);
        router.isReady().then(() => {
            app.mount("#root"); 
        })
    } else {
        app.mount("#root"); 
    }
}

/**
 * SSR： Server side rendering = 服务端渲染
 * CSR： Client side rendering = 客户端渲染
 * 
 * 主屏是用服务端渲染返回到浏览器，再通过路由去客户端渲染子页面
 * 好处： 对 SEO 友好啊， 等等
 * 对比 spa 和 ssr 等等啊
 * 
 */