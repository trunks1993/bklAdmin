<template>
  <div class="pay-container">
    <div class="pay-container-order">
      <div>
        <div>订单编号 : {{order.orderNo}}</div>
        <div>订单类型 : {{order.orderType === 0?'活动订单':'二维码充值订单'}}</div>
      </div>
      <div>
        <span>应付金额 : </span>
        <span style="font-size:20px;">¥{{order.orderPrice / 100}}</span>
      </div>
    </div>
    <div class="pay-container-footer">
      <img class="recommend" :src="rec">
      <el-tabs type="border-card">
        <el-tab-pane label="微信支付">
          <div class="icon">
            <img :src="wxpaylogo"><span style="margin-left: 5px;">微信支付</span>
          </div>
          <div class="qrCode">
            <div class="qrCode-photo" v-loading="qrCodeLoading">
              <img :src="payQrCode" v-if="!qrCodeLoading">
            </div>
            <div class="qrCode-detail">
              <img style="margin-top:10px;" :src="scanDetail">
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="order.orderPrice / 100 > userInfo.balance">
          <span slot="label">余额 {{order.orderPrice / 100 > userInfo.balance?'(余额不足)':'¥'+userInfo.balance}}</span>
          <div class="qrCode">
            <el-form ref="psw" @submit.native.prevent :model="pswObj" :rules="pswRule" size="small" label-position="top" style='width: 200px;'>
              <el-form-item label="支付密码：" prop="password">
                <el-input v-model="pswObj.password" type="password" @keyup.enter.native="pay(order.id,pswObj.password)"></el-input>
              </el-form-item>
              <span style="font-size: 8px;color: #999">支付密码暂为登录密码</span>
              <el-form-item>
                <el-button :loading="balancePayLoading" type="primary" @click.native="pay(order.id,pswObj.password)" size="small">确认支付</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import wxpaylogo from '@/assets/wxpaylogo.png'
import codetest from '@/assets/codetest.png'
import scanDetail from '@/assets/scanDetail.png'
import rec from '@/assets/rec.png'

import { mapGetters } from 'vuex'

import { unifiedOrder, balancePayOrder, paySuccess } from '@/api/user'

export default {
  props: {
    order: {
      type: Object
    }
  },
  stompClient: {
    monitorIntervalTime: 100000,
    stompReconnect: false,
    timeout(orgCmd) {}
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else {
        if (this.pswMsg !== '') {
          callback(new Error('密码错误'))
        }
        callback()
      }
    }
    return {
      wxpaylogo,
      payQrCode: '',
      scanDetail,
      rec,
      pswObj: {
        password: '',
      },
      pswMsg: '',
      pswRule: {
        password: [{ required: true, validator: validatePass, trigger: 'blur' }]
      },
      qrCodeLoading: false,
      balancePayLoading: false
    }
  },
  mounted() {
    this.onConnected()
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    onConnected() { //订阅消息
      this.$stompClient.subscribe('/user/' + this.userInfo.id + '/pay', this.receiveOnlineGuest)
      this.getPayCode() //获取支付二维码
    },
    receiveOnlineGuest(frame) {
      const data = JSON.parse(frame.body)
      if (data.msg_type === 'PAY_SUCCESS'){
        this.$emit('payRes', 'PAY_SUCCESS')
        this.$store.dispatch('GetUserInfo')
        this.$message({
          showClose: true,
          message: '支付成功',
          type: 'success'
        })
      }
    },
    getPayCode() {
      this.qrCodeLoading = true
      unifiedOrder(this.order.id).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.payQrCode = process.env.BASE_API + data.data
          this.qrCodeLoading = false
        }
      })
    },
    pay(id, password) {
      this.$refs.psw.validate(valid => {
        if (valid) {
          this.balancePayLoading = true
          balancePayOrder(id, password).then(res => {
            const data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$emit('payRes', 'PAY_SUCCESS')
              this.$store.dispatch('GetUserInfo')
              paySuccess(data.data.activity)
              this.balancePayLoading = false
              this.$message({
                showClose: true,
                message: '支付成功',
                type: 'success'
              })
            } else {
              this.balancePayLoading = false
              this.pswMsg = data.msg
              this.$refs.psw.validateField('password')
              this.pswMsg = ''
            }
          })
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.pay-container {
  height: 500px;
  color: #333333;
  &-order {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f2f2f2;
    width: 100%;
    padding: 25px 60px 25px 25px;
  }
  &-footer {
    padding: 30px;
    position: relative;
    .recommend {
      position: absolute;
      top: 15px;
      left: 50px;
      z-index: 1000;
      width: 50px;
    }
    .icon {
      display: flex;
      align-items: center;
      font-size: 20px;
      img {
        width: 30px;
      }
    }
    .qrCode {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 20px;
      &-photo {
        width: 150px;
        height: 150px;
        img {
          width: 100%;
        }
      }
      &-detail {
        width: 150px;
        img {
          width: 100%;
        }
      }
    }
  }
}

</style>
