import { Store } from './index';

let store = new Store({
  name: 'Ammar',
  family: {
    wife: 'hafsa',
    children: [{ name: "Amena", age: 5 }, {name: "Yasser", age: 3} ]
  }
});

console.log(store.data);

store.reset();

console.log(store.data);