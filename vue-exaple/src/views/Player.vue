<template>
  <div class="video">
    <video class="video-item" ref="video"></video>
    <div ref="videoControls" id="videoControls" class="video-controls">
      <div :class="statusClass"></div>
      <div class="tiem">{{timeFormatted}}</div>
      <div class="progress-bar">
        <div ref="progressIndicator" class="progress-indigator" :style="`width: ${mediaProgress}%`"></div>
      </div>
      <div class="duration">{{durationFormatted}}</div>
    </div>
  </div>
</template>

<script>
    import { get } from 'lodash';
    import util from '@/util';

    const statusClass = {
        PLAY: 'play',
        PAUSE: 'pause'
    };

    let progressTimer = null;
    let controlsTimer = null;

    export default {
        name: 'Player',
        data() {
            return {
                time: 0,
                duration: 0,
                statusClass: statusClass.PLAY,
                mediaProgress: 0
            }
        },
        created() {
            let media = get( this.$route, 'params.media' );
            let id = get( this.$route, 'params.id' );
            util.xhr( { route: `/api/${media}/trailer/${id}` } ).then( ( {trailer} ) => {
                trailer.forEach( ( { videoMimeType, videoUrl } ) => {
                    if ( videoMimeType === 'video/mp4' ) {
                        let video = this.$refs.video;
                        video.onloadeddata = () => {
                            this.duration = video.duration * 1000;
                            this.togglePlayPause();
                        };

                        let source = document.createElement( 'source' );
                        source.src = videoUrl;
                        source.type = videoMimeType;

                        video.appendChild( source );
                        this.startPollProgress();
                        this.showControls();
                    }
                } );
            } );

            document.addEventListener( 'keydown', this.onKeyDown );
        },
        beforeDestroy() {
            document.removeEventListener( 'keydown', this.onKeyDown );
        },
        computed: {
            timeFormatted() {
                return this.getFormattedTime( this.time );
            },
            durationFormatted() {
                return this.getFormattedTime( this.duration );
            }
        },
        methods: {
            onKeyDown( event ) {
                this.showControls();

                switch ( event.keyCode ) {
                    case 13:
                        this.togglePlayPause();
                        break;
                    case 39:
                        this.seekForward();
                        break;
                    case 37:
                        this.seekBack();
                        break;
                    case 40:
                        this.hideControls();
                        break;
                    case 10009:
                    case 8:
                        this.exitPlayer();
                        break;
                }
            },
            showControls() {
                let controls = document.querySelector( '#videoControls' ) || {};
                controls.style = '';

                if ( controlsTimer ) {
                    clearInterval( controlsTimer );
                }

                controlsTimer = setInterval( () => {
                     this.hideControls()
                }, 2 * 1000 )
            },
            hideControls() {
                if ( controlsTimer ) {
                    clearInterval( controlsTimer );
                }

                let controls = document.querySelector( '#videoControls' ) || {};
                controls.style = 'top: 100%;';
            },
            exitPlayer() {
                window.history.back();
            },
            seekForward() {
                let videoApi = get( this.$refs, 'video' );
                videoApi.currentTime += 10;
            },
            seekBack() {
                let videoApi = get( this.$refs, 'video' );
                videoApi.currentTime -= 10;
            },
            startPollProgress() {
                let videoApi = get( this.$refs, 'video' );

                progressTimer = setInterval( () => {
                    let progress = (videoApi.currentTime / videoApi.duration) * 100;
                    if ( progress === 100 && videoApi.ended ) {
                        clearInterval( progressTimer );
                        this.exitPlayer();
                    }
                    this.time = videoApi.currentTime * 1000;
                    this.mediaProgress = progress;
                }, 100 )
            },
            togglePlayPause() {
                let video = get( this.$refs, `video` );

                let status = statusClass.PLAY;
                let method = statusClass.PAUSE;
                if ( video.paused ) {
                    status = statusClass.PAUSE;
                    method = statusClass.PLAY;
                }

                let playOrPause = get( video, method );
                let changeIcon = () => this.statusClass = status;

                let response = playOrPause.call( video )

                if ( response instanceof Promise ) {
                    response.then( changeIcon )
                        .catch( console.error );
                }
                else {
                    changeIcon();
                }
            },
            getFormattedTime( duration ) {
                let seconds = Math.floor( (duration / 1000) % 60 );
                let minutes = Math.floor( (duration / (1000 * 60)) % 60 );
                let hours = Math.floor( (duration / (1000 * 60 * 60)) % 24 );

                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;

                var time = '';

                if ( hours !== '00' ) {
                    time += hours + ":";
                }

                return time + minutes + ":" + seconds;
            }
        }
    }

</script>

<style scoped>

  .video {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    z-index: 10;
    background-color: black;
  }
  video.video-item {
    width: 100%;
    height: 100%;
  }
  .play:after {
    content: 'play_arrow'
  }
  .pause:after {
    content: 'pause'
  }
  .play, .pause {
    font-family: 'Material Icons';
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    left: 1em;
    top: 0;
    bottom: 0;
    margin: auto;
    color: white;
    font-size: 5em;
    text-align: center;
    line-height: 2.73em;
  }
  .video-controls {
    position: absolute;
    left: 0;
    right: 0;
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(14%, #282828), to(transparent));
    background-image: linear-gradient(to top, #282828 14%, transparent);
    bottom: 0;
    top: 80%;
    color: white;
    transition: top .3s;
  }
  .progress-bar {
    position: absolute;
    top: 6.55em;
    background-color: rgba(255, 255, 255, 0.2);
    bottom: 0;
    left: 18em;
    right: 11em;
    height: 0.3em;
    border-radius: 4em;
  }
  .progress-indigator {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 0;
    background-color: white;
    -webkit-transition: width .1s;
    transition: width .1s;
  }
  .progress-indigator:after {
    content: '';
    position: absolute;
    right: 0;
    width: 1.5em;
    height: 1.5em;
    background-color: inherit;
    top: -0.6em;
    z-index: 2;
    border-radius: 22em;
  }
  .tiem, .duration {
    position: absolute;
    font-size: 1.2em;
    bottom: 0;
    top: 0;
    margin: auto;
    line-height: 11.2em;
  }
  .tiem {
    left: 10em;
  }
  .duration {
    right: 4.5em;
  }
</style>