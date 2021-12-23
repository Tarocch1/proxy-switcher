<template>
  <div class="row p-4">
    <div class="col-auto">
      <Export />
      <List v-model:selectedKey="selectedKey" :proxy="proxy" />
    </div>
    <div class="col">
      <ProxyForm :id="selectedKey === 'add' ? undefined : selectedKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storage } from '@/utils/storage'
import { eventEmitter, STORAGE_CHANGED } from '@/utils/event'
import Export from '../Components/Export.vue'
import List from '../Components/List.vue'
import ProxyForm from '../Components/ProxyForm.vue'

const selectedKey = ref('add')
const proxy = ref(storage.proxy)

const storageChangeHandler = function () {
  proxy.value = storage.proxy
  if (!storage.proxy.some((p) => p.id === selectedKey.value)) {
    selectedKey.value = 'add'
  }
}

onMounted(function () {
  eventEmitter.on(STORAGE_CHANGED, storageChangeHandler)
})

onBeforeUnmount(function () {
  eventEmitter.removeListener(STORAGE_CHANGED, storageChangeHandler)
})
</script>

<style>
body {
  overflow-x: hidden;
}
</style>
