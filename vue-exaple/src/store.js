import { find } from 'lodash';
import util from '@/util';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const PAGE_SIZE = 15;

let inProgress = false;

export default new Vuex.Store({
    state: {
        isLoading: false,
        imagesCached: false,
        mediaUrl: {
            movies: `/api/movies?pageSize=${PAGE_SIZE}`,
            series: `/api/series?pageSize=${PAGE_SIZE}`
        },
        carousel: {},
        carouselContainer: {},
        mediaList: []
    },
    mutations: {
        SET_MEDIA_URL( state, { type, nextPage } ) {
            switch ( type ) {
                case 'movies':
                    state.mediaUrl.movies = nextPage;
                    break;
                case 'tv-series':
                    state.mediaUrl.series = nextPage;
                    break;
            }
        },
        SET_IS_LOADING( state, value ) {
            state.isLoading = value;
        },
        SET_MEDIA( state, data ) {
            state.mediaList = data;
        },
        SET_ACTIVE_CAROUSEL_DATA( state, { id, data } ) {
            state.carousel[id] = data;
        },
        SET_ACTIVE_CAROUSEL_CONTAINER( state, data ) {
            state.carouselContainer = data;
        },
        SET_ACTIVE_IMAGES_CASHED( state, data ) {
            state.imagesCached = data;
        }
    },
    actions: {
        cacheImages( { commit, state } ) {
            if ( state.imagesCached ) {
                commit( 'SET_IS_LOADING', true );
                util.xhr( { route: '/api/images' } ).then( imageList => {
                    let pomises = [];
                    imageList.forEach( ( imgSrc ) => {
                        pomises.push(
                            new Promise(
                                resolve => {
                                    let img = new Image();
                                    img.src = imgSrc.replace( '_UY1000', '_UY500' );
                                    img.onload = resolve;
                                    img.onerror = resolve;
                                }
                            )
                        );
                    } );

                    Promise.all( pomises ).then( () => {
                        commit( 'SET_ACTIVE_IMAGES_CASHED', true );
                        commit( 'SET_IS_LOADING', false );
                    } );
                } );
            }
        },
        getMedia( { commit, state } ) {
            util.xhr( { route: '/api/media' } ).then( ( mediaList ) => {
                commit( 'SET_MEDIA', mediaList );
            } );
        }
    },
    getters: {
        getCarouselData( state ) {
            return id => state.carousel[id] || {};
        },
        getCarouselContainerData( state ) {
            return () => state.carouselContainer;
        }
    }
})
