
//导入路由对象
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from  '../views/Home.vue'
import AdminInfo from '../views/AdminInfo.vue'
import FriendChat from '../views/chat/FriendChat.vue'

//安装路由插件
Vue.use(VueRouter)

//配置路由和组件的映射关系
const routes = [{
    path: '/', //路由地址 配置默认路由
    name: 'Login', //路由名称
    component: Login, //组件名称（ import Login from '../views/Login.vue'）
    hidden: true
  },
  {
    path: '/home', //路由地址
    name: 'Home', //路由名称
    component:Home, 
    children:[      //
      {
        path: '/chat', //路由地址
        name: '在线聊天', //路由名称
        component: FriendChat
      },

      {
        path: '/userinfo', //路由地址
        name: '个人中心', //路由名称
        component:AdminInfo
      }
     
    ]

  }

]

//创建vueRouter实例对象
const router = new VueRouter({
  routes
})

//导出实例对象，目的挂在到vue实例上
export default router