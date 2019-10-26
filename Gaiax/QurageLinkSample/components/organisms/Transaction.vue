<template>
  <div class="card block">
    <CardHeader>
      <CardTitle>Transaction</CardTitle>
      <CardIcon />
    </CardHeader>

    <CardContent>
      <template v-if="isLinked">
        <Balance
          :balance="balance"
          :isUpdating="isBalanceUpdating"
          @web3="updateBalanceWeb3"
          @ethereum="updateBalanceEthereum"
        />
        <Messages
          :messages="messages"
          :isUpdating="isMessagesUpdating"
          @web3="updateMessagesWeb3"
          @ethereum="updateMessagesEthereum"
        />
        <MessageSendForm
          :message.sync="message"
          :isSending="isMessageSending"
          :linkResult="linkResult"
          @web3="sendMessageTransactionWeb3"
          @ethereum="sendMessageTransactionEthereum"
        />
      </template>
      <template v-else>
        not linked
      </template>
    </CardContent>
  </div>
</template>

<script lang="ts">
import { promisify } from 'util'

import { Component, Prop, Vue } from 'nuxt-property-decorator'

import Artifact from '../../assets/contract/Messages.json'
import { Message } from '../../types'

import CardIcon from '../atoms/CardIcon.vue'
import CardTitle from '../atoms/CardTitle.vue'
import CardHeader from '../molecules/CardHeader.vue'
import CardContent from '../molecules/CardContent.vue'
import Balance from '../molecules/Balance.vue'
import Messages from '../molecules/Messages.vue'
import MessageSendForm from '../molecules/MessageSendForm.vue'

import { LinkResult } from '@uniqys/qurage-link-lib'

const Contract = require('truffle-contract')

@Component({
  components: {
    MessageSendForm,
    Messages,
    Balance,
    CardHeader,
    CardTitle,
    CardIcon,
    CardContent
  }
})
export default class Transaction extends Vue {
  @Prop() isLinked!: boolean
  @Prop() linkResult!: LinkResult | null
  isMessageSending: boolean = false
  isMessagesUpdating: boolean = false
  isBalanceUpdating: boolean = false

  balance: number = 0
  message: string = ''
  messages: Message[] = []

  private get web3 (): any {
    const web3 = (window as any).web3
    if (!web3) {
      throw new Error('web3: `window.web3` not found')
    }
    return web3
  }

  private get ethereum (): any {
    const ethereum = (window as any).ethereum
    if (!ethereum) {
      throw new Error('ethereum: `window.ethereum` not found')
    }
    return ethereum
  }

  private get web3Provider (): any {
    const provider = this.web3.currentProvider
    if (!provider) {
      throw new Error('web3Provider: `window.web3.currentProvider` not found')
    }
    return provider
  }

  private get ethereumProvider (): any {
    const provider = this.ethereum.currentProvider
    if (!provider) {
      throw new Error('ethereumProvider: `window.ethereum.currentProvider` not found')
    }
    return provider
  }

  private get account (): any {
    return this.web3.eth.defaultAccount
  }

  private get web3Contract (): any {
    const contract = Contract(Artifact)
    contract.setProvider(this.web3Provider)
    return contract
  }

  private get ethereumContract (): any {
    const contract = Contract(Artifact)
    contract.setProvider(this.ethereumProvider)
    return contract
  }

  async updateBalanceWeb3 (): Promise<void> {
    await this.updateBalanceWithState(async () => {
      const balance = await promisify(this.web3.eth.getBalance)(this.account) as any as string
      this.balance = parseInt(balance, 10)
    })
  }

  async updateBalanceEthereum (): Promise<void> {
    await this.updateBalanceWithState(async () => {
      const [address] = await this.ethereum.eth.getAccounts()
      const balance = await this.ethereum.eth.getBalance(address) as any as string
      this.balance = parseInt(balance, 10)
    })
  }

  async updateMessagesWeb3 (): Promise<void> {
    await this.updateMessagesWithState(async () => {
      const contract = await this.web3Contract.deployed()
      await this.updateMessages(contract)
    })
  }

  async updateMessagesEthereum (): Promise<void> {
    await this.updateMessagesWithState(async () => {
      const contract = await this.ethereumContract.deployed()
      await this.updateMessages(contract)
    })
  }

  async sendMessageTransactionWeb3 (): Promise<void> {
    if (!this.message) { return }

    await this.sendMessageTransactionWithState(async () => {
      const message = this.message
      this.message = ''

      const contract = await this.web3Contract.deployed()
      await this.sendMessageTransaction(contract, message)
    })
  }

  async sendMessageTransactionEthereum (): Promise<void> {
    if (!this.message) { return }

    await this.sendMessageTransactionWithState(async () => {
      const message = this.message
      this.message = ''

      const contract = await this.ethereumContract.deployed()
      await this.sendMessageTransaction(contract, message)
    })
  }

  private async sendMessageTransaction (contract: any, message: string): Promise<void> {
    try {
      await contract.postMessageTraditional(message, { from: this.account })
    } catch (err) {
      console.error('sendMessageTransaction:', err.message)
    }
  }

  private async updateMessages (contract: any): Promise<void> {
    const count = parseInt(await contract.count.call(), 10)
    const messages = await Promise.all(
      [...Array(count).keys()].reverse()
        .map(key => contract.messages.call(key))
    )
    this.messages = messages
  }

  private async updateBalanceWithState (updater: () => Promise<void>): Promise<void> {
    this.isBalanceUpdating = true
    try {
      await updater()
    } finally {
      this.isBalanceUpdating = false
    }
  }

  private async updateMessagesWithState (updater: () => Promise<void>): Promise<void> {
    this.isMessagesUpdating = true
    try {
      await updater()
    } finally {
      this.isMessagesUpdating = false
    }
  }

  private async sendMessageTransactionWithState (sender: () => Promise<void>): Promise<void> {
    this.isMessageSending = true
    try {
      await sender()
    } finally {
      this.isMessageSending = false
    }
  }
}
</script>
