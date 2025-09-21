declare module 'postman-collection' {
  export interface RequestDefinition {
    url: string;
    method: string;
    header?: Header;
    body?: string;
    description?: string;
  }
  export class Request {
    constructor(options: RequestDefinition);
    url: string;
    method: string;
    headers: Header[];
    body?: string;
    toJSON(): RequestDefinition;
  }

  export class Collection {
    constructor(options?: any);
    items: any[];
    toJSON(): any;
  }
  export interface ItemDefinition {
    name?: string;
    request?: Request;
    response?: unknown[];
  }
  export class Item {
    constructor(options?: ItemDefinition);
    request: Request;
  }

  export class Header {
    constructor(options: string);
  }
}
