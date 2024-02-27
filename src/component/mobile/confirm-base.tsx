import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogProps } from "@mui/material";
import { ForwardRefRenderFunction, HTMLAttributes, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

interface ConfirmBaseProps extends Omit<DialogProps, 'open'> {
  open?: boolean
  title?: string
  content?: string
  okButtonLabel?: string
  cancelButtonLabel?: string
}

export interface ConfirmBaseHandle {
  confirm: (title: string, content: string, okButtonLabel?: string, cancelButtonLabel?: string) => Promise<boolean>
}

const ConfirmBase: ForwardRefRenderFunction<ConfirmBaseHandle, ConfirmBaseProps> = function ConfirmBase({open: openProp = false, title: titleProp, content: contentProp, okButtonLabel: okButtonLabelProp = 'Ok', cancelButtonLabel: cancelButtonLabelProp = 'Cancel', ...props }, ref) {

  const [open, setOpen] = useState(openProp)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [title, setTitle] = useState(titleProp)
  const [content, setContent] = useState(contentProp)
  const [okButtonLabel, setOkButtonLabel] = useState(okButtonLabelProp)
  const [cancelButtonLabel, setCancelButtonLabel] = useState(cancelButtonLabelProp)

  const [resolve, setResolve] = useState(() => (value: boolean) => {})

  useImperativeHandle(ref, () => {
    return {
      confirm(title: string, content: string, okButtonLabel?: string, cancelButtonLabel?: string) {
        setTitle(title)
        setContent(content)
        okButtonLabel && setOkButtonLabel(okButtonLabel)
        cancelButtonLabel && setCancelButtonLabel(cancelButtonLabel)
        handleOpen()
        const { promise, resolve } = Promise.withResolvers<boolean>()
        setResolve(() => resolve)
        return promise
      }
    }
  })

  function handleOkButtonClick() {
    handleClose()
    resolve(true)
  }

  function handleCancelButtonClick() {
    handleClose()
    resolve(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancelButtonClick}>{cancelButtonLabel}</Button>
        <Button onClick={handleOkButtonClick}>{okButtonLabel}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default forwardRef(ConfirmBase)
