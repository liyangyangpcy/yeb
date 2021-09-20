let proxyObj = {}

proxyObj['/'] = {
    //表示是websocket
    ws: false,
    // 代理到后端目标地址
    target: 'http://localhost:8082',
    //发送请求头host会被设置 target （http://localhost:8082）
    changeOrigin: true,
    //路径重写配置,不重写路径
    pathRewrite: {
        '^/': '/'
    }
};

//请求转发,和之前传统协议一样，写代理， ws相关都可以理解成websocket,有了代理之后会被nodejs请求转发到后端8082接口上面去，实现跨域
proxyObj['/ws'] ={
    ws:true,
    target:'ws://localhost:8082'

};

module.exports = {
    // 本地项目启动地址 http://localhost：8084=> 代理到后端地址 http://localhost:8082
    devServer: {
        host: 'localhost',
        port: 8084,
        proxy: proxyObj
    }
}
