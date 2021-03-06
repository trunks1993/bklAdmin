<template>
  <div class="activityForm">
    <el-form :model="activity" :rules="rules" ref="activity" size="small" label-width="150px" label-position="right">
      <div class="activityForm-main">
        <div class="activityForm-main-title">
          <svg-icon icon-class="form" />
          <span>现金红包</span>
        </div>
        <div class="activityForm-main-item">
          <el-form-item label="活动名称:" prop="name">
            <el-col :span="9">
              <el-input v-model="activity.name" style="width:220px"></el-input>
            </el-col>
            <el-col :span="15">
              <span class="form-item-span"></span>
            </el-col>
          </el-form-item>
          <el-form-item label="活动开始时间:" prop="startDate">
            <el-col :span="9">
              <el-date-picker v-model="activity.startDate" :picker-options="pickerBeginDateBefore" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-col>
            <el-col :span="15">二维码制作配送需要3～5天，建议提前5天发布活动信息</el-col>
          </el-form-item>
          <el-form-item label="二维码收货地址:" prop="deliveryAddress">
            <el-col :span="9">
              <div v-for="(item,index) in deliveryAddressList">
                <el-radio v-model="activity.deliveryAddress" :label='item.address | formatAddress() + item.addressDetail+" ( "+item.receiver+" 收)"+" "+item.phone'>
                  {{item.address | formatAddress() + item.addressDetail+" ( "+item.receiver+" 收)"+" "+item.phone}}
                </el-radio>
              </div>
              <el-button type="text" @click.native="addDeliveryAddress">{{deliveryAddressList.length>0?'管理收货地址':'添加收货地址'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="是否需要分享广告：">
            <el-col :span="9">
              <el-switch v-model="activity.needShare" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1"></el-switch>
              <transition name="fade">
                <advert-select v-show="!activity.needShare" v-model="activity.advert"></advert-select>
              </transition>
            </el-col>
          </el-form-item>
          <el-form-item label="限制扫码次数：">
            <el-col :span="9">
              <el-input-number :min="1" v-model="activity.scanedTimes" @change="checkInteger($event,'scanedTimes')"></el-input-number>
            </el-col>
            <el-col :span="15">限制本次活动每个微信号可扫码的次数</el-col>
          </el-form-item>
          <el-form-item label="二维码数(红包数)：">
            <el-col :span="9">
              <el-input-number :min="1" v-model="activity.qrCount" 
              @blur="()=>{if(this.activity.qrCount!==1)this.$refs.activity.validateField('minMoney')
            this.$refs.activity.validateField('totalMoney')}" 
            @change="checkInteger($event,'qrCount')" :controls="false">
              </el-input-number>
            </el-col>
            <el-col :span="15">一个二维码对应一个红包</el-col>
          </el-form-item>
          <el-form-item label="红包总金额：" prop="totalMoney">
            <el-col :span="9">
              <el-input-number :min="1" @change="checkSmallNumber($event,'totalMoney')" v-model="activity.totalMoney" :controls="false" class="gold"></el-input-number>
              <span style="color:#4fc08d;font-size:13px;">微信手续费：{{activity.totalMoney | mathCeil()}}</span>
            </el-col>
            <el-col :span="15">微信限制，单个红包金额不能少于1元</el-col>
          </el-form-item>
          <el-form-item label="最小金额：" prop="minMoney" v-show="activity.qrCount !== 1">
            <el-col :span="9">
              <el-input-number :min="1" :max="maxMinMoney" :controls="false" v-model="activity.minMoney" class="gold" @change="checkSmallNumber($event,'minMoney')"></el-input-number>
              <span style="color:#4fc08d;font-size:13px;">{{ minMoney_rule(activity.totalMoney,activity.qrCount ) }}</span>
            </el-col>
            <el-col :span="15">设置不超过设置范围的数，可包含两位小数</el-col>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog title="管理收货地址" :visible.sync="dialogDeliveryAddress" @close="refreshAddress">
      <delivery-address v-if="dialogDeliveryAddress"></delivery-address>
    </el-dialog>
  </div>
</template>
<script>
import { formatDefaultAddress } from '@/utils'
import { getDeliveryAddressList } from '@/api/user'
import DeliveryAddress from '@/components/DeliveryAddress'
import AdvertSelect from '@/components/AdvertSelect'
import rec from '@/assets/rec.png'
import advertImg from '@/assets/advertDetail.png'

export default {
  components: {
    DeliveryAddress,
    AdvertSelect
  },
  props: {
    activity: {
      type: Object
    }
  },
  data() {
    const validateTotalMoney = (rule, value, callback) => {
      if (this.activity.qrCount !== 1) this.$refs.activity.validateField('minMoney')
      if (value < this.activity.qrCount) {
        callback(new Error('总金额不能小于红包个数'));
      }
      callback()
    }
    const validateMinMoney = (rule, value, callback) => {
      if (value <= this.maxMinMoney) {
        callback()
      }
      callback(new Error('最小金额超出设置范围'))
    }
    return {
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          user: this.$store.getters.userInfo.id
        }
      },
      rec,
      advertImg,
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() < Date.now();
        }
      },
      deliveryAddressList: [],
      dialogDeliveryAddress: false,
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择活动开始日期', trigger: 'change' }],
        deliveryAddress: [{ required: true, message: '收货地址不能为空', trigger: 'change' }],
        totalMoney: [{ required: true, validator: validateTotalMoney, trigger: 'blur' }],
        minMoney: [{ required: true, validator: validateMinMoney, trigger: 'blur' }]
      },
      advert: ''
    }
  },
  computed: {
    maxMinMoney() {
      return Math.floor(this.activity.totalMoney / this.activity.qrCount * 100) / 100
    }
  },
  created() {
    this.getDeliveryAddressList()
  },
  methods: {
    // -------------------------------------收货地址-------------------------------------
    getDeliveryAddressList(isChange) {
      getDeliveryAddressList(this.listQuery).then(response => {
        const data = response.data
        if (data.code === 0 && data.msg === 'success') {
          this.deliveryAddressList = data.datas.records
          this.activity.deliveryAddress = formatDefaultAddress(data.datas.records)
          this.total = data.datas.total
          if (isChange) this.$refs['activity'].validateField("deliveryAddress")
          this.loading = false
        }
      })
    },
    addDeliveryAddress() {
      this.dialogDeliveryAddress = true
    },
    refreshAddress() {
      this.getDeliveryAddressList(true)

    },
    // ----------------最小金额设置范围------------------
    minMoney_rule(totalMoney, qrCount) {
      if (totalMoney === qrCount) return "设置范围：1"
      return "设置范围：1～" + Math.floor(totalMoney / qrCount * 100) / 100
    },
    // ----------------最小金额设置范围------------------
    checkInteger(val, property) {
      const oldVal = this.activity[property]
      let that = this
      this.$nextTick().then(() => {
        if (val % 1 !== 0) {
          that.activity[property] = oldVal
        }
      })
    },
    checkSmallNumber(event, property) {
      const oldVal = this.activity[property]
      let that = this
      this.$nextTick().then(() => {
        if (!/^\d+(\.\d{1,2})?$/.test(event)) {
          that.activity[property] = oldVal
        }
      })
    },
    // ----------------父组件提交验证--------------------
    validateActivity() {
      this.$refs.activity.validate((valid) => {
        if (valid) {
          this.$emit('getChildValidMsg', true)
        } else {
          this.$emit('getChildValidMsg', false)
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.activityForm {
  &-main {
    display: table;
    width: 100%;
    background: #fff;
    margin-bottom: 0;
    padding: 40px 0 20px 0;
    border-bottom: 1px solid #eee;
    &-title {
      display: table-cell;
      width: 160px;
      padding: 0;
      font-size: 14px;
      font-weight: bold;
      background: #fff;
      color: #333;
      text-align: center;
      vertical-align: top;
      position: relative;
      top: 7px;
    }
    .question-detail:hover {
      color: #4fc08d;
      cursor: pointer;
    }
    &-item {
      display: table-cell;
    }
    &-delete {
      width: 160px;
      text-align: center;
    }
  }
}

</style>
<style lang="scss">
.gold {
  .el-input {
    input {
      color: #f90!important;
      font-weight: bolder!important;
    }
  }
}

</style>
