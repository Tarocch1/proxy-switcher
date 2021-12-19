<template>
  <div class="row justify-content-center">
    <div class="col mw-600">
      <form @submit.passive.stop="submit" novalidate>
        <div class="mb-3">
          <label for="name" class="form-label">
            {{ $filters.i18n('proxy_name') }}
          </label>
          <input
            id="name"
            class="form-control"
            :class="{ 'is-invalid': invalid.name }"
            v-model="form.name"
          />
        </div>
        <div class="mb-3">
          <label for="mode" class="form-label">
            {{ $filters.i18n('proxy_mode') }}
          </label>
          <select id="mode" class="form-select" v-model="form.mode">
            <option value="fixed_servers">
              {{ $filters.i18n('manual') }}
            </option>
            <option value="pac_script">
              {{ $filters.i18n('auto') }}
            </option>
            <option value="direct">
              {{ $filters.i18n('direct') }}
            </option>
          </select>
          <div v-if="form.mode === 'direct'" class="form-text">
            {{ $filters.i18n('direct_extra') }}
          </div>
        </div>

        <div v-if="form.mode === 'fixed_servers'">
          <div class="mb-3">
            <label for="scheme" class="form-label">
              {{ $filters.i18n('proxy_scheme') }}
            </label>
            <select id="scheme" class="form-select" v-model="form.scheme">
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks4">Socks4</option>
              <option value="socks5">Socks5</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="host" class="form-label">
              {{ $filters.i18n('proxy_host') }}
            </label>
            <input
              id="host"
              class="form-control"
              :class="{ 'is-invalid': invalid.host }"
              v-model="form.host"
              placeholder="e.g. 127.0.0.1"
            />
          </div>
          <div class="mb-3">
            <label for="port" class="form-label">
              {{ $filters.i18n('proxy_port') }}
            </label>
            <input
              id="port"
              class="form-control"
              :class="{ 'is-invalid': invalid.port }"
              v-model="form.port"
              placeholder="e.g. 8080"
              type="number"
              min="1"
              max="65535"
            />
          </div>
          <div
            v-if="['http', 'https'].includes(form.scheme)"
            class="row mb-3 gx-3"
          >
            <div class="col">
              <label for="username" class="form-label">
                {{ $filters.i18n('proxy_username') }}
              </label>
              <input
                id="username"
                class="form-control"
                v-model="form.username"
              />
            </div>
            <div class="col">
              <label for="password" class="form-label">
                {{ $filters.i18n('proxy_password') }}
              </label>
              <input
                id="password"
                class="form-control"
                v-model="form.password"
                type="password"
              />
            </div>
          </div>
          <div class="mb-3">
            <label for="bypassList" class="form-label">
              {{ $filters.i18n('bypass_list') }}
            </label>
            <textarea
              id="bypassList"
              class="form-control"
              v-model="form.bypassList"
              placeholder="e.g. <local>"
            />
            <div class="form-text">
              <span>
                <span>{{ $filters.i18n('bypass_list_extra') }}</span>
                <a
                  href="https://developer.chrome.com/docs/extensions/reference/proxy/#bypass-list"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ $filters.i18n('bypass_list_extra_example') }}
                </a>
              </span>
            </div>
          </div>
        </div>

        <div v-else-if="form.mode === 'pac_script'">
          <div class="mb-3">
            <label for="pacUrl" class="form-label">
              {{ $filters.i18n('pac_file') }}
            </label>
            <input
              id="pacUrl"
              class="form-control"
              :class="{ 'is-invalid': invalid.pacUrl }"
              v-model="form.pacUrl"
              placeholder="e.g. http://127.0.0.1:1080/pac"
            />
          </div>
          <div class="mb-3">
            <label for="pacScript" class="form-label">
              {{ $filters.i18n('pac_script') }}
            </label>
            <textarea
              id="pacScript"
              class="form-control"
              :class="{ 'is-invalid': invalid.pacScript }"
              v-model="form.pacScript"
            />
            <div class="form-text">
              <span>{{ $filters.i18n('pac_script_extra') }}</span>
            </div>
          </div>
        </div>

        <div class="row gx-3">
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">
              {{ $filters.i18n(props.id ? 'save' : 'create') }}
            </button>
          </div>
          <div v-if="props.id" class="col-auto">
            <button type="button" class="btn btn-danger" @click="modal?.show()">
              {{ $filters.i18n('delete') }}
            </button>
          </div>
        </div>
      </form>

      <div ref="modalRef" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              {{ $filters.i18n('delete_confirm') }}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="modal?.hide()"
              >
                {{ $filters.i18n('cancel') }}
              </button>
              <button type="button" class="btn btn-primary" @click="remove">
                {{ $filters.i18n('confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { storage } from '@/utils/storage'
import { Proxy, ProxyFormData } from '@/utils/proxy'

const props = defineProps<{
  id?: string
}>()
const form = ref<ProxyFormData>(Proxy.default())
const dirty = ref<boolean>(false)
const modalRef = ref<HTMLDivElement>()
const modal = ref<Modal>()

const invalid = computed<Record<keyof ProxyFormData, boolean>>(() => {
  if (!dirty.value) return {} as Record<keyof ProxyFormData, boolean>
  const error = {} as Record<keyof ProxyFormData, boolean>
  if (!form.value.name) error.name = true
  if (form.value.mode === 'fixed_servers') {
    if (!form.value.host) error.host = true
    if (!form.value.port) error.port = true
  }
  if (form.value.mode === 'pac_script') {
    if (!form.value.pacUrl && !form.value.pacScript) {
      error.pacUrl = true
      error.pacScript = true
    }
  }
  return error
})

watch(
  () => props.id,
  (id) => {
    dirty.value = false
    form.value = id
      ? { ...storage.proxy.find((proxy) => proxy.id === id)! }
      : Proxy.default()
  }
)

const submit = function () {
  dirty.value = true
  if (Object.keys(invalid.value).length > 0) return
  storage.addOrEditProxy(form.value)
  if (!props.id) {
    dirty.value = false
    form.value = Proxy.default()
  }
}

const remove = function () {
  storage.deleteProxy(props.id!)
  modal.value?.hide()
}

onMounted(function () {
  modal.value = new Modal(modalRef.value!)
})
</script>

<style scoped>
.mw-600 {
  max-width: 600px;
}
#bypassList,
#pacScript {
  min-height: 150px;
}
</style>
