<template>
  <div class="advert-container">
    <div class="advert-container-advertBox" id="advert-container-advertBox">
      <div class="articles">
        <div class="articles-label">
          <label>图文列表</label>
          <el-button type="primary" size="mini" :style="{'border-radius':0}" icon="el-icon-edit-outline" @click="handleAdd">新建图文</el-button>
        </div>
        <div class="articles-items" v-loading="articleLoading">
          <div class="articles-items-box" v-for="(item,index) in advertList" @click="selectAdvert(item,index)" :class="{'articles-items-box-active':item.id === advert.id}">
            <div class="articles-items-box-img" :style="{'background-image':'url(\''+item.advertPic+'\')'}">
              <div v-if="!item.advertPic" class="isNone"><i class="el-icon-picture"></i></div>
              <div class="articles-items-box-img-title">{{item.title || '标题'}}</div>
            </div>
            <div class="articles-items-box-delete" v-if="advertList.length !== 1 || advertList[0].id !== ''">
              <svg-icon icon-class="delete" @click.native="deleteAdvert(index)"></svg-icon>
            </div>
          </div>
        </div>
        <div v-if="advertList.length > 0">
          <el-pagination small :page-size="listQuery.size" :current-page.sync="listQuery.current" @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="fixedAdvertTemp" id="fixedAdvertTemp"></div>
    <div>
      <ueditor class="ueditor" v-model="advert.content" :title="advert.title" :author="advert.author" :hasChange="hasChange" @inputTitleAndAuthor="inputTitleAndAuthor" @ready="ueditorReady" @selectChange="()=>{ this.hasChange = true }">
      </ueditor>
      <div class="ueditor-line"></div>
      <div class="coverPhoto">
        <div class="coverPhoto-label">
          上传封面
        </div>
        <div class="coverPhoto-btn">
          <el-button :style="{'border-radius':0}" @click="getContentImg" type="info" plain size="small">从正文中选择</el-button>
          <el-button :style="{'border-radius':0}" type="info" plain size="small">从图片库选择</el-button>
        </div>
        <img v-if='!!advert.advertPic' style="width: 100px;height: 100px;margin-top: 10px;" :src="advert.advertPic">
      </div>
    </div>
    <div class="advert-container-toolsBox" id="advert-container-toolsBox">
      <div class="plugin">
        <div class="plugin-label">
          <label>多媒体</label>
        </div>
        <div class="plugin-items">
          <div class="plugin-items-boxbar">
            <EditorImage @successCBK="imageSuccessCBK"></EditorImage>
          </div>
          <div class="plugin-items-boxbar">
            <Ticket @addTicket="addTicket"></Ticket>
          </div>
        </div>
      </div>
    </div>
    <div class="advert-container-footer">
      <div class="advert-container-footer-toolbar">
        <el-button :style="{'border-radius':0,padding:'8px 30px'}" type="primary" :loading="saveLoading" @click="saveAdvert">保 存</el-button>
        <el-button :style="{'border-radius':0,padding:'8px 30px'}" type="info" plain>预 览</el-button>
      </div>
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogAdvertPic" @close="()=>{this.step=1;this.selectedAdvertPhoto=''}">
      <div class="picSelect">
        <span class="picSelect-title" :style="step === 1?'color:#4fc08d':''">1 从正文选择封面</span>
        <span :style="step === 2?'color:#4fc08d':''">2 裁切封面</span>
      </div>
      <div class="imgPanelBox">
        <div class="imgPanelBox-step1" v-if="step === 1">
          <div class="imgPanelBox-step1-imgItems" v-if="imgList.length > 0">
            <span v-for="item in imgList" @click="selectAdvertPhoto(item.src)" :class="{'is-select':selectedAdvertPhoto === item.src}" class="imgPanelBox-step1-imgItems-item" :style="{'background-image':'url(\''+item.src+'\')'}"></span>
          </div>
          <div class="imgPanelBox-step1-noImgItems" v-else>
            <span>正文中无可用做封面的图片</span>
          </div>
        </div>
        <div class="imgPanelBox-step2" v-if="step === 2">
          <croppa placeholder="选择图片" :placeholder-font-size="25" :show-remove-button="false" :disable-click-to-choose="true" :initial-image="selectedAdvertPhoto" canvas-color="transparent" v-model="croppa" ref="myCroppa">
          </croppa>
        </div>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" v-if="step === 1" :style="{'border-radius':0,padding:'8px 25px'}" :disabled="selectedAdvertPhoto === ''" @click="()=>{this.step = 2}">下一步</el-button>
        <el-button type="info" v-if="step === 2" :style="{'border-radius':0,padding:'8px 25px'}" :disabled="selectedAdvertPhoto === ''" @click="()=>{this.step = 1}">上一步</el-button>
        <el-button type="primary" v-if="step === 2" :style="{'border-radius':0,padding:'8px 30px'}" :disabled="selectedAdvertPhoto === ''" @click="sureSelectedAdvertPhoto">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Ueditor from '@/components/Ueditor'
