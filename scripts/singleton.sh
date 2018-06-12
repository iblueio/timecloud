#!/usr/bin/env node

var app = require('../app.js')

app.start()

process.on('SIGINT', app.stop)
