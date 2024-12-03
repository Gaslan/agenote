'use client'
import { Box, IconButton, Typography } from "@mui/material"
import styles from "@/component/todo/topbar.module.css";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useEffect, useRef, useState } from "react";
import { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import SidebarMenu from "../sidebar-menu";
import AddList from "./add-list";
import { getTodoLists } from "@/db/todo-list-service";
import { TodoList } from "@/db/db";
import ListsTreeView from "./lists-tree-view";
import { useRouter } from "next/navigation";
import Bottombar from "../bottombar";

interface ListsProps {

}

export default function Lists({ }: ListsProps) {

  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)
  const addListRef = useRef<SwipeableDrawerBaseHandle>(null)
  const router = useRouter()

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
          <Box sx={{ bgcolor: '#fff', zIndex: 999, userSelect: 'none', borderRadius: '0px', borderBottom: '1px solid #d3d5d9', height: '60px', position: 'fixed', top: 0, left: 0, right: 0 }}>
            <Box sx={{ height: '100%', paddingX: '16px', color: 'rgba(19,21,25,.75)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleLeftMenuButtonClick} sx={{ fontSize: '1.5rem', marginLeft: '-8px', marginRight: '8px' }}>
                  <MenuRoundedIcon fontSize="inherit" />
                </IconButton>
                Listeler
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ paddingTop: '60px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: '16px' }}>
          <Typography>Lists</Typography>
          <IconButton onClick={() => addListRef.current?.open()}>
            <AddRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <ListsTreeView todoLists={todoLists} onItemClick={(item: TodoList) => { router.push('/todo/list/' + item.id) }} />
      </Box>


      <Bottombar />
      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
      <AddList addListRef={addListRef} onListAdd={handleListAdd} />
    </>
  )
}
