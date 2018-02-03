<template>
  <el-row class="user-container">
    <el-col class="left-container" :span="12">
      <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="userInfo-left">
        <div class="left-info-item">
          <span>登录账号:</span>
          <span>{{userInfo.username}}</span>
        </div>
        <div class="left-info-item">
          <span>账号ID:</span>
          <span>{{userInfo.id}}</span>
        </div>
        <div class="left-info-item">
          <span>注册时间:</span>
          <span>{{userInfo.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </div>
      </div>
    </el-col>
    <el-col class="right-container" :span="12">
      <el-form :model="userInfo" ref="user" :rules="rules" size="small" label-position="top" style='width: 350px;'>
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="phone">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-cascader :options="options" v-model="userInfo.address"></el-cascader>
        </el-form-item>
        <el-form-item label="街道:" prop="addressDetail">
          <el-input v-model="userInfo.addressDetail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="valid" @click.native="updateUserInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import { validatePhone } from '@/utils/validate'
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'

export default {
  data() {
    return {
      uploadUrl: process.env.BASE_API + '/api/upload/uploadImg/' + this.$store.getters.userInfo.id,
      options: regionData,
      userInfo: null,
      valid: true,
      rules: {
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        name: [{ required: true, message: "用户名不能为空", trigger: 'blur' }],
        address: [{ required: true, message: "地址不能为空", trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  watch: {
    'userInfo': {
      handler: function(val) {
        const old = this.$store.getters.userInfo
        if (JSON.stringify(val) === JSON.stringify(old)) this.valid = true
        else this.valid = false
      },
      deep: true
    }
  },
  methods: {
    getUserInfo() {
      this.userInfo = _.cloneDeep(this.$store.getters.userInfo)
    },
    //--------------------------------------图片上传--------------------------------------
    handleAvatarSuccess(res, file, fileList) {
      this.userInfo.photo = process.env.BASE_API + res.data //upload
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //------------------------------------------------------------------------------------
    updateUserInfo() {

      this.$refs["user"].validate((valid) => {
        if (valid) {
          let userInfo = _.cloneDeep(this.userInfo)
          userInfo.address = userInfo.address.toString()
          this.$store.dispatch('UpdateUserInfo', userInfo).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getUserInfo()
          })
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.user-container {
  width: 100%;
  height: 100%;
  background: #fff;
  .left-container {
    height: 100%;
    border-right: 1px solid #d8dce5;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .avatar-uploader {
      margin-left: 100px;
      margin-bottom: 30px;
    }
    .userInfo-left {
      font-size: 14px;
      margin-left: 100px;
      .left-info-item {
        margin-top: 10px;
        span:first-child {
          display: inline-block;
          width: 80px;
        }
      }
    }
  }
  .right-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}


</style>
<style lang="scss">
  //头像上传
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
