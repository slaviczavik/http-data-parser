const assert = require('assert')
const fs = require('fs')

const Parser = require('../src/')
const { resolve, source } = require('./util')

describe('Multi part request', function () {
  describe('Whole buffer', function () {
    describe('First part', function () {
      it('Should return all headers', function (done) {
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)
        const headers = []

        let content = ''
        let part = 0

        parser.on('header', (data) => {
          content += data
        })

        parser.on('part', function (data) {
          if (part === 0) {
            const lines = content.split(/\r\n/g)
            lines.forEach(function (line) {
              if (line.length > 0) {
                headers.push(line.split(/:\s/))
              }
            })

            assert.deepStrictEqual(headers, test.result[part].headers)
            done()
          }

          part++
        })

        readerStream.on('data', function (data) {
          parser.write(data)
        })

        readerStream.on('end', function () {
          parser.end()
        })
      })

      it('Should return all content data', function (done) {
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)

        let content = 0
        let part = 0

        parser.on('data', function (data) {
          content += data.length
        })

        parser.on('part', function (data) {
          if (part === 0) {
            assert.strictEqual(content, test.result[part].size)
            done()
          }

          part++
        })

        readerStream.on('data', function (data) {
          parser.write(data)
        })

        readerStream.on('end', function () {
          parser.end()
        })
      })
    })

    describe('Second part', function () {
      it('Should return all headers', function (done) {
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)

        let content = ''
        let headers = []
        let part = 0

        parser.on('header', (data) => {
          content += data
        })

        parser.on('part', function (data) {
          if (part === 1) {
            const lines = content.split(/\r\n/g)
            lines.forEach(function (line) {
              if (line.length > 0) {
                headers.push(line.split(/:\s/))
              }
            })

            assert.deepStrictEqual(headers, test.result[part].headers)
            done()
          }

          content = ''
          headers = []
          part++
        })

        readerStream.on('data', function (data) {
          parser.write(data)
        })

        readerStream.on('end', function () {
          parser.end()
        })
      })

      it('Should return all content data', function (done) {
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)

        let content = 0
        let part = 0

        parser.on('data', function (data) {
          content += data.length
        })

        parser.on('part', function (data) {
          if (part === 1) {
            assert.strictEqual(content, test.result[part].size)
            done()
          }

          content = 0
          part++
        })

        readerStream.on('data', function (data) {
          parser.write(data)
        })

        readerStream.on('end', function () {
          parser.end()
        })
      })
    })
  })

  describe('Splitted buffer', function () {
    describe('First part', function () {
      it('Should return all headers', function (done) {
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)
        const headers = []

        let content = ''
        let part = 0

        parser.on('header', (data) => {
          content += data
        })

        parser.on('part', function (data) {
          if (part === 0) {
            const lines = content.split(/\r\n/g)
            lines.forEach(function (line) {
              if (line.length > 0) {
                headers.push(line.split(/:\s/))
              }
            })

            assert.deepStrictEqual(headers, test.result[part].headers)
            done()
          }

          part++
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
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)

        let content = 0
        let part = 0

        parser.on('data', function (data) {
          content += data.length
        })

        parser.on('part', function (data) {
          if (part === 0) {
            assert.strictEqual(content, test.result[part].size)
            done()
          }

          part++
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

    describe('Second part', function () {
      it('Should return all headers', function (done) {
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)

        let content = ''
        let headers = []
        let part = 0

        parser.on('header', (data) => {
          content += data
        })

        parser.on('part', function (data) {
          if (part === 1) {
            const lines = content.split(/\r\n/g)
            lines.forEach(function (line) {
              if (line.length > 0) {
                headers.push(line.split(/:\s/))
              }
            })

            assert.deepStrictEqual(headers, test.result[part].headers)
            done()
          }

          content = ''
          headers = []
          part++
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
        const test = source('beta')
        const readerStream = fs.createReadStream(resolve(test.data))
        const parser = Parser(test.boundary)

        let content = 0
        let part = 0

        parser.on('data', function (data) {
          content += data.length
        })

        parser.on('part', function (data) {
          if (part === 1) {
            assert.strictEqual(content, test.result[part].size)
            done()
          }

          content = 0
          part++
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
})
