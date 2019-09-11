import { Store } from './index';
import { IReaderOptions } from './readers';

let store = new Store();

store.set("auth", null);

console.log(store.get());