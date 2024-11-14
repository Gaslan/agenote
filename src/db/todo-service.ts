import { db, Todo } from "@/db/db";
import dayjs from "dayjs";

export async function getTodosByDate(date: string) {
  return await db.todos.where('date').equals(date).toArray()
}

export async function getTodosOverDue() {
  const today = dayjs().format('YYYY-MM-DD')
  return await db.todos.where('date').below(today).toArray()
}

export async function addTodo(todo: Todo) {
  const todoAdd = {
    ...todo, 
    createdAt: dayjs().format('YYYY-MM-DD'), 
    completed: false}
  const id = await db.todos.add(todoAdd)
  return id
}

export async function changeCompleted(id: number, completed: boolean) {
  await db.todos.update(id, {completed})
}

export async function updatePriority(id: number, priority: number) {
  await db.todos.update(id, {priority})
}

export async function updateDuedate(id: number, date: string) {
  await db.todos.update(id, {date})
}

export async function getTodosBetweenDates(startDate: string, endDate: string) {
  return await db.todos.where('date').between(startDate, endDate, true, false).toArray()
}
