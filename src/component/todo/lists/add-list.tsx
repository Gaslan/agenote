import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import { Box, Button, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import { ChangeEvent, RefCallback, RefObject, useEffect, useRef, useState } from "react";
import { TodoList } from "@/db/db";
import DrawerBase from "@/component/mobile/drawer-base";
import { addTodoList } from "@/db/todo-list-service";

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
  const taskInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    taskInputRef.current?.focus()
    setList(initialList)
  }, [])

  const noop = () => { }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setList(old => ({ ...old, name: event.target.value }))
  }

  async function handleSaveButtonClick() {
    await addTodoList(list)
    onListAdd()
    addListRef.current?.close()
  }

  return (
    <>
      <DrawerBase ref={addListRef} disableRestoreFocus anchor="bottom">
        <Box sx={{ width: '100%', height: '100vh' }}>
          <Box>
            <Box width={'100%'} height={'50px'} px={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'1px solid #ddd'}>
              <IconButton onClick={() => addListRef.current?.close()}>
                <WestRoundedIcon />
              </IconButton>
              <Typography variant="body1" flexGrow={1} fontSize={'1.125rem'} fontWeight={500} color={'inherit'} sx={{ marginLeft: '16px' }}>Add List</Typography>
            </Box>
          </Box>
          <Box sx={{width: '100%', height: 'calc(100vh - 50px)', display: 'flex', flexDirection: 'column'}}>
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
            <Box sx={{flexGrow: 1}}>
              <List disablePadding sx={{ borderTop: '1px solid #e3e5e9' }}>
                <ListItem disablePadding sx={{ borderBottom: '1px solid #e3e5e9' }}>
                  <ListItemButton sx={{ paddingY: '16px' }}>
                    <ListItemIcon>
                      <PaletteRoundedIcon />
                    </ListItemIcon>
                    <ListItemText>Color</ListItemText>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ borderBottom: '1px solid #e3e5e9' }}>
                  <ListItemButton sx={{ paddingY: '16px' }}>
                    <ListItemIcon>
                      <SegmentRoundedIcon />
                    </ListItemIcon>
                    <ListItemText>Parent List</ListItemText>
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
            <Box sx={{padding: '16px'}}>
              <Button 
                variant="contained" 
                fullWidth 
                disableElevation 
                onClick={handleSaveButtonClick}
                sx={{height: '40px', borderRadius: '40px'}}>Save</Button>
            </Box>
          </Box>
        </Box>
      </DrawerBase>
    </>
  )
}
