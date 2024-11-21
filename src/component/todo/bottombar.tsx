'use client'
import { Box, IconButton } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import SidebarMenu from "./sidebar-menu";
import { useRef } from "react";
import { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";
import { useRouter } from "next/navigation";

interface BottombarProps {

}

export default function Bottombar({ }: BottombarProps) {

  const router = useRouter()

  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)

  function handleLeftMenuButtonClick() {
    setTimeout(() => {
      drawerLeftMenuRef.current?.open()
    }, 200)
  }

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,.1)' }}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', paddingX: '16px' }}>
          <Box>
            <IconButton onClick={handleLeftMenuButtonClick} sx={{ paddingX: '24px', fontSize: '1.5rem', borderRadius: '44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <MenuRoundedIcon fontSize="inherit" />
              <Box sx={{fontSize: '12px'}}>Menu</Box>
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={() => router.push('/todo/today')} sx={{ paddingX: '24px', fontSize: '1.5rem', borderRadius: '44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <TodayRoundedIcon fontSize="inherit" />
              <Box sx={{fontSize: '12px'}}>Today</Box>
            </IconButton>
          </Box>
        </Box>
      </Box>
      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
    </>
  )
}
