import Head from "next/head";
import React from "react";
import { Dashboard } from "../components/Dashboard";
import { Layout } from "../components/Layout";
import { ProtectedPage } from "../types";

interface Props {}

const DashboardPage: ProtectedPage<Props> = () => {
  const dashboardProps = {};

  return (
    <>
      <Head>
        <title>Dashboard | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Dashboard {...dashboardProps} />
      </Layout>
    </>
  );
};

DashboardPage.isProtected = true;

export default DashboardPage;
