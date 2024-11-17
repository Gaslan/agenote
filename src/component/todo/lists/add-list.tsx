import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import { Box, Button, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, TextField, Typography } from "@mui/material";
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import { ChangeEvent, RefCallback, RefObject, useEffect, useRef, useState } from "react";
import { TodoList } from "@/db/db";
import DrawerBase from "@/component/mobile/drawer-base";
import { addTodoList, getTodoLists } from "@/db/todo-list-service";
import { grey } from "@mui/material/colors";
import ListsTreeView from "./lists-tree-view";

interface AddListProps {
  addListRef: RefObject<SwipeableDrawerBaseHandle>
  onListAdd: () => void
}

const initialList = {
  name: '',
  icon: '',
  parentId: null
} as TodoList

export default function AddList({ addListRef, onListAdd }: AddListProps) {

  const [list, setList] = useState<TodoList>(initialList)
  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const taskInputRef = useRef<HTMLInputElement>(null)
  const todoListSelectorRef = useRef<SwipeableDrawerBaseHandle>(null)

  useEffect(() => {
    taskInputRef.current?.focus()
    setList(initialList)
    fetchLists()
  }, [])

  async function fetchLists() {
    const lists = await getTodoLists()
    setTodoLists(lists)
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setList(old => ({ ...old, name: event.target.value }))
  }

  async function handleSaveButtonClick() {
    await addTodoList(list)
    onListAdd()
    addListRef.current?.close()
  }

  async function handleListValueChange(value: number) {
    setList(old => ({ ...old, parentId: value }))
    todoListSelectorRef.current?.close()
  }

  function handleParentListClick() {
    console.log('TIKLANDI')
    todoListSelectorRef.current?.open()
  }

  return (
    <>
      <DrawerBase ref={addListRef} disableRestoreFocus anchor="bottom" sx={{ zIndex: 1011 }}>
        <Box sx={{ width: '100%', height: '100dvh' }}>
          <Box>
            <Box width={'100%'} height={'50px'} px={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'1px solid #ddd'}>
              <IconButton onClick={() => addListRef.current?.close()}>
                <WestRoundedIcon />
              </IconButton>
              <Typography variant="body1" flexGrow={1} fontSize={'1.125rem'} fontWeight={500} color={'inherit'} sx={{ marginLeft: '16px' }}>Add List</Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 'calc(100dvh - 50px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ paddingX: '16px', paddingTop: '24px', paddingBottom: '24px' }}>
              <TextField
                variant="outlined"
                label="List name"
                inputRef={taskInputRef}
                fullWidth
                autoComplete="false"
                value={list?.name}
                onChange={handleNameChange}
                sx={{ '&>.MuiInputBase-input': { fontSize: '20px' } }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <List disablePadding sx={{ borderTop: '1px solid #e3e5e9' }}>
                <ListItem disablePadding sx={{ borderBottom: '1px solid #e3e5e9' }}>
                  <ListItemButton sx={{ paddingY: '16px' }}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <PaletteRoundedIcon />
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: '16px' }}>Color</ListItemText>
                    </Box>
                    <Box></Box>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ borderBottom: '1px solid #e3e5e9' }}>
                  <ListItemButton onClick={handleParentListClick} sx={{ paddingY: '16px' }}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <SegmentRoundedIcon />
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: '16px' }}>Parent List</ListItemText>
                    </Box>
                    <Box sx={{marginLeft: 'auto', fontSize: '14px'}}>{todoLists.find(x => x.id == list.parentId)?.name}</Box>
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
            <Box sx={{ padding: '16px' }}>
              <Button
                variant="contained"
                fullWidth
                disableElevation
                onClick={handleSaveButtonClick}
                sx={{ height: '40px', borderRadius: '40px' }}>Save</Button>
            </Box>
          </Box>
        </Box>
      </DrawerBase>
      <SwipeableDrawerBase ref={todoListSelectorRef} onClose={() => { }} onOpen={() => { }} PaperProps={{ sx: { backgroundColor: 'transparent', borderTopLeftRadius: '8px', zIndex: 1012 } }}>
        <Box sx={{ display: 'flex', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', bgcolor: '#fff' }}>
          <Puller />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', bgcolor: '#fff' }}>
          <Button variant="text" color="primary" onClick={() => handleListValueChange(0)}>Clear List</Button>
        </Box>
        <ListsTreeView todoLists={todoLists} onItemClick={(value) => handleListValueChange(value.id)} />
      </SwipeableDrawerBase>
    </>
  )
}

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  margin: '8px auto',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}))
