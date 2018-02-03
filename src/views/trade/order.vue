<template>
  <div>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" v-model="listQuery.condition.orderNo" placeholder="订单编号">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" v-model="listQuery.condition.vo.activityName" placeholder="活动名">
      </el-input>
      <el-button class="filter-item" type="primary" @click="handleFilter" v-waves icon="el-icon-search">搜索</el-button>
      <div style="margin: 10px 0;">
        <el-radio-group v-model="listQuery.condition.status" style="margin-left:20px;" @change="handlerRadioChange">
          <el-radio label="">所有订单</el-radio>
          <el-radio :label="1">等待付款</el-radio>
          <el-radio :label="3">待发货</el-radio>
          <el-radio :label="4">待收货</el-radio>
          <el-radio :label="2">关闭的订单</el-radio>
          <el-radio :label="0">成功的订单</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-table :data="orederList" v-loading="loading" element-loading-text="给我一点时间" border fit style="width: 100%">
      <el-table-column align="center" label="订单编号" prop="createDate" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单类型">
        <template slot-scope="scope">
          <span>{{scope.row.orderType==0?'活动创建（'+scope.row.vo.activityName+'）':'二维码充值'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | getOrderStatus(2)" :class="{blueBack:scope.row.status === 4}">
            {{scope.row.status | getOrderStatus(0)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码数量">
        <template slot-scope="scope">
          <span>{{scope.row.vo.qrCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码单价">
        <template slot-scope="scope">
          <span>{{scope.row.vo.qrPrice / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信手续费">
        <template slot-scope="scope">
          <span>{{!scope.row.wxTransfer?'无': scope.row.wxTransfer / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope">
          <span>{{scope.row.orderPrice / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===1" type="danger" size="mini" @click.native="pay(scope.row)">立即付款</el-button>
          <el-button v-if="scope.row.status===1" type="text" @click.native="cancelOrder(scope.row.id)">取消订单</el-button>
          <el-button v-if="scope.row.status===0||scope.row.status===2" type="text" @click.native="deletOrder(scope.row.id)">删除订单</el-button>
          <el-button v-if="scope.row.status===4" type="warning" size="mini" @click.native="confirmDelivery(scope.row.id,scope.$index)">确认收货</el-button>
          <el-button type="text" @click.native="openOrderDetail(scope.row)">订单详情</el-button>
          <el-button type="text" v-if="scope.row.orderType===1&&scope.row.status===0||scope.row.status===4 && scope.row.isDelivery===0" @click.native="openLogisticalDetail(scope.row)">物流信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!loading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogOrderDetail" v-if="!!orderDetail">
      <div slot="title">
        <span>订单详情</span>
        <el-tag size="mini" :type="orderDetail.status | getOrderStatus(2)" :class="{blueBack:orderDetail.status === 4}">
          {{orderDetail.status | getOrderStatus(0)}}</el-tag>
      </div>
      <template v-if="orderDetail.orderType == 0">
        <span>二维码收货地址：{{orderDetail.vo.deliveryAddress}}</span>
        <div class="orderDetail-title">活动信息：</div>
        <el-row>
          <el-col :span="8">活动名：{{orderDetail.vo.activityName}}</el-col>
          <el-col :span="8">总二维码数量：{{orderDetail.vo.activityTotalQr}}张</el-col>
          <el-col :span="8">红包总金额：¥{{orderDetail.vo.activityTotalMoney / 100}}</el-col>
          <el-col :span="24">开始时间：{{orderDetail.vo.activityStartDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</el-col>
        </el-row>
      </template>
      <div class="orderDetail-title">创建人信息：</div>
      <el-row>
        <el-col :span="8">姓名：{{orderDetail.vo.createUserName}}</el-col>
        <el-col :span="8">电话：{{orderDetail.vo.createUserPhone}}</el-col>
      </el-row>
      <div class="orderDetail-title">订单信息：</div>
      <el-row>
        <el-col :span="12">订单编号：{{orderDetail.orderNo}}</el-col>
        <el-col :span="12">创建时间：{{orderDetail.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</el-col>
        <el-col :span="12" v-if="orderDetail.status!==1">{{orderDetail.status===0?"成交时间":" 关闭时间"}}：{{orderDetail.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</el-col>
        <el-col :span="12">订单总金额：¥{{orderDetail.orderPrice / 100}}</el-col>
      </el-row>
    </el-dialog>
    <el-dialog class="pay-dialog" :visible.sync="dialogPay">
      <div slot="title" class="dialog-title">
        <img :src="checkstandLogo">
        <span>收银台</span>
      </div>
      <pay-page :order="order" @payRes="getPayRes" v-if="dialogPay"></pay-page>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, deletOrder, cancelOrder, confirmDelivery } from '@/api/user'
import waves from '@/directive/waves/index.js' // 水波纹指令
import PayPage from '@/components/PayPage'
import checkstandLogo from '@/assets/checkstandLogo.jpg'

export default {
  directives: {
    waves
  },
  components: {
    PayPage
  },
  data() {
    return {
      loading: false,
      total: null,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          orderNo: '',
          status: '',
          vo: {
            orderFlag: 0,
            activityName: ''
          },
          createBy: this.$store.getters.userInfo.id
        }
      },
      orederList: [],
      orderDetail: null,
      order: null,
      checkstandLogo,
      dialogOrderDetail: false,
      dialogPay: false
    }
  },
  created() {

    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getOrderList(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.orederList = data.datas.records
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
    },
    handlerRadioChange() {
      this.getList()
    },
    openOrderDetail(orderDetail) {
      this.dialogOrderDetail = true
      this.orderDetail = orderDetail
    },
    deletOrder(id) {
      this.$confirm('是否删除订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletOrder(id).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === "success") {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      })
    },
    cancelOrder(id) {
      this.$confirm('是否取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrder(id).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === "success") {
            this.getList()
            this.$store.dispatch('GetUserInfo').then(userId => {
              this.$notify({
                title: '成功',
                message: '取消成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }).catch(res => {})
    },
    pay(order) {
      this.order = order
      this.dialogPay = true
    },
    getPayRes(res) {
      if (res === 'PAY_SUCCESS') {
        this.dialogPay = false
        this.getList()
      }
    },
    confirmDelivery(orderId, index) {
      this.$confirm('确认收货将解锁二维码，是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmDelivery(orderId).then(res => {
          const data = res.data
          if (data.code === 0 && data.msg === 'success') {
            this.orederList.splice(index, 1, data.data)
            this.$message({
              type: 'success',
              message: '操纵成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收货'
        })
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.orderDetail-title {
  font-size: 14px;
  font-weight: bold;
  border-top: 1px solid #D1D7DC;
  margin: 10px 0;
  padding-top: 10px;
}

</style>
