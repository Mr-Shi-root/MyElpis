module.exports = {
    name: 'B站课堂',
    desc: 'B站课堂管理系统',
    homePage: '',
    menu: [{
        key: 'video',
        name: '视频管理',
    }, {
        key: 'user',
        name: '用户管理',
    }, {
        key: 'classes',
        name: '课程资料',
        menuType: 'module',
        moduleType: 'sider',
        siderConfig: {
            menu: [
                {
                    key: 'pdf',
                    name: 'PDF',
                    menuType: 'module',
                    moduleType: 'custom',
                    customConfig: {
                        path: '/todo'
                    }
                },
                {
                    key: 'excel',
                    name: 'Excel',
                    menuType: 'module',
                    moduleType: 'custom',
                    customConfig: {
                        path: '/todo'
                    }
                },
                {
                    key: 'ppt',
                    name: 'PPT',
                    menuType: 'module',
                    moduleType: 'custom',
                    customConfig: {
                        path: '/todo'
                    }
                },
            ]
        }
    }]

}