// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import jquery from '../../lib/jquery'
import Materialize from '../../lib/materialize-css/js/materialize.min'
Vue.config.productionTip = false

console.log(Materialize, jquery)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
