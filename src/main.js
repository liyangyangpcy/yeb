import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'font-awesome/css/font-awesome.min.css'

//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {
  postRequest,
  putRequest,
  getRequest,
  deleteRequest
} from './utils/api.js';

import {
  initMenu
} from './utils/menu';

import { downloadRequest } from './utils/download'



// 关闭浏览器控制台关于环境的相关提示
Vue.config.productionTip = false
//安装ElementUI
Vue.use(ElementUI);

//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;


//路由导航守卫（全局前置守卫）：路由跳转 
//next(放行)不写，调用方法来resolve钩子，不会跳转到路由里面  如参数：next(false):中断当前跳转；比如浏览器url改变，改变可以是用户手动输入或者浏览器后退按钮，此时url地址会重置到from对应的地址
router.beforeEach((to, from, next) => {
  //判断是否登录
  if (window.sessionStorage.getItem("tokenStr")) {
    initMenu(router, store);
    //判断是否存在用户信息
    if (!window.sessionStorage.getItem("user")) {
      return getRequest('/admin/info').then(resp => {
        if (resp) {
          //存入用户信息 sessionStorage只能存字符串，所有要转换
          window.sessionStorage.setItem("user", JSON.stringify(resp));
          // store.commit('INIT_ADMIN',resp);  //存入信息，会去更新vuex里面的Admin,也就是currentAdmin
          next();
        }
      });
    }
    next();
  } else {
    //判断下一个路由的路径是登录页
    if (to.path == '/') {
      next();
    } else {
      //重定向 ？是传参 /是login
      next('/?redirect=' + to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')