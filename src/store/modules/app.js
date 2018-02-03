import Cookies from 'js-cookie'

function getTagView() {
  return !Cookies.get('tagView') ? [] : JSON.parse(Cookies.get('tagView'))
}

function setTagView(json) {
  return Cookies.set('tagView', json)
}

function delTagView() {
  return Cookies.remove('tagView')
}

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (getTagView().some(v => v.path === view.path)) {
        state.visitedViews = getTagView()
        return
      }
      let arr = getTagView()
      arr.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || 'no-name'
      })
      setTagView(JSON.stringify(arr))
      state.visitedViews = getTagView()
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, obj) => {
      if (obj.type === 'CURRENT') {
        for (const [i, v] of state.visitedViews.entries()) {
          if (v.path === obj.view.path) {
            state.visitedViews.splice(i, 1)
            setTagView(state.visitedViews)
            break
          }
        }
        for (const i of state.cachedViews) {
          if (i === obj.view.name) {
            const index = state.cachedViews.indexOf(i)
            state.cachedViews.splice(index, 1)
            break
          }
        }
      }
      if (obj.type === 'ALL') {
        state.visitedViews = []
        delTagView()
        state.cachedViews = []
      }
      if (obj.type === 'RIGHT') {
        let temp = []
        for (const [i, v] of state.visitedViews.entries()) {
          if (v.path === obj.view.path) {
            temp = state.visitedViews.splice(i + 1, state.visitedViews.length - i)
            setTagView(state.visitedViews)
            break
          }
        }
        for (const j of temp) {
          for (const i of state.cachedViews) {
            if (i === j.name) {
              const index = state.cachedViews.indexOf(i)
              state.cachedViews.splice(index, 1)
              break
            }
          }
        }
      }
      if (obj.type === 'OTHER') {
        state.visitedViews = [obj.view]
        setTagView(state.visitedViews)
        state.cachedViews = [obj.view.name]
      }


    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, obj) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', obj)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default app
