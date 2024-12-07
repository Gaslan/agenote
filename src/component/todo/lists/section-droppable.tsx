import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface SectionDroppableProps {
  id: string
  children: ReactNode
}

export default function SectionDroppable({ id, children }: SectionDroppableProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <Box ref={setNodeRef}>
      {children}
    </Box>
  )
}
