<script setup lang="ts">
import Popup from '@/components/layout/Popup.vue'
</script>

<template>
  <Popup id="popup">
    Контент попапа
  </Popup>
  <Popup
    id="video"
    is-video
  />
</template>