import EditorImage from '@/components/Ueditor/plugin/editorImage'
import Ticket from '@/components/Ueditor/plugin/ticket'

import { getObjectPosition, getElement } from '@/components/Ueditor/domUtils'
import { mapGetters } from 'vuex'
import { getAdvertList, saveAdvert, deleteAdvert } from '@/api/advert'

export default {
  components: {
    Ueditor,
    EditorImage,
    Ticket
  },
  data() {
    return {
      editor: null,
      articleLoading: false, //文章加载loadong
      saveLoading: false,
      baseUrl: process.env.BASE_API,
      dialogAdvertPic: false,

      step: 1,

      total: 0,
      listQuery: {
        size: 3,
        current: 1,
        condition: {
          type: 0,
          user: this.$store.getters.userInfo.id
        }
      },
      advertList: [],
      imgList: [],
      selectedAdvertPhoto: '',
      advert: {
        title: '',
        author: '',
        content: ''
      },
      croppa: null,
      hasChange: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    getList() {
      this.articleLoading = true
      getAdvertList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.advertList = data.datas.records.length > 0 ? data.datas.records : [{
            id: '',
            user: this.$store.getters.userInfo.id,
            title: '',
            author: '',
            content: '',
            advertPic: '',
            type: 0
          }]
          this.selectAdvert(data.datas.records[0])
          this.total = data.datas.total
          this.articleLoading = false
        }
      }).catch(error => {
        this.articleLoading = false
      })
    },
    selectAdvert(advert, index) {
      this.hasChange = false
      this.advert = _.clone(advert) || {
        id: '',
        user: this.$store.getters.userInfo.id,
        title: '',
        author: '',
        content: '',
        advertPic: '',
        type: 0
      }
    },
    handleAdd() {
      if (this.advertList[0].id === '') {
        this.$message({ message: '您有未保存的新软文', type: 'warning' });
        return
      }
      const newAdvert = {
        id: '',
        user: this.$store.getters.userInfo.id,
        title: '',
        author: '',
        content: '',
        advertPic: '',
        type: 0
      }
      this.advertList.unshift(newAdvert)
      this.selectAdvert(newAdvert)
    },
    saveAdvert() {
      if (!this.advert.title || this.advert.title.length > 64 || !this.editor.hasContents() || (this.advert.author && this.advert.author.length > 8)) {
        this.$message.error('标题，正文不能为空，且标题不能超过64个字，作者不超过8个字')
        return
      }
      this.saveLoading = true
      saveAdvert(this.advert).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.$notify({ title: '成功', message: '保存成功', type: 'success' })
          this.getList()
        } else {
          this.$message.error('保存失败')
        }
        this.saveLoading = false
      }).catch(error => {
        this.$message.error('保存失败')
        this.saveLoading = false
      })
    },
    deleteAdvert(index) {
      this.$confirm('此操作将永久删除该图文, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.advertList[index].id) {
          this.advertList.splice(index, 1)
          this.$nextTick(() => {
            this.selectAdvert(this.advertList[index] || {
              id: '',
              user: this.$store.getters.userInfo.id,
              title: '',
              author: '',
              content: '',
              advertPic: '',
              type: 0
            })
          })
          this.$message({ type: 'success', message: '删除成功!' })
        } else {
          deleteAdvert(this.advertList[index].id).then(res => {
            const data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$message({ type: 'success', message: '删除成功!' })
              this.getList()
            } else {
              this.$message.error('删除失败')
            }
          }).catch(error => {
            this.$message.error('删除失败')
          })
        }
      }).catch(() => {
        // this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    selectAdvertPhoto(photoSrc) {
      if (photoSrc === this.selectedAdvertPhoto) this.selectedAdvertPhoto = ''
      else this.selectedAdvertPhoto = photoSrc
    },
    sureSelectedAdvertPhoto() {
      this.dialogAdvertPic = false
      let url = this.croppa.generateDataUrl()
      this.advert.advertPic = url
    },
    handleCurrentChange() {
      this.getList()
    },
    ueditorReady(editor) {
      this.editor = editor
      UE.dom.domUtils.on(this.editor.body, "click", function(e) {
        editor.setEnabled()
      })
      this.getList()
    },
    inputTitleAndAuthor(val) {
      if (!val.inputType) this.advert.title = val.value
      else this.advert.author = val.value
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        this.editor.execCommand('inserthtml', `<img style="max-width:100%;max-height:${570/(v.width/v.height) +'px'};" src="${process.env.BASE_API+v.url}" >`)
      })
    },
    addTicket() {
      // this.editor.execCommand('inserthtml', `<section style="text-align: center;max-height:200px;background: red; width: 90%" contenteditable='false'>测试测试</section>`)
      this.$message({ type: 'warning', message: '暂未上线' })
    },
    getContentImg() {
      this.imgList = this.editor.body.getElementsByTagName('img')
      this.dialogAdvertPic = true
    }
  }
}

