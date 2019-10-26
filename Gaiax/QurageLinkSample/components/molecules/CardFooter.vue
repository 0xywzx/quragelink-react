<template>
  <footer class="card-footer">
    <slot />
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class CardFooter extends Vue {}
</script>
