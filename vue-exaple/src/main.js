import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render( h ) {
      let query = window.location.search;
      if ( !query || ~query.indexOf( 'pc' ) ) {
          /* eslint-disable */
          const DESIGNED_WIDTH = 1920;
          let style = document.createElement( 'style' );

          function getCurrentResoScale() {
              let documentWidth = document.body.offsetWidth;

              return ( documentWidth / DESIGNED_WIDTH ) * 100;
          }

          function scaleBody() {
              var scale = getCurrentResoScale();
              style.innerHTML = ' body {' + 'zoom: ' + scale + '%; -moz-transform: scale( ' + scale / 100 + ' ); -moz-transform-origin: 0 0; }'
              document.head.appendChild( style );
          }

          scaleBody();
          window.addEventListener( 'resize', scaleBody );
          /* eslint-enable */
      }
      else if ( !query || ~query.indexOf( 'samsungtizen' ) ) {
          import( './device/samsungtizen' );
      }

      return h(App)
  }
}).$mount('#app')
