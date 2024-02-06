import { openDB } from "idb";
import { AgeNoteDB, Note } from "./schema";
import { nanoid } from "nanoid";
import { Folder } from "@/component/Folders";
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
