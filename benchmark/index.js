const Parser = require('../lib/')

const boundary = '--------------------------034172598905589540726558'
const parser = new Parser(boundary)

const MB = 100
const buffer = createMultipartBuffer(boundary, MB * 1024 * 1024)

let start = +new Date()

parser.on('end', function () {
  let duration = +new Date() - start
  let ratio = (MB / (duration / 1000)).toFixed(2)

  console.log(`${ratio} MB/s`)
})

parser.write(buffer)
parser.end()

function createMultipartBuffer (boundary, size) {
  let head = Buffer.from('--' + boundary + '\r\n')
  let body = Buffer.from('Content-Disposition: form-data; name="field"\r\n\r\n')
  let tail = Buffer.from('\r\n--' + boundary + '--\r\n')
  let buff = Buffer.allocUnsafe(size)

  return Buffer.concat([ head, body, buff, tail ])
}
