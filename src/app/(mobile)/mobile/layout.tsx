'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./sidebar";
import SubSidebar from "./sub-sidebar";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/app/store";
import { Box, CssBaseline, Drawer, IconButton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import MainApp from "@/component/main-app";
import { MilkdownProvider } from "@milkdown/react";
import { useState } from "react";
import Bottombar from "./bottombar";
import { useAppSelector } from "@/redux/app/hooks";
import { Folder } from "@/component/mobile/folders/folders";
import Topbar from "./topbar";
import Main from "./main";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Provider store={makeStore()}>
      <MilkdownProvider>
        <Main>
          { children }
        </Main>
      </MilkdownProvider>
    </Provider>
  );
}
