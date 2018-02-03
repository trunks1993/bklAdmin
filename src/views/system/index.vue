<template>
    <tree-grid :menu-list="menuList" :treeLoading="treeLoading" @initTree="getMenuList"></tree-grid>
</template>
<script>
import TreeGrid from '@/components/TreeGrid'
import { getMenuTree } from '@/api/menu'

export default {
  components: { TreeGrid },
  name: 'hello',
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menuList: [],
      treeLoading: false
    }
  },
  methods: {
    getMenuList() {
      this.treeLoading = true
      getMenuTree().then(response => {
        let data = response.data
        if (data.code === 0 && data.msg === "success") {
          this.menuList = data.data
        }
        this.treeLoading = false
      }).catch(error => {
        this.treeLoading = false
      })
    }
  }
}

</script>
