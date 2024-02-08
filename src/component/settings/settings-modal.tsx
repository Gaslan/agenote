import { Icon } from "@iconify/react";
import { Box, FormControl, FormControlLabel, Stack, Switch, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

interface SettingsModalProps {
  
}

export default function SettingsModal({}: SettingsModalProps) {
  
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Stack direction={'row'}>
      <Box width={'180px'} minWidth={'180px'} maxWidth={'240px'} height={'600px'} borderRight={1} borderColor={'divider'}>
        <Typography variant="h2" component={'h2'} fontSize={'1rem'} fontWeight={600} fontFamily={"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"} p={'1.25rem 1rem'}>Settings</Typography>
        <Box mb={'1rem'}>
          <Tabs
          TabIndicatorProps={{hidden: true}}
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Vertical tabs example"
            sx={{ '& .MuiTab-root': {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', textTransform: 'none', minHeight: '48px', p: '.75rem 1.25rem', fontFamily:"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"}, '& .MuiTab-root:hover': {bgcolor: 'rgba(0,0,0,.05)'}, '& .MuiTab-root.Mui-selected': {bgcolor: 'rgba(0,0,0,.08)', color: 'initial', fontWeight: 600} }}
          >
            <Tab icon={<Icon icon="mdi:theme-outline" width="1.5rem" height="1.5rem" />} iconPosition="start" label="Theme" disableTouchRipple />
            <Tab icon={<Icon icon="mdi:slider" width="1.5rem" height="1.5rem" />} iconPosition="start" label="General" disableTouchRipple />
            <Tab icon={<Icon icon="mdi:file-document-box-outline" width="1.5rem" height="1.5rem" />} iconPosition="start" label="Editor" disableTouchRipple />
          </Tabs>
        </Box>
      </Box>
      <Box flexGrow={1}>
        <Typography variant="h2" component={'h2'} fontSize={'1rem'} fontWeight={600} fontFamily={"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'"} p={'1.25rem 1rem'}>Display</Typography>
        <Box>
          <FormControl fullWidth sx={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px', fontSize: '14px'}}>
            <span style={{padding: '0 4px'}}>Show number of notes in each notebook</span>
            <Switch />
          </FormControl>
          <FormControl fullWidth sx={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px', fontSize: '14px'}}>
            <span style={{padding: '0 4px'}}>Show number of notes in each notebook</span>
            <Switch />
          </FormControl>
        </Box>
      </Box>
    </Stack>
  )
}
