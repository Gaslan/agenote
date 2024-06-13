import { openDB } from "idb";
import { AgeNoteDB, Note } from "./schema";
import { nanoid } from "nanoid";
import { Folder } from "@/db/schema";
import { IDBConfig } from "./database";

export async function getNotes() {
  const db = await IDBConfig()
  return db.getAll('note')
}

export async function getNote(id: string) {
  const db = await IDBConfig()
  return db.get('note', id)
}

export async function getNotesByFolder(folderId: string) {
  const db = await IDBConfig()
  const noteIds = await db.getAllFromIndex('folderNoteRel', 'by-folder', folderId)
  // const notes = await db.getAll('note', IDBKeyRange.only(noteIds.map(id => id.note)))
  const notes: Note[] = []
  for (let noteId of noteIds) {
    const note = await db.get('note', noteId.note)
    if (note) {
      notes.push(note)
    }
  }
  return notes
}

export async function countNotesOfFolder(folderId: string) {
  const db = await IDBConfig()
  const transaction = db.transaction('folderNoteRel')
  const objectStore = transaction.objectStore('folderNoteRel')
  const folderIndex = objectStore.index('by-folder')
  const count = await folderIndex.count(folderId)
  return count
}

export async function addNote(note: Note, folder: Folder) {
  const db = await IDBConfig()
  const newNote = {...note, id: nanoid()}
  await db.put('note', newNote)
  await db.put('folderNoteRel', {
    folder: folder.id,
    note: newNote.id
  })
  return note
}

export async function saveNote(note: Note) {
  const db = await IDBConfig()
  await db.put('note', note)
  return note
}

export async function deleteNote(id: string) {
  const db = await IDBConfig()
  const transaction = db.transaction(['folderNoteRel', 'note'], 'readwrite')
  const objectStoreNote = transaction.objectStore('note')
  objectStoreNote.delete(id)
  const objectStoreFolderNoteRel = transaction.objectStore('folderNoteRel')
  const folderNoteRelIndex = objectStoreFolderNoteRel.index('by-note')
  const indexKeys = await folderNoteRelIndex.getAllKeys(IDBKeyRange.only(id))
  indexKeys.forEach(key => objectStoreFolderNoteRel.delete(key))
}

export async function pin(note: Note) {
  const db = await IDBConfig()
  const updatedNote = {...note, pinned: !note.pinned}
  await db.put('note', updatedNote)
  return updatedNote
} 

export async function quickAccess(note: Note) {
  const db = await IDBConfig()
  const updatedNote = {...note, quickAccess: !note.quickAccess}
  await db.put('note', updatedNote)
  return updatedNote
} 
