'use-client'
import Sidebar from "@/app/(desktop)/sidebar";
import SubSidebar from "@/app/(desktop)/sub-sidebar";
import { addNote } from "@/db/note-service";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectFolder, toggleSidebarCollapse } from "@/redux/features/app/appSlice";
import { Icon } from "@iconify/react";
import { Box, Button, IconButton } from "@mui/material";
import classNames from "classnames";
import { Folder } from "@/db/schema";
import Settings from "./settings/settings";

interface MainAppProps {
  children: React.ReactNode
}

export default function MainApp({children}: MainAppProps) {
  
  const sidebarCollapsed = useAppSelector(state => state.app.sidebarCollapsed)
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)
  
  const dispatch = useAppDispatch()

  function handleToggleButtonClick() {
    dispatch(toggleSidebarCollapse())
  }

  async function handleAddNoteButtonClick() {
    if (!selectedFolder) {
      return
    }
    await addNote({
      id: '',
      title: 'Yeni Note',
      content: '',
      createdAt: new Date().toISOString()
    },
    (selectedFolder as Folder))
    dispatch(selectFolder({...(selectedFolder as Folder)}))
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
          <Button variant="contained" color="primary" disableElevation size="small" onClick={handleAddNoteButtonClick} sx={{textTransform: 'none', fontSize: '12px'}}>New Note</Button>
          <Settings />
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
