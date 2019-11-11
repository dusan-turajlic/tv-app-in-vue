<template>
  <div class="outer">
    <div class="carousel-title">{{title}}</div>
    <div ref="wrapper" class="wrapper" :style="'left:' + moveLeft + 'px'">
      <template v-for="child in children">
        <MediaCard :key="child.id" ref="mediaCard" v-if="child" :media="child" :src="child.image.replace( '_UY1000', '_UY200' )" :name="child.title" :link="`/play/${child.type}/${child.id}`"></MediaCard>
      </template>
    </div>
  </div>
</template>

<script>
    import { get } from 'lodash'
    import { mapState } from 'vuex';
    import MediaCard from '@/components/MediaCard.vue'

    export default {
        name: 'Carousel',
        components: {
            MediaCard
        },
        props: {
            id: String,
            type: String,
            title: String,
            isActive: Boolean,
            direction: String,
            children: Array
        },
        mounted() {
            let data = this.$store.getters.getCarouselData( this.id );
            if ( data && !Object.keys( data ).length ) {
                this.$store.commit( 'SET_ACTIVE_CAROUSEL_DATA', {
                    id: this.id,
                    data: {
                        moveLeft: 0,
                        activeIndex: 0
                    }
                } );
            }

            document.addEventListener( 'keydown', this.onKeyDown );
            this.activateCard();
        },
        updated() {
            this.activateCard()
        },
        beforeDestroy() {
          document.removeEventListener( 'keydown', this.onKeyDown );
        },
        computed: mapState( {
            moveLeft( state ) {
                return get( state, `carousel[${this.id}].moveLeft`, 0 );
            }
        } ),
        methods: {
            onKeyDown() {
                if ( this.isActive ) {
                    let wrapperStyle = get( this.$refs, 'wrapper.style', {} );
                    wrapperStyle.left = this.moveWrapper( event ) + 'px';
                }
            },
            moveWrapper( { keyCode } ) {
                let { activeIndex, moveLeft } = this.$store.getters.getCarouselData( this.id );
                let containerWidth = get( this.$refs, 'wrapper.offsetWidth', 0 );
                this.deactivateCard();

                if ( keyCode ) {
                    switch ( keyCode ) {
                        case 39:
                            let previousCardWidth = get( this.$refs, `mediaCard[${ activeIndex }].$refs.card.offsetWidth`, 0 );
                            let forward = moveLeft - previousCardWidth;
                            let hasNextItem = get( this.$refs, `mediaCard[${ activeIndex + 1 }]`, false );
                            if ( forward > (containerWidth * -1) && hasNextItem ) {
                                ++activeIndex;
                                moveLeft = forward;
                                this.$store.commit( 'SET_ACTIVE_CAROUSEL_DATA', {
                                    id: this.id,
                                    data: {
                                        activeIndex,
                                        moveLeft
                                    }
                                } );
                            }
                            break;
                        case 37:
                            let nextCardWidth = get( this.$refs, `mediaCard[${ activeIndex - 1 }].$refs.card.offsetWidth`, 0 );
                            let backward = moveLeft + nextCardWidth;
                            if ( backward <= 0 ) {
                                if ( activeIndex > 0 ) {
                                    --activeIndex;
                                }
                                moveLeft = backward;
                                this.$store.commit( 'SET_ACTIVE_CAROUSEL_DATA', {
                                    id: this.id,
                                    data: {
                                        activeIndex,
                                        moveLeft
                                    }
                                } );
                            }
                            break;
                        case 13:
                            let card = get( this.$refs, `mediaCard[${ activeIndex }].$refs.card`, {
                                click: () => {
                                }
                            } );
                            card.click();
                            break;

                    }
                }

                if ( ( ( activeIndex - ( this.children.length - 1 ) ) * -1 ) < 7 ) {
                  this.emitPaginate();
                }

                this.activateCard();

                return moveLeft;
            },
            deactivateCard() {
                let { activeIndex } = this.$store.getters.getCarouselData( this.id );
                let lastCard = get( this.$refs, `mediaCard[${ activeIndex }]`, {} );
                lastCard.active = false;
            },
            activateCard() {
                if ( this.isActive ) {
                    let { activeIndex } = this.$store.getters.getCarouselData( this.id );
                    let card = get( this.$refs, 'mediaCard[' + activeIndex + ']', {} );
                    card.active = true;
                }
            },
            emitPaginate() {
                var event = new Event( 'pagination' );
                event.mediaType = this.type;
                document.dispatchEvent( event );
            }
        },
    }
</script>

<style scoped>
  .outer {
    padding-bottom: 2em;
    min-height: 27.6em;
    position: relative;
  }

  .carousel-title {
    padding: 0 0.1em 0.4em;
  }

  .wrapper {
    left: 0;
    white-space: nowrap;
    position: relative;
    width: 100%;
    text-align: left;
    transition: left .3s;
  }

  .carousel-title {
    color: white;
    font-family: 'Raleway', sans-serif;
    text-align: left;
    position: relative;
    font-size: 3em;
  }

</style>