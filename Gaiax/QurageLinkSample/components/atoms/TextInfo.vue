<template>
  <p class="has-text-success">
    <slot />
  </p>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class TextInfo extends Vue {}
</script>
