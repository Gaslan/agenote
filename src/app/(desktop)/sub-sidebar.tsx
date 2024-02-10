'use client'
import { Folder } from "@/component/Folders"
import { addNote, getNotesByFolder } from "@/db/note-service"
import { Note } from "@/db/schema"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import { selectNote } from "@/redux/features/app/appSlice"
import { Box, Button, Typography } from "@mui/material"
import classNames from "classnames"
import { useEffect, useState } from "react"

interface SubSidebarProps {
  folder: Folder
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour12: false,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
}

export default function SubSidebar({folder}: SubSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)
  const selectedNote = useAppSelector(state => state.app.selectedNote)
  
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    getNotes()
  }, [selectedFolder])

  async function getNotes() {
    if (!selectedFolder) {
      return []
    }

    const foldersNotes = await getNotesByFolder((selectedFolder as Folder).id)
    setNotes(foldersNotes)
    
    // if (foldersNotes && foldersNotes.length > 0) {
    //   dispatch(selectNote(foldersNotes[0]))
    // } else {
    //   dispatch(selectNote(undefined))
    // }
  }

  function handleNoteItemClick(note: Note): void {
    dispatch(selectNote(note))
  }

  return selectedFolder ? (
    <div className="sub-sidebar">
      <div className="sub-sidebar-header">
        {selectedFolder ? (selectedFolder as Folder).name : 'YOK'}
      </div>      
      <Box sx={{borderTop: '1px solid rgba(0,0,0,.1)', fontFamily: "'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"}}>
        {notes && notes.map(note => (
          <Box 
            key={note.id} 
            onClick={() => handleNoteItemClick(note)} 
            className={classNames({active: (selectedNote as unknown as Note)?.id == note.id})} 
            sx={{padding: '1rem', borderBottom: '1px solid rgba(0,0,0,.1)', cursor: 'pointer', ":hover": {bgcolor: 'rgba(0,0,0,.03)'}, '&.active': {backgroundColor: 'rgba(128,192,255,.1)'}}}>
            <Typography variant="h4" pb={'.75rem'} fontSize={'14px'} fontWeight={'500'} fontFamily={"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"}>
              {note.title}
            </Typography>
            <Typography variant="body1" pb={'.75rem'} fontSize={'14px'} fontWeight={'400'} fontFamily={"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"}>
              {note.content}
            </Typography>
            <Typography variant="body2" fontSize={'11px'} fontWeight={'300'} fontFamily={"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"} color={'#939599'}>
              {new Date(note.createdAt).toLocaleString(undefined, DATE_FORMAT_OPTIONS)}
            </Typography>
          </Box>
        ))}
      </Box>
    </div>
  ) : null
}
