'use client'
import { useAppSelector } from "@/redux/app/hooks";
import Bottombar from "./bottombar";
import Topbar from "./topbar";
import { CssBaseline } from "@mui/material";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

interface MainProps {
  children: React.ReactNode
}

export default function Main({children}: MainProps) {

  // const inter = Inter({ subsets: ["latin"] });
  const theme = useAppSelector(state => state.settings.theme)

  return (
    <html lang="en">
      <head>
        <meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport"/>
      </head>
      <body /*className={inter.className}*/ data-theme={theme}>
        <CssBaseline />
        <Topbar />

        <div style={{height: 'calc(100dvh - 100px)', backgroundColor: 'var(--an-body-bg-color)'}}>
          { children }
        </div>

        <Bottombar />
        <Toaster position="bottom-center" reverseOrder={false} />
      </body>
    </html>
  )
}
