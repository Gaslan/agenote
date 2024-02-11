import { Icon } from "@iconify/react";
import { IconButton } from "@mui/material";
import { useRef } from "react";
import FoldersView, { FoldersViewHandle } from "@/component/mobile/folders/folders-view";

interface BottombarProps {
  
}

export default function Bottombar({}: BottombarProps) {

  const foldersViewRef = useRef<FoldersViewHandle>(null)

  return (
    <>
    <div className="bottombar">
      <div style={{width: '100%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <IconButton onClick={() => foldersViewRef.current?.open()}>
          <Icon icon="tabler:folders" width="1.625rem" height="1.625rem" />
        </IconButton>
        <IconButton onClick={() => foldersViewRef.current?.open()} sx={{bgcolor: '#256dc9', padding: '12px', transform: 'translateY(-35%)', color: '#fff', boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(164, 164, 164, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'}}>
          <Icon icon="tabler:edit" width="1.75rem" height="1.75rem" />
        </IconButton>
        <IconButton>
          <Icon icon="mdi:dots-horizontal" width="1.625rem" height="1.625rem" />
        </IconButton>
      </div>
    </div>
    <FoldersView ref={foldersViewRef} />
    </>
  )
}
