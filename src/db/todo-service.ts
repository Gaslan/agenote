import { db } from "@/db/db";
import dayjs from "dayjs";

// export async function getTodos() {
//   const db = await IDBConfig()
//   return db.getAllFromIndex('todo', 'by-date')
// }

export async function getTodosByDate(date: string) {
  return await db.todos.where('date').equals(date).toArray()
}

export async function getTodosOverDue() {
  const today = dayjs().format('YYYY-MM-DD')
  return await db.todos.where('date').below(today).toArray()
}

// export async function addTodo(todo: Todo) {
//   const db = await IDBConfig()
//   const newTodo = {...todo, id: nanoid()}
//   await db.put('todo', newTodo)
//   return newTodo
// }
