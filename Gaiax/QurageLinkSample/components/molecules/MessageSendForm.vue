<template>
  <div class="box">
    <div class="field">
      <h2>メッセージ送信</h2>
      <div v-if="linkResult">
        <p>ウォレットのネットワークをropstenに設定してください<br><a :href="`https://ropsten.etherscan.io/address/${linkResult.address}`" target="_blank">ウォレットの確認(Etherscan)</a></p>
      </div>
      <div class="control">
        <input
          v-model="message"
          @input="$emit('update:message', message)"
          class="input"
          placeholder="message"
          type="text"
        >
      </div>
      <div class="control">
        <button
          :disabled="isSending"
          class="button is-primary"
          @click="clickWeb3"
        >
          web3 0.20
        </button>
        <button
          :disabled="isSending"
          class="button is-primary"
          @click="clickEthereum"
        >
          web3 1.0
        </button>
      </div>
      <TextInfo v-show="isSending">
        Sending...
      </TextInfo>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import TextInfo from '../atoms/TextInfo.vue';
import { LinkResult } from '@uniqys/qurage-link-lib'

@Component({
  components: {
    TextInfo
  }
})
export default class MessageSendForm extends Vue {
  @Prop() isSending!: boolean
  @Prop() linkResult!: LinkResult | null

  message: string = ''

  clickWeb3 (): void {
    this.$emit('web3')
    this.message = ''
  }

  clickEthereum (): void {
    this.$emit('ethereum')
    this.message = ''
  }
}
</script>
