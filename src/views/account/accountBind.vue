<template>
  <div class="accountBind-container">
    <div class="bindKind">
      <div class="bindKind-left">
        <div class="img">
          <img :src="img_logo">
        </div>
        <div class="bindDetail">
          <span v-if="userInfo.openId">已绑定微信账号：{{userInfo.vo.nickName}}</span>
          <span v-else>未绑定，无法使用微信提现</span>
        </div>
      </div>
      <div class="bindKind-right">
        <el-button v-if="!userInfo.openId" type="text" @click.native="getBindQrCode">绑定</el-button>
        <el-button v-else type="text">解除绑定</el-button>
      </div>
    </div>
    <div class="line"></div>
    <el-dialog title="扫描关注完成绑定" width="300px" center :visible.sync="dialogBindQrCode">
      <div class="qrCode-photo" v-loading="qrCodeLoading">
        <img :src="bindQrCode+'?check='+Date.now()" v-if="!qrCodeLoading">
      </div>
      <span slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="getBindQrCode">刷新</el-button>
	  </span>
    </el-dialog>
  </div>
</template>
<script>
import img_logo from '@/assets/logo.svg'
import { mapGetters } from 'vuex'
import { getBindQrCode } from '@/api/user'

export default {
  data() {
    return {
      img_logo,
      bindQrCode: '',
      dialogBindQrCode: false,
      qrCodeLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    getBindQrCode() {
      this.onConnected()
      this.dialogBindQrCode = true
      this.qrCodeLoading = true
      getBindQrCode(this.userInfo.id).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.bindQrCode = process.env.BASE_API + data.data
          this.qrCodeLoading = false
        }
      })
    },
    onConnected() { //订阅消息
      this.$stompClient.subscribe('/user/' + this.userInfo.id + '/bindUser', this.receiveOnlineGuest)
    },
    receiveOnlineGuest(frame) { //接收消息
      const data = JSON.parse(frame.body)
      if (data.msg_type === 'BIND_USER') {
        this.dialogBindQrCode = false
        this.$store.dispatch('GetUserInfo')
        this.$message({
          showClose: true,
          message: '绑定成功',
          type: 'success'
        })
      }
    }
  }
}

</script>
<style lang="scss">
.accountBind-container {
  height: 100%;
  background: #fff;
  .bindKind {
    width: 100%;
    height: 100px;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px 0 20px;
    &-left {
      display: -webkit-flex;
      align-items: center;
      .img {
        height: 50px;
        width: 50px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .bindDetail {
        margin-left: 20px;
        color: #2d2f33;
      }
    }
  }
  .line {
    width: 100%;
    margin: 0 auto;
    border-bottom: 1px solid #ced1d9;
  }
  .qrCode-photo {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
}

</style>
