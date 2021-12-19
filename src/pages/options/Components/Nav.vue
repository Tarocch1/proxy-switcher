<template>
  <nav class="navbar navbar-light bg-light shadow-sm sticky-top">
    <div class="container-fluid">
      <div class="navbar-brand">
        <img src="/icons/icon128.png" alt="logo" width="32" />
      </div>
      <div class="row gx-2 me-auto">
        <div v-for="r in router.getRoutes()" :key="r.name" class="col-auto">
          <router-link
            class="btn btn-outline-danger"
            :class="{ active: route.name === r.name }"
            :to="r.path"
          >
            {{ $filters.i18n(r.name as string) }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
</script>
