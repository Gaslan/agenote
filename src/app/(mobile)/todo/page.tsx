import TodoList from "@/component/todo/todo-list"
import { Box } from "@mui/material"
import { Viewport } from "next"

interface PageProps {

}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export default function Page({ }: PageProps) {

  return (
    <Box sx={{paddingTop: '50px'}}>
      <TodoList />
    </Box>
  )
}
