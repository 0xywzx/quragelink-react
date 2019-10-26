<template>
  <div v-if="data">
    {{ data.sender }}: {{ data.contents }}<br>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Message as MessageData } from '../../types'

@Component
export default class Message extends Vue {
  @Prop() data!: MessageData | null
}
</script>
