'use client'
import { Folder } from "@/db/schema";
import NoteEditor, { NoteEditorHandle } from "@/component/editor/NoteEditor";
import { saveNote } from "@/db/note-service";
import { Note } from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectNote, selectFolder } from "@/redux/features/app/appSlice";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

export default function Home() {

  const editorRef = useRef<NoteEditorHandle>(null)
  const selectedNote = useAppSelector(state => state.app.selectedNote) as unknown as Note
  const selectedFolder = useAppSelector(state => state.app.selectedFolder) as unknown as Folder
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log('editorRef.current', editorRef.current)
    editorRef.current?.updateContent(selectedNote.content)
  }, [selectedNote])

  async function handleClick() {
    const content = editorRef.current?.getMarkdown() ?? ''
    const newNote = await saveNote({...selectedNote, content})
    dispatch(selectFolder({...selectedFolder}))
    dispatch(selectNote(newNote))
  }

  return (
   <div style={{padding: '1rem', height: '100%'}}>
    {selectedNote && editorRef && (
      <div style={{display: `${selectedNote ? 'block' : ''}`}}>
        <button onClick={handleClick}>Kaydet</button>
        <NoteEditor ref={editorRef} note={selectedNote} />
      </div>
    )}
    {selectedFolder && !selectedNote && (
      <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Box width={80} height={100} borderRadius={'8px'} bgcolor={selectedFolder.cover} mb={2}></Box>
        <Typography variant="body2" mb={1}>Want to add new note? Tap on the button below!</Typography>
        <Button variant="text">New Note</Button>
      </div>
    )}
   </div>
  )
}
