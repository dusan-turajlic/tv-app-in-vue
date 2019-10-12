import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render( h ){
    var DESIGNED_WIDTH = 1080;
    var style = document.createElement( 'style' );

    function getCurrentResoScale() {
      var documentWidth = document.body.offsetHeight;

      return ( documentWidth / DESIGNED_WIDTH ) * 100;
    };

    function scaleBody() {
      var scale = getCurrentResoScale();
      style.innerHTML = ' body {' + 'zoom: ' + scale + '%; -moz-transform: scale( ' + scale / 100 + ' ); -moz-transform-origin: 0 0; }'
      document.head.appendChild( style );
    }

    scaleBody();

    return h(App)
  }
}).$mount('#app')
