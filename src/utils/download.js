//封装 专门为文件下载请求
import axios from "axios";

//先定义axios, 给axios默认带一个响应的类型 ,因为流是二进制数组
const service=axios.create({
    responseType:'arraybuffer'
})

//拦截器 调用后端接口，
//比如：请求拦截器，项目里面有专门的JWTToken:authorization, 
//调用后端接口，要验证request请求里面有没有authorization对应的key以及key对应value,有的话才能认为处于登录状态，可以调用接口，
//如果request请求里面有没有authorization对应的key，会认为没有登录，被登录拦截器拦截。
//请求拦截器
service.interceptors.request.use(config=>{
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    return config;
},error=>{
    console.log(error);
})

//为什么：因为axios,不仅仅可以用来获取导出员工数据的接口，也可以去调用任意的后端接口， 本身就是ajax的一个异步请求，去调用后端接口，所以要拿到返回的结果，做一些相应的处理。
//响应拦截器
service.interceptors.response.use(resp=>{
    const headers= resp.headers;  //响应头部信息
    let reg=RegExp(/application\/json/);          //如果响应类型是/application\/json/，定义正则表达式:主要是因为，虽然是流的形式返回，也有可能是正常的json字符串返回--因为前后端分离，后端一般返回的数据大部分都是json字符串，只有像下载文件这种特殊的接口才会返回流的形式。
    if(headers['content-type'].match(reg)){       //匹配说明是普通的接口请求
        resp.data=unitToString(resp.data );                 //转成string类型，正常返回json 字符串
    }else{                                       //不是默认返回string流
        let fileDownload=require('js-file-download');         //引入的插件
        let fileName=headers['content-disposition'].split(';')[1].split('filename=')[1];                   //获取名字完整的filename     ;截掉attach 和filename=
        let contentType= headers['content-type']; //响应类型   
        fileName=decodeURIComponent(fileName); //格式转换：防止中文乱码
        fileDownload(resp.data, fileName, contentType);  //下载文件
    }
},error=>{
    console.log(error);
})

//处理json格式的转换
function unitToString(unitArray){  
    let encodedString=String.fromCharCode.apply(null,new Uint8Array(unitArray));  //编码
    let decodedString=decodeURIComponent(escape(encodedString));  //解码
    return JSON.parse(decodedString);

}


//定义请求  下载一般都用get请求
let base='';
export const downloadRequest = (url, params) => {
    return service({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}


export default service;