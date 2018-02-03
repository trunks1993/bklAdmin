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
          <el-radio :label="1">等待买家付款</el-radio>
          <el-radio :label="3">等待发货</el-radio>
          <el-radio :label="4">已发货</el-radio>
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
            {{scope.row.status | getOrderStatus(1)}}</el-tag>
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
          <el-button v-if="scope.row.status===3" type="warning" size="mini" @click.native="delivery(scope.row.id,scope.$index)">立即发货</el-button>
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
          {{orderDetail.status | getOrderStatus(1)}}</el-tag>
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
    <el-dialog title="发货" :visible.sync="dialogLogistical" center @close="closeDialogLogistical">
      <el-form :model="logistical" ref="logistical" size="mini" :rules="logisticalRules" style='width: 400px;' label-width="100px">
        <el-form-item label="需要物流：">
          <el-switch v-model="logistical.isDelivery" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1">
          </el-switch>
        </el-form-item>
        <template v-if="logistical.isDelivery===0">
          <el-form-item label="物流公司：" prop="expCompany">
            <el-input v-model="logistical.expCompany" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="单号：" prop="expNo">
            <el-input v-model="logistical.expNo" auto-complete="off"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogLogistical">取消</el-button>
        <el-button type="primary" @click.native="sendDelivery">确定发货</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderList, deletOrder, cancelOrder, sendDelivery } from '@/api/user'
import waves from '@/directive/waves/index.js' // 水波纹指令
import PayPage from '@/components/PayPage'

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
            orderFlag: 1,
            activityName: ''
          },
          createBy: this.$store.getters.userInfo.id
        }
      },
      orederList: [],
      rowIndex: 0,
      logistical: {
        orderId: '',
        isDelivery: 0,
        expCompany: '',
        expNo: ''
      },
      orderDetail: null,
      order: null,
      checkstandLogo: process.env.BASE_API + '/upload/1/1515129793070.jpg',
      dialogOrderDetail: false,
      dialogPay: false,
      dialogLogistical: false,

      logisticalRules: {
        expCompany: [
          { required: true, message: '物流公司不能为空', trigger: 'change' }
        ],
        expNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
      }
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
    delivery(orderId, rowIndex) {
      this.logistical.orderId = orderId
      this.rowIndex = rowIndex
      this.dialogLogistical = true
    },
    sendDelivery() {
      this.$refs["logistical"].validate((valid) => {
        if (valid) {
          sendDelivery(this.logistical).then(res => {
            const data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.orederList.splice(this.rowIndex, 1, data.data)
              this.dialogLogistical = false
              this.$message({
                type: 'success',
                message: '操纵成功'
              })
            }
          })
        }
      })
    },
    closeDialogLogistical() {
      this.$refs["logistical"].resetFields()
      this.dialogLogistical = false
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
