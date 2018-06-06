const Core = require('timecloud-core')
const Back = require('timecloud-back')
const Front = require('timecloud-front')

const http = require('http')
const express = require('express')
const serveIndex = require('serve-index')
const serveStatic = require('serve-static')

const app = express()
const router = express.Router()
const port = process.env.PORT || 8080

let core = null
let back = null
let front = null

async function start() {
  // 读取json文件配置
  // TODO

  // 初始化timecloud组件
  await new Promise(res => {
    back = new Back({
      db: { address: 'mongodb://localhost/iblueio' },
      workDirectory: './.tmp',
      scanInterval: 2000,
      configName: 'timecloud.json',
      // TODO: 支持多级目录
      logDirectory: './.tmp',
    }, res)
  })
  await back.start()
  core = back.getCore()
  front = Front(core, {
    title: 'TIMECLOUD'
  })
  // 初始化web框架express
  app.set('view engine', 'ejs')
  app.set('views', './views')
  app.set("view options", { "open": "{{", "close": "}}" })
  app.use(express.static('public'))
  app.use('/', front)
  app.use('/log', serveIndex('xxx', {
    icons: true
  }))
  app.use('/log', serveStatic('xxx'))
  app.set('port', port)
  let server = http.createServer(app)
  server.listen(port, function () {
    console.log('Express server listening on port ' + server.address().port)
  })
}

async function stop() {

}

start()