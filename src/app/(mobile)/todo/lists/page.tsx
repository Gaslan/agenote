import Lists from "@/component/todo/lists/lists"
import { Viewport } from "next"

interface PageProps { }

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
}

export default function Page({ }: PageProps) {
  return (
    <Lists />
  )
}
