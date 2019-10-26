<template>
  <Sample />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Sample from '~/components/templates/Sample.vue';

@Component({
  components: {
    Sample
  }
})
export default class Home extends Vue {
  message: string = 'Hello, Nuxt ts!'
}
</script>
