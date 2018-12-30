import { Store } from './index';

let store = new Store({
  name: "Ammar",
  age: 33,
  family: {
    wife: { name: 'Hafsa', age: 28 },
    children: [
      { name: 'Amena', age: 4 }
    ]
  },
  kit: ['laptop', 'bag', 'pencil', 'paper'],
  tasks: ['task1', 'task2', 'task3', 'task4', 'task5']
});

store.on('update', data => {
  console.log(JSON.stringify(data, null, 2));
});

store.update({
  $set: { 'store.name': ['$self'] },
  $inc: { 'store.family.wife.age': '$store.family.children[0].age' },
  $push: { 'store.family.children': '$data.yasser' },
  $pull: { 'store.kit': { $intersect: ['.$data.dropped'] } },
  $splice: { 'store.tasks': [0, 2, '$self[2]'] },
  $delete: { 'store.family.children[1].name': 1 },
  $concat: { 'store.family.children[0].name': ['$self', ' Ammar Mourad'] }
}, {
  name: 'Ammar Mourad',
  yasser: { name: 'Yasser', age: 2 },
  dropped: ['bag']
});