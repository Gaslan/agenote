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
      <SwipeableDrawerBase ref={sidebarRef} anchor="left" onOpen={() => { }} onClose={() => { }} PaperProps={{ sx: { minWidth: '70%', maxWidth: '300px' } }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ width: '100%', height: '20px' }}></Box>
          <List>
            <ListItem disablePadding sx={{ paddingX: '4px' }}>
              <ListItemButton onClick={appRouter('/todo')} sx={{ borderRadius: '6px' }}>
                <ListItemIcon sx={{ minWidth: 'auto', color: '#2880dd' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                    <path fill="currentColor" fillRule="evenodd" d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v1.087c-.004 1.852-.027 3.35-.19 4.556c-.194 1.445-.6 2.585-1.494 3.48c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.163-1.207-.186-2.704-.19-4.556v-1.087c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m-9.19 12.5c.01 1.503.045 2.68.173 3.636c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.128-.956.163-2.133.172-3.636H18.84c-.974 0-1.229.016-1.442.114c-.214.099-.392.282-1.026 1.02l-.605.707l-.088.102c-.502.587-.9 1.052-1.45 1.305s-1.162.253-1.934.252h-.589c-.773 0-1.385.002-1.935-.252c-.55-.253-.948-.718-1.45-1.305l-.088-.102l-.605-.706c-.634-.74-.812-.922-1.026-1.02c-.213-.099-.468-.115-1.442-.115zm18.497-1.5h-2.544c-.773 0-1.385-.002-1.935.252c-.55.253-.948.718-1.45 1.305l-.088.102l-.605.706c-.634.74-.812.922-1.026 1.02c-.213.099-.468.115-1.442.115h-.32c-.974 0-1.229-.016-1.442-.114c-.214-.099-.392-.282-1.026-1.02l-.605-.707l-.088-.102c-.502-.587-.9-1.052-1.45-1.305c-.55-.254-1.162-.253-1.934-.252H2.75V12c0-2.378.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62c.57-.569 1.34-.896 2.619-1.068c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386zM7.25 7A.75.75 0 0 1 8 6.25h8a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 7.25 7m2 3.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path>
                  </svg>
                </ListItemIcon>
                <ListItemText sx={{ marginLeft: '16px' }}>Inbox</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ paddingX: '4px' }}>
              <ListItemButton onClick={appRouter('/todo')} sx={{ borderRadius: '6px' }}>
                <ListItemIcon sx={{ minWidth: 'auto', color: '#dd8528' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                    <path fill="currentColor" fillRule="evenodd" d="M12 1.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M3.669 3.716a.75.75 0 0 1 1.06-.047L6.95 5.7a.75.75 0 1 1-1.012 1.107L3.716 4.776a.75.75 0 0 1-.047-1.06m16.662 0a.75.75 0 0 1-.047 1.06l-2.222 2.031A.75.75 0 0 1 17.05 5.7l2.222-2.031a.75.75 0 0 1 1.06.047M12 7.75a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5M6.25 12a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0m-5 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m18 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75m-2.224 5.025a.75.75 0 0 1 1.06 0l2.222 2.223a.75.75 0 0 1-1.06 1.06l-2.222-2.222a.75.75 0 0 1 0-1.06m-10.051 0a.75.75 0 0 1 0 1.061l-2.223 2.222a.75.75 0 0 1-1.06-1.06l2.222-2.223a.75.75 0 0 1 1.06 0M12 19.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75" clipRule="evenodd"></path>
                  </svg>
                </ListItemIcon>
                <ListItemText sx={{ marginLeft: '16px' }}>Today</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ paddingX: '4px' }}>
              <ListItemButton onClick={appRouter('/todo/lists')} sx={{ borderRadius: '6px' }}>
                <ListItemIcon sx={{ minWidth: 'auto', color: '#038940' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '22px', height: '22px' }}>
                    <path fill="currentColor" fillRule="evenodd" d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529v.114c0 2.309 0 4.118-.19 5.53c-.194 1.444-.6 2.584-1.494 3.479c-.895.895-2.035 1.3-3.48 1.494c-1.411.19-3.22.19-5.529.19h-.114c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19m-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176s4.086-.002 5.386-.176c1.279-.172 2.05-.5 2.62-1.069c.569-.57.896-1.34 1.068-2.619c.174-1.3.176-3.008.176-5.386s-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176m3.904 3.53a.75.75 0 0 1 .026 1.061l-2.857 3a.75.75 0 0 1-1.086 0l-1.143-1.2a.75.75 0 1 1 1.086-1.034l.6.63l2.314-2.43a.75.75 0 0 1 1.06-.026M12.25 9a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75m-1.733 4.457c.3.286.312.76.026 1.06l-2.857 3a.75.75 0 0 1-1.086 0l-1.143-1.2a.75.75 0 1 1 1.086-1.034l.6.63l2.314-2.43a.75.75 0 0 1 1.06-.026M12.25 16a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path>
                  </svg>
                </ListItemIcon>
                <ListItemText sx={{ marginLeft: '16px', flexGrow: 1 }}>Lists</ListItemText>
                <ListItemText sx={{flexGrow: 0, fontSize: '12px'}} primaryTypographyProps={{fontSize: '14px', color: theme => theme.palette.text.secondary}}>2</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawerBase>
    </>
  )
}
