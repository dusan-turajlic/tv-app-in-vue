<template>
  <div ref="highliter"></div>
</template>

<script>
    import { get } from 'lodash';

    export default {
        name: "MediaHighliter",
        beforeMount() {
            document.addEventListener( 'activeItemChanged', () => {
                let activeItem = document.querySelector( '.active img' );
                let highliter = get( this.$refs, 'highliter.style', {} );

                highliter.width = ( get( activeItem, 'clientWidth' ) || 216 ) + 'px';
                highliter.height = ( get( activeItem, 'clientHeight' ) || 320 )+ 'px';
            } )
        },
        mounted() {
            let highliter = get( this.$refs, 'highliter.style', {} );
            highliter.width = '216px';
            highliter.height = '320px';
        }
    }
</script>

<style scoped>
   div {
     position: absolute;
     left: 3.56%;
     top: 40%;
     border: 0.5em solid white;
     border-radius: 0.2em;
     padding-bottom: 2.6em;
     transition: width .2s, height .2s;
     margin-top: 4%;
     z-index: 5;
   }
</style>