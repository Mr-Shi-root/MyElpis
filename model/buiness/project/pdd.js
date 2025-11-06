module.exports = {
    name: 'pinduoduo',
    desc: 'pdd电商系统',
    homePage: '',
    menu: [{
        key: 'product',
        name: '商品管理（拼多多）',
        menuType: 'module',
        moduleType: 'custom',
        customConfig: {
            path: '/todo'
        }
    },{
        key: 'customer',
        name: '客户管理（拼多多）',
        menuType: 'module',
        moduleType: 'custom',
        customConfig: {
            path: '/todo'
        }
    },{
        key: 'data',
        name: '数据分析（拼多多）',
        menuType: 'module',
        moduleType: 'sider',
        siderConfig: {
            menu: [{
                key: 'analysis',
                name: '电商落盘',
                menuType: 'module',
                moduleType: 'custom',
                customConfig: {
                    path: '/todo'
                }
            }, {
                key: 'sider-search',
                name: '信息查询',
                moduleType: 'iframe',
                iframeConfig: {
                    url: 'https://www.baidu.com'
                }
            }]
        }
    },{
        key: 'search',
        name: '信息查询（拼多多）',
        menuType: 'iframe',
        iframeConfig: {
            url: 'https://www.baidu.com'
        }
    }]
}