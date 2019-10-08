<template>
  <a ref="card" :class="{ active: active }" :href="link">
    <img ref="image" :alt="name" :src="src">
    <span>{{name}}</span>
  </a>
</template>

<script>
    import 'hooper/dist/hooper.css';

    export default {
        name: "MediaCard",
        props: {
            src: String,
            name: String,
            link: String,
            media: Object
        },
        data() {
            return {
                active: false
            }
        },
        updated() {
            this.createAndDispatchItemChangedEvent();
        },
        methods: {
            createAndDispatchItemChangedEvent() {
                let event = new Event('activeItemChanged');
                document.dispatchEvent( event );
            }
        }
    }
</script>

<style scoped>
  a {
    color: white;
    text-decoration: none;
    position: relative;
    width: auto;
    height: 20em;
    padding: .4em .4em 2.4em;
    display: inline-block;
    vertical-align: top;
  }

  img {
    display: inline-block;
    vertical-align: top;
    height: 100%;
    width: auto;
  }

  span {
    position: absolute;
    display: block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5%;
    font-weight: bold;
    font-size: 1.5em;
    left: 0;
    right: 0;
    bottom: 0;
  }
/*
  .active:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.8em;
    top: 0;

  }
 */
</style>