</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.advert-container {
  background: #fff;
  display: flex;
  padding-bottom: 100px;
  &-advertBox {
    width: 250px; // border-right: 1px solid #e7e7eb;
    padding: 20px;
    .articles {
      &-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &-items {
        margin: 20px 0; // height: 600px;
        // overflow: scroll;
        // &::-webkit-scrollbar {
        //   //滚动条的宽度
        //   // position: absolute;
        //   width: 7px;
        //   height: 7px;
        // }
        // &::-webkit-scrollbar-track-piece {
        //   //滚动条凹槽的颜色，还可以设置边框属性
        //   background-color: #fff;
        // }
        // &::-webkit-scrollbar-thumb {
        //   //滚动条的设置
        //   border-radius: 10px;
        //   background: rgba(0, 0, 0, 0.5); // background: #fff;
        //   background-clip: padding-box;
        //   min-height: 28px;
        // }
        &-box {
          box-sizing: border-box;
          width: 210px;
          height: 134px;
          padding: 10px;
          border: 1px solid #e7e7eb;
          cursor: pointer;
          position: relative;
          &-active {
            border: 2px solid #43b548 !important;
          }
          &:hover {
            .articles-items-box-delete {
              display: block;
            }
          }
          &-delete {
            text-align: right;
            font-size: 30px;
            padding: 0 10px;
            height: 38px;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 100;
          }
          &-img {
            position: relative;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            .isNone {
              width: 100%;
              height: 100%;
              background: #ececec;
              color: #c0c0c0;
              font-size: 40px;
              line-height: 110px;
              text-align: center;
            }
            &-title {
              height: 25px;
              line-height: 25px;
              font-size: 14px;
              font-weight: 500;
              position: absolute;
              bottom: 0;
              right: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.6);
              text-align: left;
              color: #fff;
              padding: 0 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  &-toolsBox {
    width: 200px;
    height: 600px;
    padding: 20px; // border-left: 1px solid #e7e7eb;
    .plugin {
      &-items {
        margin: 20px 0;
        &-boxbar {
          margin-bottom: 5px;
        }
      }
    }
  }

  .ueditor-line {
    margin: 15px 90px;
    border-top: 1px solid #e7e7eb
  }
  .coverPhoto {
    padding: 0 90px;
    &-btn {
      margin-top: 15px;
    }
  }
  &-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    border-top: 1px solid #d9dadc;
    &-toolbar {
      width: 1200px;
      margin: auto;
      text-align: right;
      padding: 32px 210px 32px 250px;
      background: #fff;
    }
  }
}

.picSelect {
  text-align: center;
  border-bottom: 1px solid #e4e8eb;
  padding-bottom: 20px;
  &-title {
    &:after {
      content: "";
      display: inline-block;
      vertical-align: middle;
      margin: 10px;
      width: 20px;
      border-bottom: 1px solid #e4e8eb;
    }
  }
}

.imgPanelBox {
  &-step1 {
    &-imgItems {
      height: 350px;
      padding-top: 20px;
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      &-item {
        display: block;
        width: 115px;
        height: 115px;
        margin: 10px 0 0 10px;
        border: 1px dashed #e7e7eb;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        position: relative;
        &:hover {
          cursor: pointer;
        }
      }
    }
    &-noImgItems {
      line-height: 350px;
      text-align: center;
    }
  }

  &-step2 {
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.imgPanel {
  margin-top: 20px;
  overflow-y: scroll;
  height: 350px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  &-item {
    display: block;
    width: 115px;
    height: 115px;
    margin: 10px 0 0 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: relative;
    &:hover {
      cursor: pointer;
    }
  }
}

.is-select {
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
    bottom: 0;
    right: 0;
  }
}

.fixedAdvert {
  position: fixed;
  top: 0;
}

.fixedTools {
  position: fixed;
  top: 0;
}

.fixedAdvertTemp {
  width: 250px;
  height: 600px;
  display: none;
}

</style>

