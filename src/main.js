import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueAxios } from './utils/request'

import Spin from 'ant-design-vue/es/spin/Spin'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

Vue.use(VueI18n, VueAxios, router, VueCookies)

Spin.setDefaultIndicator({
  indicator: (h) => {
    return <a-icon type="loading" style="font-size: 30px" spin />
  }
})

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const i18n = new VueI18n({
  locale: Vue.ls.get('current_locale') || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

export default i18n

new Vue({
  router,
  store,
  i18n,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
