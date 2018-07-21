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

## Code

```JS
const HttpDataParser = require('@slaviczavik/http-data-parser')

// A boundary must be extracted from 'content-type' request header.
const boundary '--------------------------034172598905589540726558'
const parser = new HttpDataParser(boundary)

parser.on('header', function (buffer) {
  // Save headers somewhere...
})

parser.on('data', function (buffer) {
  // Save body content somewhere...
})

parser.on('part', function () {
  // We reached the end of one body part.
  // Here we can concate headers and/or body content together.
})

parser.on('end', function () {
  // We reached the end of whole body.
  // Or here we can concate headers and/or body content together.
})

req.on('data', function (data) {
  parser.add(data)
})

req.on('end', function () {
  parser.end()
})
```
