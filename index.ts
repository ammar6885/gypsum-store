import { EventEmitter } from 'events';
import { IUpdateOptions } from "./query";
import { getValue } from 'tools-box/object/get-value';
import { objFromMap } from 'tools-box/object/object-from-map';
import { extend } from 'tools-box/object/extend';
import { operators } from './operators';
import { ISchema } from 'validall/schema';

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

  set(path: string, value: any, data?: any) {
    operators.$set(data ? { store: this.data, data } : this.data, path, value);
  }

  inc(path: string, value: number | string, data?: any) {
    operators.$inc(data ? { store: this.data, data } : this.data, path, value);
  }

  mul(path: string, value: number | string, data?: any) {
    operators.$mul(data ? { store: this.data, data } : this.data, path, value);
  }

  push(path: string, value: any, data?: any) {
    operators.$push(data ? { store: this.data, data } : this.data, path, value);
  }

  unshift(path: string, value: any, data?: any) {
    operators.$unshift(data ? { store: this.data, data } : this.data, path, value);
  }

  pop(path: string, value: number | string, data?: any) {
    operators.$pop(data ? { store: this.data, data } : this.data, path, value);
  }

  shift(path: string, value: number | string, data?: any) {
    operators.$shift(data ? { store: this.data, data } : this.data, path, value);
  }

  pull(path: string, value: number | string | boolean | ISchema, data?: any) {
    operators.$pull(data ? { store: this.data, data } : this.data, path, value);
  }

  splice(path: string, value: [number | string, number | string, any?], data?: any) {
    operators.$splice(data ? { store: this.data, data } : this.data, path, value);
  }

  concat(path: string, value: string[], data?: any) {
    operators.$concat(data ? { store: this.data, data } : this.data, path, value);
  }

  delete(path: string, value: number, data?: any) {
    operators.$delete(data ? { store: this.data, data } : this.data, path);
  }

  update(options: IUpdateOptions, data?: any) {
    for (let option in options)
      for (let key in (<any>options)[option])
        (<any>operators)[option](data ? {store: this.data, data} : this.data, key, (<any>options)[option][key]);

    this.emit('update', extend({}, this.data));
  }

  extract(map: any, target = {}, data?: any): any {
    return objFromMap(data ? {store: this.data, data} : this.data, target, map);
  }
}