const assert = require('assert')
const fs = require('fs')

const Parser = require('../lib/')
const { resolve, source } = require('./util')

describe('Single part request', function () {
  describe('Whole buffer', function () {
    it('Should return all headers', function (done) {
      let test = source('alpha')
      let readerStream = fs.createReadStream(resolve(test.data))
      let parser = new Parser(test.boundary)

      let content = ''
      let headers = []

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
      let test = source('alpha')
      let readerStream = fs.createReadStream(resolve(test.data))
      let parser = new Parser(test.boundary)

      let content = 0

      parser.on('data', (data) => {
        content += data.length
      })

      parser.on('end', function () {
        assert.equal(content, test.result[0].size)
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
      let test = source('alpha')
      let readerStream = fs.createReadStream(resolve(test.data))
      let parser = new Parser(test.boundary)

      let content = ''
      let headers = []

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
      let test = source('alpha')
      let readerStream = fs.createReadStream(resolve(test.data))
      let parser = new Parser(test.boundary)

      let content = 0

      parser.on('data', (data) => {
        content += data.length
      })

      parser.on('end', function () {
        assert.equal(content, test.result[0].size)
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
