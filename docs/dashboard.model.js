 {
    mode: 'dashboard', // 模版类型， 不同模版类型对应不一样的模版数据结构
    // 头部菜单
    menu: [{
        key: '', 
        name: '',
        menuType: '', // 枚举值 group / module 
        // menuType = group 时 可填
        subType: [{
            // 可递归 menuItem
        }, ],

        // 当 menuType == module 时， 可填
        moduleType: '', // 枚举值 ： sider/iframe/custom/schema

        // 当 moduleType = sider 时
        siderConfig: {
            menu: [{
                // 可递归 除 moduleType = sider 外
            }]
        },

        // 当 moduleType = iframe 时
        iframeConfig: {},

        // 当 moduleType = custom 时
        customConfig: {}, 

        // 当 moduleType = schema 时
        schemaConfig: {
            api: '/api/user', // 数据源 api （遵循 RESTFUL 规范）
            schema: {
                type: 'object',
                properties: {
                    key: {
                        ...schema, // 标准 schema 配置
                        label: '', // 字段的中文名
                        type: '', // 字段类型
                    },
                    // ...
                }
            },
            tableConfig: {}, // table 相关配置
            searchConfig: {}, // searchBar 相关配置
            components: {}, // 模块组件

        },
    }]

 }