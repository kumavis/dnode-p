const EventEmitter = require('events')
const dnode = require('dnode')
const adapter = require('./adapter')

module.exports = (interface = {}, opts = {}) => {
  const core = dnode(adapter.toCallbacks(interface), opts)
  const eventListenerIntercept = (event, handler) => {
    if (event !== 'remote') return core.on(event, handler)
    core.on('remote', (rawInterface) => {
      const interface = adapter.toPromises(rawInterface)
      handler(interface)
    })
  }
  // intercept event listeners
  const proxy = new Proxy(core, {
    get: (target, name) => {
      if (name === 'on') return eventListenerIntercept
      return target[name]
    },
  })
  return proxy
}
