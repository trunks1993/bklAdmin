<template>
  <div class="editor-container">
    <div class="articles"></div>
    <div class="tinymce">
      <div class="tools" :class="{'dask': !editorFocus}" v-loading="tinyToolsLoading"></div>
      <div class="tinymce-head">
        <div class="tinymce-head-title">
          <input placeholder="请在这里输入标题" @click="() => {this.editorFocus = false}" max-length="64"></input>
        </div>
        <div class="tinymce-head-writer">
          <input placeholder="请输入作者" @click="() => {this.editorFocus = false}"></input>
        </div>
      </div>
      <div class="tinymce-line"></div>
      <!-- tinymce挂载位置 -->
      <div class="tinymce-main" :class="{'plac':content.length === 30}"></div>
    </div>
    <div class="components"></div>
  </div>
</template>
<script>
import editorImage from './components/editorImage'
import plugins from './plugins'
import toolbar from './toolbar'

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
      tinyToolsLoading: false,
      editorFocus: true,
      hasChange: false,
      hasInit: false,
      content: '',
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    // value(val) {
    //   if (!this.hasChange && this.hasInit) {
    //     this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
    //   }
    // }

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
    initTinymce() {
      const _this = this
      _this.tinyToolsLoading = true
      window.tinymce.init({
        selector: '.tinymce-main',
        height: 360,
        inline: true,
        fixed_toolbar_container: '.tools',
        // toolbar: this.toolbar,
        menubar: false,
        toolbar: toolbar,
        plugins: plugins,
        language: 'zh_CN',
        theme_advanced_fonts: "宋体=宋体;微软雅黑=微软雅黑;新宋体=新宋体;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n",
        templates: [
          { title: '软文模版', description: 'Some desc 1', content: 'My content' },
          { title: '文件模版', description: 'Some desc 2', url: 'development.html' }
        ],
        init_instance_callback: editor => {
          // if (_this.value) {
          //   editor.setContent(_this.value)
          // }
          // _this.hasInit = true
          tinymce.activeEditor.focus()
          editor.on('NodeChange Change KeyUp', () => {
            // this.hasChange = true
            // this.$emit('input', editor.getContent({ format: 'raw' })) //传递到父组件
            _this.content = editor.getContent({ format: 'raw' })
          })
          editor.on('click', () => {
            _this.editorFocus = true
          })
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
    flex: 1;
    height: 600px;
  }
  .tinymce {
    padding: 0 20px 100px 20px;
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
      min-height: 300px;
      border-bottom: 1px solid #e7e7eb;
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
    flex: 1;
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
