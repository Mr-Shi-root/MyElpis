module.exports = {
    name: 'taobao',
    desc: 'taobao电商系统',
    homePage: '',
    menu: [{
        key: 'operating',
        name: '运营活动',
        menuType: 'module',
        moduleType: 'sider',
        siderConfig: {
            menu: [{
                key: 'coupon',
                name: '优惠券',
                menuType: 'module',
                customConfig: {
                    path: '/todo'
                }
            },{
                key: 'limited',
                name: '限购量',
                menuType: 'module',
                customConfig: {
                    path: '/todo'
                }
            },{
                key: 'festival',
                name: '节日活动',
                menuType: 'module',
                customConfig: {
                    path: '/todo'
                }
            } ]
        }
    }]
}