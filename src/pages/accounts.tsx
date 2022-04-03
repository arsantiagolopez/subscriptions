import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Account } from "../components/Account";
import { Layout } from "../components/Layout";

const AccountPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Account | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Account />
      </Layout>
    </>
  );
};

export default AccountPage;
