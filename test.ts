import { Store } from './index';
import { IReaderOptions } from './readers';

let store = new Store();

store.update([
  { $set: { name: 'Ammar' } },
  { $log: { '*': 1, name: 1 } }
]);