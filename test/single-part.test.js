const assert = require('assert')
const fs = require('fs')

const Parser = require('../src/')
const { resolve, source } = require('./util')

describe('Single part request', function () {
  describe('Whole buffer', function () {
    it('Should return all headers', function (done) {
      const test = source('alpha')
      const readerStream = fs.createReadStream(resolve(test.data))
      const parser = Parser(test.boundary)
      const headers = []

      let content = ''

      parser.on('header', (data) => {
        content += data
      })

      parser.on('end', function () {
        const lines = content.split(/\r\n/g)
        lines.forEach(function (line) {
          if (line.length > 0) {
            headers.push(line.split(/:\s/))
          }
        })

        assert.deepStrictEqual(headers, test.result[0].headers)
        done()
      })

      readerStream.on('data', function (data) {
        parser.write(data)
      })

      readerStream.on('end', function () {
        parser.end()
      })
    })

    it('Should return all content data', function (done) {
      const test = source('alpha')
      const readerStream = fs.createReadStream(resolve(test.data))
      const parser = Parser(test.boundary)

      let content = 0

      parser.on('data', (data) => {
        content += data.length
      })

      parser.on('end', function () {
        assert.strictEqual(content, test.result[0].size)
        done()
      })

      readerStream.on('data', function (data) {
        parser.write(data)
      })

      readerStream.on('end', function () {
        parser.end()
      })
    })
  })

  describe('Splitted buffer', function () {
    it('Should return all headers', function (done) {
      const test = source('alpha')
      const readerStream = fs.createReadStream(resolve(test.data))
      const parser = Parser(test.boundary)
      const headers = []

      let content = ''

      parser.on('header', (data) => {
        content += data
      })

      parser.on('end', function () {
        const lines = content.split(/\r\n/g)
        lines.forEach(function (line) {
          if (line.length > 0) {
            headers.push(line.split(/:\s/))
          }
        })

        assert.deepStrictEqual(headers, test.result[0].headers)
        done()
      })

      readerStream.on('data', function (data) {
        let i = 0

        while (i < data.length) {
          parser.write(data.slice(i, i += 8))
        }
      })

      readerStream.on('end', function () {
        parser.end()
      })
    })

    it('Should return all content data', function (done) {
      const test = source('alpha')
      const readerStream = fs.createReadStream(resolve(test.data))
      const parser = Parser(test.boundary)

      let content = 0

      parser.on('data', (data) => {
        content += data.length
      })

      parser.on('end', function () {
        assert.strictEqual(content, test.result[0].size)
        done()
      })

      readerStream.on('data', function (data) {
        let i = 0

        while (i < data.length) {
          parser.write(data.slice(i, i += 8))
        }
      })

      readerStream.on('end', function () {
        parser.end()
      })
    })
  })
})
