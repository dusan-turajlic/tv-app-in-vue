<template>
  <div class="video">
    <video class="video-item" ref="video" controls="true" autoplay="true"></video>
  </div>
</template>

<script>
    import util from '@/util'

    export default {
        name: 'Player',
        created() {
            let media = this.$route.params.media;
            let id = this.$route.params.id;
            util.xhr( { route: `/api/${media}/trailer/${id}` } ).then( ( {trailer} ) => {
                trailer.forEach( ( { videoMimeType, videoUrl } ) => {
                    if ( videoMimeType ) {
                        this.$refs.video.src = videoUrl;
                        this.$refs.video.onload = function() {
                            this.$refs.video.play();
                        }
                    }
                } )
            } );
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
    z-index: 10;
    background-color: black;
  }

  video.video-item {
    width: 100%;
    height: 100%;
  }
</style>