export type RespError = { code: string; message: string; hint?: string };

export type RespData = {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number | null;
  headers: Array<[string, string]>;
  isJson: boolean;
  isText: boolean;
  isBinary: boolean;
  truncated: boolean;
  bodyText: string;
  downloadUrl?: string;
  bodyFullText?: string;
};
