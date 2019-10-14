<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html body {
  background-color: #282828;
  color: #2c3e50;
  width: auto;
  height: auto;
}

body, #app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: #282828;
  color: #2c3e50;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: auto;
  height: 100%;
  padding: 0;
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
