<template>
  <div>
    <div class="filter-container">
      <div style="display:flex;">
        <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" v-model="listQuery.condition.customer" placeholder="openId">
        </el-input>
        <div style="margin:0 10px;">
          <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" v-model="listQuery.condition.qrCode" placeholder="二维码编号">
          </el-input>
        </div>
        <div>
          <el-select v-model="listQuery.condition.type" clearable @change="handleFilter" size="small" placeholder="错误类型">
            <el-option label="正常扫描" value="success"></el-option>
            <el-option label="红包被自己领取" value="already_scaned"></el-option>
            <el-option label="红包被他人领取" value="others_scaned"></el-option>
            <el-option label="超过扫码限制" value="over_limit"></el-option>
            <el-option label="用户被锁定" value="customer_lock"></el-option>

            <el-option label="活动未开始" value="not_start"></el-option>
            <el-option label="活动暂停" value="activity_stop"></el-option>
            <el-option label="活动已结束" value="activity_finish"></el-option>
            
            <el-option label="错误的code" value="error_code"></el-option>
            <el-option label="无效二维码" value="invalid_qrcode"></el-option>
          </el-select>
        </div>
        <div style="margin:0 10px;">
          <el-button class="filter-item" type="primary" size="small" @click="handleFilter" v-waves icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div style="margin:10px 0;">
        <el-date-picker id="times" size="small" v-model="listQuery.condition.vo.times" @change="handleFilter" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <el-table :data="scanLogList" v-loading="loading" element-loading-text="给我一点时间" border fit style="width: 100%">
      <el-table-column align="center" label="记录时间" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备">
        <template slot-scope="scope">
          <span>{{scope.row.deviceInfo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码编号">
        <template slot-scope="scope">
          <span>{{scope.row.qrCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="openId">
        <template slot-scope="scope">
          <span>{{scope.row.customer}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信头像">
        <template slot-scope="scope">
          <img v-if="!!scope.row.vo.customerPhoto" :src="scope.row.vo.customerPhoto" style="width:50px;height:50px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信昵称">
        <template slot-scope="scope">
          <span>{{scope.row.vo.customerName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="返回的msg">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扫码数据">
        <template slot-scope="scope">
          <span>{{scope.row.statusCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常">
        <template slot-scope="scope">
          <el-tag :type="scope.row | getErrorStatus(true)">
            {{scope.row | getErrorStatus(false)}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!loading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getScanLogList } from '@/api/system'
import waves from '@/directive/waves/index.js' // 水波纹指令

export default {
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      total: 0,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          vo: { times: [] },
          type: '',
          customer: '',
          qrCode: ''
        }
      },
      scanLogList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getScanLogList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.scanLogList = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(res => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}

</script>
