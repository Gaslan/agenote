'use client'
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import styles from "./topbar.module.css";
import { useRef } from "react";
import AddTodo, { AddTodoHandle } from "./add-todo";
import AddIcon from '@mui/icons-material/Add';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarMenu from "./sidebar-menu";

interface TopbarProps {

}

export default function Topbar({ }: TopbarProps) {

  const addButtonRef = useRef<AddTodoHandle>(null)
  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)

  const router = useRouter()

  function handleAddButtonClick(): void {
    setTimeout(() => {
      addButtonRef.current?.open()
    }, 200)
  }

  function handleLeftMenuButtonClick(): void {
    setTimeout(() => {
      drawerLeftMenuRef.current?.open()
    }, 200)
  }

  return (
    <>
      <Box className={styles.topbar}>
        <Box className={styles.topbar_inner}>
          <Box sx={{ height: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', paddingX: '16px', fontSize: '20px' }}>
            <IconButton onClick={handleLeftMenuButtonClick} sx={{ fontSize: '1.5rem' }}>
              <MenuRoundedIcon fontSize="inherit" />
            </IconButton>
            <Box sx={{ marginLeft: '16px', fontWeight: 500 }}>Görevler</Box>
          </Box>
          <Box className={styles.add_button_wrapper}>
            <IconButton onClick={handleAddButtonClick} sx={{ fontSize: '1.125rem', backgroundColor: (theme) => theme.palette.primary.main, color: '#fff' }}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <AddTodo ref={addButtonRef} />


      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
    </>
  )
}
