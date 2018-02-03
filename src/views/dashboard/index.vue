<template>
  <div class="dashboard-container" v-loading="countLoading">
    <div class="dashboard-total">
      <el-card class="dashboard-total-card">
        <div slot="header" class="clearfix">
          <span>扫码量</span>
        </div>
        <div class="total">
          <span v-if="totalScanData">
            {{totalScanData.total}}
          </span>
          <span v-else>0</span>
        </div>
        <div class="count-container">
          <template v-if="totalScanData">
            <span>今：{{totalScanData.today}}</span>
            <span>昨：{{totalScanData.yesterday}}</span>
            <span>周：{{totalScanData.week}}</span>
          </template>
          <template v-else>
            <span>今：0</span>
            <span>昨：0</span>
            <span>周：0</span>
          </template>
        </div>
      </el-card>
      <el-card class="dashboard-total-card">
        <div slot="header" class="clearfix">
          <span>广告分享量</span>
        </div>
        <div class="total">
          <span v-if="totalShareData">
            {{totalShareData.total}}
          </span>
          <span v-else>0</span>
        </div>
        <div class="count-container">
          <template v-if="totalShareData">
            <span>今：{{totalShareData.today}}</span>
            <span>昨：{{totalShareData.yesterday}}</span>
            <span>周：{{totalShareData.week}}</span>
          </template>
          <template v-else>
            <span>今：0</span>
            <span>昨：0</span>
            <span>周：0</span>
          </template>
        </div>
      </el-card>
      <el-card class="dashboard-total-card">
        <div slot="header" class="clearfix">
          <span>朋友圈点击量</span>
        </div>
        <div class="total">
          <span v-if="totalClickData">
            {{totalClickData.total}}
          </span>
          <span v-else>0</span>
        </div>
        <div class="count-container">
          <template v-if="totalClickData">
            <span>今：{{totalClickData.today}}</span>
            <span>昨：{{totalClickData.yesterday}}</span>
            <span>周：{{totalClickData.week}}</span>
          </template>
          <template v-else>
            <span>今：0</span>
            <span>昨：0</span>
            <span>周：0</span>
          </template>
        </div>
      </el-card>
      <el-card class="dashboard-total-card">
        <div slot="header" class="clearfix">
          <span>小程序访问量</span>
        </div>
        <!-- <div class="total">
          2000
        </div>
        <div class="count-container">
          <span>今：0</span>
          <span>昨：0</span>
          <span>周：0</span>
        </div> -->
        <span>暂未开通</span>
      </el-card>
    </div>
    <div class="dashboard-charts">
      <el-row>
        <el-col :span="12">
          <div id="scanDate" :style="{width:'100%',height:'300px'}"></div>
        </el-col>
        <el-col :span="12">
          <div id="clickDate" :style="{width:'100%',height:'300px'}"></div>
        </el-col>
        <el-col :span="24" style="margin-top:20px;">
          <span>筛选：</span>
          <el-select size="mini" v-model="dateType" @change="handleChange" placeholder="请选择">
            <el-option label="最近一周" :value="1"></el-option>
            <el-option label="最近一月" :value="2"></el-option>
            <el-option label="最近一年" :value="3"></el-option>
          </el-select>
          <div id="myChart" :style="{width:'100%',height:'500px'}"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTotalOptions, getClickOptions, getScanOptions } from './statistics'
import { initStatistics } from '@/api/user'

export default {
  name: 'dashboard',
  data() {
    return {
      dateType: 1,
      countLoading: false,
      totalClickData: null,
      totalScanData: null,
      totalShareData: null
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.initStatistics()
  },
  methods: {
    initStatistics() {
      this.countLoading = true
      initStatistics(this.userInfo.id, this.dateType).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          let totalDate = this.$echarts.init(document.getElementById('myChart'))
          totalDate.setOption(getTotalOptions(data.data.totalData))
          let clickDate = this.$echarts.init(document.getElementById('clickDate'))
          clickDate.setOption(getClickOptions(data.data.clickData))
          let scanDate = this.$echarts.init(document.getElementById('scanDate'))
          scanDate.setOption(getScanOptions(data.data.scanData))
          this.totalClickData = data.data.totalClickData
          this.totalScanData = data.data.totalScanData
          this.totalShareData = data.data.totalShareData
          this.countLoading = false

        }
      })
    },
    handleChange() {
      this.initStatistics()
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-total {
    display: flex;
    justify-content: space-between;
    &-card {
      width: 24%;
      .total {
        text-align: center;
      }
      .count-container {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
      }
    }
  }
  &-charts {
    margin-top: 40px;
  }
}

</style>
