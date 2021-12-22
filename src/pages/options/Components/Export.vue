<template>
  <div class="btn-group w-100 mb-3">
    <button
      type="button"
      class="btn btn-outline-secondary"
      @click="inputElement?.click()"
    >
      <i class="bi bi-download"></i>
      <span class="ms-2">{{ $filters.i18n('import') }}</span>
      <input
        ref="inputElement"
        class="d-none"
        type="file"
        accept=".json"
        @click.stop
        @change="importHandler"
      />
    </button>
    <button
      type="button"
      class="btn btn-outline-secondary"
      @click="exportHandler"
    >
      <i class="bi bi-upload"></i>
      <span class="ms-2">{{ $filters.i18n('export') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storage } from '@/utils/storage'

const inputElement = ref<HTMLInputElement>()

const importHandler = function () {
  if (!inputElement.value?.files?.length) return
  const file = inputElement.value.files[0]

  const reader = new FileReader()
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target?.result as string) as unknown
      storage.importProxy(data)
    } catch (error) {
      console.error(error)
    }
  }
  reader.readAsText(file)
}

const exportHandler = function () {
  const link = document.createElement('a')
  link.download = 'proxy-switcher.json'
  link.href = `data:text/plain,${JSON.stringify(storage.proxy)}`
  link.click()
}
</script>
