<template>
  <v-theme-provider theme="dark">
    <router-view></router-view>
  </v-theme-provider>
</template>

<script setup lang="ts">
  // Any app-wide setup can go here
</script>

<style>
  .kbd {
    background-color: #313131;
    border: 1px solid #838383;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
    color: #b4b4b4;
    display: inline-block;
    font-size: 0.85em;
    font-family: Monaco, Menlo, Consolas, monospace;
    padding: 2px 4px;
    white-space: nowrap;
  }
</style>