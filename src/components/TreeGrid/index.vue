<template>
  <div>
    <div class="filter-container">
      <el-button plain class="filter-item" size="small" style="margin-left: 10px;" @click="openDialog('新建菜单')" type="primary" icon="el-icon-edit">新建菜单</el-button>
    </div>
    <el-table v-loading="treeLoading" :data="formatMenuList" style="width: 100%" :cell-style="{'padding':'6px 0'}" :row-style="showTr">
      <el-table-column label="图标/名称" width="160">
        <template slot-scope="scope">
          <el-button type="text" size="mini" :style="{ 'margin-left' : scope.row._level*16 + 'px'}" @click="scope.row.children?toggle(scope.$index):''">
            <svg-icon icon-class="BlockArrow" v-if="scope.row.children" :class="scope.row._expanded?'trControl is_expanded':'trControl'"></svg-icon>
            <svg-icon v-if="scope.row.meta.icon" :icon-class="scope.row.meta.icon" class="menu-icon"></svg-icon>
            {{scope.row.meta.title}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center" width="180">
        <template slot-scope="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>
      <el-table-column label="组件" align="center" width="180">
        <template slot-scope="scope">
          {{scope.row.component}}
        </template>
      </el-table-column>
      <el-table-column label="重定向" align="center" width="200">
        <template slot-scope="scope">
          {{scope.row.redirect}}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="!scope.row.hidden?'success':'danger'">{{!scope.row.hidden?'显示':'隐藏'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="openDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row.meta.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 菜单表单 -->
    <el-dialog :title="dialog_title" @close="handleClose" :visible.sync="dialogFormVisible">
      <el-form status-icon :model="menu" :rules="menuRules" ref="menu" size="small" label-position="right" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="上级菜单" prop="parentTitle">
          <el-input v-model="menu.parentTitle" readonly @focus="treeDialog=true">
            <el-button slot="append" @click="()=>{this.menu.parentTitle = '';this.menu.parentId = ''}" icon="el-icon-close"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名" prop="title">
          <el-input v-model="menu.title"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="menu.path"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menu.icon" readonly @focus="iconDialog=true">
            <svg-icon :icon-class="menu.icon" slot="prepend"></svg-icon>
            <el-button slot="append" @click="()=>{this.menu.icon = ''}" icon="el-icon-close"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component" v-if="menu.parentId!==''">
          <!-- <el-autocomplete class="inline-input" @select="selectComponent" v-model="menu.component" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete> -->
          <el-input v-model="menu.component" ></el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component" v-else>
          <el-input v-model="menu.component = 'layout/Layout'" readonly></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="menu.redirect"></el-input>
        </el-form-item>
        <el-form-item label="命名路由" prop="name">
          <el-input v-model="menu.name"></el-input>
        </el-form-item>
        <el-form-item label="可见" prop="hidden">
          <el-switch v-model="menu.hidden" active-color="#ff4949" inactive-color="#13ce66">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择父级菜单 -->
    <el-dialog title="所有菜单" :visible.sync="treeDialog" width="300px">
      <el-tree :data="menuList" node-key="id" ref="tree" highlight-current :props="defaultProps" :expand-on-click-node="false" @current-change="selectParent">
      </el-tree>
      <div slot="footer">
        <el-button size="mini" @click="makeSureParent(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="makeSureParent(true)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择图标 -->
    <el-dialog title="所有图标" :visible.sync="iconDialog">
      <el-radio-group v-model="iconTemp" size="mini" class="radio-icon-group">
        <el-col v-for="icon in iconsMap" :span="6" :key="icon+Date.now()">
          <el-radio-button :label="icon">
            <svg-icon :icon-class="icon"></svg-icon><span style="margin-left:5px;">{{icon}}</span>
          </el-radio-button>
        </el-col>
      </el-radio-group>
      <div slot="footer">
        <el-button size="mini" @click="makeSureIcon(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="makeSureIcon(true)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { dataTransfer } from '@/utils'
import icons from './generateIconsView'
import { save, deleteMenu } from '@/api/menu'
// import { getToken } from '@/utils/auth'

export default {
  name: 'TreeGrid',
  props: {
    menuList: {
      type: Array
    },
    treeLoading: {
      type: Boolean
    }
  },
  computed: {
    formatMenuList() {
      return dataTransfer(this.menuList)
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      treeDialog: false,
      iconDialog: false,
      dialog_title: "",
      iconsMap: [],
      components: [],
      menu: {
        id: "",
        parentId: "",
        parentTitle: "",
        title: "",
        path: "",
        component: "layout",
        hidden: false,
        icon: "",
        name: "",
        redirect: "",
        createBy: this.$store.getters.userInfo.id,
        updateBy: this.$store.getters.userInfo.id
      },
      parentTemp: {
        parentTitle: "",
        parentId: ""
      },
      iconTemp: "",
      defaultProps: {
        children: 'children',
        label: (data, node) => {
          return data.meta.title
        }
      },
      menuRules: {
        title: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '组件不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '路由命名不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map((i) => {
      return i.default.id.split('-')[1]
    })
    this.iconsMap = iconsMap
  },
  methods: {
    // 显示行  
    showTr: ({ row, rowIndex }) => {
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
      row._show = show
      return show ? '' : 'display:none;'
    },
    toggle(trIndex) {
      let record = this.formatMenuList[trIndex]
      record._expanded = !record._expanded
    },
    openDialog(data) {
      if (data === "新建菜单") {
        this.dialog_title = data
        this.dialogFormVisible = true
      } else {
        this.dialog_title = "编辑菜单"
        this.dialogFormVisible = true
        setTimeout(() => {
          this.menu.id = data.meta.id
          this.menu.parentTitle = data._parent ? data._parent.meta.title : ""
          this.menu.parentId = data._parent ? data._parent.meta.id : ""
          this.menu.title = data.meta.title
          this.menu.path = data.path
          this.menu.component = data.component
          this.menu.hidden = data.hidden
          this.menu.icon = data.meta.icon ? data.meta.icon : ""
          this.menu.redirect = data.redirect
          this.menu.name = data.name
          this.menu.createBy = data.meta.createBy
        })

      }
    },
    handleClose() {
      var that = this
      that.resetForm()
      setTimeout(() => {
        that.$refs['menu'].clearValidate()
      })
    },
    selectParent(parent, node) {
      this.parentTemp.parentTitle = parent.meta.title
      this.parentTemp.parentId = parent.meta.id
    },
    makeSureParent(flag) {
      if (flag) {
        this.menu.parentId = this.parentTemp.parentId
        this.menu.parentTitle = this.parentTemp.parentTitle
        this.treeDialog = false
      } else {
        this.treeDialog = false
      }
    },
    makeSureIcon(flag) {
      if (flag) {
        if (this.iconTemp) this.menu.icon = this.iconTemp
        this.iconTemp = ""
        this.iconDialog = false
      } else {
        this.iconTemp = ""
        this.iconDialog = false
      }
    },
    // querySearch(queryString, cb) {
    //   let components = ArrayToObj(Object.keys(componentsMap))
    //   let results = queryString ? components.filter(this.createFilter(queryString)) : components
    //   cb(results)
    // },
    // createFilter(queryString) {
    //   return (components) => {
    //     return (components.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // selectComponent(item) {
    //   if (!this.menu.parentId) this.menu.component = "layout"
    // },
    save() {
      this.$refs["menu"].validate((valid) => {
        if (valid) {
          save(this.menu).then(response => {
            const data = response.data
            if (data.code === 0 && data.msg === "success") {
              this.dialogFormVisible = false
              this.$emit('initTree')
              this.$notify({
                title: '成功',
                message: this.menu.id ? '更新成功' : '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })

    },
    handleDelete(id) {
      this.$confirm('是否删除菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(id).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === "success") {
            this.$emit("initTree")
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })

          }

        })
      })
    },
    resetForm() {
      this.menu = {
        id: "",
        parentId: "",
        parentTitle: "",
        title: "",
        path: "",
        component: "layout",
        hidden: false,
        icon: "",
        name: "",
        redirect: "",
        createBy: this.$store.getters.userInfo.id,
        updateBy: this.$store.getters.userInfo.id
      }
    }
  }
}

</script>
<style scoped>
.trControl {
  transform: rotate(-90deg);
  transition: .18s;
  transform-origin: 50% 50%;
}

.is_expanded {
  transform: rotate(-45deg);
}

.menu-icon {
  width: 1.3em!important;
  height: 1.3em!important;
  vertical-align: -0.3em!important;
}

</style>
<style>
.radio-icon-group .el-radio-button__inner {
  border: 0!important;
  border-radius: 0!important;
}

</style>
