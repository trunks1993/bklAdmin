<template>
  <div class="editor-container">
    <div class="articles" v-loading="loading">
      <div style="padding-bottom: 20px;">软文列表</div>
      <div class="articles-item" v-for="item in articleList" :class="{active:item.id === selectId}" @click="selectArticle(item)">
        <div class="articles-item-main">
          <img :src="item.articlePic">
          <div class="articles-item-main-title">{{item.title}}</div>
        </div>
        <div class="articles-item-delete">
          <svg-icon icon-class="delete" @click.native="deleteArt"></svg-icon>
        </div>
      </div>
      <div class="articles-pagination" v-if="articleList.length > 0">
        <el-pagination small :page-size="listQuery.size" :current-page.sync="listQuery.current" @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="tinymce">
      <div class="tools" :class="{'dask': !editorFocus}" v-loading="tinyToolsLoading"></div>
      <div class="tinymce-head">
        <div class="tinymce-head-title">
          <!-- <input placeholder="请在这里输入标题" @click="() => {this.editorFocus = false}" max-length="64"></input> -->
          <el-input v-model="article.title" @focus="() => {this.editorFocus = false}" placeholder="请在这里输入标题"></el-input>
        </div>
        <div class="tinymce-head-writer">
          <el-input v-model="article.author" @focus="() => {this.editorFocus = false}" placeholder="请输入作者"></el-input>
          <!-- <input placeholder="请输入作者" @click="() => {this.editorFocus = false}"></input> -->
        </div>
      </div>
      <div class="tinymce-line"></div>
      <!-- tinymce挂载位置 -->
      <div class="tinymce-main" :id="tinymceId" :class="{'plac':article.content.length === 30}"></div>
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
import { getArticleList, saveArticle } from '@/api/advert'

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
      selectId: '',
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    article(val) {
      // if (!this.hasChange) {
      this.$nextTick(() => {
        // alert(window.tinymce.getContent({ format: 'text' }))
        // console.log(window.tinymce.get(this.tinymceId))
        window.tinymce.get(this.tinymceId).setContent(val.content)
      })
      // }
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
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
      })
    },
    saveArticle() {
      this.saveLoading = true
      saveArticle(this.article).then(res => {
        this.saveLoading = false
        this.getList()
      })
    },
    selectArticle(article) {
      this.selectId = article.id
      this.article = article
    },
    initTinymce() {
      const _this = this
      _this.tinyToolsLoading = true
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: 360,
        inline: true,
        fixed_toolbar_container: '.tools',
        menubar: false,
        toolbar: toolbar,
        plugins: plugins,
        content_css: '/static/tinymce/skins/myTinymce.css',
        language: 'zh_CN',
        templates: [
          { title: '软文模版', description: 'Some desc 1', content: 'My content' },
          { title: '文件模版', description: 'Some desc 2', url: 'development.html' }
        ],
        init_instance_callback: editor => {
          // if (_this.value) {
          //   editor.setContent(_this.value)
          // }
          // _this.hasInit = true

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
              if (evt.shiftKey) {
                editor.execCommand('Outdent');
              } else {
                editor.execCommand('Indent');
              }
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
    deleteArt() {
      alert(1)
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
    height: 600px;
    overflow: scroll;
    padding: 20px;
    border-right: 1px solid #e7e7eb;
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
          text-align: center;
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
    &-head {
      input {
        margin: 4px 0;
        width: 100%;
        background-color: transparent;
        border: 0;
        outline: 0;
        overflow: visible;
        color: #222;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
      &-title {
        margin: 20px 0 15px 0;
        input {
          font-size: 22px;
          height: 46px;
          line-height: 46px;
        }
      }
      &-writer {
        margin: 15px 0;
        input {
          height: 22px;
        }
      }
    }
    &-line {
      border-top: 1px solid #e7e7eb;
      margin: 15px 0;
    }
    &-main {
      position: relative;
      height: 450px;
      overflow: scroll;
      border-bottom: 1px solid #e7e7eb;
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

</style>
