'use client'
import { Folder } from "@/db/schema"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import { selectFolder } from "@/redux/features/app/appSlice"
import { Icon, InlineIcon } from "@iconify/react"
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { useState } from "react"

export type NoteCount = {[key: string]: number}

interface SidebarFoldersProps {
  folders: Folder[]
  foldersNoteCount: NoteCount
  onFolderDelete: (id: string) => void
}

export default function SidebarFolders({folders, foldersNoteCount, onFolderDelete}: SidebarFoldersProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorId, setAnchorId] = useState<null | string>(null)
  const open = Boolean(anchorEl)
  const dispatch = useAppDispatch()
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, folderId: string) => {
    setAnchorEl(event.currentTarget)
    setAnchorId(folderId)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setAnchorId(null)
  }

  function handleDeleteButtonClick() {
    onFolderDelete(anchorId ?? '')
    handleClose()
  }

  function handleFolderClick(folder: Folder) {
    dispatch(selectFolder(folder))
  }

  return (
    <>
      <div>
        {folders && folders.map(folder => (
          <Box onClick={() => {handleFolderClick(folder)}} className={selectedFolder ? ((selectedFolder as Folder).id == folder.id ? 'active' : '') : ''} key={folder.id} sx={{p: '4px 12px', cursor: 'pointer', '&:hover': {backgroundColor: 'rgba(0,0,0,.05)'}, '&:hover .MuiButtonBase-root': {visibility: 'visible'}, '&.active': {backgroundColor: 'rgba(0,0,0,.08)'}}}>
            <Stack direction={'row'} alignItems={'center'}>
              <Box width={'28px'} height={'28px'} borderRadius={'50%'} bgcolor={folder.cover} mr={'8px'}></Box>
              <Typography variant="body2" component={'span'} flexGrow={1} display={'flex'} alignItems={'center'} fontSize={'1.125rem'}>
                {folder.name}
                {!!(foldersNoteCount[folder.id] && foldersNoteCount[folder.id] > 0) && (
                  <span style={{fontSize: '80%', marginLeft: '6px', color: 'rgba(0,0,0,.6)'}}>{foldersNoteCount[folder.id]}</span>
                )}
              </Typography>
              <IconButton onClick={(e) => handleClick(e, folder.id)} data-folder-id={folder.id} aria-controls={anchorId == folder.id ? 'folder-menu' : undefined} disableRipple disableTouchRipple sx={{visibility: 'hidden', '&:hover': {color: '#111'}}}>
                <Icon icon="mdi:dots-horizontal" width="1.25rem" height="1.25rem" />
              </IconButton>
              
            </Stack>
            </Box>
        ))}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'folder-menu',
          }}
          sx={{'& .MuiPaper-root': {boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(164, 164, 164, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'}}}
        >
          <MenuItem onClick={handleClose} sx={{fontSize: '.875rem'}}>
            <ListItemIcon>
              <InlineIcon icon={'mdi:plus'} fontSize={'1.25rem'} />
            </ListItemIcon>
            <span>New Sub Folder</span>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{fontSize: '.875rem'}}>
            <ListItemIcon>
              <InlineIcon icon={'mdi:edit'} fontSize={'1.25rem'} />
            </ListItemIcon>
            <span>Edit</span>
          </MenuItem>
          <MenuItem onClick={() => handleDeleteButtonClick()} sx={{fontSize: '.875rem'}}>
            <ListItemIcon>
              <InlineIcon icon={'mdi:trash'} fontSize={'1.25rem'} />
            </ListItemIcon>
            <span>Delete</span>
          </MenuItem>
        </Menu>
      </div>
    </>
  )
}
