import { Store } from './index';

let store = new Store({
  name: "Ammar",
  age: 33,
  family: {
    wife: { name: 'Hafsa', age: 28 },
    children: [
      { name: 'Amena', age: 4 },
      { name: 'Yasser', age: 2 },
    ]
  },
  kit: ['laptop', 'bag', 'pencil', 'paper'],
  tasks: ['task1', 'task2', 'task3', 'task4', 'task5'],
  limit: 2
});

// store.on('update', data => {
//   console.log(JSON.stringify(data, null, 2));
// });

// store.update({
//   $set: { 'name': ['$self'] },
//   $inc: { 'family.wife.age': '$family.children[0].age' },
//   $push: { 'family.children': '$payload.yasser' },
//   $pull: { 'kit': { $intersect: ['.$payload.drop'] } },
//   $splice: { 'tasks': [0, 2, '$self[2]'] },
//   $delete: { 'family.children[1].name': 1 },
//   $concat: { 'family.children[0].name': ['$self', ' Ammar Mourad'] }
// }, {
//   name: 'Ammar Mourad',
//   yasser: { name: 'Yasser', age: 2 },
//   drop: ['bag']
// });

console.log(store.validate({ $paths: { 'payload.age': { $gt: '$limit' } } }, { age: 3 }));