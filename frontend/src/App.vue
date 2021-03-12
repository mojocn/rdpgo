<template>
  <div id="app">
    <guac-client></guac-client>
  </div>
</template>

<script>

import GuacClient from "@/components/GuacClient";
export default {
  name: 'App',
  components: {
    GuacClient,
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
