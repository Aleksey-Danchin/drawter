import { loadImage } from 'canvas'
import WebSocket from 'ws'

import Canvas from './Canvas'

const SECOND = 1000
const MINUTE = 60 * SECOND

const WIDTH = 750
const HEIGHT = 750

const canvas = new Canvas({ width: WIDTH, height: HEIGHT })
const server = new WebSocket.Server({ port: "8081" })

const restart = () => {
    loadImage(`https://picsum.photos/${WIDTH}/${HEIGHT}`)
        .then(image => {
            canvas.context.drawImage(image, 0, 0)

            for (const client of server.clients) {
                client.send({
                    type: 'canvasInit',
                    data: {
                        width: canvas.element.width,
                        height: canvas.element.height,
                        base64: canvas.element.toDataURL()
                    }
                })
            }
        })
}

restart()

setInterval(restart, 5 * MINUTE)

server.on('connection', socket => {
    socket.send = (...args) => WebSocket.prototype.send.call(socket, JSON.stringify(args))

    socket.send({
        type: 'canvasInit',
        data: {
            width: canvas.element.width,
            height: canvas.element.height,
            base64: canvas.element.toDataURL()
        }
    })

    socket.on('message', data => {
        const array = JSON.parse(data)

        for (const item of array) {
            socket.emit(item.type, item.data, item)
        }
    })

    socket.on('close', () => {})

    socket.on('addFigure', (figure, item) => {
        canvas.smartDraw(figure)

        for (const client of server.clients) {
            client.send(item)
        }
    })
})
