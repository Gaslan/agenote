'use client'
import ModalBase, { ModalBaseHandle } from "@/component/ModalBase"
import { Folder } from "@/db/schema"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import { selectFolder } from "@/redux/features/app/appSlice"
import { Icon } from "@iconify/react"
import { Box, MenuItem, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { useLongPress } from "use-long-press"
import UpdateFolderView, { UpdateFolderViewHandle } from "./update-folder-view"

export type NoteCount = {[key: string]: number}

interface FoldersProps {
  folders: Folder[]
  foldersNoteCount: NoteCount
  onFolderDelete: (id: string) => void
  onFolderSelected: (folder: Folder) => void
}

export default function Folders({folders, foldersNoteCount, onFolderDelete, onFolderSelected}: FoldersProps) {
  const [selectedOptionFolder, setSelectedOptionFolder] = useState<Folder>()
  const dispatch = useAppDispatch()
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)
  const folderOptionsRef = useRef<ModalBaseHandle>(null)
  const updateFolderViewRef = useRef<UpdateFolderViewHandle>(null)
  const bindFolderFn = useLongPress((event, meta) => {
    folderOptionsRef.current?.open()
  }, {
    threshold: 400,
    onStart: (event, meta) => {
      setSelectedOptionFolder(meta.context as Folder)
    }
  })

  function handleFolderClick(folder: Folder) {
    dispatch(selectFolder(folder))
    onFolderSelected(folder)
  }

  return (
    <>
      <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', padding: '1rem'}}>
        {folders && folders.map(folder => (
          <Box key={folder.id} sx={{width: 'calc((100% - 1.5rem) / 2)'}}>
            <Box 
              onClick={() => {handleFolderClick(folder)}} 
              className={selectedFolder ? ((selectedFolder as Folder).id == folder.id ? 'active' : '') : ''} 
              {...bindFolderFn(folder)}
              sx={{cursor: 'pointer', userSelect: 'none'}}>
              <Box width={'100%'} height={'200px'} bgcolor={folder.cover} borderRadius={'8px'} position={'relative'} overflow={'hidden'}>
                <Typography variant="body1" component={'span'} flexGrow={1} display={'flex'} alignItems={'center'} justifyContent={'space-between'} position={'absolute'} bottom={0} left={0} right={0} width={'100%'} padding={'8px'} bgcolor={'rgba(0,0,0,.4)'} color={'#fff'}>
                  <span>{folder.name}</span>
                  {!!(foldersNoteCount[folder.id] && foldersNoteCount[folder.id] > 0) && (
                    <span style={{fontSize: '80%', marginLeft: '6px', color: 'rgba(255,255,255,.6)'}}>{foldersNoteCount[folder.id]}</span>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        
      </div>
      {selectedOptionFolder &&
        <ModalBase ref={folderOptionsRef} onClose={() => setSelectedOptionFolder(undefined)} sx={{padding: '8px 0'}}>
          <>
            <MenuItem onClick={() => {folderOptionsRef.current?.close();updateFolderViewRef.current?.open()}}>
              <Icon icon="fluent:edit-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
              Edit folder
            </MenuItem>
            <MenuItem onClick={() => {folderOptionsRef.current?.close()}} sx={{color: '#e63946'}}>
              <Icon icon="fluent:delete-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
              Delete folder
            </MenuItem>
          </>
        </ModalBase>
      }
      {selectedOptionFolder && 
        <UpdateFolderView ref={updateFolderViewRef} folder={selectedOptionFolder as Folder} onFolderUpdate={() => {}} />
      }
    </>
  )
}
