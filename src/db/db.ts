import Dexie, {type EntityTable} from 'dexie';

// interface Lists {
//   id: number
//   name: string
// }

// interface ListItems {
//   id: number
//   type: string
//   detail: object
//   listId: number
// }

interface Todo {
  id: number
  title: string
  detail: string
  date: string
  priority: string
  createdAt: string
  completed: boolean
}

const db = new Dexie('note-db') as Dexie & {
  todos: EntityTable<Todo, 'id'>
  // 'list-items': EntityTable<ListItems, 'id'>
}

db.version(1).stores({
  todos: '++id, name, title, detail, date, priority, createdAt, completed',
  // 'list-items': '++id, type, detail, listId'
})

export type { Todo };
export { db };
