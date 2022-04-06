import { useSession } from "next-auth/react";
import React, { FC, useState } from "react";
import axios from "../../axios";

interface Props {}

const Account: FC<Props> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data } = useSession();

  // const { isLoading, subscription, userProfile } = useUser();

  const redirectToCustomerPortal = async () => {
    setIsLoading(true);

    // Create portal link
    try {
      const { status } = await axios.post("/api/create-portal-link");

      if (status !== 200) {
        console.log("Could not create portal link.");
        setIsLoading(false);
      }
    } catch (error) {
      if (error) return alert((error as Error).message);
    }

    setIsLoading(false);
  };

  // const subscriptionPrice =
  //   subscription &&
  //   new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: subscription?.prices?.currency,
  //     minimumFractionDigits: 0,
  //   }).format((subscription?.prices?.unit_amount || 0) / 100);

  return <div className="">Account content</div>;
};

export { Account };
