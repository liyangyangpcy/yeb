import axios from "axios";
import {Message} from 'element-ui';
import router from "../router";

/* 配置响应拦截器，用来提示信息 */
axios.interceptors.response.use(success => {

    //接口调取成功，业务逻辑错误
    if (success.status && success.status == 200) {
        // success.data 后端返回的json数据对象 success.data =>  {code,message,dataObject}
        // 500: 服务器错误 401:未登录 403:权限禁止
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
            // 弹出错误信息，结束操作
            Message.error({message: success.data.message})
            return;
        }
        // 可以默认这里是操作成功，判断成功有没有返回信息
        if (success.data.message) {
            Message.success({message: success.data.message})
        }
    }
    //拦截器处理完操作，需要把对象返回出去
    return success.data;

}, error => {

    //后端接口没调到，服务器挂机了 504:服务器有问题，404:页面找不到
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({message: '服务器被吃了'})
    } else if (error.response.code == 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.code == 401) {
        Message.error({message: '权限不足，请重新登录'})
        //设置跳转到登录页 （import导入路由-配置）
        router.replace('/')
    } else {
        if (error.response.data.message) {
            Message.error({message: error.response.data.message})
        } else {
            Message.error({message: '未知错误'})
        }
    }
    return;

})

//配置请求拦截器， 添加token保证有数据获取的权限
axios.interceptors.request.use(config => {
    //获取 登录成功时 存在sessionStorage 的 tokenStr
    if (window.sessionStorage.getItem('tokenStr')) {
        //将 tokenStr 存在请求头 ，请求的时候携带token 请求
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    }
    return config;
}, error => {
    console.log(error)
})

//前置路径，提前写在这里
let base = '';

//传送json格式的post请求
//请求 封装 导出 定义 post请求 一般情况下，post请求要有请求的路径接口url，对应的参数
//传送json格式的post请求     请求某一个对应的接口的时候：ip地址+端口号+请求的接口地址/路径  +前置的路径（大型项目加上用来区分）
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

//传送json格式的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

//传送json格式的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

//传送json格式的delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
