<template>
  <div class="home">
    <MediaHighliter></MediaHighliter>
    <div class="carousel-wrapper">
      <div class="innet-wrapper" ref="carouselWrapper" :style="`top: ${moveTop}px;`">
          <template v-for="(media, index) in mediaList">
              <Carousel :isActive="activeIndex === index" ref="carousel" :id="media.type + '-' + index" :children="media.mediaData" :type="media.type" :title="media.title"></Carousel>
          </template>
      </div>
    </div>
  </div>
</template>

<script>
    import { get, find } from 'lodash'
    import { mapState } from 'vuex';
    import MediaHighliter from "@/components/MediaHighliter";
    import Carousel from '@/components/Carousel'

    export default {
        name: 'home',
        components: {
            Carousel,
            MediaHighliter
        },
        created() {
            this.$store.dispatch( 'getMedia', 'movies' );
            this.$store.dispatch( 'getMedia', 'tv-series' );

            document.addEventListener( 'keydown', this.onKeyDown );
            document.addEventListener( 'pagination', this.onPaginate );

            let hasData = this.$store.getters.getCarouselContainerData();
            if ( hasData && !Object.keys( hasData ).length ) {
                this.$store.commit( 'SET_ACTIVE_CAROUSEL_CONTAINER', {
                    activeIndex: 0,
                    moveTop: 0
                } );
            }
        },
        beforeDestroy() {
            document.removeEventListener( 'keydown', this.onKeyDown );
            document.removeEventListener( 'pagination', this.onPaginate );
        },
        computed: mapState( {
            mediaList: state => state.mediaList,
            moveTop: state => get( state, 'carouselContainer.moveTop', 0 ),
            activeIndex: state => get( state, 'carouselContainer.activeIndex', 0 )
        } ),
        methods: {
            onPaginate( { mediaType } ) {
                this.$store.dispatch( 'getMedia', mediaType )
            },
            onKeyDown( event ) {
                let { activeIndex, moveTop } = this.$store.getters.getCarouselContainerData();
                let container = get( this.$refs, 'carouselWrapper', {} );
                let carousel = get( this.$refs, `carousel`, [] );
                if ( event.keyCode === 40 ) {
                    if ( activeIndex >= 0 && activeIndex < carousel.length -1 ) {
                        let activeItem = get( this.$refs, `carousel[${activeIndex}]`, {} )
                        moveTop = activeItem.$el.offsetHeight * -1;
                        container.style.top = moveTop + 'px';
                        activeItem.deactivateCard();
                        ++activeIndex;
                    }
                }
                else if ( event.keyCode === 38 ) {
                    if ( activeIndex > 0 ){
                        let activeItem = get( this.$refs, `carousel[${activeIndex}]`, {} )
                        moveTop = 0;
                        container.style.top = moveTop + 'px';
                        activeItem.deactivateCard();
                        --activeIndex;
                    }
                }

                this.$store.commit( 'SET_ACTIVE_CAROUSEL_CONTAINER', { activeIndex, moveTop } );
            },
            appendToMovies( movies ) {
                if ( movies && movies.length ) {
                    this.addToMediaList( {
                        type: 'movie',
                        title: 'Movies',
                        children: movies
                    } );
                }
            },
            appendToSeries( series ) {
                if ( series && series.length ) {
                    this.addToMediaList( {
                        type: 'tv-series',
                        title: 'Series',
                        children: series
                    } );
                }
            },
            addToMediaList( mediaOptions ) {
                let media = find( this.mediaList, { type: mediaOptions.type } );
                if ( media ) {
                    mediaOptions.children.forEach( item => media.children.push( item ) );
                }
                else {
                    this.mediaList.push( mediaOptions )
                }
            },
            getMedia( type ) {
                switch ( type ) {
                    case 'movie':
                        if ( this.movieEndIndex > this.moviesPageIndex ) {
                            util.xhr( { route: `/api/movies?pageSize=${ PAGE_SIZE }&startIndex=${ ++this.moviesPageIndex }` } ).then( ( {endIndex, mediaData} ) => {
                                this.movieEndIndex = endIndex;
                                this.appendToMovies( mediaData )
                            } );
                        }
                        break;
                    case 'tv-series':
                        if ( this.serieEndIndex > this.seriesPageIndex ) {
                            util.xhr( { route: `/api/series?pageSize=${ PAGE_SIZE }&startIndex=${ ++this.seriesPageIndex }` } ).then( ( {endIndex, mediaData} ) => {
                                this.serieEndIndex = endIndex;
                                this.appendToSeries( mediaData );
                            } );
                        }
                      break;
                }
            }
        }
    }
</script>
<style scoped>
  .home {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .carousel-wrapper {
    position: absolute;
    top: 27em;
    padding-left: 3.65%;
    z-index: 2;
    overflow-y: hidden;
  }

  .innet-wrapper {
    position: relative;
    top: 0;
    transition: top 0.3s;
  }

</style>