<template>
  <div>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" v-model="listQuery.condition.name" placeholder="角色名称">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="openRoleDialog('新建角色')" type="primary" icon="el-icon-edit">添加</el-button>
    </div>
    <el-table :data="roleList" v-loading="loading" element-loading-text="给我一点时间" border fit style="width: 100%">
      <el-table-column type="index" align="center" label="序号">
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="英文名称">
        <template slot-scope="scope">
          <span>{{scope.row.enname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.useable==1?'success':'danger'">{{scope.row.useable==1?'正常':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.vo.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" sortable prop="createDate">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" sortable prop="createDate">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openTreeDialog(scope.row.id,scope.row.vo.menuIdList)" size="small">菜单</el-button>
          <el-button type="text" @click="openRoleDialog(scope.row)" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!loading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="role_dialog_title" :visible.sync="dialogFormVisible">
      <el-form status-icon :model="role" ref="role" size="small" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="role.enname"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="useable">
          <el-switch v-model="role.useable" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="save" type="primary">创 建</el-button>
      </div>
    </el-dialog>
    <el-dialog title="菜单权限" :visible.sync="treeDialog" width="300px">
      <el-tree v-loading="treeLoading" check-strictly :default-expanded-keys="roleMenu.vo.menuIdList" :data="menuList" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
      </el-tree>
      <div slot="footer">
        <el-button size="mini" @click="makeSureParent(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="makeSureParent(true)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { getToken } from '@/utils/auth'
import { getMenuTree } from '@/api/menu'
import { getRoleList, saveRoleMenu, saveRole } from '@/api/role'

export default {
  created() {
    this.getList()
  },
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      treeDialog: false,
      treeLoading: false,
      role_dialog_title: "",
      menuList: [],
      total: null,
      roleMenu: {
        id: "",
        vo: {
          menuIdList: []
        }
      },
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          name: undefined,
        }
      },
      roleList: [],
      role: {
        id: "",
        name: "",
        enname: "",
        useable: "1",
        createBy: this.$store.getters.userInfo.id,
        updateBy: this.$store.getters.userInfo.id
      },
      defaultProps: {
        children: 'children',
        label: (data, node) => {
          return data.meta.title
        },
        id: 'id'
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      getRoleList(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.roleList = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
      })
    },
    openRoleDialog(obj) {
      if (obj === "新建角色") {
        this.resetForm()
        this.role_dialog_title = obj
        this.dialogFormVisible = true
      } else {
        this.role_dialog_title = "编辑角色"
        this.dialogFormVisible = true
        this.role = Object.assign({}, obj)
      }
    },
    save() {
      saveRole(this.role).then(response => {
        let data = response.data
        if (data.code === 0 && data.msg === "success") {
          this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 })
          this.getList()
        }
        this.dialogFormVisible = false
      }).catch(error => {
        this.dialogFormVisible = false
      })
    },
    openTreeDialog(id, menuIdList) {
      this.roleMenu.id = id
      this.roleMenu.vo.menuIdList = menuIdList

      this.treeLoading = true
      this.treeDialog = true
      getMenuTree().then(response => {
        let data = response.data
        if (data.code === 0 && data.msg === "success") {
          this.menuList = data.data
        }
        this.$refs.tree.setCheckedKeys(menuIdList)
        this.menuIdList = menuIdList
        this.treeLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    makeSureParent(flag) {
      if (!flag) {
        this.$refs.tree.setCheckedKeys([])
        this.treeDialog = false
      } else {
        this.roleMenu.vo.menuIdList = this.$refs.tree.getCheckedKeys()
        saveRoleMenu(this.roleMenu).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === 'success') {
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
            this.getList()
          }
          this.treeDialog = false
        }).catch(error => {
          this.loading = false
        })
      }
    },
    resetForm() {
      this.role = {
        name: "",
        enname: "",
        useable: "1"
        // createBy: getToken(),
        // updateBy: getToken()
      }
    }
  }
}

</script>
