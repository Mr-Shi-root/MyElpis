import md5 from "md5";
import {ElMessage} from 'element-plus';
/**
 * 前端封的 curl 方法
 */
const curl = ({
    url, 
    method = 'post', 
    headers = {}, // 请求头
    query = {}, // url query
    data = {}, // post body
    responseType = 'json', // response data type
    timeout = 60000, // timeout 
    errorMessage = '网络异常'
}) => {

    // 接口签名处理 （让接口）
    const signKey = 'xdh1j3jh1hjfhjhchhj13heh'
    const st = Date.now();

    // 构造请求参数 (把参数转换为 axios 参数)
    const ajaxSetting = {
        url, 
        method: 'post', 
        params: query,
        data, // post body
        responseType, // response data type
        timeout, // timeout 
        headers: {
            ...headers,
            s_t: st,
            s_sign: md5(`${signKey}_${st}`)
        }
    }

    return axios.request(ajaxSetting).then((responent) => {

        const resData = responent.data || {}

        // 后端 API 返回格式
        const{ success } = responent
        if (!success) {
            const {message, code} = responent
            if(code === 442) {
                ElMessage.error('请求参数异常')
            } else if(code === 445) {
                // 尽量不写 请求签名不合法，不告诉黑客们有签名
                ElMessage.error('请求不合法')
            } else if(code === 50000) {
                ElMessage.error(message)
            } else {
                ElMessage.error(errorMessage)
            }
            return Promise.resolve({success, code, message});
        }

        // chenggong
        const {data, metadata} = resData;
        return Promise.resolve({success, data, metadata})

    }).catch((err) => {
        const { message } = err
        if (message.match(/timeout/)) {
            return Promise.resolve({
                message: 'Request timeout ',
                code: 504
            })
        }
        return Promise.resolve(error)
    })
}

export default curl