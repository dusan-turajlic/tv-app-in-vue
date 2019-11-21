<template>
  <div class="container">
    <div class="details">
      <div class="title">{{title}}</div>
      <div class="description">{{description}}</div>
      <div v-if="genre.length" class="genre">Genre : <span>{{ genre }}</span></div>
    </div>
    <div class="backdrop">
      <img ref="backdrop">
    </div>
  </div>
</template>

<script>
    import util from '@/util';
    import { get } from 'lodash';

    let delay;

    export default {
        name: 'Details',
        data() {
            return {
                title: '',
                genre: '',
                description: ''
            }
        },
        beforeCreate() {
            document.addEventListener( 'activeItemChanged', ( { mediaItem } ) => {
                if ( mediaItem ) {
                    if ( delay ) {
                        clearInterval( delay );
                    }

                    delay = setTimeout( () => {
                        let activeItem = document.querySelector( '.active' );
                        this.title = mediaItem.title;
                        this.description = mediaItem.description;
                        if ( mediaItem.genre.length ) {
                            this.genre = mediaItem.genre.join( ', ' );
                        }

                        if ( mediaItem.trailer ) {
                            util.xhr( { method: 'POST', route: '/api/slate', body: { trailerUrl: mediaItem.trailer } } ).then( ( response ) => {
                                this.$refs.backdrop.src = response.slateUrl;
                            } );
                        }
                    }, 750 );
                }
            } )
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: block;
    height: 71%;
  }

  .details {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    color: white;
    text-align: left;
    padding: 4.4em;
    z-index: 1;
    background-image: linear-gradient(to right, #282828 50%, transparent);
  }

  .title {
    position: relative;
    white-space: nowrap;
    width: 57%;
    margin-bottom: 0.3em;
    font-size: 5em;
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  .description {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    font-size: 2em;
    width: 50%;
  }

  .backdrop img {
    width: 100%
  }

  .backdrop {
    position: absolute;
    right: 0;
    width: 60%;
    top: -5em;
  }

  .genre {
    font-size: 1.8em;
    font-weight: bold;
    font-family: 'Raleway', sans-serif;
    padding-top: 1em;
  }

  .genre > span {
    font-family: "Roboto", Helvetica, Arial, sans-serif;
  }

</style>
