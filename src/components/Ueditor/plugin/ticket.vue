<template>
  <div>
    <el-button :style="{'border-radius':0,width:'100%',background:color}" type="primary" @click="addTicket">添加优惠券</el-button>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: '#20a0ff'
    }
  },
  methods: {
    addTicket() {
      this.$emit('addTicket')
    }
  }
}

</script>
