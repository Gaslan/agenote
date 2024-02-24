import { Menu, PopoverOrigin } from "@mui/material"
import { ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react"

interface PopupMenuBaseProps {
  children: React.ReactNode
  anchorOrigin: PopoverOrigin
  transformOrigin: PopoverOrigin
}

export interface PopupMenuBaseHandle {
  open: (event: React.MouseEvent<HTMLElement>) => void
  close: () => void
}

const PopupMenuBase: ForwardRefRenderFunction<PopupMenuBaseHandle, PopupMenuBaseProps> = function PopupMenuBase({children, anchorOrigin = {horizontal: 'left', vertical: 'bottom'}, transformOrigin = { horizontal: 'left', vertical: 'bottom' }}, ref) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  useImperativeHandle(ref, () => {
    return {
      open(event: React.MouseEvent<HTMLElement>) {
        handleOpen(event)
      },
      close() {
        handleClose()
      },
    };
  })

  return (
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: -2,
            '& .MuiListItemIcon-root': {
              minWidth: '28px'
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
      >
        { children }
      </Menu>
  )
}

export default forwardRef(PopupMenuBase)
