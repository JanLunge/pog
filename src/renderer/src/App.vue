<script setup lang="ts">
import {computed} from "vue";
import {keyboardStore} from "./store";

const store = computed(()=>{
  return keyboardStore
})
console.log('store initiated', store.value.path)
</script>

<template>
 <router-view></router-view>
</template>
<style lang="scss">
html,body,#app{
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont;
}
</style>
