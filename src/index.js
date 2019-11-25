const { Writable } = require('stream')
const StreamSearch = require('@slaviczavik/stream-search')

const STATE = {
  UNINITIALIZED: 0,
  AFTER_STARTING_BOUNDARY: 1,
  AFTER_HEADERS: 2,
  AFTER_ENCLOSING_BOUNDARY: 3,
  REQUEST_END: 4
}

const DASH = Buffer.from('-')
const TAIL = Buffer.from('--')

function Parser (boundary) {
  const bodySearch = new StreamSearch('\r\n--' + boundary)
  const headSearch = new StreamSearch('\r\n\r\n', 1)

  let bodyState = STATE.UNINITIALIZED
  let headState = STATE.UNINITIALIZED

  const stream = new Writable({
    write (chunk, encoding, next) {
      bodySearch.add(chunk)

      next()
    }
  })

  bodySearch.on('part', function (result) {
    const { isMatch, data, start } = result
    bodyParser(isMatch, data, start)
  })

  headSearch.on('part', function (result) {
    const { isMatch, data, start } = result
    headParser(isMatch, data, start)
  })

  // We have to insert EOF before the starting boundary,
  // because only so we can easily search for any boundary.
  bodySearch.add('\r\n')

  function bodyParser (isMatch, data, start) {
    if (bodyState === STATE.UNINITIALIZED) {
      if (isMatch) {
        // The starting boundary.
        bodyState = STATE.AFTER_STARTING_BOUNDARY
      }
    }
    else if (bodyState === STATE.AFTER_STARTING_BOUNDARY) {
      if (isMatch) {
        // An enclosing boundary starts at position `start`,
        // before that are content data and/or headers.
        headSearch.add(data.slice(0, start))
        headSearch.end()

        stream.emit('part')

        // Reset head state.
        headState = STATE.UNINITIALIZED
      }
      else {
        if (data.equals(DASH) || data.equals(TAIL)) {
          // Tail after last boundary.
          bodyState = STATE.REQUEST_END
          stream.emit('end')
        }
        else {
          // Data before enclosing boundary.
          headSearch.add(data)
        }
      }
    }
  }

  function headParser (isMatch, data, start) {
    if (headState === STATE.UNINITIALIZED) {
      if (isMatch) {
        // Double EOF between headers and content,
        // before that are headers.
        headState = STATE.AFTER_HEADERS
        stream.emit('header', data.slice(0, start), true)
      }
      else {
        // Headers before double EOF.
        stream.emit('header', data, false)
      }
    }
    else if (headState === STATE.AFTER_HEADERS) {
      // Content data.
      stream.emit('data', data)
    }
  }

  function end () {
    bodySearch.end()
  }

  return {
    end: end,
    write: (data) => stream.write(data),
    on: (event, handler) => stream.on(event, handler)
  }
}

module.exports = Parser
