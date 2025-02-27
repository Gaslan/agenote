import { Box, Drawer, DrawerProps } from "@mui/material";
import { ForwardRefRenderFunction, HTMLAttributes, forwardRef, useImperativeHandle, useState } from "react";

interface DrawerBaseProps extends DrawerProps {
  // children: React.ReactNode
  // anchor: 'left' | 'top' | 'right' | 'bottom'
}

export interface DrawerBaseHandle {
  open: () => void
  close: () => void
}

const style = {
  height: '100%'
};

const DrawerBase: ForwardRefRenderFunction<DrawerBaseHandle, DrawerBaseProps> = function DrawerBase({children, ...props}, ref) {

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useImperativeHandle(ref, () => {
    return {
      open() {
        handleOpen()
      },
      close() {
        handleClose()
      },
    };
  })

  return (
    <Drawer sx={{'& .MuiPaper-root': {height: '100%', width: '100%', bottom: 0, left: 0}}}
      {...props}
      anchor={props.anchor}
      open={open}
      onClose={handleClose}
      variant="temporary">
      <Box sx={style} {...props}>
        { children }
      </Box>
    </Drawer>
  )
}

export default forwardRef(DrawerBase)
