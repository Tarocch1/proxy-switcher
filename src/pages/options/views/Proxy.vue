<template>
  <div class="row p-4">
    <div class="col-auto">
      <div class="list-group">
        <button
          v-for="p in proxy"
          :key="p.id"
          type="button"
          class="list-group-item list-group-item-action"
          :class="{ active: selectedKey === p.id }"
          @click="selectedKey = p.id"
        >
          <i class="bi" :class="iconMap[p.mode]"></i>
          <span class="ms-2">{{ p.name }}</span>
        </button>
        <button
          type="button"
          class="list-group-item list-group-item-action"
          :class="{ active: selectedKey === ADD }"
          @click="selectedKey = ADD"
        >
          <i class="bi bi-plus-lg"></i>
          <span class="ms-2">{{ $filters.i18n('add') }}</span>
        </button>
      </div>
    </div>
    <div class="col">
      <ProxyForm :id="selectedKey === ADD ? undefined : selectedKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ProxyMode } from '@/utils/proxy'
import { storage } from '@/utils/storage'
import { eventEmitter, STORAGE_CHANGED } from '@/utils/event'
import ProxyForm from '../Components/ProxyForm.vue'

const ADD = 'add'
const selectedKey = ref(ADD)
const proxy = ref(storage.proxy)

const iconMap: Record<ProxyMode, string> = {
  fixed_servers: 'bi-funnel',
  pac_script: 'bi-signpost-2',
  direct: 'bi-plug',
}

const storageChangeHandler = function () {
  proxy.value = storage.proxy
  if (!storage.proxy.some((p) => p.id === selectedKey.value)) {
    selectedKey.value = ADD
  }
}

onMounted(function () {
  eventEmitter.on(STORAGE_CHANGED, storageChangeHandler)
})

onBeforeUnmount(function () {
  eventEmitter.removeListener(STORAGE_CHANGED, storageChangeHandler)
})
</script>

<style scoped>
.list-group {
  width: 300px;
}
</style>
