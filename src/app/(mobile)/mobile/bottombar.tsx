import { Icon } from "@iconify/react";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { addFolder, deleteFolder, getFolders } from "@/db/folder-service";
import { countNotesOfFolder, getNotes } from "@/db/note-service";
import Folders, { NoteCount } from "./folders";
import { Folder } from "@/component/Folders";

interface BottombarProps {
  
}

export default function Bottombar({}: BottombarProps) {

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const [foldersNoteCount, setFoldersNoteCount] = useState<NoteCount>({})

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

  function handleDrawerClose() {
    setDrawerOpen(false)
  }

  async function handleFolderDelete(id: string) {
    deleteFolder(id)
    getAllFolders()
  }

  return (
    <>
    <div className="bottombar">
      <div style={{width: '100%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <IconButton onClick={() => setDrawerOpen(true)}>
          <Icon icon="tabler:folders" width="1.625rem" height="1.625rem" />
        </IconButton>
        <IconButton onClick={() => setDrawerOpen(true)} sx={{bgcolor: '#256dc9', padding: '12px', transform: 'translateY(-35%)', color: '#fff', boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(164, 164, 164, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'}}>
          <Icon icon="tabler:edit" width="1.75rem" height="1.75rem" />
        </IconButton>
        <IconButton>
          <Icon icon="mdi:dots-horizontal" width="1.625rem" height="1.625rem" />
        </IconButton>
      </div>
    </div>
    <Drawer sx={{'& .MuiPaper-root': {height: '100%'}}}
      anchor="bottom"
      open={drawerOpen}
      onClose={handleDrawerClose}>
        <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'stretch'}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'50px'} borderBottom={'1px solid #ddd'}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Icon icon="tabler:chevron-left" width="2rem" height="2rem" />
            </IconButton>
            <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500}>Folders</Typography>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <Icon icon="tabler:plus" width="1.75rem" height="1.75rem" />
            </IconButton>
          </Box>
          <Box flexGrow={1} bgcolor={'#f0f2f7'}>
            <Folders folders={folders} foldersNoteCount={foldersNoteCount} onFolderDelete={handleFolderDelete} />
          </Box>
        </Box>
    </Drawer>
    </>
  )
}
