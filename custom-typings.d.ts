/// <reference path="./node_modules/typescript/lib/lib.es6.d.ts" />
/// <reference path="./node_modules/@types/node/index.d.ts" />

// Extend Express Request type
/*
declare namespace Express {
  export interface Request {
  }
}
*/

interface User {
  username?: string;
  name?: string;

  roles?: Array(any);
  can(verb: string): boolean
}

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
