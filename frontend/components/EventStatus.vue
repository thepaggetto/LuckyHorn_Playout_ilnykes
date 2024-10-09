<template>
  <div class="flex items-center ps-4 pe-1 on-air-status">
    <div
        class="w-16 h-8 flex items-center justify-center rounded-md text-white font-semibold text-sm shadow-lg"
        :class="indexStore.sseConnected ? 'bg-success glow-on-air' : 'bg-error glow-off-air'"
        :title="indexStore.sseConnected ? t('socketConnected') : t('socketDisconnected')"
    >
      {{ indexStore.sseConnected ? 'ON-AIR' : 'OFF-AIR' }}
    </div>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

const indexStore = useIndex()
</script>
