appName = 'express-seed'

module.exports =
  appName: appName
  port: 3000
  # socket: "/usr/local/var/run/#{appName}.socket"
  pidFile: "/usr/local/var/run/#{appName}.pid"
  env: 'development'
