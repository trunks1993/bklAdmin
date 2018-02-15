<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="活动消息">
        <div style="padding: 5px 0;" v-for="item in getMsgByType(messageList,'ACTIVITY')">
          <span style="margin-right:10px;">{{item.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          <span>{{item.content}}</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="订单消息">
        <div style="padding: 5px 0;" v-for="item in getMsgByType(messageList,'ORDER')">
          <span style="margin-right:10px;">{{item.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          <span>{{item.content}}</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统消息">
        <div style="padding: 5px 0;" v-for="item in getMsgByType(messageList,'SYSTEM')">
          <span style="margin-right:10px;">{{item.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          <span>{{item.content}}</span>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="padding-top: 10px;">
      <el-button size="mini" @click="Iknown">全部已读</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import img_logo from '@/assets/logo.svg'
import { getMsg,iknown } from '@/api/user'

export default {
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
          this.$store.dispatch("GetMsgList",this.userInfo.id)
        }
      })
    }
  }
}


</script>
<style lang="scss" scoped>


</style>
