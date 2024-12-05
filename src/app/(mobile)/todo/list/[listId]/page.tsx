import ListView from "@/component/todo/lists/list-view";
import { Viewport } from "next";

interface PageProps {
  params: { listId: number }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export default function Page({ params }: PageProps) {
  return (
    <ListView listId={+params.listId}/>
  )
}
