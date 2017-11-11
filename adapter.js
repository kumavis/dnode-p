const cbify = require('cb-ify')
const pify = require('pify')

module.exports = {
  
  toCallbacks: function (promiseMethods) {
    var callbackMethods = {}
    Object.keys(promiseMethods).forEach(function (methodName) {
      callbackMethods[methodName] = cbify(promiseMethods[methodName])
    })
    return callbackMethods
  },
  
  toPromises: function (callbackMethods, PromiseImplementation = Promise) {
    var promiseMethods = {}
    Object.keys(callbackMethods).forEach(function (methodName) {
      promiseMethods[methodName] = pify(callbackMethods[methodName])
    })
    return promiseMethods
  }

}
