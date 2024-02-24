'use client'
import { Folder } from "@/db/schema"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import { selectFolder } from "@/redux/features/app/appSlice"
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { useState } from "react"

export type NoteCount = {[key: string]: number}

interface FoldersProps {
  folders: Folder[]
  foldersNoteCount: NoteCount
  onFolderDelete: (id: string) => void
  onFolderSelected: (folder: Folder) => void
}

export default function Folders({folders, foldersNoteCount, onFolderDelete, onFolderSelected}: FoldersProps) {
  const dispatch = useAppDispatch()
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)

  function handleFolderClick(folder: Folder) {
    dispatch(selectFolder(folder))
    onFolderSelected(folder)
  }

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        {folders && folders.map(folder => (
          <Box key={folder.id} sx={{width: 'calc(100% / 2)'}}>
            <Box 
              onClick={() => {handleFolderClick(folder)}} 
              className={selectedFolder ? ((selectedFolder as Folder).id == folder.id ? 'active' : '') : ''} 
              sx={{p: '4px 4px', cursor: 'pointer', padding: '1rem'}}>
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
    </>
  )
}
