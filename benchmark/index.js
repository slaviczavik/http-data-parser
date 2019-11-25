const Parser = require('../src/')

const boundary = '--------------------------034172598905589540726558'
const parser = Parser(boundary)

const MB = 100
const buffer = createMultipartBuffer(boundary, MB * 1024 * 1024)

const start = +new Date()

parser.on('end', function () {
  const duration = +new Date() - start
  const ratio = (MB / (duration / 1000)).toFixed(2)

  console.log(`${ratio} MB/s`)
})

parser.write(buffer)
parser.end()

function createMultipartBuffer (boundary, size) {
  const head = Buffer.from('--' + boundary + '\r\n')
  const body = Buffer.from('Content-Disposition: form-data; name="field"\r\n\r\n')
  const tail = Buffer.from('\r\n--' + boundary + '--\r\n')
  const buff = Buffer.allocUnsafe(size)

  return Buffer.concat([head, body, buff, tail])
}
