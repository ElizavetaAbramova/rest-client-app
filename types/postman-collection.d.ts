declare module 'postman-collection' {
  export class Request {
    constructor(options: any);
    url: any;
    method: string;
    headers: any;
    body: any;
    toJSON(): any;
  }

  export class Collection {
    constructor(options?: any);
    items: any[];
    toJSON(): any;
  }

  export class Item {
    constructor(options?: any);
    request: Request;
  }

  export class Header {
    constructor(options: any);
  }
}
