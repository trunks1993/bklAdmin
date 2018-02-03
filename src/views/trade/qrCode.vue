<template>
  <div class="cash">
    <div class="cash-recharge clearfix">
      <div class="cash-recharge-money">
        <div class="title">
          <span>二维码库存</span>
        </div>
        <div class="balance">
          <span>{{userInfo.vo.stock}}</span>张
        </div>
      </div>
      <div class="cash-recharge-qrCode">
        <div class="cash-recharge-qrCode-buy">
          <el-form :model="buyObj" :inline="true">
            <el-form-item>
              <el-input-number v-model="buyObj.qrCount" controls-position="right" @change="handleCheckNum" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="buttonLoading" @click.native="buy">{{!buttonLoading?'¥'+qrTotalPrice / 100: ''}} 购 买</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="cash-line"></div>
    <div class="cash-record">
      <div class="cash-record-filter">
        <div class="time">
          <span>交易时间：</span>
          <el-date-picker id="times" size="small" v-model="listQuery.condition.vo.times" @change="handleFilter" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div class="cash-record-table">
        <el-table :data="qrCodeTradeDetail" :default-sort="{prop: 'updateDate', order: 'descending'}" border fit style="width: 100%" v-loading="loading">
          <el-table-column align="center" label="交易时间" prop="updateDate" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单号">
            <template slot-scope="scope">
              <span>{{scope.row.vo.orderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="交易场景">
            <template slot-scope="scope">
              <span>{{scope.row.vo.orderType==0?'创建活动':'二维码充值'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="交易状态">
            <template slot-scope="scope">
              <span>{{scope.row.vo.orderStatus == 0?'交易成功':'活动创建未支付'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="二维码数量">
            <template slot-scope="scope">
              <span>{{scope.row.usingType == 0?'-'+scope.row.tradeNumber:'+'+scope.row.tradeNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250">
            <template slot-scope="scope">
              <el-button v-if="scope.row.vo.orderStatus == 1" type="danger" size="mini" @click.native="pay(scope.row.vo.orderNo)">立即付款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!loading" class="cash-record-pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="pay-dialog" :visible.sync="dialogPay">
      <div slot="title" class="dialog-title">
        <img :src="checkstandLogo" />
        <span>收银台</span>
      </div>
      <pay-page :order="order" @payRes="getPayRes" v-if="dialogPay"></pay-page>
    </el-dialog>
  </div>
</template>
<script>
import PayPage from '@/components/PayPage'
import { getQrTotalPrice, createQrOrder, getQrCodeTradeDetail, getOrderByNo } from '@/api/user'
import { mapGetters } from 'vuex'
import checkstandLogo from '@/assets/checkstandLogo.jpg'

export default {
  components: {
    PayPage
  },
  data() {
    return {
      loading: false,
      total: 0,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          vo: {
            times: []
          },
          createBy: this.$store.getters.userInfo.id
        }
      },
      buyObj: {
        qrCount: 1
      },
      qrTotalPrice: 0,
      order: null,
      dialogPay: false,
      buttonLoading: false,
      qrCodeTradeDetail: [],
      checkstandLogo
    }
  },
  created() {
    this.getQrTotalPrice()
    this.getList()
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    getList() {
      this.loading = true
      getQrCodeTradeDetail(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.qrCodeTradeDetail = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
      })
    },
    getQrTotalPrice() {
      this.buttonLoading = true
      getQrTotalPrice(this.userInfo.id, this.buyObj.qrCount).then(res => {
        this.buttonLoading = false
        this.qrTotalPrice = res.data.data
      })
    },
    handleCheckNum(val) {
      const that = this
      const oldVal = that.buyObj.qrCount
      that.$nextTick().then(() => {
        if (val % 1 !== 0) {
          that.buyObj.qrCount = oldVal
        }
        that.getQrTotalPrice()
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    buy() {
      this.buttonLoading = true
      createQrOrder(this.userInfo.id, this.buyObj.qrCount).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.order = data.data
          this.dialogPay = true
          this.buttonLoading = false
        }
      })
    },
    pay(orderNo) {
      getOrderByNo(orderNo).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.order = data.data
          this.dialogPay = true
        }
      })
    },
    getPayRes(res) {
      if (res === 'PAY_SUCCESS') {
        this.dialogPay = false
        this.getList()
      }
    }
  }


}

</script>
<style lang="scss" scoped>
.clearfix {
  zoom: 1;
}

.cash {
  background: #fff;

  &-recharge {
    padding: 30px 0;
    &-money {
      width: 374px;
      float: left;
      padding-left: 60px;
      border-right: 1px dashed #bec1c7;
      .title {
        color: #3a3d42;
        font-size: 18px;
      }
      .balance {
        padding-top: 18px;
        font-size: 18px;
        color: #333333;
        line-height: 1;
        height: 44px;
        span {
          font-size: 40px;
          color: #3a3d42;
          padding-right: 8px;
        }
      }
      .button-list {
        margin-top: 30px;
      }
    }
    &-qrCode {
      // width: 250px;
      padding-left: 60px;
      float: left; // border-right: 1px dashed #bec1c7;
      .title {
        color: #3a3d42;
        font-size: 18px;
      }
      .stock {
        padding-top: 27px;
        height: 35px;
        span {
          font-size: 35px;
          color: #3a3d42;
          padding-top: 11px;
          padding-right: 8px;
        }
      }
      &-buy {
        margin-top: 20px;
      }
    }
  }
  &-line {
    width: 90%;
    margin: 0 auto;
    border-bottom: 1px solid #ced1d9;
  }
  &-record {
    padding: 30px;
    &-filter {
      padding: 30px 0;
      .time {
        margin-top: 20px;
      }
    }
    &-pagination {
      padding: 30px 0;
    }
  }
}

</style>
