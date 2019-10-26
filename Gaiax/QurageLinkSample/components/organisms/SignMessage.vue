<template>
  <div class="card block">
    <CardHeader>
      <CardTitle>Sign Message</CardTitle>
      <CardIcon />
    </CardHeader>

    <CardContent>
      <template v-if="isLinked">
        <div class="test-sign-message">
          <SignMessageContent
            :title="'Net version'"
            :message="message.netVersion"
            @web3="netVersionWeb3()"
            @ethereum="netVersionEthereum()"
          />
          <SignMessageContent
            :title="'Sign message'"
            :message="message.eth"
            @web3="ethSignWeb3(signMessage)"
            @ethereum="ethSignEthereum(signMessage)"
          />
          <SignMessageContent
            :title="'Personal message'"
            :message="message.personal"
            @web3="personalSignWeb3(personalSignText)"
            @ethereum="personalSignEthereum(personalSignText)"
          />
          <SignMessageContent
            :title="'Typed message'"
            :message="message.typed"
            :disabledWeb3="true"
            @web3="null"
            @ethereum="typedMessageEthereum(typedMessage)"
          />
          <SignMessageContent
            :title="'EC Recover from Personal message'"
            :message="recoveredMessage"
            @web3="ecRecoverWeb3(personalSignText, (message.personal).split(': ')[1])"
            @ethereum="ecRecoverEthereum(personalSignText, (message.personal).split(': ')[1])"
          />
        </div>
      </template>
      <template v-else>
        not linked
      </template>
      <TextInfo v-if="isSigning">
        Signing...
      </TextInfo>
    </CardContent>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { JsonRPCResponse, ProviderMethod, ResultCallback } from '@uniqys/qurage-link-lib'

import CardTitle from '../atoms/CardTitle.vue'
import CardIcon from '../atoms/CardIcon.vue'
import CardHeader from '../molecules/CardHeader.vue'
import CardContent from '../molecules/CardContent.vue'
import SignMessageContent from '../molecules/SignMessageContent.vue'
import TextInfo from '../atoms/TextInfo.vue'


interface SignedMessage {
  eth: string
  personal: string
  typed: string
  netVersion: string
}

@Component({
  components: {
    TextInfo,
    SignMessageContent,
    CardHeader,
    CardTitle,
    CardIcon,
    CardContent,
  },
})
export default class SignMessageCard extends Vue {
  @Prop() isLinked!: boolean
  isSigning: boolean = false

  readonly signMessage = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
  readonly personalSignText = 'Hello, Quragé Link!'
  readonly typedMessage = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Mail",
    domain: {
      name: "Ether Mail",
      version: "1",
      chainId: 1,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    },
    message: {
      from: { name: "Cow", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826" },
      to: { name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" },
      contents: "Hello, Bob!",
    },
  })

  recoveredMessage = ''
  message: SignedMessage = {
    eth: '',
    personal: '',
    typed: '',
    netVersion: '',
  }

  private get web3 (): any {
    return (window as any).web3
  }

  private get ethereum (): any {
    return (window as any).ethereum
  }

  netVersionWeb3 () {
    const web3 = this.web3
    try {
      const netVersion = web3.version.network
      this.message.netVersion = netVersion
    } catch (error) {
      console.error(error)
    }
  }

  async netVersionEthereum () {
    const web3 = this.ethereum
    try {
      const netVersion = await web3.eth.net.getId()
      this.message.netVersion = netVersion
    } catch (error) {
      console.error(error)
    }
  }

  ethSignWeb3 (message: string) {
    this.isSigning = true

    const web3 = this.web3

    const from = web3.eth.defaultAccount.toLowerCase()
    web3.eth.sign(from, message, (err: Error, result: string) => {
      try {
        if (err) {
          return console.error(err)
        }
        this.message.eth = `SIGNED: ${result}`
      } finally {
        this.isSigning = false
      }
    })
  }

