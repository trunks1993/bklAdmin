import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()

  if (getToken()) {

    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！

    } else {

      if (Object.keys(store.getters.userInfo).length === 0) {

        store.dispatch('GetUserInfo').then(userId => { // 拉取用户信息
          store.dispatch('GenerateRoutes', userId).then((menuRoutes) => { // 获取菜单
            router.addRoutes(menuRoutes)
            next({ ...to })
          }).catch(() => {
            store.dispatch('FedLogOut')
            Message.error('菜单获取失败，请重新登录')
            next({ path: '/login' })
            NProgress.done()
          })
        }).catch(() => {
          store.dispatch('FedLogOut')
          Message.error('用户信息获取失败,请重新登录')
          next({ path: '/login' })
          NProgress.done()
        })

      } else {
        next()
      }

    }

  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
