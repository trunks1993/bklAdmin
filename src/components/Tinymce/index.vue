<template>
  <div class="editor-container">
    <div class="articles" v-loading="loading">
      <div style="padding-bottom: 20px;width: 220px;">
        <span>软文列表</span>
        <el-button style="float:right;" size="mini" type="primary" icon="el-icon-edit-outline" @click="handleAdd">新建软文</el-button>
      </div>
      <div class="articles-item" v-for="(item,index) in articleList" :class="{active:item.id === article.id}" @click="selectArticle(item)">
        <div class="articles-item-main">
          <img :src="item.articlePic">
          <div class="articles-item-main-title">{{item.title}}</div>
        </div>
        <div class="articles-item-delete">
          <svg-icon icon-class="delete" @click.native="deleteArt(index)"></svg-icon>
        </div>
      </div>
      <div class="articles-pagination" v-if="articleList.length > 0">
        <el-pagination small :page-size="listQuery.size" :current-page.sync="listQuery.current" @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="tinymce">
      <div class="tools" :class="{'dask': !editorFocus}" v-loading="tinyToolsLoading"></div>
      <div class="tinymceContent">
        <div class="tinymceContent-head">
          <div class="tinymceContent-head-title">
            <el-input v-model="article.title" @focus="() => {this.editorFocus = false,this.inputActive = 1}" @blur="() => {this.editorFocus = false,this.inputActive = 0}" placeholder="请在这里输入标题">
              <span v-if="inputActive === 1 || article.title&&article.title.length > 64" :style="article.title&&article.title.length > 64?'color:#e15f63':''" slot="append">
                  {{!article.title?0:article.title.length}}/64
              </span>
            </el-input>
          </div>
          <div class="tinymceContent-head-writer">
            <el-input v-model="article.author" @focus="() => {this.editorFocus = false,this.inputActive = 2}" @blur="() => {this.editorFocus = false,this.inputActive = 0}" placeholder="请输入作者">
              <span v-if="inputActive === 2 || article.author&&article.author.length > 8" :style="article.author&&article.author.length > 8?'color:#e15f63':''" slot="append">
                  {{!article.author?0:article.author.length}}/8
              </span>
            </el-input>
          </div>
        </div>
        <div class="tinymce-line"></div>
        <!-- tinymce挂载位置 -->
        <div class="tinymceContent-main" :id="tinymceId" :class="{'plac':(article.content.length === 61 && !editorFocus)}"></div>
        <div class="tinymce-line"></div>
        <div class="tinymceContent-photo">
          <div>封面</div>
          <div style="margin-top: 10px;">
            <el-button size="mini" @click="getContentImg">从正文中选择</el-button>
            <el-button size="mini">从图库中选择</el-button>
          </div>
        </div>
      </div>
      <div class="tinymce-btn">
        <el-button type="primary" :loading="saveLoading" @click="saveArticle">保 存</el-button>
        <el-button type="info" plain>预 览</el-button>
      </div>
    </div>
    <div class="components">
      <div class="editor-custom-btn-container">
        <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>
      </div>
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogArticlePic" @close="()=>{this.selectSrc = ''}">
      <div class="picSelect"><span class="picSelect-title">1 从正文选择封面</span><span>2 裁切封面</span></div>
      <div class="imgPanel" v-if="imgList.length > 0">
        <span v-for="item in imgList" @click="selectPic(item.src)" :class="{activePic:selectSrc === item.src}" class="imgPanel-item" :style="{'background-image':'url(\''+item.src+'\')'}"></span>
      </div>
      <div class="imgPanel" style="align-items:center" v-else>
        <span>正文中无可用做封面的图片</span>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" :disabled="selectSrc === ''" @click="surePic">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editorImage from './components/editorImage'
import { initAddCommand } from './util'
import plugins from './plugins'
import toolbar from './toolbar'
import { getAdvertList, saveAdvert, deleteAdvert } from '@/api/advert'

