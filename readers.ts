import { getValue } from 'tools-box/object/get-value';

export function getValFromStr(src: any, path: string): any {
  return path.charAt(0) === '$'
    ? path.charAt(1) === '$'
      ? getValue(src, path.slice(2)).toString()
      : getValue(src, path.slice(1))
    : path;
}

export interface IReaderOptions {
  $value?: any;
  $length?: string;
  $size?: string;
  $keys?: string;
  $fn?: { path: string; cb: (val: any, ...params: any[]) => any, params?: string[] };
}

export const readers = {
  $value(src: any, val: any): number {
    if (typeof val === 'string') {
      return getValFromStr(src, val);
    } else {
      return val;
    }
  },

  $length(src: any, path: string): number {
    let val = getValFromStr(src, path);

    if (val && val.length)
      return val.length;

    return null;
  },

  $size(src: any, path: string): number {
    let val = getValFromStr(src, path);

    if (val && typeof val === 'object')
      return Object.keys(val).length;

    return null;
  },

  $keys(src: any, path: string): string[] {
    let val = getValFromStr(src, path);

    if (val && typeof val === 'object')
      return Object.keys(val);

    return null;
  },

  $fn(src: any, path: string, fn: (path: any, ...params: any[]) => any, ...params: string[]) {
    let val = getValFromStr(src, path);
    let paramsValues: any[] = [];

    params = params || [];
    
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      paramsValues.push(getValFromStr(src, param));
    }

    return fn(val, ...paramsValues);
  }
}