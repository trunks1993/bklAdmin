<template>
  <div>
    <div class="advert" v-loading="advertLoading">
      <div v-if="!advertRes" class="advert-plus" @click="openSelectDialog">
        <i class="el-icon-document"></i>
      </div>
      <div v-else class="advert-res" :style="{'background-image':'url(\''+advertRes.advertPic+'\')'}" @click="openSelectDialog(advertRes)">
        <span class="advert-res-title">{{advertRes.title}}</span>
      </div>
    </div>
    <el-dialog title="广告设置" class="dialogAdvertSelect" :visible.sync="dialogAdvertSelect" v-if="dialogAdvertSelect" @close="handleDialogClose">
      <el-tabs tab-position="top" @tab-click="handleTabClick" v-model="activeName">
        <el-tab-pane label="微页面" v-loading="advertLoading">
          <div v-if="advertList.length>0" class="advertList-content">
            <span v-for="item in advertList" @click="selectAdvert(item)" :class="{active:advertSelect.id === item.id}" class="advertList-content-item" :style="{'background-image':'url(\''+item.advertPic+'\')'}">
                <span class="advertList-content-title">{{item.title}}</span>
            </span>
          </div>
          <div v-else class="advertList-nothing">
            <el-button type="text" @click="toAdvert">啥也没有，立即创建图文</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="外链" v-loading="advertLoading">
          <div v-if="advertList.length>0 && !newLink" class="advertList-content">
            <span v-for="item in advertList" @click="selectAdvert(item)" :class="{active:advertSelect.id === item.id}" class="advertList-content-item" :style="{'background-image':'url(\''+item.advertPic+'\')'}">
              <span class="advertList-content-title">{{item.title}}</span>
            </span>
            <span class="advertList-content-add" @click="()=>{this.newLink = true}"><i class="el-icon-plus"></i></span>
          </div>
          <div v-else class="advertList-addLink">
            <el-form :model="advert" :rules="rules" ref="advert" size="small" style="width: 100%;" label-width="150px" label-position="right">
              <el-form-item label="广告图片:">
                <croppa placeholder="选择图片" :placeholder-font-size="25" canvas-color="transparent" v-model="croppa" ref="myCroppa">
          </croppa>
              </el-form-item>
              <el-form-item label="广告标题:" prop="title">
                <el-input type="textarea" style="width:220px" placeholder="不超过64个字符" v-model="advert.title"></el-input>
              </el-form-item>
              <el-form-item label="广告链接:" prop="url">
                <el-input v-model="advert.url" style="width:220px" placeholder="http://www.xxxx.com 或 https://...">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" style="width:100%;text-align: center;">
        <template v-if="listQuery.condition.type === 1 && (newLink || advertList.length === 0)">
          <el-button size="small" type="primary" @click="saveAdvert">保存</el-button>
          <el-button v-if="advertList.length !== 0" size="small" type="info" @click="cancelAddLink">取消</el-button>
        </template>
        <el-button size="small" type="primary" @click="sureSelect" :disabled="!advertSelect.id" v-else>确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAdvertList, saveAdvert, deleteAdvert, getAdvert } from '@/api/advert'
