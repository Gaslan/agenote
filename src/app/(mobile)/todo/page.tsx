import Bottombar from "@/component/todo/bottombar"
import TodoLists from "@/component/todo/todo-list"
import Topbar from "@/component/todo/topbar"
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
    <>
      {/* <Topbar /> */}
      <TodoLists />
      <Bottombar />
    </>
  )
}
