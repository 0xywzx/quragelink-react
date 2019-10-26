<template>
  <p class="card-header-title">
    <slot />
  </p>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class CardTitle extends Vue {}
</script>
