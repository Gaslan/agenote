import { Box, Button, ComponentsProps, Modal, ModalOwnProps } from "@mui/material";
import { ForwardRefRenderFunction, HTMLAttributes, forwardRef, useImperativeHandle, useState } from "react";

interface ModalBaseProps extends Omit<ModalOwnProps, 'open'> {
  // children: React.ReactNode
}

export interface ModalBaseHandle {
  open: () => void
  close: () => void
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  // p: 2,
  maxHeight: 'calc(100% - 64px)',
  maxWidth: '640px',
  width: 'calc(100% - 64px)'
};

const ModalBase: ForwardRefRenderFunction<ModalBaseHandle, ModalBaseProps> = function ModalBase({children, onClose, ...props}, ref) {

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

  function handleOnClose(e:{}, reason: "backdropClick" | "escapeKeyDown") {
    if (onClose) {
      onClose(e, reason)
    }
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box {...props} sx={{...props.sx, ...style}}>
        { children }
      </Box>
    </Modal>
  )
}

export default forwardRef(ModalBase)
