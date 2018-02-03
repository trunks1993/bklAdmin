<template>
  <scroll-pane class='tags-view-container' :style="Array.from(visitedViews).length>0?'height:35px;':''">
    <router-link class="tags-view-item" :class="isActive(tag)?'active':''" v-for="(tag,index) in Array.from(visitedViews)" :to="tag.path" :key="tag.path" @contextmenu.native="handleRightClick($event,tag,isActive(tag))">
      {{ tag.title }}
      <span class='el-icon-close' @click='closeViewTags(tag,$event)'></span>
    </router-link>
    <Contextmenu :contextMenuData="menuData" @ref="refresh" @delCurrent="delCurrent" @delOther="delOther" @delRight="delRight" @delAll="delAll"></Contextmenu>
  </scroll-pane>
</template>
<script>
import ScrollPane from '@/components/ScrollPane'
import Contextmenu from '@/components/Contextmenu'

export default {
  components: { ScrollPane, Contextmenu },
  computed: {
    visitedViews() {
      return this.$store.state.app.visitedViews
    }
  },
  mounted() {
    this.addViewTags()
  },
  data() {
    return {
      menuData: {
        menuName: 'name1',
        axios: { x: null, y: null },
        menulists: [
          { fnHandler: 'ref', btnName: '重新加载', hidden: false },
          { fnHandler: 'delCurrent', btnName: '关闭标签页', hidden: false },
          { fnHandler: 'delOther', btnName: '关闭其它标签页', hidden: false },
          { fnHandler: 'delRight', btnName: '关闭右侧标签页', hidden: false },
          { fnHandler: 'delAll', btnName: '关闭所有', hidden: false }
        ],
        tag: null
      }
    }
  },
  methods: {
    handleDel(view, type) {
      this.$store.dispatch('delVisitedViews', { view: view, type: type }).then((views) => {
        if (!views.length > 0) {
          this.$router.push('/')
        } else {
          if (type === 'CURRENT') {
            if (this.isActive(view)) {
              const latestView = views.slice(-1)[0]
              if (latestView) {
                this.$router.push(latestView.path)
              } else {
                this.$router.push('/')
              }
            }
          }
          if (!views.some(v => v.path === this.$route.path)) {
            this.$router.push(view.path)
          }
        }
      })
    },
    refresh(tag) {
      this.$router.go(0)
    },
    delCurrent(view) {
      this.handleDel(view, 'CURRENT')
    },
    delOther(view) {
      this.handleDel(view, 'OTHER')
    },
    delRight(view) {
      this.handleDel(view, 'RIGHT')
    },
    delAll() {
      this.handleDel(null, 'ALL')
    },
    closeViewTags(view, $event) {
      this.handleDel(view, 'CURRENT')
      $event.preventDefault()
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    handleRightClick(e, tag, isActive) {
      e.preventDefault()
      const x = e.clientX
      const y = e.clientY
      this.menuData.axios = {
        x,
        y
      }
      this.menuData.tag = tag
      this.menuData.menulists[0].hidden = !isActive
    }

  },
  watch: {
    $route() {
      this.addViewTags()
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  background: #fff; // height: 35px;
  // border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-item {
    display: inline-block;
    position: relative;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    border-bottom: none;
    cursor: default;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 9px;
    &:first-of-type {
      margin-left: 15px;
    }
    &.active {
      background-color: #4fc08d;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
  }
}

</style>
<style rel="stylesheet/scss" lang="scss">
.tags-view-container {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}

</style>
