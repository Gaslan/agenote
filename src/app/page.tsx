'use client'
import NoteEditor, { NoteEditorHandle } from "@/component/editor/NoteEditor";
import { saveNote } from "@/db/note-service";
import { Note } from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectNote } from "@/redux/features/app/appSlice";
import { useEffect, useRef } from "react";

export default function Home() {

  const editorRef = useRef<NoteEditorHandle>(null)
  const selectedNote = useAppSelector(state => state.app.selectedNote) as unknown as Note
  const dispatch = useAppDispatch()

  useEffect(() => {
    editorRef.current?.updateContent(selectedNote.content)
  }, [selectedNote])

  async function handleClick() {
    console.log('EDİTOE REF VALUE: ', editorRef.current?.getMarkdown())
    const content = editorRef.current?.getMarkdown() ?? ''
    const newNote = await saveNote({...selectedNote, content})
    dispatch(selectNote(newNote))
  }

  return (
   <div style={{padding: '1rem'}}>
    <button onClick={handleClick}>BAS</button>
      {selectedNote && (
        <NoteEditor ref={editorRef} note={selectedNote} />
      )}
   </div>
  )
}
