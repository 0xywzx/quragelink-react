<template>
  <div>
    <Link
      :linkResult="linkResult"
      @updateLink="setLinkResult"
    />
    <SignMessage :isLinked="isLinked" />
    <Transaction :isLinked="isLinked" :linkResult="linkResult" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { LinkResult } from '@uniqys/qurage-link-lib'

import Link from '../organisms/Link.vue'
import SignMessage from '../organisms/SignMessage.vue'
import Transaction from '../organisms/Transaction.vue'

@Component({
  components: {
    Transaction,
    SignMessage,
    Link
  }
})
export default class Sample extends Vue {
  linkResult: LinkResult | null = null

  get isLinked (): boolean {
    return this.linkResult !== null
  }

  public setLinkResult (result: LinkResult) {
    this.linkResult = result
  }
}
</script>
