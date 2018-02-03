import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, delTagView } from '@/utils/auth'
import { formatAddressToArr } from '@/utils'
import { createUser,getMsg } from '@/api/user'

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    messageList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_MSGLIST: (state, messageList) => {
      state.messageList = messageList
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            commit('SET_TOKEN', data.data.token)
            setToken(data.data.token)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            data.data.balance /= 100
            commit('SET_USERINFO', formatAddressToArr(data.data))
          }
          resolve(data.data.id)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取message
    GetMsgList({ commit , state},listQuery) {
      return new Promise((resolve, reject) => {
        getMsg(listQuery).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            commit('SET_MSGLIST', data.data)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //更新用户信息
    UpdateUserInfo({ commit, state }, userInfo) {
      return new Promise((resolve, reject) => {
        createUser(userInfo).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            commit('SET_USERINFO', formatAddressToArr(data.data))
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        delTagView()
        resolve()
      })
    }
  }
}

export default user
