import { DBSchema, IDBPDatabase, IndexNames, StoreNames, openDB } from "idb";
import { AgeNoteDB } from "./schema";

const DATABASE_NAME = 'note-db'

const objectStores = ['folder', 'note', 'folderNoteRel'] as const
type AppObjectStores = typeof objectStores[number]


type AppObjectStore = {
  [key in StoreNames<AgeNoteDB>]: {
    primaryKey: string | string[],
    index: {
      name: string,
      column: string | string[]
    }[]
  }
}

const objectStoresObj: AppObjectStore = {
  folder: {
    primaryKey: 'id',
    index: [
      {
        name: 'by-name',
        column: 'name'
      }
    ]
  },
  note: {
    primaryKey: 'id',
    index: []
  },
  folderNoteRel: {
    primaryKey: ['folder', 'note'],
    index: [
      {
        name: 'by-folder',
        column: 'folder'
      },
      {
        name: 'by-note',
        column: 'note'
      }
    ]
  }
} as const

export async function IDBConfig() {
  let database = await openDB<AgeNoteDB>(DATABASE_NAME)
  const currentObjectStores = database.objectStoreNames
  const missingObjectStores = objectStores.filter(objectStore => !currentObjectStores.contains(objectStore))
  if (missingObjectStores && missingObjectStores.length > 0) {
    database.close()
    const version = await getDatabaseVersion(database)
    database = await openDB<AgeNoteDB>(DATABASE_NAME, version + 1, {
      upgrade(db) {
        Object.entries(objectStoresObj).forEach(([key, value]) => {
          if (currentObjectStores.contains(key as StoreNames<AgeNoteDB>)) {
            return
          }
          const store = db.createObjectStore(key as StoreNames<AgeNoteDB>, {
            keyPath: value.primaryKey,
          })
          value.index.forEach(index => {
            store.createIndex(index.name as never, index.column)
          })
        })





        // missingObjectStores.forEach(objectStore => {
        //   const store = db.createObjectStore(objectStore, {
        //     keyPath: 'id',
        //   })


        //   if (objectStore == 'folder') {
        //     const store = db.createObjectStore(objectStore, {
        //       keyPath: 'id',
        //     })
        //     store.createIndex('by-name', 'name');
        //   } 
        //   if (objectStore == 'note') {
        //     db.createObjectStore(objectStore, {
        //       keyPath: 'id',
        //     })
        //   }
        //   if (objectStore == 'folderNoteRel') {
        //     const store = db.createObjectStore(objectStore, {
        //       keyPath: ['folder', 'note'],
        //     })
        //     store.createIndex('by-folder', 'folder')
        //     store.createIndex('by-note', 'note')
        //   }
          
        // })
      },
    })

  }

  return database
}

async function getDatabaseVersion<DB extends DBSchema>(db?: IDBPDatabase<DB>) {
  if (db) {
    db.version
  }
  const database = await openDB<AgeNoteDB>(DATABASE_NAME)
  return database.version
}
