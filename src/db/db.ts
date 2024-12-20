import Dexie, { type EntityTable } from 'dexie';

interface Todo {
  id: number
  title: string
  detail: string
  date: string
  priority: number
  listId: number
  sectionId: number
  createdAt: string
  completed: boolean
  recurrence: RecurringEventFrequency | null
}

interface TodoList {
  id: number
  name: string
  icon: string
  color: string
  parentId: number | null
}

interface TodoListSection {
  id: number
  name: string
  listId: number
}

export type RecurringEventFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'

// https://github.com/bakineggs/recurring_events_for
interface TodoRecurringEvent {
  id: number
  todoId: number 
  startsOn: Date
  endsOn: Date | null
  frequency: RecurringEventFrequency
  separation: number
  count: number | null
  until: Date | null
}

const db = new Dexie('note-db') as Dexie & {
  todos: EntityTable<Todo, 'id'>
  todo_lists: EntityTable<TodoList, 'id'>
  todo_list_sections: EntityTable<TodoListSection, 'id'>
  todo_recurring_events: EntityTable<TodoRecurringEvent, 'id'>
}

db.version(1).stores({
  todos: '++id, name, title, detail, date, priority, *listId, *sectionId, createdAt, completed, recurrence',
  todo_lists: '++id, name, icon, color, parentId',
  todo_list_sections: '++id, name, listId',
  todo_recurring_events: '++id, todoId, startsOn, endsOn, frequency, separation, count, until'
})

export type { Todo, TodoList, TodoListSection, TodoRecurringEvent }
export { db }
