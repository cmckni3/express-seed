import { pbkdf2, randomBytes } from 'crypto';

const uid = len => randomBytes(len).toString('base64').slice(0, len);
const serializePasswordData = passwordData => [passwordData.salt, passwordData.derivedKey, passwordData.derivedKeyLength, passwordData.iterations].join('::');
const deserializePasswordData = (serializedPasswordData) => {
  let [salt, derivedKey, derivedKeyLength, iterations] = Array.from(serializedPasswordData.split('::'));

  return {
    salt,
    derivedKey,
    derivedKeyLength: parseInt(<string> derivedKeyLength, 10),
    iterations: parseInt(<string> iterations, 10)
  };
};

export default class NodePbkdf2 {
  iterations: number;
  lengthLimit: number;
  derivedKeyLength: number;
  saltLength: number;
  digest: string;

  constructor(options?: any) {
    if (!options) {
      options = {};
    }
    this.iterations = options.iterations || 10000;
    this.saltLength = options.saltLength || 12;
    this.derivedKeyLength = options.derivedKeyLength || 30;
    this.lengthLimit = options.lengthLimit || 4096;
    this.digest = options.digest || 'sha512';
  }

  // public functions

  public hashPassword(plaintextPassword, cb) {
    if (plaintextPassword.length >= this.lengthLimit) {
      throw new Error('password is too long');
    }
    let randomSalt = uid(this.saltLength);
    return pbkdf2(plaintextPassword, randomSalt, this.iterations, this.derivedKeyLength, this.digest, (err, derivedKey) => {
      if (err) {
        return cb(err);
      }

      const key: string = (new Buffer(derivedKey.toString(), 'binary')).toString('base64');

      return cb(null, serializePasswordData({
        salt: randomSalt,
        iterations: this.iterations,
        derivedKeyLength: this.derivedKeyLength,
        derivedKey: key
      }));
    });
  }

  public checkPassword(plaintextPassword, serializedPasswordData, cb) {
    if (plaintextPassword.length >= this.lengthLimit) {
      throw new Error('password is too long');
    }
    let { salt, derivedKey, derivedKeyLength, iterations } = deserializePasswordData(serializedPasswordData);
    if (salt == null || derivedKey == null || iterations == null || derivedKeyLength == null) {
      return cb('serializedPasswordData doesn\'t have the right format');
    }

    // Use the encrypted password's parameter to hash the candidate password
    return pbkdf2(<string> plaintextPassword, <string> salt, iterations, derivedKeyLength, this.digest, (err, candidateDerivedKey) => {
      if (err) {
        return cb(err);
      }
      let key: string = (new Buffer(candidateDerivedKey.toString(), 'binary')).toString('base64');
      if (key === derivedKey) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  }
}
