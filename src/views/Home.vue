<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云端办公</div>
        
          <div>
              <el-button type="text" 
                  icon="el-icon-bell" 
                  size="normal" 
                  style="color:black; margin-right:8px"
                  @click="goChat">
              </el-button>

              <el-dropdown class="userInfo" @command="commandHandler">
                  <span class="el-dropdown-link">{{ user.name }} <i> <img :src="user.userFace" /> </i> </span>
      
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                      <el-dropdown-item command="setting">设置</el-dropdown-item>
                      <el-dropdown-item command="logout">注销登录</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
          </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router
                   unique-opened
                   >
            <el-submenu :index="index + ''"
                        v-for="(item, index) in routes"
                        v-if="!item.hidden"
                        :key="index">
              <template slot="title">
                <i :class="item.iconCls"
                   style="color: #1accff; margin-right:5px"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="children.path"
                            v-for="(children, indexj) in item.children"
                            :key="indexj">
                {{ children.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right"
                         v-if="this.$router.currentRoute.path != '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome"
               v-if="this.$router.currentRoute.path == '/home'">
            欢迎来到云端办公系统！
          </div>
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    //用户对象
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user')), //字符串转换成对象
    }
  },
  computed: {
    //从vuex获取
    routes () {
      return this.$store.state.routes;
    },
    
    user(){
      return this.$store.state.currentAdmin;  //获取vuex用户对象
    }

  },

  methods: {
    goChat(){
      this.$router.push('/chat');        //路由跳转

    },
    //事件
    commandHandler (cmd) {
      if (cmd == 'logout') {
        this.$confirm('此操作将注销登录，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            //注销
            this.postRequest('/logout')
            //清除用户信息
            window.sessionStorage.removeItem('user')
            window.sessionStorage.removeItem('tokenStr') //令牌
            // this.$store.commit('initRouters', [])
            //清空菜单
            this.$store.commit('initRoutes', [])
            //跳转登录页
            this.$router.replace('/')
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
            })
          })
      }
      if(cmd=='userinfo')
      {
        this.$router.push('/userinfo');

      }
    },
  },
}
</script>

<style>
.homeHeader {
  background-color: rgb(132, 172, 218);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}
.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: white；;
}
.homeHeader .userInfo {
  cursor: pointer;
}
.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 100%;
  margin-left: 8px;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
}
.homeWelcome{
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: blue;
  padding-top: 50px;
}
.homeRouterView{
  margin-top: 10px;
}
</style>