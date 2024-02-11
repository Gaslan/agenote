import { Icon } from "@iconify/react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import DrawerBase, { DrawerBaseHandle } from "../drawer-base";
import { ForwardRefRenderFunction, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Folder } from "./folders";

const folderColors = [
  '#2a9d8f',
  '#e9c46a',
  '#f4a261',
  '#e76f51',
  '#606c38',
  '#dda15e',
  '#bc6c25',
  '#e63946',
  '#1d3557',
  '#ef476f',
  '#9b5de5',
  '#723d46'
]

export interface AddFolderViewHandle {
  open: () => void
  close: () => void
}

interface AddFolderViewProps {
  onFolderAdd: (folder: Folder) => void
}

const AddFolderView: ForwardRefRenderFunction<AddFolderViewHandle, AddFolderViewProps> = function AddFolderView({onFolderAdd}, ref) {

  const [folderName, setFolderName] = useState('')
  const [folderColor, setFolderColor] = useState('')

  const drawerRef = useRef<DrawerBaseHandle>(null)

  useImperativeHandle(ref, () => {
    return {
      open() {
        drawerRef.current?.open()
      },
      close() {
        drawerRef.current?.close()
      },
    };
  })

  function handleAddButtonClick() {
    onFolderAdd({
      id: '',
      name: folderName,
      cover: folderColor
    })
    setFolderName('')
    setFolderColor('')
  }

  return (
    <DrawerBase ref={drawerRef} anchor="right">
      <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'stretch'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'50px'} borderBottom={'1px solid #ddd'}>
          <IconButton onClick={() => drawerRef.current?.close()}>
            <Icon icon="tabler:chevron-left" width="2rem" height="2rem" />
          </IconButton>
          <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500}>New Folder</Typography>
          <IconButton onClick={handleAddButtonClick} disabled={folderName.length == 0 || folderColor.length == 0} sx={{color: '#256dc9'}}>
            <Icon icon="tabler:check" width="1.75rem" height="1.75rem" />
          </IconButton>
        </Box>
        <Box flexGrow={1} bgcolor={'#fff'} height={'calc(100svh - 50px)'} maxHeight={'calc(100svh - 50px)'}>
          <Box height={'100%'} display={'flex'} flexDirection={'column'}>
            <Box p={'1rem'}>
              <TextField onChange={(event) => setFolderName(event.target.value)} id="outlined-basic" placeholder="Folder Name" variant="outlined" size="medium" hiddenLabel fullWidth sx={{bgcolor: '#f0f0f0'}} />
            </Box>
            
            <Box flexGrow={1}>
              <Typography id="" variant="h6" component="h4" sx={{fontSize: '1rem', padding: '0 1rem'}}>
                Cover
              </Typography>
              <Box p={'1rem'} display={'flex'} gap={'1.25rem'} flexWrap={'wrap'} bgcolor={'#f0f2f7'} overflow={'hidden auto'} height={'100%'} maxHeight={'calc(100dvh - 88px - 26px - 50px)'}>
                {folderColors.map(color => (
                  <Box key={color} width={'calc((100% - (1.25rem * (3 - 1))) / 3)'} height={140} borderRadius={'6px'} bgcolor={color} display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{cursor: 'pointer'}} onClick={() => setFolderColor(color)}>
                    {folderColor == color && (
                      <Icon icon={'mdi:check'} fontSize={'1.25rem'} color="#fff" style={{borderRadius: '50%', padding: '2px', backgroundColor: 'rgba(0,0,0,.2)'}} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </Box>
      </Box>
    </DrawerBase>
  )
}

export default forwardRef(AddFolderView)
