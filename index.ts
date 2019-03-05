import { EventEmitter } from 'events';
import { IUpdateOptions } from "./interface";
import { getValue } from 'tools-box/object/get-value';
import { objFromMap } from 'tools-box/object/object-from-map';
import { extend } from 'tools-box/object/extend';
import { operators } from './operators';
import { ISchema } from 'validall/schema';
import { validate } from 'validall';

export class Store extends EventEmitter  {
  private data: any;

  constructor(data: any = {}) {
    super();
    this.data = data;
  }

  get(path?: string): any {
    let value = path ? getValue(this.data, path) : this.data;

    if (value && typeof value === 'object')
      return extend({}, value);

    return value;
  }

  set(path: string, value: any, payload?: any) {
    this.data.payload = payload;
    this.data.payload = payload;
    operators.$set(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  inc(path: string, value: number | string, payload?: any) {
    this.data.payload = payload;
    operators.$inc(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  mul(path: string, value: number | string, payload?: any) {
    this.data.payload = payload;
    operators.$mul(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  push(path: string, value: any, payload?: any) {
    this.data.payload = payload;
    operators.$push(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  unshift(path: string, value: any, payload?: any) {
    this.data.payload = payload;
    operators.$unshift(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  pop(path: string, value: number | string, payload?: any) {
    this.data.payload = payload;
    operators.$pop(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  shift(path: string, value: number | string, payload?: any) {
    this.data.payload = payload;
    operators.$shift(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  pull(path: string, value: number | string | boolean | ISchema, payload?: any) {
    this.data.payload = payload;
    operators.$pull(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  splice(path: string, value: [number | string, number | string, any?], payload?: any) {
    this.data.payload = payload;
    operators.$splice(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  concat(path: string, value: string[], payload?: any) {
    this.data.payload = payload;
    operators.$concat(this.data, path, value);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  delete(path: string, value: number, payload?: any) {
    this.data.payload = payload;
    operators.$delete(this.data, path);
    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  update(options: IUpdateOptions[], payload?: any) {
    this.data.payload = payload;
    for (let i = 0; i < options.length; i++) {
      for (let option in options[i])
        for (let key in (<any>options[i])[option])
          (<any>operators)[option](this.data, key, (<any>options[i])[option][key]);
    }

    delete this.data.payload;
    this.emit('update', extend({}, this.data));
  }

  extract(map: any, target = {}, payload?: any, ignoreKeys = false): any {
    this.data.payload = payload;
    let result = objFromMap(this.data, target, map, ignoreKeys);
    delete this.data.payload;
    return result;
  }

  validate(schema: ISchema, payload?: any) {
    this.data.payload = payload;
    delete schema.$filter;
    let err = validate(this.data, objFromMap(this.data, {}, schema, true));
    delete this.data.payload;
    return err;
  }

  find(path: string, schema: ISchema) {
    let list = getValue(this.data, path);

    if (!Array.isArray(list))
      return null;

    if (list.length === 0)
      return [];

    let filteredList = [];
    
    for (let i = 0; i < list.length; i++)
      if (!validate(list[i], objFromMap(this.data, {}, schema, true)))
        filteredList.push(list[i]);

    return filteredList;
  }
}