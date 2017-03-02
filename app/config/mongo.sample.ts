import { appName } from './app';

export default {
  uri: `mongodb://localhost/${appName}`,
  options: {
    server: {
      poolSize: 5
    }
  }
};
