<template>
  <div class="home">
    <MediaHighliter></MediaHighliter>
    <div class="carousel-wrapper">
      <div class="innet-wrapper" ref="carouselWrapper">
          <template v-for="(media, index) in mediaList">
              <Carousel :isActive="activeCarousel === index" ref="carousel" :children="media.children" :type="media.type" :title="media.title"></Carousel>
          </template>
      </div>
    </div>
  </div>
</template>

<script>
    import { get, find } from 'lodash'
    import util from '@/util'
    import MediaHighliter from "@/components/MediaHighliter";
    import Carousel from '@/components/Carousel'

    const PAGE_SIZE = 15;

    export default {
        name: 'home',
        components: {
            Carousel,
            MediaHighliter
        },
        data() {
            return {
                activeCarousel: 0,
                moviesPageIndex: -1,
                seriesPageIndex: -1,
                movieEndIndex: 0,
                serieEndIndex: 0,
                mediaList: []
            }
        },
        created() {
            this.getMedia( 'movie' );
            this.getMedia( 'tv-series' );

            document.addEventListener( 'pagination', event => {
                this.getMedia( event.mediaType );
            } );
        },
        mounted() {
            document.addEventListener( 'keydown', event => {
                let container = window.test = get( this.$refs, 'carouselWrapper', {} );
                let carousel = get( this.$refs, `carousel`, [] );
                if ( event.keyCode === 40 ) {
                    if ( this.activeCarousel >= 0 && this.activeCarousel < carousel.length -1 ) {
                        let activeItem = get( this.$refs, `carousel[${this.activeCarousel}]`, {} )
                        container.style.top = activeItem.$el.offsetHeight * -1 + 'px';
                        activeItem.deactivateCard();
                        ++this.activeCarousel;
                    }
                }
                else if ( event.keyCode === 38 ) {
                    if ( this.activeCarousel > 0 ){
                        let activeItem = get( this.$refs, `carousel[${this.activeCarousel}]`, {} )
                        container.style.top = 0 + 'px';
                        activeItem.deactivateCard();
                        --this.activeCarousel;
                    }
                }
            } );
        },
        updated() {
            console.log( this.activeCarousel );
        },
        methods: {
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
    top: 40%;
    left: 3.65%;
    z-index: 2;
    overflow-y: hidden;
    overflow-x: visible;
  }

  .innet-wrapper {
    position: relative;
    top: 0;
    transition: top 0.3s;
  }

</style>