export default {
  // name: 'tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
        return ['removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code', 'bold italic blockquote | h2 p  media link | alignleft aligncenter alignright']
      }
    },
    menubar: {
      default: ''
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      loading: false,
      saveLoading: false,
      tinyToolsLoading: false,
      dialogArticlePic: false,
      editorFocus: true,
      hasChange: false,
      hasInit: false,
      inputActive: 0,
      total: 0,
      listQuery: {
        size: 10,
        current: 1,
        condition: {
          type: 0,
          user: this.$store.getters.userInfo.id
        }
      },
      imgList: [],
      selectSrc: '',
      articleList: [],
      article: {
        id: '',
        user: this.$store.getters.userInfo.id,
        title: '',
        author: '',
        content: '',
        articlePic: '',
        type: 0
      },
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    article(val) {
      if (this.hasInit) {
        this.$nextTick(() => {
          window.tinymce.get(this.tinymceId).setContent(val.content)
        })
      }
    }

  },
  created() {
    this.getList()
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  methods: {
    getList() {
      this.loading = true
      getAdvertList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.articleList = data.datas.records
          this.selectArticle(data.datas.records[0] || {
            id: '',
            user: this.$store.getters.userInfo.id,
            title: '',
            author: '',
            content: '',
            articlePic: '',
            type: 0
          })
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
      })
    },
    handleAdd() {
      const newArticle = {
        id: '',
        user: this.$store.getters.userInfo.id,
        title: '',
        author: '',
        content: '',
        articlePic: '',
        type: 0
      }
      this.articleList.unshift(newArticle)
      this.article = newArticle
    },
    saveArticle() {
      if (!this.article.title || this.article.title.length > 64 || this.article.content.length === 61 || (this.article.author && this.article.author.length > 8)) {
        this.$message.error('标题，正文不能为空，且标题不能超过64个字，作者不超过8个字')
        return
      }
      this.saveLoading = true
      saveAdvert(this.article).then(res => {
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
    selectArticle(article) {
      this.article = article
    },
    initTinymce() {
      const _this = this
      _this.tinyToolsLoading = true
      window.tinymce.init({
        selector: `#${_this.tinymceId}`,
        width: 558,
        max_width: 558,
        inline: true,
        fixed_toolbar_container: '.tools',
        menubar: false,
        toolbar: toolbar,
        plugins: plugins,
        object_resizing: 'img',
        image_advtab: true,
        fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px',
        content_css: '/static/tinymce/skins/myTinymce.css',
        language: 'zh_CN',
        templates: [
          { title: '软文模版', description: 'Some desc 1', content: 'My content' },
          { title: '文件模版', description: 'Some desc 2', url: 'development.html' }
        ],
        setup: ed => {
          initAddCommand(ed)
          ed.addButton('myIndent', {
            title: '首行缩进',
            icon: 'indent',
            onclick: function() {
              ed.execCommand('mceStageindent');
            }
          })
          ed.addButton('myImgTool', {
            title: '图片自适应手机',
            icon: 'image',
            onclick: function() {
              ed.execCommand('mceStageImg');
            }
          })
        },
        init_instance_callback: editor => {
          _this.hasInit = true
          // 初始化获取文本内容
          editor.setContent(_this.article.content)
          // 初始化获取焦点
          tinymce.activeEditor.focus()
          // keyup抬起绑定content
          editor.on('NodeChange Change KeyUp', () => {
            // this.hasChange = true
            // this.$emit('input', editor.getContent({ format: 'raw' })) //传递到父组件
            _this.article.content = editor.getContent()
          })
          editor.on('click', () => {
            _this.editorFocus = true
          })
          // table缩进键
          editor.on('keydown', function(evt) {
            if (evt.keyCode == 9) {
              editor.execCommand('insertText', true, "    ");
              evt.preventDefault();
              evt.stopPropagation();
            }
          })
          _this.tinyToolsLoading = false
        }
      })
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        console.log(v)
        window.tinymce.get(_this.tinymceId).insertContent(`<img width="100%" height="auto" style="max-width:558px;max-height:${558/(v.width/v.height) +'px'};" src="${process.env.BASE_API+v.url}" >`)
      })
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    deleteArt(index) {
      this.$confirm('此操作将永久删除该软文, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.articleList[index].id) {
          this.articleList.splice(index, 1)
          this.$nextTick(() => {
            this.selectArticle(this.articleList[index] || {
              id: '',
              user: this.$store.getters.userInfo.id,
              title: '',
              author: '',
              content: '',
              articlePic: '',
              type: 0
            })
          })
          this.$message({ type: 'success', message: '删除成功!' })
        } else {
          deleteArticle(this.articleList[index].id).then(res => {
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
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    getContentImg() {
      // const dom = document.getElementById(this.tinymceId)
      // const imgList = window.tinymce.dom.DomQuery('img', dom)
      const imgList = tinyMCE.activeEditor.dom.select('img')
      this.imgList = imgList
      this.dialogArticlePic = true
    },
    selectPic(src) {
      if (src === this.selectSrc) this.selectSrc = ''
      else this.selectSrc = src
    },
    surePic() {
      this.dialogArticlePic = false
      this.article.articlePic = this.selectSrc
      this.selectSrc = ''
    }
  },
  destroyed() {
    this.destroyTinymce()
  }
}

</script>
<style lang="scss" scoped>
.editor-container {
  display: flex;
  justify-content: center;
  .articles {
    width: 240px;
    height: 688px;
    overflow-y: scroll;
    padding: 20px 20px 20px 0;
    border-right: 1px solid #e7e7eb;
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 7px;
      height: 7px;
    }
    &::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
      //滚动条的设置
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.5); // background: #fff;
      background-clip: padding-box;
      min-height: 28px;
    }
    .active {
      border-top-width: 0;
      border: 2px solid #43b548;
    }
    &-item {
      position: relative;
      border: 1px solid #e7e7eb;
      box-sizing: border-box;
      width: 220px;
      padding: 10px;
      cursor: pointer;
      height: 220px;
      &-main {
        width: 100%;
        position: relative;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
        &-title {
          height: 28px;
          line-height: 28px;
          font-size: 14px;
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
      &:hover {
        .articles-item-delete {
          display: block;
        }
      }
    }
    &-pagination {
      width: 100%;
      margin-top: 20px;
    }
  }
  .tinymce {
    padding: 20px 20px 100px 20px; // flex: 3;
    .tools {
      border-bottom: 1px solid #e7e7eb;
      .mce-tinymce {
        border-width: 0;
      }
    }
    .dask {
      position: relative;
      &:after {
        background-color: rgba(255, 255, 255, 0.6);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        content: ' ';
      }
    }
    .tinymceContent {
      height: 600px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        //滚动条的宽度
        width: 7px;
        height: 7px;
      }
      &::-webkit-scrollbar-track-piece {
        //滚动条凹槽的颜色，还可以设置边框属性
        background-color: #fff;
      }
      &::-webkit-scrollbar-thumb {
        //滚动条的设置
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.5); // background: #fff;
        background-clip: padding-box;
        min-height: 28px;
      }
      &-main {
        position: relative;
        min-height: 350px;
        width: 588px;
      }
    }
    &-line {
      border-top: 1px solid #e7e7eb;
      margin: 15px 0;
    }
    &-btn {
      padding: 20px 0;
      text-align: center;
    }
    .plac {
      &:after {
        content: "从这里开始写正文";
        color: #999;
        position: absolute;
        top: 0;
        left: 15px;
      }
    }
  }
  .components {
    height: 600px;
    width: 130px;
    padding: 20px 0;
  }

  .picSelect {
    text-align: center;
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
  .activePic {
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
  .imgPanel {
    margin-top: 20px;
    overflow-y: scroll;
    height: 350px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
}

</style>
<style lang="scss">
//样式覆盖
.tools {
  min-height: 68px;
  .mce-tinymce {
    border: 0!important;
    display: block!important;
    .mce-container {
      border: 0!important;
    }
  }
}

.mce-edit-focus {
  outline: none !important;
}

.tinymceContent-head {
  .el-input-group__append {
    border: 0;
    background: none;
  }
  input {
        color:#222;

    border: 0!important;
    border-radius: 0; // padding: 0;
  }
  &-title {
    margin: 20px 0 15px 0;
    input {
      font-size: 20px;
      font-weight: 400;
      &::-webkit-input-placeholder {
        color: #999;
        font-size: 20px;
      }
    }
  }
  &-writer {
    margin: 15px 0;
  }
}

</style>
