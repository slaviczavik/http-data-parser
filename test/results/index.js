module.exports = {
  alpha: {
    boundary: '--------------------------034172598905589540726558',
    data: '../data/alpha.dat',
    parts: 1,
    result: [{
      size: 32,
      headers: [
        ['Content-Disposition', 'form-data; name="file"; filename="file.png"'],
        ['Content-Type', 'image/png']
      ]
    }]
  },
  beta: {
    boundary: '--------------------------034172598905589540726558',
    data: '../data/beta.dat',
    parts: 2,
    result: [{
      size: 32,
      headers: [
        ['Content-Disposition', 'form-data; name="file"; filename="001.jpg"'],
        ['Content-Type', 'image/jpeg']
      ]
    }, {
      size: 16,
      headers: [
        ['Content-Disposition', 'form-data; name="file"; filename="002.jpg"'],
        ['Content-Type', 'image/jpeg']
      ]
    }]
  }
}
