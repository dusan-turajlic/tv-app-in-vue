import { find } from 'lodash';
import util from '@/util';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const PAGE_SIZE = 15;

let inProgress = false;

export default new Vuex.Store({
    state: {
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
        SET_MEDIA( state, data ) {
            let mediaInState = find( state.mediaList, ( { type } ) => type == data.type );
            if ( !mediaInState ) {
                state.mediaList.push( data );
            }
            else {
                data.mediaData.forEach( data => mediaInState.mediaData.push( data ) );
            }
        },
        SET_ACTIVE_CAROUSEL_DATA( state, { id, data } ) {
            state.carousel[id] = data;
        },
        SET_ACTIVE_CAROUSEL_CONTAINER( state, data ) {
            state.carouselContainer = data;
        }
    },
    actions: {
        getMedia( { commit, state }, type ) {
            let url = '';
            switch ( type ) {
                case 'movies':
                    url = state.mediaUrl.movies;
                    break;
                case 'tv-series':
                    url = state.mediaUrl.series;
                    break;
            }

            if ( url ) {
                util.xhr( { route: url } ).then( ( { type, title, mediaData, nextPage } ) => {
                    commit( 'SET_MEDIA_URL', { type, nextPage } );
                    commit( 'SET_MEDIA', { type, title, mediaData } );
                    inProgress = false;
                } );
            }
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
