<template>
  <div id="app">
    <Details></Details>
    <router-view/>
    <img class="page-logo" alt="Vue logo" src="./assets/logo.png">
  </div>
</template>

<script>
  import Details from "@/components/Details";

  export default {
      name: 'app',
      components: {
          Details
      }
  }

</script>

<style lang="scss">
body, #app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: #282828;
  color: #2c3e50;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  width: 1920px;
  height: 1080px;
  padding: 0;
  margin: auto;
}

.page-logo {
  position: absolute;
  right: 0;
  top: 0;
  padding: 2%;
  width: 5%;
  height: auto;
  z-index: 1000;
}

</style>
