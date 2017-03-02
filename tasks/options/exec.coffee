module.exports =
  "curl-head":
    command: (url) ->
      fs = require 'fs'
      nginx_conf_file = "#{process.cwd()}/app/config/nginx.ts"
      if fs.existsSync nginx_conf_file
        {serverNames} = require nginx_conf_file
        if serverNames and (server = serverNames.split(' ')[0])
          "curl -I http://#{server} >/dev/null 2>&1"
        else
          "echo \"serverNames not set in app/config/nginx.ts\"; exit 1"
      else
        "echo \"app/config/nginx.ts doesn't exist\"; exit 1"
  copyConfigs:
    command: ->
      files = [
        { source: 'app/config/app.sample.ts', destination: 'app/config/app.ts' },
        { source: 'app/config/logger.sample.ts', destination: 'app/config/logger.ts' },
        { source: 'app/config/mongo.sample.ts', destination: 'app/config/mongo.ts' },
        { source: 'app/config/nginx.sample.ts', destination: 'app/config/nginx.ts' }
      ]
      fs = require 'fs'

      files.map (config_file) ->
        if fs.existsSync config_file.source
          "cp \"#{config_file.source}\" \"#{config_file.destination}\";"
        else
          "echo \"#{config_file.source} does not exist\";"
      .join('')
  # this task must be run as root
  activateService:
    command: if config? then "chkconfig #{config.appName} on" else "echo 'no config file'"
  npm:
    command: 'npm prune && npm install'
  bower:
    command: 'bower prune && bower install'
