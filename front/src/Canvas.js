export default class Canvas {
    constructor (args = {}) {
        this.element = args.element || document.createElement('canvas')
        this.context = this.element.getContext('2d')
        this.background = args.background || 'rgba(255,255,255,0)'

        this.element.width = args.width || 50
        this.element.height = args.height || 50
    }

    clear () {
        const { element: canvas, element: { width, height }, context } = this

        canvas.width = width
        canvas.height = height

        context.beginPath()
        context.rect(0, 0, width, height)

        context.fillStyle = this.background
        context.fill()
    }

    smartDraw (data) {
        const { type, ...figure } = data

        if (type === 'circle') {
            return this.drawCircle(figure)
        }

        if (type === 'line') {
            return this.drawLine(figure)
        }
    }

    draw (callback) {
        callback(this.element, this.context)
    }
    
    drawCircle (args) {
        if (!args) {
            return
        }

        this.draw((canvas, context) => {
            context.beginPath()

            context.arc(
                args.x,
                args.y,
                args.r,
                args.startAngle || 0,
                args.endAngle || 2 * Math.PI,
                args.anticlockwise || false
            )

            if (args.fillStyle !== undefined) {
                context.fillStyle = args.fillStyle
                context.fill()
            }

            if (args.strokeStyle !== undefined) {
                context.strokeStyle = args.strokeStyle
                context.stroke()
            }
        })
    }

    drawLine (args) {
        if (!args) {
            return
        }

        this.draw((canvas, context) => {
            context.beginPath()

            context.moveTo(
                args.x1,
                args.y1
            )

            context.lineTo(
                args.x2,
                args.y2
            )

            context.lineWidth = args.lineWidth !== undefined ? args.lineWidth : 2

            if (args.fillStyle !== undefined) {
                context.fillStyle = args.fillStyle
                context.fill()
            }

            if (args.strokeStyle !== undefined) {
                context.strokeStyle = args.strokeStyle
                context.stroke()
            }
        })
    }
}