import { db, TodoList } from "./db"

export async function getTodoLists() {
  return await db.todo_lists.where('id').above(0).toArray()
}

export async function addTodoList(list: TodoList) {
  const todoList = {
    ...list
  }
  const id = await db.todo_lists.add(todoList)
  return id
}
