'use client'
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/app/store";
import { CssBaseline } from "@mui/material";
import styles from "./layout.module.css"
import Topbar from "@/component/todo/topbar";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/tr'

const inter = Inter({ subsets: ["latin"] });

const userLang = typeof window !== "undefined" ? window.navigator.language : ''


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // dayjs.locale('tr', {weekStart: 1})
  dayjs.extend(weekday)
  dayjs.extend(localeData)
  console.log('dayjs layout ', dayjs.localeData().firstDayOfWeek())
  console.log('GUNLER: ', dayjs.weekdaysShort(true))
  dayjs.locale('tr')
  console.log('GUNLER TR: ', dayjs.weekdays())
  // dayjs.locale('en')

  console.log('dayjs layout ', dayjs.locale())
  console.log('dayjs layout ', dayjs.localeData().firstDayOfWeek())
  return (
    <html lang="en">
      <head></head>
      <body className={`${inter.className} ${styles.body}`} >
        <CssBaseline />
        <Provider store={makeStore()}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Topbar />
            {children}
          </LocalizationProvider>
        </Provider>
      </body>
    </html>
  );
}
