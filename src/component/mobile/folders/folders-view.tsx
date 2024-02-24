import { Icon } from "@iconify/react";
import { Box, IconButton, Typography } from "@mui/material";
import DrawerBase, { DrawerBaseHandle } from "../drawer-base";
import { ForwardRefRenderFunction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Folders, { NoteCount } from "./folders";
import { addFolder, deleteFolder, getFolders } from "@/db/folder-service";
import { countNotesOfFolder } from "@/db/note-service";
import AddFolderView, { AddFolderViewHandle } from "./add-folder-view";
import { Folder } from "@/db/schema";

export interface FoldersViewHandle {
  open: () => void
  close: () => void
}

interface FoldersViewProps {
}

const FoldersView: ForwardRefRenderFunction<FoldersViewHandle, FoldersViewProps> = function FoldersView({}, ref) {

  const [folders, setFolders] = useState<Folder[]>([])
  const [foldersNoteCount, setFoldersNoteCount] = useState<NoteCount>({})

  const drawerRef = useRef<DrawerBaseHandle>(null)
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

  useImperativeHandle(ref, () => {
    return {
      open() {
        drawerRef.current?.open()
      },
      close() {
        drawerRef.current?.close()
      },
    };
  })

  function handleCreateFolder(folder: Folder) {
    addFolder(folder)
    addFolderRef.current?.close()
    getAllFolders()
  }

  function handleSelectFolder(folder: Folder) {
    drawerRef.current?.close()
  }

  return (
    <>
      <DrawerBase ref={drawerRef} anchor="bottom">
        <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'stretch'}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'50px'} borderBottom={'1px solid #ddd'}>
            <IconButton onClick={() => drawerRef.current?.close()}>
              <Icon icon="tabler:chevron-left" width="2rem" height="2rem" />
            </IconButton>
            <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500}>Folders</Typography>
            <IconButton onClick={() => addFolderRef.current?.open()}>
              <Icon icon="tabler:plus" width="1.75rem" height="1.75rem" />
            </IconButton>
          </Box>
          <Box flexGrow={1} bgcolor={'#f0f2f7'} height={'calc(100svh - 50px)'} overflow={'hidden auto'} >
            <Folders folders={folders} foldersNoteCount={foldersNoteCount} onFolderDelete={handleFolderDelete} onFolderSelected={handleSelectFolder} />
          </Box>
        </Box>
      </DrawerBase>
      <AddFolderView ref={addFolderRef} onFolderAdd={handleCreateFolder} />
    </>
  )
}

export default forwardRef(FoldersView)
