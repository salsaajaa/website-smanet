import { configure } from 'quasar/wrappers'

export default configure(function (ctx) {
  return {
    boot: ['pinia', 'axios'],

    css: ['app.sass'],

    extras: ['fontawesome-v6', 'line-awesome', 'material-icons'],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      vueRouterMode: 'history',
    },

    devServer: {
      port: 8080,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },

    framework: {
      config: {},

      plugins: ['Notify', 'Dialog', 'Loading'],

      iconSet: 'material-icons',
    },

    animations: [],

    ssr: {
      pwa: false,
    },

    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'quasar-app',
      },
    },

    bex: {
      contentScripts: ['my-content-script'],
    },
  }
})
