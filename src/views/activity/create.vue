<template>
  <div class="activity">
    <el-tabs type="border-card">
      <el-tab-pane label="一码一扫">
        <cash-red-pocket ref="cashRedPocket" v-loading="createLoading" @getChildValidMsg="getChildValidMsg" :activity="activity"></cash-red-pocket>
      </el-tab-pane>
      <el-tab-pane disabled label="一码多扫(暂未上线)"></el-tab-pane>
      <div class="footer">
        <div class="footer-priceDetail">
          <div class="footer-priceDetail-money">
            <span class="title">红包总金额：</span>
            <span class="money"> ¥{{activity.totalMoney}}</span>
          </div>
          <div class="footer-priceDetail-qrCode">
            <span class="title">微信手续费：</span>
            <span class="money">¥{{activity.totalMoney | mathCeil()}}</span>
          </div>
          <div class="footer-priceDetail-qrCode" v-if="userInfo.vo.stock < activity.qrCount">
            <span class="title">二维码金额：</span>
            <span class="money">¥{{qrTotalPrice / 100}}</span>
          </div>
        </div>
        <div class="footer-submit">
          <el-button type="primary" :loading="createLoading" @click="submitForm">
            ¥{{activity.totalMoney | orderPrice(qrTotalPrice)}} 提交订单
          </el-button>
        </div>
      </div>
    </el-tabs>
    <el-dialog class="pay-dialog" :visible.sync="dialogPay" @close='getPayRes'>
      <div slot="title" class="dialog-title">
        <img :src="checkstandLogo" />
        <span>收银台</span>
      </div>
      <pay-page :order="order" @payRes="getPayRes" v-if="dialogPay"></pay-page>
    </el-dialog>
  </div>
</template>
<script>
import CashRedPocket from '@/views/activity/components/cashRedPocket'
import { createActivity } from '@/api/activity'
import PayPage from '@/components/PayPage'
import { mapGetters } from 'vuex'
import { getQrTotalPrice } from '@/api/user'
import checkstandLogo from '@/assets/checkstandLogo.jpg'

export default {
  components: {
    PayPage,
    CashRedPocket
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      createLoading: false,
      activity: {
        user: this.$store.getters.userInfo.id,
        name: '',
        startDate: '',
        deliveryAddress: '',
        qrCount: 1,
        totalMoney: 1,
        minMoney: 0,
        maxMoney: 0,
        type: 1,
        needShare: 0,
        adImg: '',
        adTitle: '',
        adLink: '',
        scanedTimes: 1
      },
      qrTotalPrice: 0,
      checkstandLogo,
      dialogPay: false,
      order: null
    }
  },
  created() {
    this.getCharegeQrPrice()
  },
  watch: {
    'activity.qrCount': {
      handler: function(val) {
        this.getCharegeQrPrice()
      },
      deep: true
    }
  },
  methods: {
    getCharegeQrPrice() {
      // if (this.userInfo.vo.stock < this.activity.qrCount) {
      const price = this.activity.qrCount - this.userInfo.vo.stock
      getQrTotalPrice(this.userInfo.id, price > 0 ? price : 0).then(res => {
        this.qrTotalPrice = res.data.data
      })
      // }
    },
    submitForm() {
      this.$refs.cashRedPocket.validateActivity()
    },
    getChildValidMsg(flag) {
      if (flag) {
        this.createLoading = true
        let temp = _.cloneDeep(this.activity)
        temp.totalMoney *= 100
        temp.minMoney *= 100
        temp.startDate = temp.startDate.getTime()
        createActivity(temp).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            this.order = data.data
            this.dialogPay = true
            this.createLoading = false
          }
        })
      } else {
        this.$message({
          message: '提交有误，请检查活动信息',
          type: 'warning'
        });
      }
    },
    getPayRes(res) {
      if (res === 'PAY_SUCCESS') {
        this.$router.push({ path: '/activity/index' })

      } else {
        this.$router.push({ path: '/trade/order' })
        this.$message({
          showClose: true,
          message: '支付失败',
          type: 'warning'
        })
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  padding: 20px;
  &-priceDetail {
    &-money,
    &-qrCode {
      display: table;
      .title {
        color: #5a5e66;
        display: table-cell;
        vertical-align: middle;
      }
      .money {
        font-size: 24px;
        height: 24px;
        line-height: 24px;
        color: #f60;
        font-family: "\5FAE\8F6F\96C5\9ED1", "Microsoft Yahei", "Hiragino Sans GB", tahoma, arial, "\5B8B\4F53";
      }
    }
  }
  &-submit {
    text-align: center;
  }
}

</style>
