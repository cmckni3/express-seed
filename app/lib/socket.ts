import * as fs from 'fs';
import { socket } from '../config/app';

process.on('cleanup', function () {
  if (fs.existsSync(socket)) {
    return fs.unlinkSync(socket);
  }
});
