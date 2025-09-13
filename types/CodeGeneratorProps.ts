interface Header {
  key: string;
  value: string;
}

export interface Props {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  json: string;
  headers: Header[];
}
