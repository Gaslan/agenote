import { Folder } from "@/db/schema"
import { nanoid } from "nanoid"
import { IDBConfig } from "./database"

export async function getFolders() {
  const db = await IDBConfig()
  return db.getAllFromIndex('folder', 'by-name')
}

export async function addFolder(folder: Folder) {
  const db = await IDBConfig()
  const newFolder = {...folder, id: nanoid()}
  await db.put('folder', newFolder)
  return newFolder
}

export async function deleteFolder(id: string) {
  const db = await IDBConfig()
  await db.delete('folder', id)
}
