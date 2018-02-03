<template>
  <div class="menu-container" :class="'vue-contextmenuName-' + contextMenuData.menuName">
    <div v-for="item in contextMenuData.menulists" v-if="!item.hidden"
    class="menu-container-item" @click="fnHandler(item,contextMenuData.tag)">
      {{item.btnName}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'contextmenu',
  props: {
    contextMenuData: {
      type: Object,
      requred: false,
      default () {
        return {
          menuName: null,
          axios: {
            x: null,
            y: null
          },
          menulists: [{
              fnHandler: 'adddata',
              btnName: 'New'
            },
            {
              fnHandler: 'savedata',
              btnName: 'Save'
            }
          ],
          tag: null
        }
      }
    },
    transferIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'contextMenuData.axios' (val) {
      const x = val.x
      const y = val.y
      let _this = this
      const index = _this.transferIndex
      const menuName = 'vue-contextmenuName-' + _this.contextMenuData.menuName
      const menu = document.getElementsByClassName(menuName)[index]
      menu.style.display = 'block'
      menu.style.left = x + 'px'
      menu.style.top = y + 'px'
      document.addEventListener('click', function() {
        menu.style.display = 'none'
      }, false)
    }
  },
  methods: {
    fnHandler(item,tag) {
      this.$emit(item.fnHandler,tag)
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.menu-container {
  display: none;
  position: fixed;
  z-index: 9999;
  background: #fff;
  width: 150px;
  font-size: 14px;
  text-align: left;
  box-shadow: 1px 1px 1px 1px #cccccc;
  padding: 5px 0;
  border-radius: 5px;
  .menu-container-item {
    padding: 5px 20px;
    cursor: default;
    &:hover {
      background: #42b983;
      color: #fff;
    }
  }
}

</style>
