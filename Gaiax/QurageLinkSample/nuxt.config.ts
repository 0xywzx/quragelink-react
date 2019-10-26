import path from 'path'

import { Configuration } from 'webpack'
import { Context } from '@nuxt/vue-app'

const baseDir = process.env.NODE_ENV === 'production' ? '/sample' : '/'

const pkg = require('./package')

export default {
  mode: 'spa',
  server: {
    host: '0.0.0.0'
  },
  router: {
    base: baseDir,
  },
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css' }
    ],
    script: [
      { type: 'text/javascript', src: 'https://use.fontawesome.com/releases/v5.3.1/js/all.js' }
    ]
  },
  modules: [
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma'
  ],
  build: {
    extend (config: Configuration, { isClient }: Context) {
      if (isClient) {
        config.devtool = '#source-map'
      }
      config.resolve = {
        alias: {
          '@': path.resolve(__dirname),
          '~': path.resolve(__dirname)
        }
      }
    },
    optimization: {
      minimize: false
    }
  }
}
