import pkg from '../../package.json';

let conf = {
  appName: pkg.name,
  appUser: pkg.name,
  version: pkg.version,
  port: 3000,
  // socket: "/tmp/#{pkg.name}.sock"
  env: 'development',
  cookie_secret: 'super secret cookie key'
};

// get latest git commit hash and branch if in dev environment
if (conf.env === 'development') {
  let { exec } = require('child_process');
  exec('git rev-parse --short HEAD', function (err, stdout, stderr) {
    conf.hash = stdout;
    return conf.hashLink = `${pkg.repository.web}/commit/${stdout}`;
  });
  exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => conf.branch = stdout);
}

export default conf;
