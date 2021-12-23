<template>
  <div class="list-group">
    <li v-if="props.proxy.length === 0" class="list-group-item text-center">
      {{ $filters.i18n('no_proxy') }}
    </li>
    <button
      v-for="(p, index) in props.proxy"
      :key="p.id"
      type="button"
      class="list-group-item list-group-item-action text-truncate"
      :class="{
        active: props.selectedKey === p.id,
        dragover: currentDragOver === index && currentDragging !== index,
      }"
      draggable="true"
      @click="emit('update:selectedKey', p.id)"
      @dragstart="dragstart($event, index)"
      @dragenter="dragEnterOrOver($event, index)"
      @dragover="dragEnterOrOver($event, index)"
      @dragend="dragend"
      @drop="drop($event, index)"
    >
      <i class="bi" :class="iconMap[p.mode]"></i>
      <span class="ms-2">{{ p.name }}</span>
    </button>
    <button
      type="button"
      class="list-group-item list-group-item-action"
      :class="{ active: props.selectedKey === 'add' }"
      @click="emit('update:selectedKey', 'add')"
    >
      <i class="bi bi-plus-lg"></i>
      <span class="ms-2">{{ $filters.i18n('add') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { storage } from '@/utils/storage'
import { ProxyFormData, ProxyMode } from '@/utils/proxy'

const currentDragging = ref(-1)
const currentDragOver = ref(-1)

const iconMap: Record<ProxyMode, string> = {
  [ProxyMode.fixed_servers]: 'bi-funnel',
  [ProxyMode.pac_script]: 'bi-signpost-2',
  [ProxyMode.direct]: 'bi-plug',
}

const props = defineProps<{
  proxy: ProxyFormData[]
  selectedKey: string
}>()

const emit = defineEmits(['update:selectedKey'])

const customDragDataType = 'application/x-proxy-index'

const dragstart = function (ev: DragEvent, from: number) {
  if (ev.dataTransfer) {
    currentDragging.value = from
    ev.dataTransfer.setData(customDragDataType, String(from))
    ev.dataTransfer.dropEffect = 'move'
  }
}

const dragEnterOrOver = function (ev: DragEvent, at: number) {
  if (ev.dataTransfer && ev.dataTransfer.types.includes(customDragDataType)) {
    currentDragOver.value = at
    ev.preventDefault()
  }
}

const dragend = function () {
  currentDragging.value = -1
  currentDragOver.value = -1
}

const drop = function (ev: DragEvent, to: number) {
  if (ev.dataTransfer && ev.dataTransfer.types.includes(customDragDataType)) {
    if (currentDragging.value !== to) {
      storage.sortProxy(currentDragging.value, to)
    }
  }
}
</script>

<style scoped>
.list-group {
  width: 300px;
}
.dragover {
  background: repeating-linear-gradient(
    -45deg,
    rgb(0 0 0 / 10%) 0 5px,
    #fff 0 10px
  );
}
</style>
