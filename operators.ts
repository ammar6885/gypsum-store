import { getValue } from 'tools-box/object/get-value';
import { injectValue } from 'tools-box/object/inject-value';
import { validate } from 'validall';
import { ISchema } from 'validall/schema';
import { extend } from 'tools-box/object/extend';
import { cleanPropPath } from 'tools-box/object/clean-prop-path';
import { objFromMap } from 'tools-box/object/object-from-map';
import { strSplice } from 'tools-box/string/str-splice';

function getValFromStr(src: any, path: string): any {
  return path.charAt(0) === '$'
    ? path.charAt(1) === '$'
      ? getValue(src, path.slice(2)).toString()
      : getValue(src, path.slice(1))
    : path;
}

export const operators = {
  $set(src: any, path: string, value: any): void {
    src.self = getValue(src, path);

    if (typeof value == 'string') {
      injectValue(src, path, getValFromStr(src, value));
      delete src.self;
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        injectValue(src, path, []);
        delete src.self;
        return;
      }

      let result: any = [];

      for (let i = 0; i < value.length; i++) {

        if (typeof value[i] === 'string') {
          if (value[i].indexOf('.$') === 0) {
            value[i] = value[i].slice(4);
            let currVal = getValue(src, value[i]);

            if (currVal && currVal.length)
              result.push(...currVal);

            continue;

          } else {
            result.push(getValFromStr(src, value[i]));
            continue;
          }
        }
      }

      injectValue(src, path, result);
      delete src.self;
      return;
    }

    injectValue(src, path, value);
    delete src.self;
  },

  $inc(src: any, path: string, value: number | string) {
    src.self = getValue(src, path);
    value = typeof value === 'string' ? getValue(src, value.slice(1)) : value;

    if (src.self && typeof src.self === 'number') {
      src.self += <number>value;
      injectValue(src, path, src.self);
    }

    delete src.self;
  },

  $mul(src: any, path: string, value: number | string) {
    src.self = getValue(src, path);
    value = typeof value === 'string' ? getValue(src, value.slice(1)) : value;

    if (src.self && typeof src.self === 'number') {
      src.self *= <number>value;
      injectValue(src, path, src.self);
    }

    delete src.self;
  },

  $push(src: any, path: string, value: any[]) {
    src.self = getValue(src, path);

    if (!src.self || !Array.isArray(src.self)) {
      delete src.self;
      return;
    }

    value = Array.isArray(value) ? value : [value];

    for (let i = 0; i < value.length; i++) {
      let currVal = value[i];

      if (typeof currVal === 'string') {
        if (currVal.indexOf('.$') === 0)
          currVal = getValue(src, currVal.slice(4));
        else
          currVal = getValFromStr(src, currVal);
      }

      if (Array.isArray(currVal))
        src.self.push(...currVal);
      else
        src.self.push(currVal);
    }

    delete src.self;
  },

  $unshift(src: any, path: string, value: any[]) {
    src.self = getValue(src, path);

    if (!src.self || !Array.isArray(src.self)) {
      delete src.self;
      return;
    }

    value = Array.isArray(value) ? value : [value];

    for (let i = 0; i < value.length; i++) {
      let currVal = value[i];

      if (typeof currVal === 'string') {
        if (currVal.indexOf('.$') === 0)
          currVal = getValue(src, currVal.slice(4));
        else
          currVal = getValFromStr(src, currVal);
      }

      if (Array.isArray(currVal))
        src.self.unshift(...currVal);
      else
        src.self.unshift(currVal);
    }

    delete src.self;
  },

  $pull(data: any, path: string, value: any, src = data) {
    src.self = getValue(src, path);

    if (!src.self || src.self.length === 0) {
      delete src.self;
      return;
    }

    if (value && typeof value === 'object') {
      let schema: ISchema = extend({}, value);
      schema = objFromMap(src, {}, schema);

      for (let i = 0; i < src.self.length; i++)
        if (!validate(src.self[i], schema))
          src.self.splice(i--, 1);

    } else {
      if (typeof value === 'string')
        value = getValFromStr(src, value);

      for (let i = 0; i < src.self.length; i++)
        if (src.self[i] === value)
          src.self.splice(i--, 1);
    }

    delete src.self;
  },

  $pop(src: any, path: string, value: string | number) {
    src.self = getValue(src, path);

    if (!src.self || !Array.isArray(src.self)) {
      delete src.self;
      return;
    }

    value = typeof value === 'string' ? getValue(src, value.slice(1)) : value;

    src.self.splice(src.self.length - <number>value, <number>value);
    delete src.self;
  },

  $shift(src: any, path: string, value: string | number) {
    src.self = getValue(src, path);

    if (!src.self || !Array.isArray(src.self)) {
      delete src.self;
      return;
    }

    value = typeof value === 'string' ? getValue(src, value.slice(1)) : value;

    src.self.splice(0, <number>value);
    delete src.self;
  },

  $splice(src: any, path: string, value: [number | string, number | string, any?]) {
    src.self = getValue(src, path);

    if (!src.self || (!Array.isArray(src.self) && typeof src.self !== 'string')) {
      delete src.self;
      return;
    }

    let start: number = typeof value[0] === 'string' ? getValue(src, (<string>value[0]).slice(1)) : value[0];
    let count: number = typeof value[1] === 'string' ? getValue(src, (<string>value[1]).slice(1)) : value[1];

    if (value[2]) {
      value[2] = Array.isArray(value[2]) ? value[2] : [value[2]];

      for (let i = 0; i < value[2].length; i++) {
        let currVal = value[2][i];

        if (typeof currVal === 'string') {
          if (currVal.indexOf('.$') === 0)
            currVal = getValue(src, currVal.slice(4));
          else
            currVal = getValFromStr(src, currVal);
        }

        if (Array.isArray(currVal))
          typeof src.self === 'string' ? src.self = strSplice(src.self, start, count, ...currVal) : src.self.splice(start, count, ...currVal);
        else
          typeof src.self === 'string' ? src.self = strSplice(src.self, start, count, currVal) : src.self.splice(start, count, currVal);
      }

    } else {
      src.self.splice(start, count);
    }

    delete src.self;
  },

  $delete(src: any, path: string) {
    let parts = cleanPropPath(path).split('.');

    if (parts.length === 1) {
      delete src[path];
      return;
    }

    let temp = src[parts[0]];

    for (let i = 1; i < parts.length; i++) {
      if (temp && temp.hasOwnProperty(parts[i])) {
        if (i === parts.length - 1) {
          delete temp[parts[i]];
          break;
        } else {
          temp = temp[parts[i]];
          continue;
        }
      }

      break;
    }
  },

  $concat(src: any, path: string, value: string[]) {
    let str = "";
    src.self = getValue(src, path);
    for (let i = 0; i < value.length; i++)
      str += getValFromStr(src, value[i]);

    injectValue(src, path, str);
    delete src.self;
  }
}
