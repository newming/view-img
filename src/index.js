import Vue from 'vue'
import App from './App'

import ViewImg from './plugin/main'
Vue.use(ViewImg)

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(App)
})
