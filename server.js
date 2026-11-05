const { serveNcmApi } = require('NeteaseCloudMusicApi')
serveNcmApi({ port: 3000, checkVersion: false })
