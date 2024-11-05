import { Icon } from "@iconify/react";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import Sidebar from "./sidebar";
import { useState } from "react";
import { Folder } from "@/db/schema";
import { useAppSelector } from "@/redux/app/hooks";

interface TopbarProps {
  
}

export default function Topbar({}: TopbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const selectedFolder = useAppSelector(state => state.app.selectedFolder)

  function handleToggleButtonClick(): void {
    setDrawerOpen(true)
  }

  function handleFolderSelect(): void {
    setDrawerOpen(false)
  }

  return (
    <>
      <Box className="topbar">
        <Box width={'100%'} height={'50px'} px={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'1px solid #ddd'}>
          <IconButton onClick={handleToggleButtonClick}>
            <Icon icon="mdi:hamburger-menu" width="1.625rem" height="1.625rem" />
          </IconButton>
          <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500} color={'#256dc9'}>{selectedFolder ? (selectedFolder as unknown as Folder).name : 'Folder'}</Typography>
          <IconButton onClick={() => {}}>
            <Icon icon="tabler:search" width="1.75rem" height="1.75rem" />
          </IconButton>
        </Box>
      </Box>
      <Drawer
        anchor={"left"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div style={{width: '70svw'}}>
          <Sidebar onFolderSelect={handleFolderSelect} />
        </div>
      </Drawer>
    </>
  )
}
