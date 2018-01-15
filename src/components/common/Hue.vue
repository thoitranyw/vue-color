<template>
  <div :class="['vc-hue', directionClass]">
    <div class="vc-hue-container" ref="container"
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange">
      <div class="vc-hue-pointer" :style="{top: pointerTop, left: pointerLeft}">
        <div class="vc-hue-picker"></div>
      </div>  
    </div>
  </div>
</template>

<script>
import colorMixin from '../../mixin/color'

export default {
  name: 'Hue',
  mixins: [colorMixin],
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator (value) {
        return value === 'horizontal' || value === 'vertical'
      }
    }
  },
  data () {
    return {
      oldHue: 0,
      pullDirection: ''
    }
  },
  watch: {
    color () {
      const h = this.$data._color.hsl.h
      if (h !== 0 && h - this.oldHue > 0) this.pullDirection = 'right'
      if (h !== 0 && h - this.oldHue < 0) this.pullDirection = 'left'
      this.oldHue = h
    }
  },
  computed: {
    directionClass () {
      return {
        'vc-hue--horizontal': this.direction === 'horizontal',
        'vc-hue--vertical': this.direction === 'vertical'
      }
    },
    pointerTop () {
      if (this.direction === 'vertical') {
        const { hsl } = this.$data._color
        if (hsl.h === 0 && this.pullDirection === 'right') return 0
        return -((hsl.h * 100) / 360) + 100 + '%'
      } else {
        return 0
      }
    },
    pointerLeft () {
      if (this.direction === 'vertical') {
        return 0
      } else {
        const { hsl } = this.$data._color
        if (hsl.h === 0 && this.pullDirection === 'right') return '100%'
        return (hsl.h * 100) / 360 + '%'
      }
    }
  },
  methods: {
    handleChange (e, skip) {
      !skip && e.preventDefault()

      const container = this.$refs.container
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      const xOffset = container.getBoundingClientRect().left + window.pageXOffset
      const yOffset = container.getBoundingClientRect().top + window.pageYOffset
      const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0)
      const pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0)
      const left = pageX - xOffset
      const top = pageY - yOffset

      let h = 0
      let percent = 0

      const { hsl } = this.$data._color

      if (this.direction === 'vertical') {
        if (top < 0) {
          h = 360
        } else if (top > containerHeight) {
          h = 0
        } else {
          percent = -(top * 100 / containerHeight) + 100
          h = (360 * percent / 100)
        }

        if (hsl.h !== h) {
          this.colorChange({
            h: h,
            s: hsl.s,
            l: hsl.l,
            a: hsl.a,
            source: 'hsl'
          })
        }
      } else {
        if (left < 0) {
          h = 0
        } else if (left > containerWidth) {
          h = 360
        } else {
          percent = left * 100 / containerWidth
          h = (360 * percent / 100)
        }

        if (hsl.h !== h) {
          this.colorChange({
            h: h,
            s: hsl.s,
            l: hsl.l,
            a: hsl.a,
            source: 'hsl'
          })
        }
      }
    },
    handleMouseDown (e) {
      this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp (e) {
      this.unbindEventListeners()
    },
    unbindEventListeners () {
      window.removeEventListener('mousemove', this.handleChange)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>

<style>
.vc-hue {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
}
.vc-hue--horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vc-hue--vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vc-hue-container {
  cursor: pointer;
  margin: 0 2px;
  position: relative;
  height: 100%;
}
.vc-hue-pointer {
  z-index: 2;
  position: absolute;
}
.vc-hue-picker {
  cursor: pointer;
  margin-top: 1px;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  transform: translateX(-2px) ;
}
</style>
