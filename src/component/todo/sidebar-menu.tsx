'use client'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";
import { RefObject } from "react";
import { useRouter } from "next/navigation";


interface SidebarMenuProps {
  sidebarRef: RefObject<SwipeableDrawerBaseHandle>
}

export default function SidebarMenu({ sidebarRef }: SidebarMenuProps) {

  const router = useRouter()

  const appRouter = (href: string) => () => {
    setTimeout(() => { router.push(href) }, 200) 
  }

  return (
    <>
      <SwipeableDrawerBase ref={sidebarRef} anchor="left" onOpen={() => { }} onClose={() => { }} PaperProps={{ sx: { minWidth: '60%', maxWidth: '300px' } }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ width: '100%', height: '100px' }}></Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={appRouter('/todo')}>
                <ListItemIcon sx={{minWidth: 'auto', color: 'inherit'}}>
                  <ChecklistRoundedIcon />
                </ListItemIcon>
                <ListItemText sx={{marginLeft: '16px'}}>Todos</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={appRouter('/todo/lists')}>
                <ListItemIcon sx={{minWidth: 'auto', color: 'inherit'}}>
                  <FormatListBulletedRoundedIcon />
                </ListItemIcon>
                <ListItemText sx={{marginLeft: '16px'}}>Lists</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawerBase>
    </>
  )
}
