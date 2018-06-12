const app_name = 'timecloud-' + process.env.ENV
let instances = process.env.ENV === 'prod' ? 4 : 2
module.exports = JSON.stringify({
  'apps': [
    {
      name: app_name,
      script: 'scripts/singleton.sh',
      kill_timeout: 1200000,
      log_file: '/dev/null',
      error_file: '/dev/null',
      exec_mode: 'cluster',
      instances: instances,
      treekill: false,
    },
  ],
})