import { validateAdLink } from '@/utils/validate'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogAdvertSelect: false,
      advertLoading: false,
      paneTab: 0,
      newLink: false,
      croppa: {},
      advertList: [],
      total: null,
      listQuery: {
        size: 20,
        current: 1,
        condition: {
          type: 0,
          user: this.$store.getters.userInfo.id
        }
      },
      imageUrl: '',
      uploadUrl: process.env.BASE_API + '/api/upload/uploadImg/' + this.$store.getters.userInfo.id,
      baseUrl: process.env.BASE_API,
      advert: {
        id: '',
        user: this.$store.getters.userInfo.id,
        title: '',
        url: '',
        advertPic: '',
        type: 1
      },
      previewImg: '',
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: 'blur' },
          { max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        url: [{ required: true, validator: validateAdLink, trigger: 'blur' }]
      },
      advertRes: '',
      advertSelect: '',
      activeName: '0'
    }
  },
  created() {
    if (this.value) this.getAdvert()
  },
  methods: {
    getAdvert() {
      this.advertLoading = true
      getAdvert(this.value).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.advertSelect = data.data
          this.advertRes = data.data
          this.advertLoading = false
        }
      })
    },
    getAdvertList() {
      this.advertLoading = true
      getAdvertList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === "success") {
          this.advertList = data.datas.records
          this.total = data.datas.total
          this.advertLoading = false
        }
      })
    },
    openSelectDialog(advertRes) {
      if (advertRes.type === 1) {
        this.listQuery.condition.type = 1
        this.activeName = '1'
      }
      this.advertSelect = advertRes
      this.getAdvertList()
      this.dialogAdvertSelect = true
    },
    toAdvert() {
      // this.$router.push({ path: '/advert/index' })
      window.open("#/advert/index")

    },
    handleTabClick(val) {
      this.newLink = false
      if (val.paneName === '0') {
        this.listQuery.condition.type = 0
      } else {
        this.listQuery.condition.type = 1
      }
      this.getAdvertList()
    },
    saveAdvert() {
      this.$refs["advert"].validate((valid) => {
        if (valid) {
          const url = this.croppa.generateDataUrl()
          this.advert.advertPic = url || ''
          saveAdvert(this.advert).then(res => {
            const data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$notify({ title: '成功', message: '保存成功', type: 'success' })
              this.newLink = false
              this.croppa = {}
              this.getAdvertList()
              this.$refs["advert"].resetFields()
            } else {
              this.$message.error('保存失败')
            }
          }).catch(error => {
            this.$message.error('保存失败')
          })
        }
      })
    },
    selectAdvert(advert) {
      this.advertSelect = advert.id === this.advertSelect.id ? '' : advert
    },
    sureSelect() {
      this.$emit('input', this.advertSelect.id)
      this.advertRes = this.advertSelect
      this.dialogAdvertSelect = false
      this.handleDialogClose()
    },
    handleDialogClose() {
      this.listQuery.condition.type = 0
      this.activeName = '0'
      this.newLink = false
    },
    cancelAddLink() {
      this.newLink = false
      this.$refs["advert"].resetFields()
    }
  }
}

</script>
<style lang="scss" scoped>
.advert {
  width: 200px;
  height: 200px;
  padding: 5px;
  background: #fff;
  border-radius: 5px 10px 10px 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  &:before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -10px;
    left: 8px;
    padding: 0;
    border-bottom: 5px solid #FFFFFF;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    display: block;
    content: '';
    z-index: 12;
  }
  &:after {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -12px;
    left: 7px;
    padding: 0;
    border-bottom: 6px solid #ebeef5;
    border-top: 6px solid transparent;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    display: block;
    content: '';
    z-index: 10
  }
  &-plus {
    width: 100%;
    height: 100%;
    font-size: 28px;
    color: #8c939d;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    &:hover {
      cursor: pointer;
      border-color: #4fc08d;
    }
  }
  &-res {
    width: 100%;
    height: 100%;
    border: 1px dashed #d9d9d9;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    &:hover {
      cursor: pointer;
      border-color: #4fc08d;
    }
    &-title {
      height: 30px;
      display: block;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: left;
      line-height: 30px;
      color: #fff;
      padding: 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
  }
}

.advertList-content {
  height: 300px;
  overflow-y: scroll;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  &-item {
    display: block;
    width: 115px;
    height: 115px;
    margin: 10px 0 0 10px;
    border: 1px solid #d9d9d9;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: relative;
    &:hover {
      cursor: pointer;
    }
  }
  &-title {
    width: 100%;
    height: 20px;
    display: block;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0;
    text-align: left;
    line-height: 20px;
    color: #fff;
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }
  &-add {
    width: 115px;
    height: 115px;
    margin: 10px 0 0 10px;
    border: 1px dashed #d9d9d9;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8c939d;
    &:hover {
      cursor: pointer;
      border-color: #409EFF;
    }
  }

  .active {
    &:after {
      content: ' ';
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: url(https://res.wx.qq.com/mpres/htmledition/images/icon/common/icon_card_selected3a7b38.png) no-repeat 0 0;
      background-position: center center;
    }
    &:before {
      content: ' ';
      display: inline-block;
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 0;
      bottom: 20px;
      right: 0;
    }
  }
}

.advertList-nothing {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advertList-addLink {
  display: flex;
  justify-content: center;
  width: 100%; //头像上传
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative; // overflow: hidden;
    width: 115px;
    height: 115px;
    &:hover {
      border-color: #409EFF;
    }
    .avatar {
      width: 115px;
      height: 115px;
      display: block;
    }
    &-icon {
      font-size: 25px;
      color: #8c939d;
      width: 115px;
      height: 115px;
      line-height: 115px;
      text-align: center;
    }
  }
}

</style>
<style>
  /*.dialogAdvertSelect .el-dialog__body {
    padding: 0;
  }*/
</style>
