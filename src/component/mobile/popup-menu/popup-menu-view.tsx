import { Icon } from "@iconify/react";
import { Divider, MenuItem } from "@mui/material";
import PopupMenuBase, { PopupMenuBaseHandle } from "../popup-menu-base";
import { ForwardRefRenderFunction, forwardRef, useImperativeHandle, useRef } from "react";
import SettingsView, { SettingsViewHandle } from "./settings-view";

export interface PopupMenuViewHandle {
  open: (event: React.MouseEvent<HTMLElement>) => void
  close: () => void
}

interface PopupMenuViewProps {
  
}

const PopupMenuView: ForwardRefRenderFunction<PopupMenuViewHandle, PopupMenuViewProps> =  function PopupMenuView({}, ref) {

  const popupMenuBaseRef = useRef<PopupMenuBaseHandle>(null)
  const settingsViewRef = useRef<SettingsViewHandle>(null)

  useImperativeHandle(ref, () => {
    return {
      open(event: React.MouseEvent<HTMLElement>) {
        popupMenuBaseRef.current?.open(event)
      },
      close() {
        popupMenuBaseRef.current?.close()
      },
    };
  })

  return (
    <>
      <PopupMenuBase ref={popupMenuBaseRef}>
        <MenuItem onClick={() =>{}}>
          <Icon icon={'mdi:pencil'} fontSize="18px" style={{marginRight: '12px'}} />
          Edit Folder
        </MenuItem>
        <MenuItem onClick={() =>{}}>
          <Icon icon={'mdi:plus'} fontSize="18px" style={{marginRight: '12px'}} />
          New Folder
        </MenuItem>
        <MenuItem onClick={() =>{}}>
          <Icon icon={'mdi:trash'} fontSize="18px" style={{marginRight: '12px'}} />
          Delete Folder
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => settingsViewRef.current?.open()}>
          <Icon icon={'mdi:cog'} fontSize="18px" style={{marginRight: '12px'}} />
          Settings
        </MenuItem>
      </PopupMenuBase>
      <SettingsView ref={settingsViewRef} />
    </>
  )
}

export default forwardRef(PopupMenuView)
