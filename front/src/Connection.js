import EventEmitter from 'events'

class Connection extends EventEmitter {
    constructor (url) {
        super()

        this.url = url
        this.pull = []
        this.socket = null
        this.lastTryConnectionDate = null

        this.tryConnect()
    }

    tryConnect () {
        if (this.socket && this.socket.readyState === 1) {
            return
        }

        if (this.lastTryConnectionDate !== null && this.lastTryConnectionDate + Connection.TRY_CONNECTION_TIMEOUT  > Date.now()) {
            return setTimeout(() => this.tryConnect(), Connection.TRY_CONNECTION_TIMEOUT + 1)
        }

        this.lastTryConnectionDate = Date.now()        
        this.socket = new WebSocket(this.url)
        this.tieHandlers()
    }

    tieHandlers () {
        this.socket.onmessage = event => {
            const array = JSON.parse(event.data)

            for (const item of array) {
                this.emit(item.type, item.data, item)
            }
        }

        this.socket.onopen = () => {
            console.log('Connection set')

            if (this.pull.length) {
                this.send(...this.pull)
            }
        }

        this.socket.onclose = data => {
            console.warn('Connection close', data)
            this.tryConnect()
        }

        this.socket.onerror = error => {
            console.error('Connection close with error', error)
            this.tryConnect()
        }
    }

    send (...args) {
        if (!this.socket || this.socket.readyState !== 1) {
            return this.pull.push(...args)
        }

        this.socket.send(JSON.stringify(args))
    }
}

Connection.TRY_CONNECTION_TIMEOUT = 500

export default Connection