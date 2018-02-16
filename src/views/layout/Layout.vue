<template>
  <div class="app-wrapper">
    <navbar id="navbar"></navbar>
    <div id="fixedTemp"></div>
    <app-main></app-main>
  </div>
</template>
<script>
import { Navbar, AppMain } from '@/views/layout/components'
import Breadcrumb from '@/components/Breadcrumb'
import { getElement, dynCreateDomObject } from '@/components/Ueditor/domUtils'

export default {
  components: {
    Navbar,
    AppMain
  },
  data() {
    return {
      endPoint: process.env.BASE_API + "/jnkjSocket"
    }
  },
  mounted() {
    this.connectSrv()
    const _this = this
    window.onscroll = function() {
      if (_this.$route.path !== '/advert/index') {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        if (scrollTop > 61) {
          UE.dom.domUtils.addClass(getElement('navbar'), 'fixedNav')
          getElement('fixedTemp').setAttribute('style', 'height: 61px')
        } else {
          UE.dom.domUtils.removeClasses(getElement('navbar'), 'fixedNav')
          getElement('fixedTemp').setAttribute('style', 'height: 0')
        }
      }
    }
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
  @include clearfix;
  position: relative;
  width: 100%;
}

.fixedNav {
  position: fixed;
  z-index: 1000;
  opacity: 0.9;
}

</style>
