import { Store } from './index';

let store = new Store({
  name: 'Ammar',
  family: {
    wife: 'hafsa',
    children: [{ name: "Amena", age: 5 }, {name: "Yasser", age: 3} ]
  }
});

store.update([
  { $log: { family: 1 } },
  { $delete: { 'family.children.$.age': 1 } },
  { $log: { family: 1 } }
]);