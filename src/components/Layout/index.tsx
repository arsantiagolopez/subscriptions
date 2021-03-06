import React, { FC, ReactNode } from "react";
import { Navigation } from "../Navigation";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col bg-primary">
      <Navigation />
      <div className="flex flex-col pt-16 md:pt-20 min-h-screen h-screen px-5 md:px-[15%]">
        {children}
      </div>
    </div>
  );
};

export { Layout };
