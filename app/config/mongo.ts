import { appName } from './app';

const mongo_conf = {
  uri: `mongodb://localhost/${appName}`,
  options: {
    server: {
      poolSize: 5
    }
  }
};

export { mongo_conf };
export default mongo_conf;
