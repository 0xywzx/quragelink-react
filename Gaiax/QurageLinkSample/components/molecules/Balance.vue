<template>
  <div class="box">
    <h2>残高</h2>
    <p>残高: {{ balance | ethUnit }}</p>
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
    <TextInfo v-show="isUpdating">
      Updating...
    </TextInfo>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import TextInfo from '../atoms/TextInfo.vue';

function ethUnit (value: number): string {
  return `${value} wei`
}

@Component({
  components: {
    TextInfo
  },
  filters: {
    ethUnit
  }
})
export default class Balance extends Vue {
  @Prop() balance!: number
  @Prop() isUpdating!: boolean
}
</script>
