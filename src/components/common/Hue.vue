<template>
  <div :class="['vc-hue', directionClass]">
    <div class="vc-hue-container" ref="container"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown">
      <div class="vc-hue-pointer" :style="pointerStyle">
        <div class="vc-hue-picker"></div>
      </div>  
    </div>
  </div>
</template>

<script>
import colorMixin from '../../mixin/color'

const RANGE = 360

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
      dragDirection: '',

      containerSize: 1,

      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      dragging: false
    }
  },
  watch: {
    color () {
      const h = this.$data._color.hsl.h
      if (h !== 0 && h - this.oldHue > 0) this.dragDirection = 1
      if (h !== 0 && h - this.oldHue < 0) this.dragDirection = -1
      this.oldHue = h
    }
  },
  computed: {
    vertical () {
      return this.direction === 'vertical'
    },
    directionClass () {
      return {
        'vc-hue--horizontal': !this.vertical,
        'vc-hue--vertical': this.vertical
      }
    },
    pointerPosition () {
      const { hsl: { h } } = this.$data._color
      if (h > 0 && h < RANGE) return `${(h / RANGE) * 100}%`
      if (h === 0 && this.dragDirection === 1) return '100%'
      return '0%'
    },
    pointerStyle () {
      return this.vertical ? { bottom: this.pointerPosition } : { left: this.pointerPosition }
    }
  },
  methods: {
    handleChange (percent) {
      this.resetSize()

      if (percent > 100) percent = 100
      if (percent < 0) percent = 0

      const { hsl } = this.$data._color
      const h = (RANGE * percent / 100)

      if (hsl.h !== h) {
        this.colorChange({
          h: h,
          s: hsl.s,
          l: hsl.l,
          a: hsl.a,
          source: 'hsl'
        })
      }
    },
    handleSliderClick (e, skip) {
      !skip && e.preventDefault()

      const $container = this.$refs.container

      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX

      if (this.vertical) {
        const sliderOffsetBottom = $container.getBoundingClientRect().bottom
        this.handleChange((sliderOffsetBottom - clientY) / this.containerSize * 100)
      } else {
        const sliderOffsetLeft = $container.getBoundingClientRect().left
        this.handleChange((clientX - sliderOffsetLeft) / this.containerSize * 100)
      }
    },
    handleMouseDown (e) {
      e.preventDefault()

      this.handleSliderClick(e)

      this.onDragStart(e)

      window.addEventListener('mousemove', this.onDragging)
      window.addEventListener('touchmove', this.onDragging)

      window.addEventListener('mouseup', this.onDragEnd)
      window.addEventListener('touchend', this.onDragEnd)

      window.addEventListener('contextmenu', this.onDragEnd)
    },
    onDragStart (e) {
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX

      if (this.vertical) {
        this.startY = clientY
      } else {
        this.startX = clientX
      }
      this.dragging = true
      this.startPosition = parseFloat(this.pointerPosition)

      this.handleSliderClick(e)
    },
    onDragging (e) {
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX

      const { vertical, dragging, containerSize, startX, startY, startPosition } = this
      if (dragging) {
        let diff = 0
        if (vertical) {
          diff = ((startY - clientY) / containerSize) * 100
        } else {
          diff = ((clientX - startX) / containerSize) * 100
        }

        const newPosition = startPosition + diff
        this.handleChange(newPosition)
      }
    },
    onDragEnd () {
      if (this.dragging) {
        this.dragging = false
        window.removeEventListener('mousemove', this.onDragging)
        window.removeEventListener('touchmove', this.onDragging)

        window.removeEventListener('mouseup', this.onDragEnd)
        window.removeEventListener('touchend', this.onDragEnd)

        window.removeEventListener('contextmenu', this.onDragEnd)
      }
    },
    resetSize () {
      if (this.$refs.container) {
        this.containerSize = this.$refs.container[`client${this.vertical ? 'Height' : 'Width'}`]
      }
    }
  },
  mounted () {
    this.resetSize()
    window.addEventListener('resize', this.resetSize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resetSize)
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
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
  transform: translate(-2px, 0);
}
.vc-hue--vertical .vc-hue-picker {
  transform: translate(-2px, 3px);
}
</style>
