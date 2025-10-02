// cypress.config.cjs
const { devServer } = require('@cypress/vite-dev-server')
const { defineConfig } = require('cypress')
const path = require('path')

module.exports = defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      on('dev-server:start', (options) => {
        return devServer({
          ...options,
          viteConfig: {
            configFile: path.resolve(__dirname, 'vite.config.ts'),
          },
        })
      })

      return config
    },
    baseUrl: 'http://localhost:3000',
  },
})