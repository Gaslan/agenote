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

export async function addTodoListSection(name: string, listId: number) {
  const todoListSection = { name, listId }
  const id = await db.todo_list_sections.add(todoListSection)
  return id
}

export async function getTodoListSectionsByListId(listId: number) {
  return await db.todo_list_sections.where('listId').equals(listId).toArray()
}
