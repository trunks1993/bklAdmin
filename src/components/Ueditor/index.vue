<template>
  <div ref="editor"></div>
</template>
<script>
import { createInput, getElement } from './domUtils'
import config from './config'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: ''
    },
    hasChange: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {　　　　
    return {
      editor: null,
      id: 'ueditor-' + +new Date()
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 保证 this.$el 已经插入文档
      this.$refs.editor.id = this.id;
      this.editor = UE.getEditor(this.id, config)
      this.editor.ready(function() {
        createInput(this.editor, this) //初始化加载input
        this.editor.addListener("contentChange", function() {
          const content = this.editor.getContent()
          this.$emit('input', content)
        }.bind(this))
        this.$emit('ready', this.editor)
      }.bind(this))
    })
  },
  watch: {
    value(val, oldVal) {
      if (!this.hasChange) {
        this.editor = UE.getEditor(this.id, config)
        this.editor.setContent(val || '')
        this.$emit('selectChange')
      }
    },
    title(val, oldVal) {
      getElement('editor-input-title').value = val
    },
    author(val, oldVal) {
      getElement('editor-input-author').value = val
    }
  },
  destroyed() {
    // 将editor进行销毁
    this.editor.destroy();
  }
}

</script>
<style lang="scss">
.fixedToolBar {
  width: 748px !important;
  z-index: 1000;
  position: fixed !important;
  top: 0;
  box-shadow: 0 1px 3px #f8f8f8;
}

.editor-input {
  margin: 20px 0 15px;
  padding: 0 90px;
  &-title {
    outline: none;
    width: 100%;
    margin: 4px 0;
    font-size: 22px;
    height: 46px;
    line-height: 46px;
    font-weight: 400;
    border: 0;
    &::-webkit-input-placeholder {
      color: #999;
      font-size: 22px;
    }
  }
}

.editor-titleInput {
  margin: 20px 0 15px;
  padding: 0 90px;
  &-title {
    color: #222;
    outline: none;
    width: 100%;
    margin: 4px 0;
    font-size: 22px;
    height: 46px;
    line-height: 46px;
    font-weight: 400;
    border: 0;
    &::-webkit-input-placeholder {
      color: #999;
      font-size: 22px;
    }
  }
}

.editor-authorInput {
  margin: 15px 0 10px;
  padding: 0 90px 10px;
  &-author {
    color: #222;
    outline: none;
    width: 100%;
    height: 22px;
    margin: 4px 0;
    border: 0;
    &::-webkit-input-placeholder {
      color: #999; // font-size: 22px;
    }
  }
}

.editor-line {
  border-top: 1px solid #e7e7eb;
  margin: 0 90px;
  margin-bottom: 15px;
}

</style>
