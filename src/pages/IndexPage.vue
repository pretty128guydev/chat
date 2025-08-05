<template>
  <q-page class="chat-page">
    <ChatApp />
  </q-page>
</template>

<script setup lang="ts">
import ChatApp from 'components/ChatApp.vue';
</script>

<style scoped>
.chat-page {
  height: 100vh;
  padding: 0;
}
</style>
