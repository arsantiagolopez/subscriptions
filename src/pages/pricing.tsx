import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { Pricing } from "../components/Pricing";

const PricingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pricing | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Pricing />
      </Layout>
    </>
  );
};

export default PricingPage;
