const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  messageList: state => state.user.messageList,
  routers: state => state.menu.routers,
  visitedViews: state => state.app.visitedViews, //标签
  cachedViews: state => state.app.cachedViews
}
export default getters
