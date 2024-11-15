'use client'
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import styles from "@/component/todo/topbar.module.css";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect, useRef, useState } from "react";
import { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import SidebarMenu from "../sidebar-menu";
import AddList from "./add-list";
import { getTodoLists } from "@/db/todo-list-service";
import { TodoList } from "@/db/db";

interface ListsProps {

}

export default function Lists({ }: ListsProps) {

  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)
  const addListRef = useRef<SwipeableDrawerBaseHandle>(null)

  useEffect(() => {
    fetchLists()
  }, [])

  async function fetchLists() {
    const lists = await getTodoLists()
    setTodoLists(lists)
  }

  function handleLeftMenuButtonClick(): void {
    setTimeout(() => {
      drawerLeftMenuRef.current?.open()
    }, 200)
  }

  function handleListAdd(): void {
    fetchLists()
  }

  return (
    <>
      <Box className={styles.topbar}>
        <Box className={styles.topbar_inner}>
          <Box sx={{ height: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', paddingX: '16px', fontSize: '20px' }}>
            <IconButton onClick={handleLeftMenuButtonClick} sx={{ fontSize: '1.5rem' }}>
              <MenuRoundedIcon fontSize="inherit" />
            </IconButton>
            <Box sx={{ marginLeft: '16px', fontWeight: 500 }}>Listeler</Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ paddingTop: '50px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: '16px' }}>
          <Typography>Lists</Typography>
          <IconButton onClick={() => addListRef.current?.open()}>
            <AddRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <List>
          {todoLists.map(todoList => (
            <ListItem key={todoList.id} disablePadding>
              <ListItemButton>
                <ListItemText>{todoList.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
      <AddList addListRef={addListRef} onListAdd={handleListAdd} />
    </>
  )
}
