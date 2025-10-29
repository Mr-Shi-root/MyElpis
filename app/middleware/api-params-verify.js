/**
 * 
 * @param {*} app 
 * @returns 
 */
const Ajv = require('ajv');

module.exports = (app) => {
    const $schema = 'http://json-schema.org/draft-07/schema#';
    return async (ctx, next) => {
        // 只对 API 请求进行签名校验
        if (ctx.path.indexOf('/api') < 0) {
            return await next();
        }

        const { body, query, headers } = ctx.request;
        const { params, path, method } = ctx;

        app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)} |  `);
        app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)} |  `);
        app.logger.info(`[${method} ${headers}] body: ${JSON.stringify(headers)} |  `);

        const schema = app.routerSchema[path]?.[method.toLowerCase()];

        if (!schema) { 
            return await next();
        }

        let valid = true;
        
        // ajv 校验器
        let validate;

        // 校验 headers
        if (valid && headers && schema.headers) {
            schema.headers.$schema = $schema;
            validate = new Ajv().compile(schema.headers); 
            valid = validate(headers);
        }

        // 校验 body
        if (valid && body && schema.body) {
            schema.body.$schema = $schema;
            validate = new Ajv().compile(schema.body); 
            valid = validate(body);
        }

        // 校验 query
        if (valid && body && schema.body) {
            schema.body.$schema = $schema;
            validate = new Ajv().compile(schema.body); 
            valid = validate(body);
        }

        // 校验 body
        if (valid && params && schema.params) {
            schema.params.$schema = $schema;
            validate = new Ajv().compile(schema.params); 
            valid = validate(params);
        }

        if (!valid) {
            ctx.status = 200;
            ctx.body = {
                code: 442,
                success: false,
                message: `request validate fail: ${ajv.errorText(validate.errors)}`,
            }
            return 
        }
        

        await next(); 
    }
}