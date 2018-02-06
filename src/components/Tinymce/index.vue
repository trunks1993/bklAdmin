<template>
  <div class="editor-container">
    <div class="articles" v-loading="loading">
      <div style="padding-bottom: 20px;">
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
    <div class="components"></div>
  </div>
</template>
<script>
import editorImage from './components/editorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import { getArticleList, saveArticle, deleteArticle } from '@/api/advert'

export default {
  name: 'tinymce',
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
      editorFocus: true,
      hasChange: false,
      hasInit: false,
      inputActive: 0,
      total: 0,
      listQuery: {
        size: 10,
        current: 1,
        condition: {
          user: this.$store.getters.userInfo.id
        }
      },
      articleList: [],
      article: {
        id: '',
        user: this.$store.getters.userInfo.id,
        title: '',
        author: '',
        content: '',
        articlePic: ''
      },
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    article(val) {
      if (this.hasInit) {
        this.$nextTick(() => {
          // alert(window.tinymce.getContent({ format: 'text' }))
          // console.log(window.tinymce.get(this.tinymceId))
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
      getArticleList(this.listQuery).then(res => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.articleList = data.datas.records
          this.selectArticle(data.datas.records[0] || {
            id: '',
            user: this.$store.getters.userInfo.id,
            title: '',
            author: '',
            content: '',
            articlePic: ''
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
        articlePic: ''
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
      saveArticle(this.article).then(res => {
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
        inline: true,
        fixed_toolbar_container: '.tools',
        menubar: false,
        toolbar: toolbar,
        object_resizing: 'img',
        plugins: plugins,
        indentation: '20pt',
        content_css: '/static/tinymce/skins/myTinymce.css',
        language: 'zh_CN',
        templates: [
          { title: '软文模版', description: 'Some desc 1', content: 'My content' },
          { title: '文件模版', description: 'Some desc 2', url: 'development.html' }
        ],
        setup: ed => {
          ed.addButton('myIndent', {
            title: '首行缩进',
            icon: 'indent',
            onclick: function() {
              ed.execCommand('mceStageindent');
            }
          })
          ed.addCommand('mceStageindent', function() {
            //基本变量设置
            var ed = tinyMCE.activeEditor,
              d = ed.dom,
              s = ed.selection,
              e, iv, iu, st;
            st = s.getNode().style;
            var allinline = d.select('p');
            var bfontSize = document.body.currentStyle ? document.body.currentStyle['fontSize'] :
              document.defaultView.getComputedStyle(document.body, false)['fontSize'];
            iu = /[a-z%]+$/i.exec(bfontSize); //获得文字的大小
            iv = parseInt(bfontSize) * 2; //俩个文字的宽度
            //实现在选取段落时候缩进段落，不选取则缩进所有段落。
            if (s.getContent() != "") {
              if (st.textIndent == "" || st.textIndent == "undefined") {
                st.textIndent = iv + iu;
              } else {
                st.textIndent = '';
              }
            } else {
              if (st.textIndent == "" || st.textIndent == "undefined") {
                d.setStyle(allinline, 'text-indent', iv + iu);
              } else {
                d.setStyle(allinline, 'text-indent', '');
              }
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
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
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
              articlePic: ''
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
      const dom = document.getElementById(this.tinymceId)
      const imgList = window.tinymce.dom.DomQuery('img',dom)
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
  .articles {
    flex: 1.5;
    width: 300px;
    height: 688px;
    overflow-y: scroll;
    padding: 20px;
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
      padding: 9px 9px;
      border: 2px solid #43b548;
    }
    &-item {
      position: relative;
      border: 1px solid #e7e7eb;
      width: 100%;
      padding: 10px;
      cursor: pointer;
      height: 165px;
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
    padding: 20px 20px 100px 20px;
    flex: 3;
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
      }
    }
  }
  .components {
    flex: 1.5;
    height: 600px;
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
    border: 0!important;
    border-radius: 0;
    padding: 0;
  }
  &-title {
    margin: 20px 0 15px 0;
    input {
      font-size: 20px;
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
