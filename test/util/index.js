const path = require('path')

const results = require('../results')

const resolve = function (dest) {
  return path.resolve(__dirname, dest)
}

const source = function (data) {
  return results[data]
}

module.exports = { resolve, source }
