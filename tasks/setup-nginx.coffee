module.exports = (grunt) ->
  # this task must be run as root
  grunt.registerTask 'setup-nginx', ->
    fs = require 'fs'
    confdir = "#{process.cwd()}/app/config"
    if fs.existsSync "#{confdir}/app.coffee"
      config = require "#{confdir}/app.coffee"
    if fs.existsSync "#{confdir}/nginx.coffee"
      nginx_config = require "#{confdir}/nginx.coffee"

    if not nginx_config? then throw new Error 'no nginx.coffee config file.'
    upstreamName = nginx_config.upstreamName
    if not upstreamName? then throw new Error 'no upstreamName defined in app.coffee.'
    socketFile = nginx_config.socketFile
    if not socketFile? then throw new Error 'not configured to run on a unix socket.'
    serverNames = nginx_config.serverNames
    if not serverNames? then throw new Error 'no serverNames defined in app.coffee.'
    publicRoot = nginx_config.publicRoot
    if not publicRoot? then throw new Error 'no publicRoot defined in app.coffee.'
    confPath = nginx_config.confPath
    if not confPath? then throw new Error 'no confPath defined in app.coffee.'
    Mustache = require 'mustache'
    done = @async()

    locals =
      upstreamName: upstreamName
      socketFile: socketFile
      serverNames: serverNames
      publicRoot: publicRoot

    filename = config.appName

    fs.readFile './support/nginx.conf', (err, configContents) ->
      if err? then throw err

      output = Mustache.render configContents.toString(), locals
      fs.writeFile "#{confPath}/#{filename}", output, (err) ->
        if err? then throw err
        console.log "nginx vhost config file written to #{confPath}/#{filename}"
        done()
