<template>
  <div>
    <img src="./images/long.png" alt="aa" @click="showModel">
    <img src="./images/e.jpg" alt="aa" @click="showModel">
    <img src="./images/long-small.png" alt="aa" @click="showModel">
    <img src="./images/width-small.png" alt="aa" @click="showModel">
    <view-img :show="show" :img='img' @hide='hide'></view-img>
  </div>
</template>

<script>
// import {ViewImg} from 'img-view'
export default {
  name: 'app',
  // components: {
  //   'view-img': ViewImg
  // },
  data () {
    return {
      show: false,
      img: ''
    }
  },
  methods: {
    showModel (e) {
      this.img = e.target.src
      this.show = true
    },
    hide () {
      this.img = ''
      this.show = false
    }
  }
}
</script>

<style>
img{
  max-width: 100%;
}
</style>
