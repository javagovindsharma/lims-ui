import React, { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const mystyle = {
  minWidth: "fit-content",
} as React.CSSProperties;

export default function MainLayout( {children}: MainLayoutProps ){
   return (
       <>
           <div>
                    {children}             
           </div>
       </>
   );
}