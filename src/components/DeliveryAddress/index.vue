<template>
  <div class="deliveryAddress-container">
    <el-form ref="form" :model="deliveryAddress" status-icon :rules="rules" size="small" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
      <el-form-item label="所在地区" prop="address">
        <el-cascader :options="options" v-model="deliveryAddress.address"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="addressDetail">
        <el-input v-model="deliveryAddress.addressDetail"></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" prop="receiver">
        <el-input v-model="deliveryAddress.receiver"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="deliveryAddress.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="save" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="deliveryAddressList" border fit style="width: 100%" v-loading="loading">
      <el-table-column align="center" label="收货人">
        <template slot-scope="scope">
          <span>{{scope.row.receiver}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在地区">
        <template slot-scope="scope">
          <span>{{scope.row.address | formatAddress()}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详细地址">
        <template slot-scope="scope">
          <span>{{scope.row.addressDetail}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="text" @click.native="updateAddress(scope.row)" size="small">修改</el-button>
          <el-button type="text" @click.native="deleteAddress(scope.row.id)" size="small">删除</el-button>
          <el-button type="primary" @click.native="defaultAddress(scope.row.id)" :disabled="scope.row.status === 0" size="mini">{{scope.row.status === 0?"默认":"设为默认"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { saveDeliveryAddress, getDeliveryAddressList, deleteDeliveryAddressList, setDefaultAddressList } from '@/api/user'
import { validatePhone } from '@/utils/validate'

export default {
  data() {
    return {
      options: regionData,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          user: this.$store.getters.userInfo.id
        }
      },
      deliveryAddress: {
        id: '',
        address: [],
        addressDetail: '',
        receiver: '',
        phone: '',
        user: this.$store.getters.userInfo.id
      },
      loading: false,
      rules: {
        address: [{ required: true, message: '地区不能为空'}],
        addressDetail: [{ required: true, message: '地址详情不能为空', trigger: 'blur' }],
        receiver: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }]
      },
      deliveryAddressList: [],
      show: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let deliveryAddress = _.cloneDeep(this.deliveryAddress)
          deliveryAddress.address = deliveryAddress.address.toString()
          saveDeliveryAddress(deliveryAddress).then(response => {
            const data = response.data
            if (data.code === 0 && data.msg === 'success') {
              this.getList()
              this.resetForm()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.resetForm()
              this.$notify.error({
                title: '错误',
                message: '最多创建5条收货地址'
              })
            }
          })
        } else {
          return false;
        }
      })
    },
    getList() {
      this.loading = true
      getDeliveryAddressList(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.deliveryAddressList = data.datas.records
          this.total = data.datas.total
          this.loading = false
        }
      })
    },
    deleteAddress(id) {
      this.$confirm('是否删除收货地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeliveryAddressList(id).then(response => {
          const data = response.data
          if (data.code === 0 && data.msg === "success") {
            this.getList()
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
    updateAddress(data) {
      const temp = _.clone(data)
      temp.address = temp.address.split(',')
      this.deliveryAddress = temp
    },
    defaultAddress(id) {
      setDefaultAddressList(id).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === "success") {
          this.getList()
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
        }

      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    }
  }

}

</script>
<style lang="scss" scoped>
.deliveryAddress-container {
  padding: 20px;
}

</style>
