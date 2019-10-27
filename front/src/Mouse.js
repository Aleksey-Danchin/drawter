export default class Mouse {
    constructor(element) {
        this.element = element

        this.x = 0
        this.y = 0
        this.left = false

        this.px = 0
        this.py = 0
        this.pleft = false

        element.addEventListener('mousemove', this.mousemoveHandler.bind(this))
        element.addEventListener('mousedown', this.mousedownHandler.bind(this))
        element.addEventListener('mouseup', this.mouseupHandler.bind(this))
    }

    get dx () {
        return this.x - this.px
    }

    get dy () {
        return this.y - this.py
    }
    
    tick () {
        this.px = this.x
        this.py = this.y
        this.pleft = this.left
    }

    mousemoveHandler (event) {
        const rect = this.element.getBoundingClientRect()

        this.px = this.x
        this.py = this.y

        this.x = event.clientX - rect.left
        this.y = event.clientY - rect.top
    }

    mousedownHandler (event) {
        if (event.button === 0) {
            this.left = true
        }
    }

    mouseupHandler (event) {
        if (event.button === 0) {
            this.left = false
        }
    }
}