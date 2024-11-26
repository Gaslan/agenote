import { db, RecurringEventFrequency, Todo, TodoRecurringEvent } from "@/db/db";
import dayjs from "dayjs";

export async function getTodosByDate(date: string) {
  return await db.todos.where('date').equals(date).toArray()
}

export async function getTodosByListId(listId: number) {
  // return await db.todos.where('listId').equals(listId).toArray()
  const tt = await db.todos.toArray()
  console.log('Tüm', tt)
  console.log('listId', listId)
  const todos = await db.todos.where('id').equals(listId).toArray()
  console.log('TODOS', todos)
  return todos
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

export async function updatePriority(id: number, priority: number | undefined) {
  await db.todos.update(id, {priority})
}

export async function updateListId(id: number, listId: number | undefined) {
  await db.todos.update(id, {listId})
}

export async function updateRecurrence(id: number, recurrence: RecurringEventFrequency | null) {
  await db.todos.update(id, {recurrence})
}

export async function updateDuedate(id: number, date: string) {
  await db.todos.update(id, {date})
}

export async function getTodosBetweenDates(startDate: string, endDate: string) {
  return await db.todos.where('date').between(startDate, endDate, true, false).toArray()
}

export async function addRecurringEvent(event: TodoRecurringEvent) {
  return await db.todo_recurring_events.add(event)
}

export async function deleteRecurringEvent(todoId: number) {
  await db.todo_recurring_events.where('todoId').equals(todoId).delete()
}
