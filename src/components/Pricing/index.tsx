import React, { FC } from "react";
import { CgCheck } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";

interface Props {}

const Pricing: FC<Props> = () => {
  return (
    <div className="max-w-full mx-auto w-full">
      <h1 className="font-Basic tracking-tighter md:tracking-tight text-center text-6xl text-primary font-bold leading-snug pt-12">
        Pricing
      </h1>

      <div className="flex flex-row max-w-full md:max-w-6xl mx-auto my-12 md:px-8">
        <div className="flex flex-col justify-center md:flex-row w-full h-full">
          {/* First card */}
          <div className="w-full max-w-md sm:w-2/3 lg:w-1/3  h-full shadow-lg rounded-lg bg-white mx-auto my-auto">
            <div className="overflow-hidden h-full">
              <div className="text-center text-sm sm:text-md max-w-sm mx-auto mt-2 text-tertiary px-8 lg:px-6 h-full">
                <h1 className="font-Basic text-secondary tracking-widest text-xl py-6 font-bold uppercase p-3 pb-0 text-center">
                  Monthly
                </h1>
                <h2 className="text-md text-secondary text-center py-10">
                  <span className="text-6xl mr-2 font-bold tracking-tighter">
                    $30
                  </span>
                  / month
                </h2>
                {/* Pros */}
                <div className="flex flex-col justify-center items-start mx-auto w-full md:w-10/12">
                  <div className="flex flex-row justify-center items-center ">
                    <CgCheck className="text-4xl text-green-500" />
                    Access to all the daily picks.
                  </div>
                  <div className="flex flex-row justify-center items-center ">
                    <IoCloseSharp className="text-2xl text-red-500 mx-1 mr-2" />
                    No savings.
                  </div>
                </div>
              </div>

              <div className="flex items-center p-8 mt-auto uppercase">
                <button className="flex flex-row justify-center items-center rounded-md shadow-md font-Basic md:text-lg tracking-tight md:tracking-tight font-semibold bg-secondary w-full text-white px-6 py-3 hover:bg-black">
                  Select <CgCheck className="text-2xl text-white ml-1 -mr-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Most popular */}
          <div className="z-10 w-full max-w-md sm:w-2/3 lg:w-1/3 h-full lg:mx-4 shadow-lg rounded-lg bg-white mx-auto my-6 md:my-auto">
            <div className="animate-pulse text-sm leading-none rounded-t-lg bg-gray-100 text-gray-400 uppercase py-4 text-center tracking-widest">
              Most Popular
            </div>
            <div className="text-center text-sm sm:text-md max-w-sm mx-auto mt-2 text-tertiary px-8 lg:px-6">
              <h1 className="font-Basic text-primary tracking-widest text-xl py-6 font-bold uppercase p-3 pb-0 text-center">
                3 Months
              </h1>
              <h2 className="text-md text-primary text-center py-10">
                <span className="text-7xl mr-2 font-bold tracking-tighter">
                  $25
                </span>
                / month
              </h2>
              {/* Pros */}
              <div className="flex flex-col justify-center items-start mx-auto w-full md:w-10/12">
                <div className="flex flex-row justify-center items-center ">
                  <CgCheck className="text-4xl text-green-500" />
                  Access to all the daily picks.
                </div>
                <div className="flex flex-row justify-center items-center ">
                  <CgCheck className="text-4xl text-green-500" />
                  You save{" "}
                  <b className="mx-1 tracking-tight text-primary text-lg">
                    20%
                  </b>{" "}
                  per month.
                </div>
              </div>
            </div>

            <div className="flex items-center p-8 mt-auto uppercase">
              <button className="flex flex-row justify-center items-center rounded-md shadow-md font-Basic md:text-lg tracking-tight md:tracking-tight font-semibold bg-secondary w-full text-white px-6 py-3 hover:bg-black">
                Select <CgCheck className="text-2xl text-white ml-1 -mr-2" />
              </button>
            </div>
          </div>

          {/* Most expensive */}
          <div className="w-full max-w-md sm:w-2/3 lg:w-1/3 h-full shadow-lg rounded-lg bg-white mx-auto my-auto">
            <div className=" text-tertiary overflow-hidden h-full">
              <div className="text-center text-sm sm:text-md max-w-sm mx-auto mt-2 text-tertiary px-8 lg:px-8">
                <h1 className="font-Basic text-secondary tracking-widest text-xl py-6 font-bold uppercase p-3 pb-0 text-center">
                  6 Months
                </h1>
                <h2 className="text-md text-secondary text-center py-10">
                  <span className="text-6xl mr-2 font-bold tracking-tighter">
                    $20
                  </span>
                  / month
                </h2>
                {/* Pros */}
                <div className="flex flex-col justify-center items-start mx-auto w-full md:w-10/12 h-full">
                  <div className="flex flex-row justify-center items-center ">
                    <CgCheck className="text-4xl text-green-500" />
                    Access to all the daily picks.
                  </div>
                  <div className="flex flex-row justify-center items-center ">
                    <CgCheck className="text-4xl text-green-500" />
                    You save{" "}
                    <b className="mx-1 tracking-tight text-primary text-lg">
                      30%
                    </b>{" "}
                    per month.
                  </div>
                </div>
              </div>

              <div className="flex items-center p-8 mt-auto uppercase">
                <button className="flex flex-row justify-center items-center rounded-md shadow-md font-Basic md:text-lg tracking-tight md:tracking-tight font-semibold bg-secondary w-full text-white px-6 py-3 hover:bg-black">
                  Select <CgCheck className="text-2xl text-white ml-1 -mr-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Pricing };

{
  /* Pros */
}
{
  /* <div className="flex flex-wrap mt-3 px-6">
                <ul>
                  <li className="flex items-center">
                    <div className="  p-2 fill-current text-green-700">
                      <CgCheck className="text-3xl text-green-500 mr-2" />
                    </div>
                    <span className="text-gray-700 text-lg ml-3">No setup</span>
                  </li>
                  <li className="flex items-center">
                    <div className="  p-2 fill-current text-green-700">
                      <CgCheck className="text-3xl text-green-500 mr-2" />
                    </div>
                    <span className="text-gray-700 text-lg ml-3">
                      No setups
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="  p-2 fill-current text-green-700">
                      <CgCheck className="text-3xl text-green-500 mr-2" />
                    </div>
                    <span className="text-gray-700 text-lg ml-3">Speed</span>
                  </li>
                </ul>
              </div> */
}
