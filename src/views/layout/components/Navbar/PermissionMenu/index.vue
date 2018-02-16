<template>
  <el-menu class="el-menu-demo" mode="horizontal" @select="clickMenu" active-text-color="#4fc08d">
    <el-menu-item index="/dashboard">
      <template slot="title">
        首页
      </template>
    </el-menu-item>
    <template v-for="item in routers">
      <el-menu-item v-if="item.hidden!=='true'&&item.children&&item.children.length===1" :index="item.path+'/'+item.children[0].path">
        <template slot="title">
                {{item.meta.title}}
        <div v-if="item.path+'/'+item.children[0].path ==='/advert/index'" style="position:absolute;top:-17px;left:20px;">
          <img style="width: 40px;" :src="rec">
        </div>
      </template>
      </el-menu-item>
      <el-submenu v-if="item.hidden!=='true'&&item.children&&item.children.length>1" :index="item.redirect" :show-timeout="100">
        <template slot="title">{{item.meta.title}}</template>
        <el-menu-item v-for="childItem in item.children" :key="childItem.name" :index="item.path+'/'+childItem.path">{{childItem.meta.title}}</el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>
<script>
import { mapGetters } from 'vuex'
import rec from '@/assets/rec.png'

export default {
  computed: {
    ...mapGetters([
      'routers',
    ])
  },
  data() {
    return {
      rec
    }
  },
  methods: {
    clickMenu(index) {
      this.$router.push({ path: index })
    }
  }
}

</script>
<style lang="scss" scope>


</style>
