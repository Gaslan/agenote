import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from "react";

interface TodoDetailProps {

}

export interface TodoDetailHandle {
  open: () => void
  toggle: () => void
}

const TodoDetail: ForwardRefRenderFunction<TodoDetailHandle, TodoDetailProps> = function TodoDetail({ }: TodoDetailProps, ref) {

  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      toggle() {
        setOpen(old => !old)
      },
      open() {
        setOpen(true)
      },
    }
  })

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={56}
        disableSwipeToOpen={true}
        disableRestoreFocus
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ width: '100%', height: '100vh' }}>
          <Box className="topbar">
            <Box width={'100%'} height={'50px'} px={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'1px solid #ddd'}>
              <IconButton onClick={toggleDrawer(false)}>
                <Icon icon="mdi:arrow-left" width="1.75rem" height="1.75rem" />
              </IconButton>
              <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500} color={'#256dc9'}>Task</Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <Icon icon="mdi:dots-vertical" width="1.75rem" height="1.75rem" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default forwardRef(TodoDetail)
