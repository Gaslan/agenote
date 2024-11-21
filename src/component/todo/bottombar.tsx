'use client'
import { Box, IconButton } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SidebarMenu from "./sidebar-menu";
import { useRef } from "react";
import { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";
import { usePathname, useRouter } from "next/navigation";

interface BottombarProps {

}

export default function Bottombar({ }: BottombarProps) {

  const router = useRouter()
  const pathname = usePathname()

  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)

  function handleLeftMenuButtonClick() {
    setTimeout(() => {
      drawerLeftMenuRef.current?.open()
    }, 200)
  }

  return (
    <>
      <Box sx={{ boxShadow: '0 -1px 3px rgba(0, 0, 0, .025), 0 -1px 2px rgba(0, 0, 0, .05)', position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,.1)' }}>
        <Box sx={{ width: '100%', height: '100%', display: 'grid', alignItems: 'center', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center' }}>
          <Box>
            <IconButton onClick={handleLeftMenuButtonClick} sx={{ paddingX: '20px', paddingY: '4px', fontSize: '26px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <MenuRoundedIcon fontSize="inherit" />
              <Box sx={{fontSize: '12px'}}>Menu</Box>
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={() => router.push('/todo/today')} sx={{ paddingX: '20px', paddingY: '4px', fontSize: '26px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(pathname == '/todo/today' && {color: '#1976d2'}) }}>
              <TodayRoundedIcon fontSize="inherit" />
              <Box sx={{fontSize: '12px', marginTop: '4px'}}>Today</Box>
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={() => router.push('/todo')} sx={{ paddingX: '20px', paddingY: '4px', fontSize: '26px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(pathname == '/todo' && {color: '#1976d2'}) }}>
              <CalendarMonthRoundedIcon fontSize="inherit" />
              <Box sx={{fontSize: '12px'}}>Upcoming</Box>
            </IconButton>
          </Box>
        </Box>
      </Box>
      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
    </>
  )
}
