import Dexie, {type EntityTable} from 'dexie';

interface Todo {
  id: number
  title: string
  detail: string
  date: string
  priority: number
  listId: number
  createdAt: string
  completed: boolean
}

interface TodoList {
  id: number
  name: string
  icon: string
  parentId: number | null
}

const db = new Dexie('note-db') as Dexie & {
  todos: EntityTable<Todo, 'id'>
  todo_lists: EntityTable<TodoList, 'id'>
}

db.version(1).stores({
  todos: '++id, name, title, detail, date, priority, listId, createdAt, completed',
  todo_lists: '++id, name, icon, parentId'
})

export type { Todo, TodoList }
export { db }
