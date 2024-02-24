'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/app/store";
import { MilkdownProvider } from "@milkdown/react";
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
