import { ForwardRefRenderFunction, forwardRef, useImperativeHandle, useRef } from "react";
import DrawerBase, { DrawerBaseHandle } from "../drawer-base";
import { Box, IconButton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

export interface SettingsViewHandle {
  open: () => void
  close: () => void
}

interface SettingsViewProps {
  
}

const SettingsView: ForwardRefRenderFunction<SettingsViewHandle, SettingsViewProps> = function SettingsView({}, ref) {

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

  return (
    <>
      <DrawerBase ref={drawerRef} anchor="bottom">
        <Box height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'stretch'}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={'50px'} borderBottom={'1px solid #ddd'}>
            <IconButton onClick={() => drawerRef.current?.close()}>
              <Icon icon="tabler:chevron-left" width="2rem" height="2rem" />
            </IconButton>
            <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500}>Settings</Typography>
            <IconButton onClick={() => {}}>
              <Icon icon="tabler:check" width="1.75rem" height="1.75rem" />
            </IconButton>
          </Box>
          Settings
        </Box>
      </DrawerBase>
    </>
  )
}

export default forwardRef(SettingsView)
