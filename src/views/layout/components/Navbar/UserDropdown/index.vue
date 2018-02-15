<template>
  <div class="header-avatar">
    <div class="header-avatar-wrapper">
      <div class="header-avatar-wrapper-msg">
        <el-popover ref="popover" placement="bottom" width="400" trigger="hover">
          <msg-dropdown></msg-dropdown>
        </el-popover>
        <el-badge :value="messageList | getNoReadCount" :max="99">
          <svg-icon icon-class="msg" v-popover:popover></svg-icon>
        </el-badge>
      </div>
      <div class="header-avatar-wrapper-userTools">
        <el-badge :value="userInfo.vo.unpayOrder" :max="99">
          <div class="photo" :style="{'background-image':'url(\''+userInfo.photo+'\')'}"></div>
        </el-badge>
        <svg-icon icon-class="BlockArrow" class="blockArrow"></svg-icon>
        <tools-dropdown></tools-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import img_logo from '@/assets/logo.svg'
import { getMsg, iknown } from '@/api/user'
import MsgDropdown from './MsgDropdown'
import ToolsDropdown from './ToolsDropdown'

export default {
  components: {
    MsgDropdown,
    ToolsDropdown
  },
  data() {
    return {
      img_logo,
      listQuery: {
        userId: this.$store.getters.userInfo.id,
        count: 10,
        offset: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'messageList'
    ])
  },
  created() {
    this.$store.dispatch('GetMsgList', this.listQuery)
  },
  methods: {
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getMsg() {
      getMsg(this.listQuery).then(res => {
        console.log(res.data.data)
      })
    },
    getMsgByType(messageList, types) {
      return messageList.filter(item => {
        return item.type === types
      })
    },
    Iknown() {
      iknown(this.userInfo.id).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.$store.dispatch("GetMsgList", this.userInfo.id)
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.header-avatar {
  height: 60px;
  &-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    &-msg {
      font-size: 30px;
      position: relative;
      margin-right: 10px;
      display: flex;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
    }
    &-userTools {
      display: flex;
      align-items: center;
      &:hover .dropdown {
        cursor: pointer;
        display: block;
      }
      .photo {
        width: 50px;
        height: 50px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .blockArrow {
        width: 0.7em !important;
        height: 0.7em !important;
        position: relative;
        top: 15px;
        margin-left: 10px;
      }
    }
  }
}

</style>
