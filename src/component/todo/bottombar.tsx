'use client'
import { Box, IconButton } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SidebarMenu from "./sidebar-menu";
import { useRef } from "react";
import { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";

interface BottombarProps {

}

export default function Bottombar({ }: BottombarProps) {

  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)

  function handleLeftMenuButtonClick() {
    setTimeout(() => {
      drawerLeftMenuRef.current?.open()
    }, 200)
  }

  return (
    <>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,.1)' }}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', paddingX: '16px' }}>
          <IconButton onClick={handleLeftMenuButtonClick} sx={{ fontSize: '1.5rem' }}>
            <MenuRoundedIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
    </>
  )
}
