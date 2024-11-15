'use client'
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/app/store";
import { CssBaseline } from "@mui/material";
import styles from "./layout.module.css"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/tr'

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {

  dayjs.extend(weekday)
  dayjs.extend(localeData)

  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.body}`} >
        <CssBaseline />
        <Provider store={makeStore()}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}
          </LocalizationProvider>
        </Provider>
      </body>
    </html>
  )
}
