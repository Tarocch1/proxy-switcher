<template>
  <div class="w-300">
    <ul class="list-group list-group-flush">
      <li
        v-if="!enable"
        class="list-group-item list-group-item-warning text-center"
      >
        {{ $filters.i18n('cannot_control_proxy') }}
      </li>
      <li v-if="proxy.length === 0" class="list-group-item text-center">
        {{ $filters.i18n('no_proxy') }}
      </li>
      <button
        v-for="p in proxy"
        :key="p.id"
        type="button"
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        :class="{ active: current === p.id, disabled: !enable }"
        @click="toggleProxy(p.id)"
      >
        <span class="text-truncate">
          <i class="bi" :class="iconMap[p.mode]"></i>
          <span class="ms-2">{{ p.name }}</span>
        </span>
        <span
          class="ms-2 p-2 rounded-circle"
          :style="{ backgroundColor: p.color }"
        ></span>
      </button>
    </ul>
    <div class="p-2 text-end">
      <a href="#" class="text-decoration-none" @click="toSetting">
        {{ $filters.i18n('setting') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { controllableByThisExtension, ProxyMode } from '@/utils/proxy'
import { storage } from '@/utils/storage'
import { eventEmitter, STORAGE_CHANGED } from '@/utils/event'

const current = ref(storage.current)
const proxy = ref(storage.proxy)
const enable = ref(true)

const iconMap: Record<ProxyMode, string> = {
  [ProxyMode.fixed_servers]: 'bi-funnel',
  [ProxyMode.pac_script]: 'bi-signpost-2',
  [ProxyMode.direct]: 'bi-plug',
}

const storageChangeHandler = function () {
  current.value = storage.current
  proxy.value = storage.proxy
}

const toggleProxy = function (id: string) {
  storage.toggleProxy(id)
}

const toSetting = function () {
  chrome.runtime.openOptionsPage()
}

onMounted(async function () {
  eventEmitter.on(STORAGE_CHANGED, storageChangeHandler)
  enable.value = await controllableByThisExtension()
})

onBeforeUnmount(function () {
  eventEmitter.removeListener(STORAGE_CHANGED, storageChangeHandler)
})
</script>

<style scoped>
.w-300 {
  width: 300px;
}
</style>
