const path = require('path')

module.exports = {
  title: 'TIMECLOUD',
  db: { address: 'mongodb://localhost/iblueio' },
  workDirectory: path.resolve(process.env.HOME, 'npm'),
  logDirectory: path.resolve(process.env.HOME, 'log'),
  scanInterval: 5000,
  configName: 'timecloud.json',
}
