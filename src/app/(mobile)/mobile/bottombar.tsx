import { Icon } from "@iconify/react";
import { Box, IconButton, Typography } from "@mui/material";
import { useRef } from "react";
import FoldersView, { FoldersViewHandle } from "@/component/mobile/folders/folders-view";
import { PopupMenuBaseHandle } from "@/component/mobile/popup-menu-base";
import PopupMenuView from "@/component/mobile/popup-menu/popup-menu-view";
import DrawerBase, { DrawerBaseHandle } from "@/component/mobile/drawer-base";
import NoteEditor, { NoteEditorHandle } from "@/component/mobile/editor/NoteEditor";
import { addNote, saveNote } from "@/db/note-service";
import { selectFolder, selectNote } from "@/redux/features/app/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { Folder, Note } from "@/db/schema";

interface BottombarProps {
  
}

export default function Bottombar({}: BottombarProps) {

  const foldersViewRef = useRef<FoldersViewHandle>(null)
  const popupMenuViewRef = useRef<PopupMenuBaseHandle>(null)
  
  const editorDrawerRef = useRef<DrawerBaseHandle>(null)
  const editorRef = useRef<NoteEditorHandle>(null)
  const dispatch = useAppDispatch()

  const selectedFolder = useAppSelector(state => state.app.selectedFolder) as unknown as Folder
  const selectedNote = useAppSelector(state => state.app.selectedNote) as unknown as Note

  async function handleAddNoteButtonClick() {
    if (!selectedFolder) {
      return
    }
    const newNote = await addNote({
      id: '',
      title: 'New Note',
      content: ' ',
      pinned: false,
      quickAccess: false,
      createdAt: new Date().toISOString()
    } as Note, selectedFolder)
    dispatch(selectFolder({...selectedFolder}))
    dispatch(selectNote(newNote))
    editorDrawerRef.current?.open()
    editorRef.current?.focus()
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
  }

  return (
    <>
    <div className="bottombar">
      <div style={{width: '100%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <IconButton onClick={() => foldersViewRef.current?.open()}>
          <Icon icon="tabler:folders" width="1.625rem" height="1.625rem" />
        </IconButton>
        <IconButton onClick={handleAddNoteButtonClick} sx={{bgcolor: '#256dc9', padding: '12px', transform: 'translateY(-35%)', color: '#fff', boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(164, 164, 164, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'}}>
          <Icon icon="tabler:edit" width="1.75rem" height="1.75rem" />
        </IconButton>
        <IconButton onClick={(e) => popupMenuViewRef.current?.open(e)}>
          <Icon icon="mdi:dots-horizontal" width="1.625rem" height="1.625rem" />
        </IconButton>
      </div>
    </div>
    <FoldersView ref={foldersViewRef} />
    <PopupMenuView ref={popupMenuViewRef} />
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
            <IconButton onClick={(e) => popupMenuViewRef.current?.open(e)}>
              <Icon icon="mdi:dots-horizontal" width="1.625rem" height="1.625rem" />
            </IconButton>
          </Box>
          <Box flexGrow={1} bgcolor={'#fff'} maxHeight={'calc(100svh - 50px)'} sx={{overflowY: 'auto'}}>
            {selectedNote && editorRef && (             
              <NoteEditor ref={editorRef} note={selectedNote} />
            )}
          </Box>
        </Box>
      </DrawerBase>
    </>
  )
}
