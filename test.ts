import { Store } from './index';
import { IReaderOptions } from './readers';

let store = new Store();

store.update([{
  $set: {
    keys: <IReaderOptions>{
      $fn: {
        path: '$payload.0',
        cb(val: any, val2: any) { return val2 },
        params: ['$payload.1']
      }
    }
  }
}], [
    { name: 'a' },
    { name: 'b' },
    { age: 22 },
    { name: 'd' }
  ]);

console.log(store.get());