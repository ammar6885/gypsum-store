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

  set(path: string, value: any, payload?: any) {
    operators.$set(payload ? { store: this.data, payload } : this.data, path, value);
  }

  inc(path: string, value: number | string, payload?: any) {
    operators.$inc(payload ? { store: this.data, payload } : this.data, path, value);
  }

  mul(path: string, value: number | string, payload?: any) {
    operators.$mul(payload ? { store: this.data, payload } : this.data, path, value);
  }

  push(path: string, value: any, payload?: any) {
    operators.$push(payload ? { store: this.data, payload } : this.data, path, value);
  }

  unshift(path: string, value: any, payload?: any) {
    operators.$unshift(payload ? { store: this.data, payload } : this.data, path, value);
  }

  pop(path: string, value: number | string, payload?: any) {
    operators.$pop(payload ? { store: this.data, payload } : this.data, path, value);
  }

  shift(path: string, value: number | string, payload?: any) {
    operators.$shift(payload ? { store: this.data, payload } : this.data, path, value);
  }

  pull(path: string, value: number | string | boolean | ISchema, payload?: any) {
    operators.$pull(payload ? { store: this.data, payload } : this.data, path, value);
  }

  splice(path: string, value: [number | string, number | string, any?], payload?: any) {
    operators.$splice(payload ? { store: this.data, payload } : this.data, path, value);
  }

  concat(path: string, value: string[], payload?: any) {
    operators.$concat(payload ? { store: this.data, payload } : this.data, path, value);
  }

  delete(path: string, value: number, payload?: any) {
    operators.$delete(payload ? { store: this.data, payload } : this.data, path);
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