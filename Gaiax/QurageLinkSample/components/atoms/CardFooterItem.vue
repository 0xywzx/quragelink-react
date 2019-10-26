<template>
  <a href="#" class="card-footer-item" @click="$emit('click')">
    <slot />
  </a>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class CardFooterItem extends Vue {}
</script>
