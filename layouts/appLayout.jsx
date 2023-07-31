import React from "react";
import Head from "next/head";
import { BottomNavBar } from "@/components/BottomNavBar";

const AppLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Head>{/* Common head content */}</Head>
      <div className="h-full flex flex-col bg-pwip-primary hide-scroll-bar">
        <main className="flex-grow min-h-[calc(100vh-88px)] hide-scroll-bar">
          {children}
        </main>
        <BottomNavBar />
      </div>
    </React.Fragment>
  );
};

export default AppLayout;
