<template>
  <div>
    <div class="filter-container">
      <el-input size="small" @keyup.enter.native="handleFilter" v-model="listQuery.condition.name" style="width: 200px;" class="filter-item" placeholder="标题">
      </el-input>
      <el-button class="filter-item" size="small" type="primary" v-waves @click.native="handleFilter" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" size="small" @click="handleCreate" type="primary" icon="el-icon-plus">创建活动</el-button>
      <div style="margin: 10px 0;">
        <el-radio-group v-model="listQuery.condition.status" style="margin-left:20px;" @change="handlerRadioChange">
          <el-radio label="">所有活动</el-radio>
          <el-radio :label="0">正进行</el-radio>
          <el-radio :label="3">未开始</el-radio>
          <el-radio :label="1">已停用</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-table v-loading="loading" border :data="activity" style="width: 100%" @expand-change="selectedAdvert">
      <el-table-column type="expand" label="广告" width="100px" cell-style="tableExpand">
        <template slot-scope="scope">
          <div style="position: relative;" v-if="selectedActivity">
            <advert-select v-model="scope.row.advert"></advert-select>
            <div style="position: absolute;left: 210px;bottom: 0;">
              <el-button size="small" type="primary" :disabled="selectedActivity.advert === activity[scope.$index].advert" @click="updateActivity(scope.row)">保存修改</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="活动名"></el-table-column>
      <el-table-column align="center" label="活动类型">
        <template slot-scope="scope">
          <span>{{scope.row.type | getTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | getActivityStatus(true)">
            {{scope.row.status | getActivityStatus(false)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openActivityDialog(scope.row)">详细</el-button>
          <el-button type="text" size="small" v-if="scope.row.status===1||scope.row.status===2" @click.native="handleDelete(scope.row.id)">删除</el-button>
          <el-tooltip :content="scope.row.status == 0?'已开启':'已停用'" placement="top" style="margin-left:10px;">
            <el-switch v-if="scope.row.status === 1 || scope.row.status === 0" v-model="scope.row.status" @change="handleChangeStatus(scope.row.id,$event,scope.$index)" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog v-if="selectedActivity" title="活动详情" class="activity-dialog" :visible.sync="dialogActivity">
      <el-row>
        <el-col :span="6">
          总金额：{{selectedActivity.totalMoney / 100}}
        </el-col>
        <el-col :span="6">
          总二维码数：{{selectedActivity.qrCount}}
        </el-col>
        <el-col :span="6">
          已扫描金额：{{selectedActivity.scanedMoney / 100}}
        </el-col>
        <el-col :span="6">
          已扫码二维码数：{{selectedActivity.scanedCount}}
        </el-col>
      </el-row>
      </el-tab-pane>
      <div style="margin-top: 20px;">
        <span>筛选：</span>
        <el-select size="mini" v-model="dateType" @change="handleChange" placeholder="请选择">
          <el-option label="最近一周" :value="1"></el-option>
          <el-option label="最近一月" :value="2"></el-option>
          <el-option label="最近一年" :value="3"></el-option>
        </el-select>
        <div id="countData" style="margin-top:20px;" :style="{width:'100%',height:'400px'}"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getActivityList, changeStatus, deleteActivity, getNoScanedInfo, initStatisticsByActivityId, updateActivity } from '@/api/activity'
import { getTotalOptions } from '@/views/dashboard/statistics'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { validateAdLink } from '@/utils/validate'
import AdvertSelect from '@/components/AdvertSelect'

export default {
  directives: {
    waves
  },
  components: {
    AdvertSelect
  },
  data() {
    return {
      loading: false,
      total: NaN,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          name: '',
          status: '',
          user: this.$store.getters.userInfo.id
        }
      },
      activity: [],
      dialogActivity: false,
      selectedActivity: null,
      dateType: 1,
      uploadUrl: process.env.BASE_API + '/api/upload/uploadImg/' + this.$store.getters.userInfo.id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getActivityList(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.activity = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/activity/create' })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handlerRadioChange() {
      this.getList()
    },
    handleChangeStatus(id, status, index) {
      changeStatus(id, status).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.activity[index].status = data.data
          this.$message({
            type: data.data === 0 ? 'success' : 'warning',
            message: data.data === 0 ? '已启用' : '已停用'
          })
        } else {
          this.activity[index].status = status
          this.$message.error('操作失败')
        }
      })
    },
    handleDelete(id) {
      let that = this
      return new Promise((resolve, reject) => {
        getNoScanedInfo(id).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === "success") {
            resolve(data.data)
          }
        })
      }).then(res => {
        that.$confirm('本次活动已使用二维码' + res.scanedCount + '张，金额' + res.scanedMoney / 100 + '元，删除活动剩余' + res.restCount + '张二维码将会永久失效，未使用金额' + res.restMoney / 100 + '元将会返回您的账户，是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteActivity(id).then(response => {
            const data = response.data
            if (data.code === 0 && data.msg === "success") {
              that.getList()
              that.$store.dispatch('GetUserInfo')
              that.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        })
      })
    },
    openActivityDialog(activity) {
      this.dialogActivity = true
      this.selectedActivity = activity
      this.initStatisticsByActivityId()
    },
    selectedAdvert(row) {
      this.selectedActivity = _.clone(row)
    },
    handleChange() {
      this.initStatisticsByActivityId()
    },
    initStatisticsByActivityId() {
      initStatisticsByActivityId(this.selectedActivity.id, this.dateType).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          let countData = this.$echarts.init(document.getElementById('countData'))
          countData.setOption(getTotalOptions(data.data.totalData))
        }
      })
    },
    updateActivity(activity) {
      updateActivity(activity).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogActivity = false
        }
      })
    },
    //--------------------------------------图片上传--------------------------------------
    handleAvatarSuccess(res, file, fileList) {
      // this.activity.rule[index].adImg = URL.createObjectURL(file.raw);
      this.selectedActivity.adImg = process.env.BASE_API + res.data //upload
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}

</script>
<style lang="scss" scoped>
.activity-dialog {
  padding: 0 20px 20px 20px;
}

</style>
<style type="text/css" lang='scss'>
/*.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}*/

.el-table__expanded-cell {
  background: #fafbf9;
  &:hover {
    background-color: #fafbf9!important;
  }
}

</style>
