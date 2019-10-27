import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Connection from '@/Connection'

Vue.config.productionTip = false

store.commit('setConnection', new Connection(`ws://${location.hostname}:8081`))

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
