<template>
  <div class="cash">
    <div class="cash-recharge clearfix">
      <div class="cash-recharge-money">
        <div class="title">
          <span>账号：{{userInfo.username}}</span>
        </div>
        <div class="balance">
          <span>{{userInfo.balance}}</span>元
        </div>
        <div class="button-list">
          <el-button type="primary" size="small">充值</el-button>
          <el-button size="small">提现</el-button>
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
        <el-table :data="balanceTradeDetail" :default-sort="{prop: 'updateDate', order: 'descending'}" border fit style="width: 100%" v-loading="loading">
          <el-table-column align="center" label="交易时间" prop="updateDate" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="交易场景">
            <template slot-scope="scope">
              <span v-if="scope.row.usingType == 0">活动创建</span>
              <span v-if="scope.row.usingType == 1">二维码充值</span>
              <span v-if="scope.row.usingType == 2">提现</span>
              <span v-if="scope.row.usingType == 3">余额充值</span>
              <span v-if="scope.row.usingType == 4">活动退款</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="交易方式">
            <template slot-scope="scope">
              <span v-if="scope.row.vo">{{scope.row.vo.payType == 0?'现金交易':'微信支付'}}</span>
              <span v-else>现金交易</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="交易状态">
            <template slot-scope="scope">
              <span>交易成功</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额">
            <template slot-scope="scope">
              <span>{{scope.row.usingType >2 ?'+'+scope.row.tradeNumber/100:'-'+scope.row.tradeNumber/100}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!loading" class="cash-record-pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getBalanceTradeDetail } from '@/api/user'
import { mapGetters } from 'vuex'

export default {

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
      balanceTradeDetail: null
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getBalanceTradeDetail(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.balanceTradeDetail = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
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
          color: #ff8401;
          padding-right: 8px;
        }
      }
      .button-list {
        margin-top: 30px;
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
