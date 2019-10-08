<template>
  <div class="outer">
    <div class="carousel-title">{{title}}</div>
    <div ref="wrapper" class="wrapper">
      <template v-for="child in children">
        <MediaCard :key="child.id" ref="mediaCard" v-if="child" :media="child" :src="child.image.replace( '_UY1000', '_UY320' )" :name="child.title" :link="`/play/${child.type}/${child.id}`"></MediaCard>
      </template>
    </div>
  </div>
</template>

<script>
    import { get } from 'lodash'
    import MediaCard from '@/components/MediaCard.vue'

    export default {
        name: 'Carousel',
        components: {
            MediaCard
        },
        props: {
            type: String,
            title: String,
            isActive: Boolean,
            direction: String,
            children: Array
        },
        data() {
            return {
                moveLeft: 0,
                activeItem: 0
            }
        },
        mounted() {
          document.addEventListener( 'keydown', event => {
              if ( this.isActive ) {
                  let wrapperStyle = get( this.$refs, 'wrapper.style', {} );
                  wrapperStyle.left = this.moveWrapper( event ) + 'px';
              }
          } );

          this.activateCard();
        },
        updated() {
            this.activateCard();
        },
        methods: {
            moveWrapper( event ) {
                let containerWidth = get( this.$refs, 'wrapper.offsetWidth', 0 );
                this.deactivateCard();

                switch ( event.keyCode ) {
                    case 39:
                        let previousCardWidth = get( this.$refs, `mediaCard[${ this.activeItem }].$refs.card.offsetWidth`, 0 );
                        let forward = this.moveLeft - previousCardWidth;
                        if ( forward > (containerWidth * -1) ) {
                            ++this.activeItem;
                            this.moveLeft = forward;
                        }
                        break;
                    case 37:
                        let nextCardWidth = get( this.$refs, `mediaCard[${ this.activeItem - 1 }].$refs.card.offsetWidth`, 0 );
                        let backward = this.moveLeft + nextCardWidth;
                        if ( backward <= 0 ) {
                            if ( this.activeItem > 0 ) {
                                --this.activeItem;
                            }
                            this.moveLeft = backward;
                        }
                        break;
                    case 13:
                        let card = get( this.$refs, `mediaCard[${ this.activeItem }].$refs.card`, 0 );
                        card.click();
                        break;

                }

                if ( ( ( this.activeItem - ( this.children.length - 1 ) ) * -1 ) < 7 ) {
                  this.emitPaginate();
                }

                this.activateCard();

                return this.moveLeft;
            },
            deactivateCard() {
                let lastCard = get( this.$refs, `mediaCard[${ this.activeItem }]`, {} );
                lastCard.active = false;
            },
            activateCard() {
                if ( this.isActive ) {
                    let card = get( this.$refs, 'mediaCard[' + this.activeItem + ']', {} );
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