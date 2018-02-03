<template>
  <div>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" v-model="listQuery.condition.name" placeholder="用户名">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 200px;" class="filter-item" v-model="listQuery.condition.phone" placeholder="电话">
      </el-input>
      <el-button class="filter-item" type="primary" size="small" @click="handleFilter" v-waves icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" size="small" @click="openUserDialog" type="primary" icon="el-icon-edit">添加</el-button>
      <el-radio-group v-model="listQuery.condition.vo.roleName" style="margin-left:20px;" @change="handlerRoleChange">
        <el-radio label="">所有用户</el-radio>
        <el-radio label="管理员">管理员</el-radio>
        <el-radio label="商户">商户</el-radio>
        <el-radio label="代理商">代理商</el-radio>
      </el-radio-group>
    </div>
    <el-table :default-sort="{prop: 'createDate', order: 'descending'}" :data="userList" v-loading="loading" element-loading-text="给我一点时间" border fit style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="50">
      </el-table-column>
      <el-table-column align="center" label="角色" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.vo.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="帐号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址详情" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.address | formatAddress()}}</span>
          <span>{{scope.row.addressDetail}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.photo || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'" style="width:50px;height:50px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.vo.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" sortable prop="createDate" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期时间" sortable prop="expireDate" width="150">
        <template slot-scope="scope" v-if="scope.row.expireDate">
          <span>{{scope.row.expireDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额" sortable prop="balance" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.balance / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码库存" sortable prop="stock" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.vo.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag type="success">正常</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small">统计</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div v-show="!loading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="新增用户" @close="resetForm('user')" :visible.sync="dialogFormVisible">
      <el-form v-loading="roleLoading" status-icon :model="user" ref="user" :rules="rules" size="small" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="角色" prop="vo.roleId">
          <el-radio-group v-model="user.vo.roleId">
            <el-radio v-for="role in roleList" :label="role.id" :key="role.id">{{role.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="帐号" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="user.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-cascader :options="options" v-model="user.address"></el-cascader>
        </el-form-item>
        <el-form-item label="街道" prop="addressDetail">
          <el-input v-model="user.addressDetail"></el-input>
        </el-form-item>
        <el-form-item label="使用期限">
          <el-radio-group v-model="user.expireDate" @change="handleRadioChange">
            <el-radio :label="2592000000">30天试用</el-radio>
            <el-radio :label="31536000000">一年</el-radio>
            <el-radio>无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="余额">
          <el-input-number :controls="false" disabled v-model="user.balance"></el-input-number>
        </el-form-item>
        <el-form-item label="二维码库存">
          <el-input-number :controls="false" disabled v-model="user.vo.stock"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="createUser" type="primary">创 建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { createUser, getUserList } from '@/api/user'
import { getAllRole } from '@/api/role'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { validateUsername, validatePhone } from '@/utils/validate'

export default {
  directives: {
    waves
  },
  data() {
    const validatePassWord = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else {
        if (this.rules.checkPass !== '') {
          this.$refs.user.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePassWord2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      roleLoading: false,
      total: null,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          name: undefined,
          phone: undefined,
          createBy: this.$store.getters.userInfo.id,
          vo: { roleName: "" }
        }
      },
      options: regionData,
      user: {
        username: null,
        password: null,
        checkPass: null,
        name: null,
        address: [],
        addressDetail: '',
        phone: null,
        photo: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        createBy: this.$store.getters.userInfo.id,
        expireDate: 0,
        balance: 0,
        vo: {
          stock: 0,
          roleId: ""
        }
      },
      userList: [],
      roleList: [],
      dialogFormVisible: false,
      rules: {
        'vo.roleId': [{ required: true, message: "角色不能为空", trigger: 'blur' }],
        username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
        password: [{ required: true, validator: validatePassWord, trigger: 'blur' }],
        checkPass: [{ required: true, validator: validatePassWord2, trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        name: [{ required: true, message: "用户名不能为空", trigger: 'blur' }],
        address: [{ required: true, message: "地址不能为空", trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getUserList(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.userList = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleRadioChange(val) {
      if (val === 31536000000) {
        this.user.balance = 500,
          this.user.vo.stock = 500
      } else {
        this.user.balance = 0,
          this.user.vo.stock = 0
      }
    },
    handlerRoleChange() {
      this.getList()
    },
    openUserDialog() {
      this.dialogFormVisible = true
      this.roleLoading = true
      getAllRole().then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.roleList = data.data
        }
        this.roleLoading = false
      })
    },
    createUser() {
      this.$refs["user"].validate((valid) => {
        if (valid) {
          this.user.expireDate = this.user.expireDate ? this.user.expireDate + Date.now() : ""
          let user = _.cloneDeep(this.user)
          user.address = user.address.toString()
          user.balance *= 100
          createUser(user).then(response => {
            const data = response.data
            if (data.code === 0 && data.msg === 'success') {
              this.dialogFormVisible = false
              this.loading = true
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>
<style scoped>
.el-radio+.el-radio {
  margin-left: 0;
}

.el-radio {
  margin: 0 30px 10px 0;
}

</style>
