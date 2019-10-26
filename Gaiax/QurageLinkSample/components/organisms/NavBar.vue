<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://link.qurage.app">
        <h1 class="app-name">Quragé Link Sample</h1>
      </a>

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
         data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          Uniqys
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class NavBar extends Vue {}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid gray;
  margin-bottom: 20px;
}

.navbar .app-name {
  font-weight: bold;
}
</style>

