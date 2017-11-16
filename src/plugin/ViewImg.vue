<template>
<transition name="preview-fade">
  <div class='wrap' v-show='show && img' ref='model'>
  </div>
</transition>
</template>

<script>
import Hammer from 'hammerjs'

export default {
  name: 'preview',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      winW: 375,
      winH: 667
    }
  },
  created () {
    this.winW = document.documentElement.clientWidth
    this.winH = document.documentElement.clientHeight
  },
  mounted () {
    this.model = this.$refs.model
  },
  watch: {
    show (val) {
      if (val) {
        this.init()
      } else {
        this.model.innerHTML = ''
        this.hm && this.hm.destroy()
      }
    }
  },
  methods: {
    hide () {
      this.$emit('hide')
    },
    initImg (dom) {
      if (dom.naturalWidth/dom.naturalHeight < this.winW / this.winH) {
        // 长度大，按长度计算
        if (dom.naturalHeight > this.winH) {
          // 图片比屏幕长
          dom.style.height = this.winH + 'px'
          dom.style.width = dom.naturalWidth/dom.naturalHeight*this.winH + 'px'
          dom.canTouch = true // 是否监听 touch 事件
          dom.minWidth = dom.naturalWidth/dom.naturalHeight*this.winH
          dom.minHeight = this.winH
          dom.maxScale = dom.naturalHeight / this.winH
        } else {
          // 图片没有屏幕长，不可缩放
          dom.style.height = dom.naturalHeight + 'px'
          dom.style.width = dom.naturalWidth + 'px'
          dom.canTouch = false
        }
      } else {
        if (dom.naturalWidth > this.winW) {
          dom.style.width = this.winW + 'px'
          dom.style.height = this.winW*dom.naturalHeight/dom.naturalWidth + 'px'
          dom.canTouch = true
          dom.minWidth = this.winW
          dom.minHeight = this.winW*dom.naturalHeight/dom.naturalWidth
          dom.maxScale = dom.naturalWidth / this.winW
        } else {
          dom.style.width = dom.naturalWidth + 'px'
          dom.style.height = dom.naturalHeight + 'px'
          dom.canTouch = false
        }
      }
      dom.style.webkitTransform = 'translate3d(0,0,0) scale(1)'
      dom.scale = 1
      dom.startTransX = 0
      dom.startTransY = 0
    },
    init () {
      if (this.img) {
        let _this = this
        let img = new Image()
        img.src = this.img
        img.onload = function () {
          _this.initImg(this) // 初始化图片属性
          _this.model.appendChild(this)
          let hm = new Hammer(_this.model)
          // this.hm = hm
          hm.on('tap', function () {
            _this.hide()
          })
          if (this.canTouch) {
            hm.get('pinch').set({ enable: true })
            hm.get('pan').set({ direction: Hammer.DIRECTION_ALL })
            hm.on('panstart', function () {
              _this.panstartImg(img)
            })
            hm.on('pan', function (e) {
              _this.panImg(img, e)
            })
            hm.on('pinchstart', function (e) {
              _this.panstartImg(img) // 开始缩放需要拿到位移的初始值
            })
            hm.on('pinch', function (e) {
              _this.pinchImg(img, e)
            })
            hm.on('pinchend', function (e) {
              _this.pinchendImg(img, e)
            })
          } else {
            // console.log('不需要pan, pinch')
          }
        }
      }
    },
    panstartImg (dom) {
      let transform = dom.style.webkitTransform || dom.style.transform
      let reg = /translate3d\((-?.+)px,\s(-?.+)px,\s.+px\)/
      if (reg.exec(transform) !== null) {
        let curPos = reg.exec(transform)
        dom.startTransX = curPos[1]
        dom.startTransY = curPos[2]
      }
    },
    panImg (dom, e) {
      let transform = dom.style.webkitTransform || dom.style.transform
      let reg = /translate3d\((-?.+)px,\s(-?.+)px,\s.+px\)/
      if (reg.exec(transform) !== null) {
        let posX = Number(dom.startTransX) + Math.floor(e.deltaX)
        let posY = Number(dom.startTransY) + Math.floor(e.deltaY)
        let maxX = 0, minX = 0, maxH = 0, minH = 0 // 上下左右最多进行的偏移
        if (dom.minWidth * dom.scale > this.winW) {
          maxX = (dom.minWidth * dom.scale - this.winW) / 2
          minX = -maxX
          if (posX > maxX) { posX = maxX }
          if (posX < minX) { posX = minX }
        } else {
          posX = 0
        }
        if (dom.minHeight * dom.scale > this.winH) {
          maxH = (dom.minHeight * dom.scale - this.winH) / 2
          minH = -maxH
          if (posY > maxH) { posY = maxH }
          if (posY < minH) { posY = minH }
        } else {
          posY = 0
        }
        // 这里因为需要保留 scale 属性，不能直接设置 style，需要进行字符串替换
        let result = transform.replace(reg, whole => {
          return ` translate3d(${posX}px, ${posY}px, 0) `
        })
        dom.style.webkitTransform = result
      }
    },
    pinchImg (dom, e) {
      // 缩放肯定伴随这位移
      let transform = dom.style.webkitTransform || dom.style.transform
      let reg = /scale\((.+)\)/
      // let reg1 = /translate3d\((-?.+)px,\s(-?.+)px,\s.+px\)/
      let scale = dom.scale + e.scale - 1
      if (scale < 1) {
        scale = 1
      }
      if (scale > dom.maxScale) {
        scale = dom.maxScale
      }
      let deltaScale = dom.scale - 1 <= 0 ? scale - 1 : (scale - 1) / (dom.scale - 1)
      let posX = dom.startTransX * deltaScale
      let posY = dom.startTransY * deltaScale

      let maxX = 0, minX = 0, maxH = 0, minH = 0 // 上下左右最多进行的偏移
      if (dom.minWidth * scale > this.winW) {
        maxX = (dom.minWidth * scale - this.winW) / 2
        minX = -maxX
        if (posX > maxX) { posX = maxX }
        if (posX < minX) { posX = minX }
      } else {
        posX = 0
      }
      if (dom.minHeight * scale > this.winH) {
        maxH = (dom.minHeight * scale - this.winH) / 2
        minH = -maxH
        if (posY > maxH) { posY = maxH }
        if (posY < minH) { posY = minH }
      } else {
        posY = 0
      }
      let result = `translate3d(${posX}px, ${posY}px, 0) scale(${scale})`
      // let result = transform.replace(reg, (whole) => {
      //   return ` scale(${scale}) `
      // })
      dom.style.webkitTransform = result
    },
    pinchendImg (dom, e) {
      let transform = dom.style.webkitTransform || dom.style.transform
      let reg = /scale\((.+)\)/
      let scale = dom.scale + e.scale - 1
      if (scale < 1) {
        scale = 1
      }
      if (scale > dom.maxScale) {
        scale = dom.maxScale
      }
      dom.scale = scale
    }
  }
}
</script>

<style scoped>
.wrap{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #000;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-fade-enter-active, .preview-fade-leave-active {
  transition: opacity .3s;
}
.preview-fade-enter, .preview-fade-leave-to {
  opacity: 0;
}
</style>
