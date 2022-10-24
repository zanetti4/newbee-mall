<template>
  <router-view></router-view>
  <Tabbar></Tabbar>
</template>

<script lang="ts">
  import Tabbar from '@/components/Tabbar';
  
  export default {
    components: {
      Tabbar,
    },
  }
</script>

<style lang="less">
  #app {
    height: 100%;
  }
</style>
