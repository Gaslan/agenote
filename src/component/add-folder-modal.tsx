import { Icon } from "@iconify/react";
import { Typography, Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { Folder } from "@/db/schema";

interface AddFolderModalProps {
  onFolderAdd: (folder: Folder) => void
}

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

export default function AddFolderModal({onFolderAdd}: AddFolderModalProps) {

  const [folderName, setFolderName] = useState('')
  const [folderColor, setFolderColor] = useState('#2a9d8f')

  function handleAddButtonClick() {
    onFolderAdd({
      id: '',
      parentId: '',
      name: folderName,
      cover: folderColor
    })
    setFolderName('')
  }

  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontSize: '1.125rem', py: 1}}>
        Create New Folder
      </Typography>
      <Box py={2} mb={2}>
        <Stack direction={'row'} alignItems={'center'} mb={'2rem'}>
          <Box width={140}>
            <Typography id="" variant="h6" component="h4" sx={{fontSize: '1rem'}}>
              Name
            </Typography>
          </Box>
          <Box flexGrow={1}>
            <TextField onChange={(event) => setFolderName(event.target.value)} id="outlined-basic" placeholder="Folder Name" variant="filled" size="small" hiddenLabel fullWidth />
          </Box>
        </Stack>
        <Stack direction={'row'} alignItems={'center'}>
          <Box width={140} minWidth={140} alignSelf={'flex-start'}>
            <Typography id="" variant="h6" component="h4" sx={{fontSize: '1rem'}}>
              Cover
            </Typography>
          </Box>
          <Box flexGrow={1}>
            <Box display={'flex'} gap={'1.25rem'} flexWrap={'wrap'}>
              {folderColors.map(color => (
                <Box key={color} width={'calc((100% - (1.25rem * (6 - 1))) / 6)'} height={60} borderRadius={'6px'} bgcolor={color} display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{cursor: 'pointer'}} onClick={() => setFolderColor(color)}>
                  {folderColor == color && (
                    <Icon icon={'mdi:check'} fontSize={'1.25rem'} color="#fff" style={{borderRadius: '50%', padding: '2px', backgroundColor: 'rgba(0,0,0,.2)'}} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box pt={0} textAlign={'end'}>
        <Button variant="contained" color="primary" disableElevation onClick={handleAddButtonClick} disabled={folderName == ''}>
          Create
        </Button>
      </Box>
    </>
  )
}
