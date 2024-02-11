'use client'
import { Folder } from "@/component/Folders";
import NoteEditor, { NoteEditorHandle } from "@/component/editor/NoteEditor";
import { getNotesByFolder, saveNote } from "@/db/note-service";
import { Note } from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectNote } from "@/redux/features/app/appSlice";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour12: false,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
}

export default function Home() {

  const [notes, setNotes] = useState<Note[]>([])
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)

  useEffect(() => {
    getNotes()
  }, [selectedFolder])

  async function getNotes() {
    if (!selectedFolder) {
      return []
    }

    const foldersNotes = await getNotesByFolder((selectedFolder as Folder).id)
    setNotes(foldersNotes)
  }

  function emptyView() {
    return <Box p={'1rem'}>No folder selected</Box>
  }

  function emptyFolderView() {
    return (
      <Box bgcolor={'#f0f2f7'} sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Box width={80} height={100} borderRadius={'8px'} bgcolor={(selectedFolder as unknown as Folder).cover} mb={2}></Box>
        <Typography variant="body2" mb={1}>Want to add new note? Tap on the button below!</Typography>
      </Box>
    )
  }

  function notesView() {
    if (notes.length == 0) {
      return emptyFolderView()
    }
    return (
      notes && notes.map(note => (
        <Box 
          key={note.id} 
          onClick={() => {} /*handleNoteItemClick(note)*/} 
          sx={{padding: '1rem', bgcolor: '#fff', borderBottom: '1px solid rgba(0,0,0,.1)', cursor: 'pointer', ":hover": {bgcolor: 'rgba(0,0,0,.03)'}, '&.active': {backgroundColor: 'rgba(128,192,255,.1)'}}}>
          <Typography variant="h4" pb={'.75rem'} fontSize={'16px'} fontWeight={'500'}>
            {note.title}
          </Typography>
          <Typography variant="body1" pb={'.75rem'} fontSize={'16px'} fontWeight={'400'} width={'100%'} overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>
            {note.content}
          </Typography>
          <Typography variant="body2" fontSize={'12px'} fontWeight={'300'} color={'#939599'}>
            {new Date(note.createdAt).toLocaleString(undefined, DATE_FORMAT_OPTIONS)}
          </Typography>
        </Box>
      ))
    )
  }

  return (
    selectedFolder
      ? notesView()
      : emptyView()
    
  )
}
