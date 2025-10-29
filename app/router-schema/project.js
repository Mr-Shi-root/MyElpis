module.exports = {
    // 校验路由参数的类型以及必填等配置的校验， router.project里每新增一个接口，这里都需要配置一个校验规则
    '/api/project/list': {
        post: {
            query: {
                type: 'object',
                properties: {
                    proj_key: {
                        type: 'string',
                    }
                }
            },
            body: {},
            params: {},
        }
    }
}