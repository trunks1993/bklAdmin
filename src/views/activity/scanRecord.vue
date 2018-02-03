<template>
  <div>
    <div class="filter-container">
      <div style="display:flex;">
        <el-input size="small" @keyup.enter.native="handleFilter" v-model="listQuery.condition.number" style="width: 200px;" class="filter-item" placeholder="二维码编号">
        </el-input>
        <div style="margin:0 10px;">
          <el-select v-model="listQuery.condition.activity" clearable @change="handleFilter" size="small" placeholder="选择活动名">
            <el-option v-for="item in activitySearchList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div style="margin-right:10px;">
          <el-select v-model="listQuery.condition.scanFlag" clearable @clear="handleClear" @change="handleFilter" size="small" placeholder="全部二维码">
            <el-option :value="0" label="未扫描"></el-option>
            <el-option :value="1" label="已扫描"></el-option>
          </el-select>
        </div>
        <div>
          <el-button class="filter-item" size="small" type="primary" v-waves @click.native="handleFilter" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div style="margin: 10px 0;" v-if="!!listQuery.condition.scanFlag">
        <el-radio-group v-model="listQuery.condition.shareFlag" style="margin-left:20px;" @change="handlerRadioChange">
          <el-radio label="">全部二维码</el-radio>
          <el-radio :label="0">未领取</el-radio>
          <el-radio :label="1">已领取</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-table :data="scanRecordList" v-loading="loading" element-loading-text="给我一点时间" border fit style="width: 100%">
      <el-table-column align="center" label="活动名">
        <template slot-scope="scope">
          <span>{{scope.row.vo.activityName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码编号">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
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
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.vo.customerGender==1?'男':scope.row.vo.customerGender==2?'女':'未知'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扫码时间" width="150">
        <template slot-scope="scope">
          <span>{{!scope.row.scanFlag?'':scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扫描次数">
        <template slot-scope="scope">
          <span>{{scope.row.scanedTimes}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否领取">
        <template slot-scope="scope">
          <span>{{!scope.row.shareFlag?'未领取':'已领取'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扫码金额">
        <template slot-scope="scope">
          <span>{{scope.row.scanResult / 100}}</span>
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
import { getScanRecordList } from '@/api/user'
import { getActivitySearchList } from '@/api/activity'
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
          vo: { user: this.$store.getters.userInfo.id },
          shareFlag: '',
          number: '',
          activity: '',
          scanFlag: ''
        }
      },
      activitySearchList: [],
      scanRecordList: []
    }
  },
  created() {
    this.getActivitySearchList()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getScanRecordList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.scanRecordList = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(res => {
        this.loading = false
      })
    },
    getActivitySearchList() {
      getActivitySearchList(this.$store.getters.userInfo.id).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === "success") {
          this.activitySearchList = data.data
        }
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
    handlerRadioChange() {
      this.getList()
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleClear() {
      this.listQuery.current = 1
      this.listQuery.condition.shareFlag = ''
      this.getList()
    }
  }
}
</script>