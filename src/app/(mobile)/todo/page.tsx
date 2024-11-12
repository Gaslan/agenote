import TodoList from "@/component/todo/todo-list"
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
    <TodoList />
  )
}
