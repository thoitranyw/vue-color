<template>
  <div class="vc-editable-input">
    <input class="vc-input__input"
      v-if="!isNumber"
      :value="val"
      @input="update">
    <input class="vc-input__input"
      v-if="isNumber"
      type="number"
      :value="val"
      @keydown="handleKeyDown"
      @input="update"
      @blur="handleBlur"
      ref="input">
    <span class="vc-input__label">{{label}}</span>
    <span class="vc-input__desc">{{desc}}</span>
  </div>
</template>

<script>
export default {
  name: 'editableInput',
  props: {
    label: String,
    desc: String,
    value: [String, Number],
    max: Number,
    min: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val () {
      return this.value
    },
    isNumber () {
      return typeof this.value === 'number' || !isNaN(Number(this.value))
    }
  },
  methods: {
    update (e) {
      const v = e.target.value
      this.handleChange(v)
    },
    handleKeyDown (e) {
      let val = this.val
      let number = Number(val)

      if (typeof val === 'number') {
        const amount = this.arrowOffset || 1

        // Up
        if (e.keyCode === 38) {
          this.handleChange(number + amount)
          e.preventDefault()
        }

        // Down
        if (e.keyCode === 40) {
          this.handleChange(number - amount)
          e.preventDefault()
        }
      }
    },
    handleChange (value) {
      let v = value

      if (this.isNumber && !(this.max === undefined) && +v > this.max) {
        return
      }
      if (this.isNumber && !(this.min === undefined) && +v < this.max) {
        return
      }

      let data = {}
      data[this.label] = v
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data)
      } else if (value.length > 5) {
        this.$emit('change', data)
      }
    },
    handleBlur (e) {
      const value = e.target.value
      if (this.isNumber && !(this.max === undefined) && +value > this.max) {
        this.$refs.input.value = this.max
      }
      if (this.isNumber && !(this.min === undefined) && +value < this.max) {
        this.$refs.input.value = this.min
      }
    },
    handleDrag (e) {
      console.log(e)
    },
    handleMouseDown (e) {
      console.log(e)
    }
  }
}
</script>

<style>
.vc-editable-input {
  position: relative;
}
.vc-input__input {
  padding: 0;
  border: 0;
  outline: none;
}
.vc-input__label {
  text-transform: capitalize;
}

.vc-editable-input input::-webkit-outer-spin-button,
.vc-editable-input input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
</style>
