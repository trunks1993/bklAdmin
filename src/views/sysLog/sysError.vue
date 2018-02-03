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
            <el-option label="扫码错误" :value="0"></el-option>
            <el-option label="系统错误" :value="1"></el-option>
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
    <el-table :data="errorList" v-loading="loading" element-loading-text="给我一点时间" border fit style="width: 100%">
      <el-table-column align="center" label="错误时间" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="错误类型">
        <template slot-scope="scope">
          <span>{{scope.row.type === 0?'扫码错误':'系统错误'}}</span>
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
      <el-table-column align="center" label="错误详情">
        <template slot-scope="scope">
          <span>{{scope.row.stackTrace}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="错误消息">
        <template slot-scope="scope">
          <span>{{scope.row.errorMsg}}</span>
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
import { getErrorList } from '@/api/system'
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
      errorList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getErrorList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.errorList = data.datas.records
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
