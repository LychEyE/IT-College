import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
         // 确定用户是否通过getInfo获得了权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 //这里指的是src/store/getters.js的roles
      // console.log(hasRoles)
      //判断是否已经有roles了
      if (hasRoles) {
        next()
      } else {
        // try {
        //   // get user info
        //   await store.dispatch('user/getInfo')
        //   next()
        // } catch (error) {
        //   // remove token and go to login page to re-login
        //   await store.dispatch('user/resetToken')
        //   Message.error(error || 'Has Error')
        //   next(`/login?redirect=${to.path}`)
        //   NProgress.done()
        // }
        try {
          // get user info
          // 注意: roles 角色必须是对象数组! 例如: ['admin'] 或 ,['developer','editor']
          // 1. 获取roles
          const {
            roles
          } = await store.dispatch('user/getInfo') //第一步

          // 2. 根据角色生成可访问路由图
          // 获取通过权限验证的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles) //第二步
          // 3. 更新加载路由
          router.options.routes = store.getters.permission_routes //第三步
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)
          // console.log(store)
          // console.log(accessRoutes);

          // hack方法 确保addRoutes已完成，以确保地址是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // 删除token并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error('出现错误~请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
