<template>
  <div class="in-wrap">
    <!-- 公共头引入 -->
    <header id="header">
      <section class="container">
        <h1 id="logo">
          <a href="#" title="谷粒学院">
            <img src="~/assets/img/logo.png" width="100%" alt="谷粒学院" />
          </a>
        </h1>
        <div class="h-r-nsl">
          <ul class="nav">
            <router-link to="/" tag="li" active-class="current" exact>
              <a>首页</a>
            </router-link>
            <router-link to="/course" tag="li" active-class="current">
              <a>课程</a>
            </router-link>
            <router-link to="/teacher" tag="li" active-class="current">
              <a>名师</a>
            </router-link>
            <router-link to="/blog" tag="li" active-class="current">
              <a>文章</a>
            </router-link>
            <!-- <router-link  to="/my" tag="li" active-class="current">
              <a v-if="loginInfo.id">个人主页</a>
            </router-link> -->
          </ul>
          <!-- / nav -->
          <ul v-if="!loginInfo.id" class="h-r-login">
            <li id="no-login">
              <a title="登录" @click="goLogin">
                <em class="icon18 login-icon">&nbsp;</em>
                <span class="vam ml5">登录</span>
              </a>
              |
              <a title="注册" @click="goRegister">
                <span class="vam ml5">注册</span>
              </a>
            </li>
            
          </ul>
          <ul v-else class="h-r-login">
            <!-- <li v-if="loginInfo.id" id="is-login-one" class="mr10">
              <a id="headerMsgCountId" href="#" title="消息">
                <em class="icon18 news-icon">&nbsp;</em>
              </a>
              <q class="red-point" style="display: none">&nbsp;</q>
            </li> -->
            <li v-show="loginInfo.id" id="is-login-two" class="h-r-user">
              <router-link to="/my">
                <a title>
                <img
                  :src="loginInfo.avatar"
                  width="30"
                  height="30"
                  class="vam picImg"
                  alt
                />
                <span id="userName" class="vam disIb">{{
                  loginInfo.nickname
                }}</span>
              </a>
              </router-link>
              
              <a
                href="javascript:void(0);"
                title="退出"
                @click="logout()"
                class="ml5"
                >退出</a
              >
            </li>
            <!-- /未登录显示第1 li；登录后显示第2，3 li -->
            
          </ul>
          <aside class="h-r-search">
              <label class="h-r-s-box">
                <input
                  type="text"
                  placeholder="输入你想学的课程"
                  v-model="courseTitle"
                />
                <button class="s-btn" @click="searchCourse">
                  <em class="icon18">&nbsp;</em>
                </button>
              </label>
          </aside>
        </div>
        <aside class="mw-nav-btn">
          <div class="mw-nav-icon"></div>
        </aside>
        <div class="clear"></div>
      </section>
    </header>
    <!-- /公共头引入 -->

    <nuxt />

    <!-- 公共底引入 -->
    <footer id="footer">
      <section class="container">
        <div class>
          <h4 class="hLh30">
            <span class="fsize18 f-fM c-999">链接</span>
          </h4>
          <ul class="of flink-list">
            <li>
              <a href="https://gitee.com/Garzeon" title="彬彬" target="_blank"
                >彬彬的Gitee</a
              >
            </li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="b-foot">
          <section class="fl col-7">
            <section class="mr20">
              <section class="b-f-link">
                <a href="#" title="关于我们" target="_blank">关于我们</a>|
                <a href="#" title="联系我们" target="_blank">联系我们</a>|
                <a href="#" title="帮助中心" target="_blank">帮助中心</a>|
                <a href="#" title="资源下载" target="_blank">资源下载</a>|
                <span>Email：Mr.litchi.milk@Gmail.com</span>
              </section>
              
            </section>
          </section>
          <aside class="fl col-3 tac mt15">
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wx-icon.png" alt />
              </span>
            </section>
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wb-icon.png" alt />
              </span>
            </section>
          </aside>
          <div class="clear"></div>
        </div>
      </section>
    </footer>
    <!-- /公共底引入 -->
  </div>
</template>

<script>
import '~/assets/css/reset.css'
import '~/assets/css/theme.css'
import '~/assets/css/global.css'
import '~/assets/css/web.css'
import '~/assets/css/base.css'
import '~/assets/css/activity_tab.css'
import '~/assets/css/bottom_rec.css'
import '~/assets/css/nice_select.css'
import '~/assets/css/order.css'
import '~/assets/css/swiper-3.3.1.min.css'
import "~/assets/css/pages-weixinpay.css"


import cookie from 'js-cookie'
import login from '@/api/login'


export default {
  data() {
    return {
      token: '',
      loginInfo: {
        id: '',
        age: '',
        avatar: '',
        mobile: '',
        nickname: '',
        sex: '',
      },
      courseTitle:'',
    }
  },
  created() {
    this.token=this.$route.query.token
    if(this.token){
      this.wxLogin()
    }
    this.getUserInfo()
  },
  methods: {
    //从cookie中获取loginInfo
    getUserInfo() {
      var userStr = cookie.get('IT_user')
      if (userStr) {
        this.loginInfo = JSON.parse(userStr)
      }
    },
    logout(){
      //退出登录 就是清空cookie
      cookie.remove('IT_token')
      cookie.remove('IT_user')
      window.location.href = "/";
      this.$message({
        type: "success",
        message: "退出成功"
      })

    },
    wxLogin() {
      if (this.token == '') return
      //把token存在cookie中、也可以放在localStorage中
      cookie.set('IT_token', this.token, {domain: 'localhost'})
      cookie.set('IT_user', '', {domain: 'localhost'})
      //登录成功根据token获取用户信息
      login.getLoginInfo().then(response => {
        this.loginInfo = response.data.data.userInfo
        //将用户信息记录cookie
        cookie.set('IT_user', JSON.stringify(this.loginInfo), {domain: 'localhost'})
      })
    },
    searchCourse(){
      console.log("1:"+this.courseTitle);
      this.$router.push({path:'/course',query:{courseTitle:this.courseTitle}})
    },
    goLogin(){
      this.$router.push({path:'/login'})
    },
    goRegister(){
      this.$router.push({path:'/register'})
    }


  },

};
</script>