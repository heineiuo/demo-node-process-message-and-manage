const EventEmitter = require('events')

class Child {
  constructor() {

    this.event = new EventEmitter()
    this.event.on('message', (msg) => {
      process.send(msg)
    })

    process.on('message', async (msg) => {
      const { req, req: { path, query }, id } = msg
      const result = {
        hello: 'world',
        query: req.query
      }
      // await new Promise(resolve => setTimeout(resolve, 1000))

      this.event.emit('message', { id, result})
    })

    process.on('exit', (code) => {
      console.log(`About to exit with code: ${code}`)
    })
    process.on('SIGINT', () => {
      console.log('Received SIGINT.  Press Control-D to exit.')
    })

  }
}

module.exports = Child