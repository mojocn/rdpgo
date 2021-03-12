import axios from 'axios';
import {Message, MessageBox} from 'element-ui';


// 创建axios实例
const service = axios.create({
    //baseURL: 'http://localhost:2222', // api的base_url
    timeout: 120000, // 请求超时时间,
    // request payload
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
    // 修改请求数据,去除data.q中为空的数据项,只针对post请求
});

service.interceptors.request.use(config => {

    return config;
}, error => {

    return Promise.reject(error);
});


// http response 拦截器
service.interceptors.response.use(response => {
        if (response.status !== 200) {
            return false
        }
        let {code, data, msg} = response.data
        if (code === 200) {
            if (response.config.method === 'POST' || response.config.method === 'post') {
                //Message.success("创建成功")
                return true
            } else if (response.config.method === 'DELETE' || response.config.method === 'delete') {
                //Message.success("删除成功")
                return true
            } else if (response.config.method === 'PATCH' || response.config.method === 'patch') {
                //Message.success("更新成功")
                return true
            }
            return data
        } else if (code === 207) { // wps cookie 换取 jwt 错误
            //0alert(response)
            Message.warning(msg)
            return false
        } else if (code === 206) { // 参数错误
            Message.warning(msg)
            return false
        } else if (code === 204) { //service 层错误 业务错误
            Message.error(msg)
            return false
        } else if (code === 205) { // 用户中间件错误 缺少jwt token
            //需要 *.wps.cn cookie 换取用户信息
            //Message.error(msg)
            wpsAccountCookieExchangeJwt();

            return false
        } else if (code === 203) { // ssh-ark jwt cookie 出错 错误  获取wps 用户错误
            //alert(msg)

            //let thisURL = encodeURIComponent(location.href)
            //window.location.href = `https://account.wps.cn/login?cb=${encodeURIComponent(location.href)}`
            //let to = vueRouter.currentRoute.name
            //vueRouter.push({name: "wpsAuth", query: {callback: to}})

            return false
        } else {
            //alert(response)
            Message.warning('json code 位置错误')
            return false
        }
    },
    error => {
        Message.error(`网络错误`);
        return Promise.reject(error.response.data)

    }
)


export default service


// Want to use async/await? Add the `async` keyword to your outer function/method.
export async function wpsAccountCookieExchangeJwt() {
    try {
        const {data} = await axios.get('/api/wps/account');
        if (data.code === 200) {
            return data.data
        } else if (data.code === 203) {
            //跳转到 认证页面
            window.location.href = `https://account.wps.cn/login?cb=${encodeURIComponent(location.href)}`
        } else {
            console.log(JSON.stringify(data))
            MessageBox.alert(data.msg, '提示', {
                confirmButtonText: '关闭窗口',
                callback: () => {
                    window.close()
                }
            })
        }
    } catch (error) {
        //console.error(error);
        alert(error)
    }
}