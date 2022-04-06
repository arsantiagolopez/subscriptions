import moment from "moment";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";

const TestPage: NextPage = () => {
  /**
   * Convert past date into date object
   * @param date - Date in the "fromNow" format e.g. 5 hr. ago
   */
  const convertPastToDate = (string: string): Date => {
    const number = string.split(" ")[0];
    const interval = string.split(" ")[1];
    const now = moment(new Date());

    console.log(interval);

    let date = moment().toDate();

    // Handle seconds ago
    if (interval.includes("sec")) {
      date = moment(now).subtract(number, "seconds").toDate();
    }
    // Handle minutes ago
    if (interval.includes("min") || interval.includes("minute")) {
      date = moment(now).subtract(number, "minutes").toDate();
    }
    // Handle hours ago
    else if (interval.includes("hr") || interval.includes("hour")) {
      date = moment(now).subtract(number, "hours").toDate();
    }
    // Handle days ago
    else if (interval.includes("d.") || interval.includes("day")) {
      date = moment(now).subtract(number, "days").toDate();
    } else {
      date = now.toDate();
    }

    return date;
  };

  const test = moment(convertPastToDate("4 min. ago")).format("h:mm A");

  return (
    <>
      <Head>
        <title>Test | {process.env.NEXT_PUBLIC_BRAND_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="text-white py-24 text-center">{test}</div>
      </Layout>
    </>
  );
};

export default TestPage;
