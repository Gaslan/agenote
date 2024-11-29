'use client'
import { alpha, Box, IconButton } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SidebarMenu from "./sidebar-menu";
import { useRef } from "react";
import { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";
import { usePathname, useRouter } from "next/navigation";
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";

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
      <Box sx={{ boxShadow: '0 -1px 3px rgba(0, 0, 0, .025), 0 -1px 2px rgba(0, 0, 0, .05)', position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', bgcolor: '#fff', borderTop: '1px solid rgba(0,0,0,.1)', zIndex: 99 }}>
        <Box sx={{ width: '100%', height: '100%', display: 'grid', alignItems: 'center', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center' }}>
          <Box>
            <IconButton onClick={handleLeftMenuButtonClick} sx={{ paddingX: '20px', paddingY: '4px', fontSize: '24px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <MenuRoundedIcon fontSize="inherit" />
              <Box sx={{ fontSize: '12px', marginTop: '3px' }}>Menu</Box>
            </IconButton>
          </Box>
          <Box>
            <IconButton disableFocusRipple disableRipple disableTouchRipple onClick={() => router.push('/todo/today')} sx={{ paddingX: '8px', paddingY: '4px', fontSize: '24px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(pathname == '/todo/today' && { color: '#1976d2' }) }}>
              <Box sx={{display: 'flex', padding: '2px 16px', borderRadius: '20px', ...(pathname == '/todo/today' && { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) })}}>
                <TodayRoundedIcon fontSize="inherit" />
              </Box>
              <Box sx={{ fontSize: '12px', marginTop: '3px' }}>Today</Box>
            </IconButton>
          </Box>
          <Box>
            <IconButton disableFocusRipple disableRipple disableTouchRipple onClick={() => router.push('/todo')} sx={{ paddingX: '8px', paddingY: '4px', fontSize: '24px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(pathname == '/todo' && { color: '#1976d2' }) }}>
              <Box sx={{display: 'flex', padding: '2px 16px', borderRadius: '20px', ...(pathname == '/todo' && { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) })}}>
                <CalendarMonthRoundedIcon fontSize="inherit" />
                <TouchRipple />
              </Box>
              <Box sx={{ fontSize: '12px', marginTop: '3px' }}>Upcoming</Box>
            </IconButton>
          </Box>
          <Box>
            <IconButton disableFocusRipple disableRipple disableTouchRipple onClick={() => router.push('/todo/lists')} sx={{ paddingX: '8px', paddingY: '4px', fontSize: '24px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(pathname == '/todo/lists' && { color: '#1976d2' }) }}>
              <Box sx={{display: 'flex', padding: '2px 16px', borderRadius: '20px', ...(pathname == '/todo/lists' && { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) })}}>
                <FormatListBulletedRoundedIcon fontSize="inherit" />
                <TouchRipple />
              </Box>
              <Box sx={{ fontSize: '12px', marginTop: '3px' }}>Lists</Box>
            </IconButton>
          </Box>
          {/* <Box>
            <IconButton onClick={() => { }} sx={{ paddingX: '8px', paddingY: '4px', fontSize: '24px', borderRadius: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...(pathname == '/todo/settings' && { color: '#1976d2' }) }}>
              <SettingsOutlinedIcon fontSize="inherit" />
              <Box sx={{ fontSize: '12px', marginTop: '3px' }}>Settings</Box>
            </IconButton>
          </Box> */}
        </Box>
      </Box>
      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
    </>
  )
}
