<template>
  <div class="sidebar-logo-container">
    <img src="@/assets/emo.jpg" class="sidebar-logo">
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo'
}
</script>

<style lang="scss" scoped>

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  // 大图样式
  .sidebar-logo {
    width: 50%;
    height: 100%;
  }
}
</style>
