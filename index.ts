import { EventEmitter } from 'events';
import { IUpdateOptions } from "./interface";
import { getValue } from 'tools-box/object/get-value';
import { objFromMap } from 'tools-box/object/object-from-map';
import { extend } from 'tools-box/object/extend';
import { operators } from './operators';
import { ISchema } from 'validall/schema';
import { validate } from 'validall';

export class Store extends EventEmitter  {
  private _data: any;

  constructor(data: any = {}) {
    super();
    this._data = data;
  }

  get(path?: string): any {
    let value = path ? getValue(this._data, path) : this._data;

    if (value && typeof value === 'object')
      return extend({}, value);

    return value;
  }

  set(path: string, value: any, payload?: any) {
    this._data.payload = payload;
    this._data.payload = payload;
    operators.$set(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  inc(path: string, value: number | string, payload?: any) {
    this._data.payload = payload;
    operators.$inc(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  mul(path: string, value: number | string, payload?: any) {
    this._data.payload = payload;
    operators.$mul(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  push(path: string, value: any, payload?: any) {
    this._data.payload = payload;
    operators.$push(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  unshift(path: string, value: any, payload?: any) {
    this._data.payload = payload;
    operators.$unshift(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  pop(path: string, value: number | string, payload?: any) {
    this._data.payload = payload;
    operators.$pop(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  shift(path: string, value: number | string, payload?: any) {
    this._data.payload = payload;
    operators.$shift(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  pull(path: string, value: number | string | boolean | ISchema, payload?: any) {
    this._data.payload = payload;
    operators.$pull(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  splice(path: string, value: [number | string, number | string, any?], payload?: any) {
    this._data.payload = payload;
    operators.$splice(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  concat(path: string, value: string[], payload?: any) {
    this._data.payload = payload;
    operators.$concat(this._data, path, value);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  delete(path: string, value: number, payload?: any) {
    this._data.payload = payload;
    operators.$delete(this._data, path);
    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  update(options: IUpdateOptions[], payload?: any) {
    this._data.payload = payload;
    for (let i = 0; i < options.length; i++) {
      for (let option in options[i])
        for (let key in (<any>options[i])[option])
          (<any>operators)[option](this._data, key, (<any>options[i])[option][key]);
    }

    delete this._data.payload;
    this.emit('update', extend({}, this._data));
  }

  extract(map: any, target = {}, payload?: any, ignoreKeys = false): any {
    this._data.payload = payload;
    let result = objFromMap(this._data, target, map, { ignoreKeys });
    delete this._data.payload;
    return result;
  }

  validate(schema: ISchema, payload?: any) {
    this._data.payload = payload;
    delete schema.$filter;
    let err = validate(this._data, objFromMap(this._data, {}, schema, { ignoreKeys: true }));
    delete this._data.payload;
    return err;
  }

  find(path: string, schema: ISchema) {
    let list = getValue(this._data, path);

    if (!Array.isArray(list))
      return null;

    if (list.length === 0)
      return [];

    let filteredList = [];
    
    for (let i = 0; i < list.length; i++)
      if (!validate(list[i], objFromMap(this._data, {}, schema, { ignoreKeys: true })))
        filteredList.push(list[i]);

    return filteredList;
  }

  get data() {
    return Object.assign({}, this._data);
  }

  reset() {
    this._data = {};
  }
}