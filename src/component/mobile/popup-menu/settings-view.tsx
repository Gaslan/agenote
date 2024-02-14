import { ForwardRefRenderFunction, MouseEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";
import DrawerBase, { DrawerBaseHandle } from "../drawer-base";
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography, buttonBaseClasses, styled, toggleButtonClasses, toggleButtonGroupClasses } from "@mui/material";
import { Icon } from "@iconify/react";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { changeTheme } from "@/redux/features/settings/settingsSlice";

export interface SettingsViewHandle {
  open: () => void
  close: () => void
}

interface SettingsViewProps {
  
}

export type ThemeType = 'light' | 'dark' | 'system'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'var(--an-button-bg-color)',
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${buttonBaseClasses.root} .${toggleButtonClasses.root}`]: {
    backgroundColor: 'var(--an-button-bg-color)',
    color: '#fff',
    [`& .Mui-selected`]: {
      backgroundColor: 'var(--an-button-bg-active-color)',
      fontSize: '19px'
    },
  },
  [`& .Mui-selected:hover`]: {
    backgroundColor: 'var(--an-button-bg-active-color)',
    color: '#fff'
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

const SettingsView: ForwardRefRenderFunction<SettingsViewHandle, SettingsViewProps> = function SettingsView({}, ref) {

  const drawerRef = useRef<DrawerBaseHandle>(null)

  const [themeType, setThemeType] = useState<ThemeType>('light')

  const dispatch = useAppDispatch()

  function handleThemeType(event: MouseEvent<HTMLElement>, newThemeType: ThemeType) {
    setThemeType(newThemeType)
    dispatch(changeTheme(newThemeType))
  }

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

  return (
    <>
      <DrawerBase ref={drawerRef} anchor="bottom">
        <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'stretch'} bgcolor={'var(--an-body-bg-color)'}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'50px'} borderBottom={'1px solid #ddd'} bgcolor={'var(--an-body-bg-color)'}>
            <IconButton onClick={() => drawerRef.current?.close()} sx={{color: 'var(--an-text-color)'}}>
              <Icon icon="tabler:chevron-left" width="2rem" height="2rem" />
            </IconButton>
            <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500} sx={{color: 'var(--an-text-color)'}}>Settings</Typography>
            <IconButton onClick={() => {}} sx={{color: 'var(--an-text-color)'}}>
              <Icon icon="tabler:check" width="1.75rem" height="1.75rem" />
            </IconButton>
          </Box>
          <Box flexGrow={1}>
            <StyledToggleButtonGroup value={themeType} exclusive onChange={handleThemeType}>
              <ToggleButton value={'light'} sx={{color: 'var(--an-text-color)'}}>Light</ToggleButton>
              <ToggleButton value={'dark'} sx={{color: 'var(--an-text-color)'}}>Dark</ToggleButton>
              <ToggleButton value={'system'} sx={{color: 'var(--an-text-color)'}}>System</ToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        </Box>
      </DrawerBase>
    </>
  )
}

export default forwardRef(SettingsView)
