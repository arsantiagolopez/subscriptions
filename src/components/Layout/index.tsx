import React, { FC, ReactNode } from "react";
import { Navigation } from "../Navigation";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col bg-secondary">
      <Navigation />
      <div className="flex flex-col pt-16 md:pt-20 min-h-screen h-screen px-6 md:px-8">
        {children}
      </div>
    </div>
  );
};

export { Layout };
