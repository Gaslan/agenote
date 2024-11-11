import { SwipeableDrawer, SwipeableDrawerProps } from "@mui/material";
import { ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";

interface SwipeableDrawerBaseProps extends SwipeableDrawerProps {

}

export interface SwipeableDrawerBaseHandle {
  open: () => void
  close: () => void
}

const SwipeableDrawerBase: ForwardRefRenderFunction<SwipeableDrawerBaseHandle, SwipeableDrawerBaseProps> = function SwipeableDrawerBase({ children, ...props }, ref) {

  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      open() {
        handleOpen()
      },
      close() {
        handleClose()
      },
    }
  })

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  function handleClose() {
    setOpen(false)
    props.onClose && props.onClose({} as React.SyntheticEvent)
  }

  function handleOpen() {
    console.log('open a tıklandı')
    setOpen(true)
    props.onOpen && props.onOpen({} as React.SyntheticEvent)
  }

  return (
    <>
      <SwipeableDrawer
        {...props}
        anchor={props.anchor ?? 'bottom'}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={props.swipeAreaWidth ?? 56}
        disableSwipeToOpen={props.disableSwipeToOpen ?? true}
        disableRestoreFocus={props.disableRestoreFocus ?? true}
        ModalProps={{
          keepMounted: true,
          ...props.ModalProps
        }}
      >
        {children}
      </SwipeableDrawer>
    </>
  )
}

export default forwardRef(SwipeableDrawerBase)
