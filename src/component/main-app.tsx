'use-client'
import Sidebar from "@/app/sidebar";
import SubSidebar from "@/app/sub-sidebar";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { toggleSidebarCollapse } from "@/redux/features/app/appSlice";
import { Icon } from "@iconify/react";
import { Box, Button, IconButton } from "@mui/material";
import classNames from "classnames";

interface MainAppProps {
  children: React.ReactNode
}

export default function MainApp({children}: MainAppProps) {
  
  const sidebarCollapsed = useAppSelector(state => state.app.sidebarCollapsed)
  
  const dispatch = useAppDispatch()

  function handleToggleButtonClick() {
    dispatch(toggleSidebarCollapse())
  }

  return (
    <div className={classNames('main-app', {'sidebar-collapsed': sidebarCollapsed})}>
      <div className="topbar">
        <Box paddingX={'.75rem'} display={'flex'} alignItems={'center'} height={'100%'}>
          <IconButton onClick={handleToggleButtonClick}>
            <Icon icon="mdi:hamburger-menu" width="1.25rem" height="1.25rem" />
          </IconButton>
        </Box>
        <Box px={'.75rem'}>
          <Button variant="contained" color="primary" disableElevation size="small" onClick={()=>{}}>New Note</Button>
        </Box>
      </div>
      <div className="main-app-body">
        <Sidebar />
        <SubSidebar folder={{id:'2', name:'Kemal', cover:'#2a9d8f'}} />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  )
}
