'use client'
import ModalBase, { ModalBaseHandle } from "@/component/ModalBase";
import AddFolderModal from "@/component/add-folder-modal";
import { Folder } from "@/db/schema";
import { addFolder, deleteFolder, getFolders } from "@/db/folder-service";
import { countNotesOfFolder, getNotes } from "@/db/note-service";
import { Icon } from "@iconify/react";
import { Collapse } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SidebarFolders, { NoteCount } from "./sidebar-folders";
import AddFolderView, { AddFolderViewHandle } from "@/component/mobile/folders/add-folder-view";

interface SidebarProps {
  
}

export default function Sidebar({}: SidebarProps) {

  const [folders, setFolders] = useState<Folder[]>([])
  const [foldersNoteCount, setFoldersNoteCount] = useState<NoteCount>({})
  const [foldersCollapsed, setFoldersCollapsed] = useState(true)

  const folderAddModalRef = useRef<ModalBaseHandle>(null)
  const addFolderRef = useRef<AddFolderViewHandle>(null)

  useEffect(() => {
    getAll()
    async function getAll() {
      const folders = await getAllFolders()
      const b = await folders.reduce(folderCount, Promise.resolve({}))
      setFoldersNoteCount(b)
    }

    async function folderCount(acc: Promise<NoteCount>, folder: Folder) {
      const c = await countNotesOfFolder(folder.id)
      return {...(await acc), [folder.id]: c}
    }
    
  }, [])

  async function getAllFolders() {
    const folders = await getFolders()
    setFolders(folders)
    folders.forEach(async (folder) => console.log(folder.name, await countNotesOfFolder(folder.id)))
    return folders
  }

  async function handleFolderDelete(id: string) {
    deleteFolder(id)
    getAllFolders()
  }

  function handleCreateFolder(folder: Folder) {
    addFolder(folder)
    addFolderRef.current?.close()
    getAllFolders()
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-menu-item-primary">
            <div className="sidebar-menu-item-primary-label">
              <Icon icon="flat-color-icons:folder" fontSize={'1.75rem'} />
              <span className="ml-2 grow" style={{fontSize: '1.125rem'}}>Folders</span>
            </div>
            <button className="add-button" onClick={() => addFolderRef.current?.open()} style={{display: 'flex', padding: '4px', border: 0, backgroundColor: 'transparent', cursor: 'pointer'}}>
              <Icon icon="mdi:plus" fontSize={'1.5rem'} />
            </button>
            <button onClick={() => setFoldersCollapsed(val => !val)} style={{display: 'flex', padding: '4px', marginLeft: '8px', border: 0, backgroundColor: 'transparent', cursor: 'pointer'}}>
              <Icon icon={foldersCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-right'} fontSize={'1.5rem'} className="sidebar-menu-item-primary-toggle" />
            </button>
          </div>
          <Collapse in={foldersCollapsed} timeout={'auto'} unmountOnExit>
            <SidebarFolders folders={folders} foldersNoteCount={foldersNoteCount} onFolderDelete={handleFolderDelete} />
          </Collapse>
        </div>
      </aside>
      {/* <ModalBase ref={folderAddModalRef} sx={{p: 2}}>
        <AddFolderModal onFolderAdd={handleCreateFolder} />
      </ModalBase> */}
      <AddFolderView ref={addFolderRef} onFolderAdd={handleCreateFolder} />
    </>
  )
}
