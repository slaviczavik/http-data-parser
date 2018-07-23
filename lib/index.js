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

class Parser extends Writable {
  constructor (boundary) {
    super()

    this.boundary = boundary
    this.bodyState = STATE.UNINITIALIZED
    this.headState = STATE.UNINITIALIZED

    this.bodySearch = new StreamSearch('\r\n--' + this.boundary)
    this.headSearch = new StreamSearch('\r\n\r\n', 1)

    this._initParser()
  }

  _write (chunk, encoding, next) {
    this.bodySearch.add(chunk)

    next()
  }

  end () {
    this.bodySearch.end()
  }

  _initParser () {
    const self = this

    this.bodySearch.on('part', function (result) {
      const { isMatch, data, start } = result
      self._bodyParser(isMatch, data, start)
    })

    this.headSearch.on('part', function (result) {
      const { isMatch, data, start } = result
      self._headParser(isMatch, data, start)
    })

    // We have to insert EOF before the starting boundary,
    // because only so we can easily search for any boundary.
    this.bodySearch.add('\r\n')
  }

  _bodyParser (isMatch, data, start) {
    if (this.bodyState === STATE.UNINITIALIZED) {
      if (isMatch) {
        // The starting boundary.
        this.bodyState = STATE.AFTER_STARTING_BOUNDARY
      }
    }
    else if (this.bodyState === STATE.AFTER_STARTING_BOUNDARY) {
      if (isMatch) {
        // An enclosing boundary starts at position `start`,
        // before that are content data and/or headers.
        this.headSearch.add(data.slice(0, start))
        this.headSearch.end()

        this.emit('part')

        // Reset head state.
        this.headState = STATE.UNINITIALIZED
      }
      else {
        if (data.equals(DASH) || data.equals(TAIL)) {
          // Tail after last boundary.
          this.bodyState = STATE.REQUEST_END
          this.emit('end')
        }
        else {
          // Data before enclosing boundary.
          this.headSearch.add(data)
        }
      }
    }
  }

  _headParser (isMatch, data, start) {
    if (this.headState === STATE.UNINITIALIZED) {
      if (isMatch) {
        // Double EOF between headers and content,
        // before that are headers.
        this.headState = STATE.AFTER_HEADERS
        this.emit('header', data.slice(0, start), true)
      }
      else {
        // Headers before double EOF.
        this.emit('header', data, false)
      }
    }
    else if (this.headState === STATE.AFTER_HEADERS) {
      // Content data.
      this.emit('data', data)
    }
  }
}

module.exports = Parser
