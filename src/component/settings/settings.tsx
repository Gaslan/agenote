import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";
import { useRef } from "react";
import ModalBase, { ModalBaseHandle } from "../ModalBase";
import SettingsModal from "./settings-modal";

interface SettingsProps {
  
}

export default function Settings({}: SettingsProps) {

  const settingsModalRef = useRef<ModalBaseHandle>(null)

  function handleSettingsButtonClick() {
    settingsModalRef.current?.open()
  }

  return (
    <>
      <IconButton disableRipple sx={{p: '4px', ml: '10px'}} onClick={handleSettingsButtonClick}>
        <Icon icon="mdi:cog-outline" width="1.5rem" height="1.5rem" />
      </IconButton>
      <ModalBase ref={settingsModalRef} sx={{padding: 0}}>
        <SettingsModal />
      </ModalBase>
    </>
  )
}
