<template>
  <div class="card block">
    <CardHeader>
      <CardTitle>QR Code Link</CardTitle>
      <CardIcon />
    </CardHeader>

    <CardContent>
      <QRCode id="qrcode" />
      <TextInfo v-if="isLinking">
        Linking...
      </TextInfo>
      <TextInfo v-else-if="linkResult">
        連携済みアドレス: {{ linkResult.address }}
      </TextInfo>
    </CardContent>

    <CardFooter>
      <CardFooterItem
        :disabled="linkResult"
        @click="linkWithQRCode()"
      >
        QR Codeでリンク
      </CardFooterItem>
      <CardFooterItem
        :disabled="linkResult"
        @click="linkWithDeepLink()"
      >
        Deeplinkでリンク
      </CardFooterItem>
      <CardFooterItem
        :disabled="isLinking"
        @click="disconnect()"
      >
        リンクを切断
      </CardFooterItem>
    </CardFooter>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { QurageLinkFactory, LinkResult } from '@uniqys/qurage-link-lib'

import CardFooterItem from '../atoms/CardFooterItem.vue'
import TextInfo from '../atoms/TextInfo.vue'
import QRCode from '../atoms/QRCode.vue'
import CardHeader from '../molecules/CardHeader.vue'
import CardTitle from '../atoms/CardTitle.vue'
import CardIcon from '../atoms/CardIcon.vue'
import CardContent from '../molecules/CardContent.vue'
import CardFooter from '../molecules/CardFooter.vue'

@Component({
  components: {
    CardHeader,
    CardTitle,
    CardIcon,
    CardContent,
    QRCode,
    TextInfo,
    CardFooter,
    CardFooterItem
  }
})
export default class Link extends Vue {
  private endpoint = 'https://ropsten.infura.io/v3/4e9bff6ea68242e7bb798cc8acdc8afa'
  private qurageLink = QurageLinkFactory.create({
    endpoint: this.endpoint,
    dappName: 'Quragé Link Sample App',
    netVersion: '3'
  })

  @Prop() linkResult!: LinkResult | null
  isLinking: boolean = false

  private get qrcode (): HTMLCanvasElement {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement
    if (!canvas) {
      throw new Error('QRCode canvas not found')
    }
    return canvas
  }

  async mounted () {
    try {
      const shouldOverwrite = confirm('web3を上書きしますか？')
      await this.linkWithState(() => this.qurageLink.relink(shouldOverwrite))
    } catch (e) {
      console.error('mounted:', e.message)
    }
  }

  async linkWithQRCode () {
    try {
      const shouldOverwrite = confirm('web3を上書きしますか？')
      await this.linkWithState(() => this.qurageLink.linkWithQRCode(this.qrcode, shouldOverwrite))
    } catch (e) {
      console.error('linkWithQRCode:', e.message)
    }
  }

  async linkWithDeepLink () {
    try {
      const shouldOverwrite = confirm('web3を上書きしますか？')
      await this.linkWithState(() => this.qurageLink.linkWithDeepLink(shouldOverwrite))
    } catch (e) {
      console.error('linkWithDeepLink:', e.message)
    }
  }

  async disconnect () {
    this.isLinking = false
    this.$emit('updateLink', null)

    this.clearQRCode()
    await this.qurageLink.unlink()
  }

  private async linkWithState (linker: () => Promise<LinkResult | null>): Promise<void> {
    this.isLinking = true
    try {
      const result = await linker()
      this.$emit('updateLink', result)
    } catch {
      throw new Error('link result not found')
    } finally {
      this.isLinking = false
    }
  }

  private clearQRCode () {
    const { width, height } = this.qrcode
    try {
      this.qrcode
        .getContext('2d')!
        .clearRect(0, 0, width, height)
    } catch (e) {
      console.error('clearQRCode:', e.message)
    }
  }
}
</script>
