import React, { FC } from "react";

interface Props {}

const Dashboard: FC<Props> = () => {
  return (
    <div className="flex flex-col w-full h-full text-white">
      Member only dashboard.
    </div>
  );
};

export { Dashboard };
