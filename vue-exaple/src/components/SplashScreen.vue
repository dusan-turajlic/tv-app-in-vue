<template>
  <div id="splash">
    <span>Loading ...</span>
  </div>
</template>

<script>
    export default {
        name: "SplashScreen"
    }
</script>

<style scoped>
  #splash {
    position: absolute;
    width: 100%;
    height: 100%;
    display: table;
  }

  #splash span {
    color: white;
    font-size: 4em;
    position: relative;
    display: table-cell;
    vertical-align: middle;
  }
</style>