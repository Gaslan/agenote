import { Box, IconButton } from "@mui/material";
import styles from "./topbar.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";
import AddTodo, { AddTodoHandle } from "./add-todo";

interface TopbarProps {
  
}

export default function Topbar({}: TopbarProps) {

  const addButtonRef = useRef<AddTodoHandle>(null)

  function handleAddButtonClick(): void {
    addButtonRef.current?.open()
  }

  return (
    <>
    <Box className={styles.topbar}>
      <Box className={styles.topbar_inner}>
        <Box sx={{height: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', paddingX: '16px'}}>Today</Box>
        <Box className={styles.add_button_wrapper}>
          <IconButton onClick={handleAddButtonClick} disableRipple disableFocusRipple sx={{backgroundColor: (theme) => theme.palette.primary.main, color: '#fff'}}>
            <Icon icon="mdi:plus" width="1.125rem" height="1.125rem" />
          </IconButton>
          <IconButton onClick={handleAddButtonClick} disableRipple disableFocusRipple sx={{backgroundColor: 'rgba(0,0,0,.1)', color: '#111', marginLeft: '8px'}}>
            <Icon icon="mdi:dots-vertical" width="1.125rem" height="1.125rem" />
          </IconButton>
        </Box>
      </Box>
    </Box>
    <AddTodo ref={addButtonRef} />
    </>
  )
}
