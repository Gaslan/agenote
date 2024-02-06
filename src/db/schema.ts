import { Folder } from "@/component/Folders";
import { DBSchema } from "idb";

export interface Note {
  id: string
  title: string
  content: string
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
