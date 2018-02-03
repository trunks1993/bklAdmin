import { getMenuList } from '@/api/login'
const _import = require('@/router/_import_' + process.env.NODE_ENV)

function getRouterMap(menuList) {
  menuList.filter(item => {
    item.component = _import(item.component)
    if (item.children && item.children.length > 0) {
      getRouterMap(item.children)
    }
  })
  return menuList
}

const menu = {
  state: {
    routers: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, token) {
      return new Promise((resolve, reject) => {

        getMenuList(token).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            let asyncRouterMap = getRouterMap(data.data)
            asyncRouterMap.push({ path: '*', redirect: '/404', hidden: true })
            commit('SET_ROUTERS', asyncRouterMap)
            resolve(asyncRouterMap)
          }
          
        }).catch(error => {
          reject(error)
        })

      })
    }
  }
}

export default menu
