<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <header-tools></header-tools>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain, TagsView,HeaderTools } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    HeaderTools,
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    return {
      endPoint: process.env.BASE_API + "/jnkjSocket"
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  mounted() {
    this.connectSrv()
  },
  methods: {
    connectSrv() {
      this.connetWM(this.endPoint, {}, this.onConnected, frame => { console.log('Failed: ' + frame) }) //建立websocket连接
    },
    onConnected(frame) {
      this.$stompClient.subscribe('/user/' + this.$store.getters.userInfo.id + '/systemMessage', this.receiveOnlineGuest, frame => { alert('Failed: ' + JSON.stringify(frame)) })
    },
    receiveOnlineGuest(frame) {
      const data = JSON.parse(frame.body)
      if (data.msg_type === 'UPDATE_USER' || data.msg_type === 'UNBIND_USER') {
        this.$store.dispatch('GetUserInfo')
      }
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  // @include clearfix;
  position: relative;
  height: 100vh;
  width: 100%;
}

</style>
