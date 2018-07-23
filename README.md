[![Build Status](https://travis-ci.com/slaviczavik/http-data-parser.svg?branch=master)](https://travis-ci.com/slaviczavik/http-data-parser)

# Description
An extremely fast Node.js module for parsing form data and primarily file uploads.

# Requirements
Node.js 6.14.3 or higher is required.

# Installation
```
npm i @slaviczavik/http-data-parser
```

# Example

```JS
const HttpDataParser = require('@slaviczavik/http-data-parser')

// A boundary must be extracted from 'content-type' request header.
const boundary '--------------------------034172598905589540726558'
const parser = new HttpDataParser(boundary)

parser.on('header', function (data, isLast) {
  // Save headers somewhere...

  if (isLast) {
    // Here you may prepare for handling body data,
    // like create a writable stream and so on.
  }
})

parser.on('data', function (data) {
  // Save body content somewhere...
})

parser.on('part', function () {
  // We reached the end of one body part.
  // Here we can concate body content together.
})

parser.on('end', function () {
  // We reached the end of whole body.
  // No other data will come.
})

req.on('data', function (data) {
  parser.write(data)
})

req.on('end', function () {
  parser.end()
})
```

# API

## Constructor
### `new HttpDataParser(boundary)`

| Name | Required | Type | Description | Default
| - | - | - | - | - |
| `boundary` | true | `string` | | `none` |

## Methods
The parser is a Node.js Writable Stream, so you can use the `write` and the `end` methods,
or just only the `pipe` method.

### `write(buffer)`

| Parameter | Required | Type | Description
| - | - | - | - |
| `buffer` | true | `buffer` | Buffer from request body. |

### `end()`
Call this method when there is no more data to be consumed from the stream.

## Events

### `header(data, isLast)`
Emitted every time when a parser find a header part.

| Property | Type | Description
| - | - | - |
| `data` | `buffer` | - |
| `isLast` | `boolean` | Signals if it is a last header part. |

### `data(data)`
Emitted every time when a parser find a content data.

| Property | Type | Description
| - | - | - |
| `data` | `buffer` | - |

### `part()`
Emitted every time when a parser reach the end of one body part.

### `end()`
Emitted when a parser reached the end of request body.
