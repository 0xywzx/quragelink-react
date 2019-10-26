<template>
  <div class="card-content">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class CardContent extends Vue {}
</script>
