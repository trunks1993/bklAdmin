<template>
  <div class="dropdown">
    <div class="top">
      <el-row type="flex">
        <el-col :span="24">
          <router-link class="account" to="/account">
            <span>{{userInfo.name}}</span>
          </router-link>
        </el-col>
      </el-row>
      <el-row type="flex" class="router-button font-small">
        <el-col :span="24">
          <router-link class="router" to="/account/accountBind" :class="{gray:!userInfo.openId}">
            <svg-icon :icon-class="!userInfo.openId?'warning':'wxpay'"></svg-icon>
            <span :class="{green:!!userInfo.openId}">{{!userInfo.openId?'未绑定微信':'已绑定微信'}}</span>
          </router-link>
        </el-col>
      </el-row>
      <el-row type="flex" class="router-button" :class="{gray:!(userInfo.expireDate - Date.now()>0)}">
        <el-col :span="8">
          <div class="router">
            <svg-icon :icon-class="!(userInfo.expireDate - Date.now()>0)?'warning':'date'"></svg-icon><span>到期时间</span>
          </div>
        </el-col>
        <el-col :span="5">
          <el-button type="warning" plain>续费</el-button>
        </el-col>
        <el-col class="col-span" :span="11">
          <span v-if="userInfo.expireDate - Date.now()>0">{{userInfo.expireDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>已过期</span>
        </el-col>
      </el-row>
    </div>
    <div class="middle">
      <el-row type="flex" class="router-button" style="margin-top: 0;">
        <el-col :span="6">
          <router-link class="router" to="/trade">
            <svg-icon icon-class="balance"></svg-icon><span>余额</span>
          </router-link>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" plain>充值</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" plain>提现</el-button>
        </el-col>
        <el-col class="col-span" :span="10">
          <!-- <span v-if="!userInfo.balance">0</span>
                  <span v-else>¥{{userInfo.balance}}</span> -->
          <span>¥{{userInfo.balance}}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="router-button">
        <el-col :span="10">
          <router-link class="router" to="/trade/qrCode">
            <svg-icon icon-class="LineCascades"></svg-icon><span>二维码库存</span>
          </router-link>
        </el-col>
        <el-col :span="5">
          <el-button type="warning" plain>购买</el-button>
        </el-col>
        <el-col class="col-span" :span="9">
          <span v-if="!userInfo.vo.stock">0</span>
          <span v-else>{{userInfo.vo.stock}}</span>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row type="flex" class="router-button">
        <el-col :span="12">
          <router-link class="router" to="/trade/order">
            <svg-icon icon-class="LineText"></svg-icon><span>未支付订单</span>
          </router-link>
        </el-col>
        <el-col class="col-span" :span="12">
          <span class="badge" v-if="userInfo.vo.unpayOrder">{{userInfo.vo.unpayOrder > 99 ? '99+': userInfo.vo.unpayOrder}}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="router-button">
        <el-col :span="24">
          <router-link class="router" to="/trade">
            <svg-icon icon-class="BlockServicel"></svg-icon><span>消费记录</span>
          </router-link>
        </el-col>
      </el-row>
      <el-row type="flex" class="router-button">
        <el-col :span="24">
          <router-link class="router" to="/trade">
            <svg-icon icon-class="scan"></svg-icon><span>扫码记录</span>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <div class="last-time">
        <div>上次登陆:</div>
        <div>{{userInfo.loginDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</div>
      </div>
      <el-button type="info" size="mini" @click="logout">退出</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
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
.dropdown {
  width: 280px;
  background: #202529;
  z-index: 9999;
  position: absolute;
  right: 10px;
  top: 60px;
  display: none;
  color: #fff;
  font-size: 14px;
  .font-small {
    font-size: 12px;
  }
  .green {
    color: #4fc08d;
  }
  .gray {
    color: #909399;
  }
  .top {
    padding: 12px 16px;
    background: #262c30;
    .account {
      transform: color;
      transition: .38s;
      &:hover {
        color: teal;
      }
    }
  }
  .middle {
    padding: 12px 16px;
    .line {
      height: 1px;
      margin-top: 14px;
      background: #373d41;
    }
    .router {
      transform: color;
      transition: .38s;
      &:hover {
        color: teal;
      }
    }
  }
  .footer {
    padding: 0 16px;
    height: 50px;
    color: #73777a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    .el-button {
      border-radius: 0;
    }
  }
  .router-button {
    margin-top: 14px;
    .router {
      .svg-icon {
        width: 16px; // vertical-align: text-bottom;
        margin-right: 5px;
      }
    }
    .el-button {
      padding: 2px 5px;
      font-size: 8px;
      border-radius: 0;
      background: transparent;
      &:hover {
        background: #eb9e05;
        color: #262c30;
      }
    }
    .col-span {
      text-align: right;
      .badge {
        background: #f56c6c;
        border-radius: 10px;
        padding: 2px 5px;
        font-size: 12px;
        display: inline-block;
        color: #fff;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
      }
    }
  }
}

</style>
