'use client'
import { Folder } from "@/component/Folders";
import NoteEditor, { NoteEditorHandle } from "@/component/editor/NoteEditor";
import DrawerBase, { DrawerBaseHandle } from "@/component/mobile/drawer-base";
import { getNotesByFolder, saveNote } from "@/db/note-service";
import { Note } from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectFolder, selectNote } from "@/redux/features/app/appSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Button, IconButton, Typography } from "@mui/material";
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
  const selectedFolder = useAppSelector(state => state.app.selectedFolder) as unknown as Folder
  const selectedNote = useAppSelector(state => state.app.selectedNote) as unknown as Note
  const dispatch = useAppDispatch()
  const editorDrawerRef = useRef<DrawerBaseHandle>(null)
  const editorRef = useRef<NoteEditorHandle>(null)

  useEffect(() => {
    getNotes()
  }, [selectedFolder])

  // useEffect(() => {
  //   editorRef.current?.updateContent(selectedNote.content)
  // }, [selectedNote])

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

  async function handleNoteItemClick(note: Note) {
    dispatch(selectNote(note))
    editorDrawerRef.current?.open()
    editorRef.current?.destroy()
  }
  
  async function handleSaveButtonClick() {
    const content = editorRef.current?.getMarkdown() ?? ''
    const newNote = await saveNote({...selectedNote, content})
    dispatch(selectFolder({...selectedFolder}))
    dispatch(selectNote(newNote))
  }

  async function handleBackButtonClick() {
    dispatch(selectNote(undefined))
    editorDrawerRef.current?.close()
    editorRef.current?.destroy()
  }

  function notesView() {
    if (notes.length == 0) {
      return emptyFolderView()
    }

    return (
      notes && notes.map(note => (
        <Box 
          key={note.id} 
          onClick={() => handleNoteItemClick(note)} 
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
    <>
      {selectedFolder
        ? notesView()
        : emptyView()}

      <DrawerBase ref={editorDrawerRef} anchor="right">
        <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'stretch'}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'50px'} borderBottom={'1px solid #ddd'}>
            <IconButton onClick={handleBackButtonClick}>
              <Icon icon="tabler:chevron-left" width="2rem" height="2rem" />
            </IconButton>
            <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500}>Editor</Typography>
            <IconButton onClick={() => handleSaveButtonClick()} sx={{color: '#256dc9'}}>
              <Icon icon="tabler:check" width="1.75rem" height="1.75rem" />
            </IconButton>
          </Box>
          <Box flexGrow={1} bgcolor={'#fff'} height={'calc(100% - 50px)'} maxHeight={'calc(100% - 50px)'}>
            {selectedNote && editorRef && (             
              <NoteEditor ref={editorRef} note={selectedNote} />
            )}
          </Box>
        </Box>
      </DrawerBase>
    </>
  )
}
