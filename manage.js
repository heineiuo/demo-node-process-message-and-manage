const { fork } = require('child_process')
const uuid = require('uuid')
const EventEmitter = require('events')

const __queue = {}
const __cp = {}
const CHILD_PROCESS_TIMEOUT = 60 * 1000

const getChildMsg = (cpPath, req) => new Promise((resolve, reject) => {
  let timeout = false
  const t = setTimeout(() => {
    timeout = true
    const error = new Error('Timeout')
    error.name = 'TimeoutError'
    reject(error)
  }, CHILD_PROCESS_TIMEOUT)

  const id = uuid.v1()
  __queue[id] = new EventEmitter()
  __queue[id].on('message', (msg) => {
    if (timeout) return false
    clearTimeout(t)
    resolve(msg.result)
    delete __queue[id]
  })

  if (!__cp[cpPath]) {
    __cp[cpPath] = fork(cpPath)
    __cp[cpPath].on('message', (msg) => {
      const { id } = msg
      if (!id) return console.log('lost msg id')
      __queue[id].emit('message', msg)
    })
  }
  __cp[cpPath].send({req, id})
})

module.exports = getChildMsg