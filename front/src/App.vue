<template lang="pug">
  div#container
    canvas(majorCanvas ref="majorCanvas")
    canvas(mouseCanvas ref="mouseCanvas")
    input(type="color" v-model="color")
</template>

<script>
import Canvas from '@/Canvas'
import Mouse from '@/Mouse'
import { mapState } from 'vuex'

export default {
  name: 'app',

  data () {
    return {
      mouse: null,
      majorCanvas: null,
      mouseCanvas: null,

      color: '#000000'
    }
  },

  mounted () {
    const canvasFactory = element => new Canvas({ element })

    this.majorCanvas = canvasFactory(this.$refs.majorCanvas)
    this.mouseCanvas = canvasFactory(this.$refs.mouseCanvas)

    this.mouse = new Mouse(this.mouseCanvas.element)
  },

  computed: {
    ...mapState(['figures', 'canvasInit'])
  },

  watch: {
    mouse: {
      deep: true,
      handler() {
        this.mouseCanvas.clear()

        this.mouseCanvas.drawCircle({
          ...this.mouse,
          r: 2,
          fillStyle: this.color
        })

        if (this.mouse.left) {
          if (this.mouse.pleft) {
            this.$store.dispatch('addLine', {
              x1: this.mouse.x,
              y1: this.mouse.y,
              x2: this.mouse.px,
              y2: this.mouse.py,
              lineWidth: 3,
              strokeStyle: this.color
            })
          } else {
            this.$store.dispatch('addCircle', {
              x: this.mouse.x,
              y: this.mouse.y,
              r: 2,
              fillStyle: this.color
            })
          }
        }

        this.mouse.tick()
      }
    },

    figures: {
      deep: true,
      handler (array = []) {
        if (!array.length) {
          return
        }

        for (const item of array) {
          this.majorCanvas.smartDraw(item)
        }

        this.$store.commit('removeFigures', array.map(x => x.id))
      }
    },

    canvasInit: {
      deep: true,
      handler ({ width, height, base64 }) {
        this.mouseCanvas.element.width = width
        this.mouseCanvas.element.height = height

        this.majorCanvas.element.width = width
        this.majorCanvas.element.height = height

        const image = new Image
        image.onload = () => this.majorCanvas.context.drawImage(image, 0, 0)
        image.src = base64
      }
    }
  }
}
</script>

<style scoped>
#container {
  position: relative;
  cursor: none;
}

canvas {
  position: absolute;
  border: 1px solid gray;
}

input {
  position: relative;
}
</style>