<template>
  <header class="card-header">
    <slot />
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class CardHeader extends Vue {}
</script>
