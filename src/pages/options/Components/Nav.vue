<template>
  <nav class="navbar navbar-light bg-light shadow-sm sticky-top">
    <div class="container-fluid">
      <div class="navbar-brand">
        <img src="/icons/icon128.png" alt="logo" width="32" />
        <span class="ms-3">Proxy Switcher</span>
      </div>
      <ul class="navbar-nav me-auto">
        <li v-for="r in router.getRoutes()" class="nav-item">
          <router-link
            class="nav-link"
            :class="{ active: route.name === r.name }"
            :to="r.path"
          >
            {{ $filters.i18n(r.name as string) }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
</script>