  async ethSignEthereum (message: string): Promise<void> {
    await this.signAsyncWithState(async () => {
      const web3 = this.ethereum

      const [from] = await this.getAddress(web3)
      await web3.eth.sign(message, from)
        .then((sign: string) => this.message.eth = `SIGNED: ${sign}`)
        .catch((err: Error) => console.error(err))
    })
  }

  async personalSignWeb3 (text: string): Promise<void> {
    await this.signAsyncWithState(async () => {
      const web3 = this.web3
      const from = web3.eth.defaultAccount.toLowerCase() // FIXME: account[0]
      const callback: ResultCallback = (err, result) => {
        if (err) { return console.error(err) }
        this.message.personal = `PERSONAL SIGNED: ${result.result}`
      }

      await web3.currentProvider.sendAsync({
        from,
        method: ProviderMethod.PersonalSign,
        params: [from, text],
        jsonrpc: '2.0',
      }, callback)
    })
  }

  async personalSignEthereum (text: string): Promise<void> {
    await this.signAsyncWithState(async () => {
      const web3 = this.ethereum

      const [from] = await web3.eth.getAccounts()
      await this.send(ProviderMethod.PersonalSign, [from, text])
        .then(sign => this.message.personal = `SIGNED: ${sign.result}`)
        .catch(err => console.error(err))
    })
  }

  async typedMessageEthereum (text: string): Promise<void> {
    await this.signAsyncWithState(async () => {
      const web3 = this.ethereum

      const [from] = await web3.eth.getAccounts()
      await this.send(ProviderMethod.EthSignTypedDataV3, [from, text])
        .then(sign => this.message.typed = `SIGNED TYPED MESSAGE: ${sign.result}`)
        .catch(err => console.error(err))
    })
  }

  async ecRecoverWeb3 (message: string, signature: string): Promise<void> {
    await this.signAsyncWithState(async () => {
      const web3 = this.web3

      const from = web3.eth.defaultAccount.toLowerCase()
      const callback: ResultCallback = (err, result) => {
        if (err) {
          return console.error(err)
        }

        const recovered = result.result
        this.recoveredMessage = `RECOVERED ADDRESS: ${recovered}`
      }

      await web3.currentProvider.sendAsync({
        from,
        method: ProviderMethod.PersonalECRecover,
        params: [message, signature],
        jsonrpc: '2.0',
      }, callback)
    })
  }

  async ecRecoverEthereum (message: string, signature: string): Promise<void> {
    await this.signAsyncWithState(async () => {
      const web3 = this.ethereum

      const [from] = await web3.eth.getAccounts()
      const callback: ResultCallback = (err, result) => {
        if (err) {
          return console.error(err)
        }

        const recovered = result.result;
        this.recoveredMessage = `RECOVERED ADDRESS: ${recovered}`
      }

      await web3.currentProvider.send({
        from,
        method: ProviderMethod.PersonalECRecover,
        params: [message, signature],
        jsonrpc: '2.0',
      }, callback)
    })
  }

  // EIP-1193 compatibility
  private async send (method: string, params: any[]): Promise<JsonRPCResponse> {
    const web3 = this.ethereum

    return new Promise<JsonRPCResponse>((resolve, reject) => {
      const callback = (err: Error | null, res: JsonRPCResponse) => {
        if (err) {
          reject(err)
          return
        }
        if (!res) {
          reject(new Error('send: occurred error'))
          return
        }
        if (res.error) {
          reject(new Error(res.error))
          return
        }
        resolve(res)
      }

      web3.currentProvider
        .send({
          id: 0,
          jsonrpc: '2.0',
          method,
          params,
        }, callback)
    })
  }

  private async signAsyncWithState (signer: () => Promise<void>): Promise<void> {
    this.isSigning = true
    try {
      await signer()
    } finally {
      this.isSigning = false
    }
  }

  private async getAddress (web3: any): Promise<string> {
    return web3.isMetaMask
      ? web3.selectedAddress
      : web3.eth.getAccounts()
  }
}
</script>
