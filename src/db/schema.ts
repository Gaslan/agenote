import { DBSchema } from "idb";

export interface Folder {
  id: string
  parentId: string
  name: string
  cover: string
}

export interface Note {
  id: string
  title: string
  content: any
  pinned: boolean
  quickAccess: boolean
  createdAt: string
}

export interface FolderNoteRel {
  folder: string
  note: string
}

export interface AgeNoteDB extends DBSchema {
  folder: FolderScheme
  note: NoteScheme
  folderNoteRel: FolderNoteRelScheme
}

export interface FolderScheme {
  value: Folder
  key: string
  indexes: {
    'by-name': string
  }
}

export interface NoteScheme {
  value: Note
  key: string
}

export interface FolderNoteRelScheme {
  value: FolderNoteRel
  key: string
  indexes: {
    'by-folder': string,
    'by-note': string
  }
}
