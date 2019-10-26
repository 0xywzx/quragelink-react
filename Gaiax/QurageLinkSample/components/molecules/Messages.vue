<template>
  <div class="box">
    <h2>メッセージ</h2>
    <p v-if="messages">
    <span v-for="(message, index) in messages" :key="index">
      <Message :data="message" />
    </span>
    </p>
    <button
      class="button is-primary"
      @click="$emit('web3')"
    >
      web3 0.20
    </button>
    <button
      class="button is-primary"
      @click="$emit('ethereum')"
    >
      web3 1.0
    </button>
    <TextInfo v-if="isUpdating">
      Updating...
    </TextInfo>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Message as MessageData } from '../../types'
import Message from '../atoms/Message.vue'
import TextInfo from '../atoms/TextInfo.vue';

@Component({
  components: {
    TextInfo,
    Message
  }
})
export default class Messages extends Vue {
  @Prop() messages!: MessageData[]
  @Prop() isUpdating!: boolean
}
</script>
