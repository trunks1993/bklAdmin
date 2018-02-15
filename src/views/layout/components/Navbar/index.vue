<template>
  <div class="navbar">
    <permission-menu></permission-menu>
    <user-dropdown></user-dropdown>
  </div>
</template>
<script>
import PermissionMenu from './PermissionMenu'
import UserDropdown from './UserDropdown'

export default {
  components: {
    PermissionMenu,
    UserDropdown
  }
}

</script>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 61px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #e6e9f0;
  box-shadow: 0 1px 3px #f8f8f8;
  background: #f5f7fa;
}

</style>
