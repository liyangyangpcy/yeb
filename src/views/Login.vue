<template>
  <div>
    <el-form ref="loginForm"
             v-loading="loading"
             element-loading-text="正在登录..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             :rules="rules" :model="loginForm" class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width: 250px; margin-right: 5px;"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha" style="margin-bottom: -14px">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%;margin-bottom: 15px" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>


export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/captcha?time=' + new Date(),
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      loading: false,
      checked: true,
      rules: {
        username: [{required: true, message: "请输入用户名", trigger: "blur"}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {  //数据校验 ref="loginForm"  表名  :rules="rules" :model="loginForm" 数据绑定
        if (valid) {
          this.loading = true;
          this.postRequest('/login', this.loginForm).then(resp => {
            console.log(resp)
            if (resp) {
              this.loading = false;
              // 获取到了登录成功返回的 token
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              // 保存用户的 token 在本地
              window.sessionStorage.setItem('tokenStr', tokenStr)
              //、、 路由跳转(替换）首页
              //页面跳转
              //跳转路径
              let path=this.$route.query.redirect;
              //判断地址
              this.$router.replace((path=='/'||path==undefined)?'/home':path)

            }
          })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px; /*圆角*/
  background-clip: padding-box; /*内边距*/
  margin: 180px auto;
  width: 355px;
  padding: 15px 35px 15px 35px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 10px auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.el-alert__content {
  display: flex;
  align-items: center;
}
</style>
