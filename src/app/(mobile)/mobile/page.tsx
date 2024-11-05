'use client'
import { Folder } from "@/db/schema";
import DrawerBase, { DrawerBaseHandle } from "@/component/mobile/drawer-base";
import { deleteNote, getNotesByFolder, pin, quickAccess, saveNote } from "@/db/note-service";
import { Note } from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectFolder, selectNote } from "@/redux/features/app/appSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Divider, IconButton, MenuItem, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PopupMenuBase from "@/component/mobile/popup-menu-base";
import { PopupMenuViewHandle } from "@/component/mobile/popup-menu/popup-menu-view";
import toast from "react-hot-toast";
import { useLongPress } from 'use-long-press';
import ModalBase, { ModalBaseHandle } from "@/component/ModalBase";
import dynamic from "next/dynamic";
import { NewEditorHandle } from "@/component/editor/new-editor";

const NewEditorWrapper = dynamic(() => import("../../../component/editor/new-editor-wrapper"), { ssr: false, loading: () => (<>Loading ...</>) })


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
  const editorRef = useRef<NewEditorHandle>(null)
  const popupMenuViewRef = useRef<PopupMenuViewHandle>(null)
  const noteOptionsRef = useRef<ModalBaseHandle>(null)
  const [selectedOptionNote, setSelectedOptionNote] = useState<Note>()
  // const selectedOptionNoteRef = useRef<Note>()
  const bindNoteFn = useLongPress((event, meta) => {
    navigator.vibrate(60)
    noteOptionsRef.current?.open()
  }, {
    threshold: 400,
    onStart: (event, meta) => {
      setSelectedOptionNote(meta.context as Note)
    }
  })

  useEffect(() => {
    getNotes()
  }, [selectedFolder])

  async function getNotes() {
    if (!selectedFolder) {
      return []
    }

    const foldersNotes = await getNotesByFolder((selectedFolder as Folder).id)
    foldersNotes.sort((a, b) => {
      if (a.pinned && b.pinned) {
        return 0
      } else if (a.pinned) {
        return -1
      } else if (b.pinned) {
        return 1
      } else {
        return 0
      }
    })

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
  }
  
  async function handleSaveButtonClick() {
    console.log('SAVE BUTTON CLICK',editorRef.current )
    const output = await editorRef.current?.saveNote()
    const newNote = await saveNote({...selectedNote, content: output})
    dispatch(selectFolder({...selectedFolder}))
    dispatch(selectNote(newNote))
  }

  async function handleBackButtonClick() {
    dispatch(selectNote(undefined))
    editorDrawerRef.current?.close()
  }

  async function pinNote(note: Note) {
    const updatedNote = await pin(note)
    dispatch(selectNote({...updatedNote}))
    getNotes()
    const message = updatedNote.pinned ? 'Pinned to top.' : 'Unpinned from top.'
    toast.success(message)
  }

  async function addNoteToQuickAccess(note: Note) {
    const updatedNote = await quickAccess(note)
    dispatch(selectNote({...updatedNote}))
    getNotes()
    const message = updatedNote.quickAccess ? 'Added to Quick Access.' : 'Remover from Quick Access.'
    toast.success(message)
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
          {...bindNoteFn(note)}
          sx={{padding: '1rem', bgcolor: '#fff', borderBottom: '1px solid rgba(0,0,0,.1)', cursor: 'pointer', ":hover": {bgcolor: 'rgba(0,0,0,.03)'}, '&.active': {backgroundColor: 'rgba(128,192,255,.1)'}}}>
          <Typography variant="h4" display={'flex'} alignItems={'center'} pb={'.75rem'} fontSize={'16px'} fontWeight={'500'}>
            {note.pinned && (
              <Icon icon="fluent:pin-20-regular" fontSize="20px" color="#256dc9" style={{marginRight: '12px'}} />
            )}
            {note.title}
          </Typography>
          <Typography variant="body1" pb={'.75rem'} fontSize={'16px'} fontWeight={'400'} width={'100%'} overflow={'hidden'} textOverflow={'ellipsis'} whiteSpace={'nowrap'}>
            {note.content?.blocks ? note.content.blocks[0]?.data?.text : ''}
          </Typography>
          <Typography variant="body2" fontSize={'12px'} fontWeight={'300'} color={'#939599'}>
            {new Date(note.createdAt).toLocaleString(undefined, DATE_FORMAT_OPTIONS)}
          </Typography>
        </Box>
      ))
    )
  }

  function handleDeleteNote(id: string) {
    deleteNote(id)
    noteOptionsRef.current?.close()
    getNotes()
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
            <IconButton onClick={(e) => popupMenuViewRef.current?.open(e)}>
              <Icon icon="mdi:dots-horizontal" width="1.625rem" height="1.625rem" />
            </IconButton>
          </Box>
          <Box flexGrow={1} bgcolor={'#fff'} maxHeight={'calc(100svh - 50px)'} sx={{overflowY: 'auto', padding: '1rem'}}>


            {selectedNote && (             
              <NewEditorWrapper editorRef={editorRef} data={selectedNote.content} />
              // <NewEditor />
            )}
          </Box>
        </Box>
      </DrawerBase>
      <PopupMenuBase
        ref={popupMenuViewRef}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
          {selectedNote?.pinned
            ? (
              <MenuItem onClick={() => pinNote(selectedNote)}>
                <Icon icon="fluent:pin-off-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                Unpin from top
              </MenuItem>
              )
            : (
              <MenuItem onClick={() => pinNote(selectedNote)}>
                <Icon icon="fluent:pin-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                Pin to top
              </MenuItem>
              )
          }
          {selectedNote?.quickAccess
            ? (
              <MenuItem onClick={() => addNoteToQuickAccess(selectedNote)}>
                <Icon icon="fluent:star-off-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                Quick Access
              </MenuItem>
              )
            : (
              <MenuItem onClick={() => addNoteToQuickAccess(selectedNote)}>
                <Icon icon="fluent:star-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                Quick Access
              </MenuItem>
              )
          }

      </PopupMenuBase>
      {selectedOptionNote &&
        <ModalBase ref={noteOptionsRef} onClose={() => setSelectedOptionNote(undefined)} sx={{padding: '8px 0'}}>
          <>
            {selectedOptionNote.pinned
              ? (
                <MenuItem onClick={() => {pinNote(selectedOptionNote);noteOptionsRef.current?.close()}}>
                  <Icon icon="fluent:pin-off-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                  Unpin from top
                </MenuItem>
                )
              : (
                <MenuItem onClick={() => {pinNote(selectedOptionNote);noteOptionsRef.current?.close()}}>
                  <Icon icon="fluent:pin-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                  Pin to top
                </MenuItem>
                )
            }
            {selectedOptionNote?.quickAccess
              ? (
                <MenuItem onClick={() => {addNoteToQuickAccess(selectedOptionNote);noteOptionsRef.current?.close()}}>
                  <Icon icon="fluent:star-off-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                  Quick Access
                </MenuItem>
                )
              : (
                <MenuItem onClick={() => {addNoteToQuickAccess(selectedOptionNote);noteOptionsRef.current?.close()}}>
                  <Icon icon="fluent:star-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
                  Quick Access
                </MenuItem>
                )
            }
            <Divider />
            <MenuItem onClick={() => {handleDeleteNote(selectedOptionNote.id)}} sx={{color: '#f10000'}}>
              <Icon icon="fluent:delete-20-regular" fontSize="20px" style={{marginRight: '12px'}} />
              Delete Note
            </MenuItem>
          </>
        </ModalBase>
      }
    </>
  )
}
