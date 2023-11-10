import React, { ReactNode } from "react";

import SideNav from "./Sidenav";
import NavigationBar from "./navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const mystyle = {
  minWidth: "fit-content",
} as React.CSSProperties;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <SideNav />
      <div className="main-content" id="panel" style={mystyle}>
        <NavigationBar />
        {children}
      </div>
    </>
  );
}
