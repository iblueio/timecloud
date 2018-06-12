'use strict'

// Timecloud 组件
const Core = require('timecloud-core')
const Back = require('timecloud-back')
const Front = require('timecloud-front')

// Express 组件
const http = require('http')
const express = require('express')
const serveIndex = require('serve-index')
const serveStatic = require('serve-static')

// 初始化Express组件
const app = express()
const router = express.Router()
const port = process.env.PORT || 8080

// 导入配置
const _ = require('lodash')
const config = _.assign(require('./config/config'), require('./config/default'))

// 初始化Timecloud组件
let core = null
let back = null
let front = null

async function start() {
  // 初始化timecloud组件
  await new Promise((resolve, reject) => {
    back = new Back(config, err => {
      err ? reject(err) : resolve()
    })
  })
  core = back.getCore()
  await new Promise(res => {
    core.purge((err, numRemove) => {
      console.log('清除历史数据数量：', numRemove)
      res(err)
    })
  })
  await back.start()
  front = Front(core, {
    title: 'TIMECLOUD'
  })
  // 初始化web框架express
  app.set('view engine', 'ejs')
  app.set('views', './views')
  app.set("view options", { "open": "{{", "close": "}}" })
  app.use(express.static('public'))
  app.use('/', front)
  app.use('/log', serveIndex(config.logDirectory, {
    icons: true
  }))
  app.use('/log', serveStatic(config.logDirectory))
  app.set('port', port)
  let server = http.createServer(app)
  server.listen(port, function () {
    console.log('timecloud listening on port ' + server.address().port)
  })
}

async function stop() {
  try {
    back.stop((() => {
    }))
  } catch (err) {
    throw err
  } finally {
    console.log('Timecloud shuts down...')
    process.exit(0)
  }
}

module.exports = {
  start,
  stop,
}