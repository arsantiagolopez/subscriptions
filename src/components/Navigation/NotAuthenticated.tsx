import Link from "next/link";
import React, { FC, useState } from "react";
import { Logo } from "../Logo";
import { MobileMenu } from "./MobileMenu";

interface Props {}

const NotAuthenticated: FC<Props> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const mobileMenuProps = {
    isMenuOpen,
    setIsMenuOpen,
  };

  return (
    <div className="fixed z-50 bg-white flex items-center justify-center h-16 md:h-20 w-screen shadow-lg shadow-gray-100 px-6 md:px-8">
      {/* Left */}
      <div className="z-50 flex flex-row h-full items-center">
        <>
          <div className="relative aspect-square h-[40%] mr-3">
            <Logo />
          </div>
          <Link href="/">
            <h1 className="font-Basic text-xl text-primary tracking-tighter cursor-pointer">
              {BRAND_NAME}
            </h1>
          </Link>
        </>

        <div className="hidden md:flex md:mx-10">
          <Link href="/pricing">
            <button className="font-Basic text-primary mx-4">Pricing</button>
          </Link>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-row ml-auto">
        {/* Mobile only menu */}
        <button onClick={toggleMenu} className="md:hidden text-3xl">
          <MobileMenu {...mobileMenuProps} />
        </button>

        <div className="hidden md:flex flex-row h-full items-center">
          <Link href="/signin">
            <a className="font-Basic tracking-tight self-center pr-2 md:pr-4">
              Sign in
            </a>
          </Link>
          <Link href="/register">
            <button className="font-Basic text-sm text-white bg-primary px-6 py-1.5 ml-2 rounded-full hover:bg-secondary">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export { NotAuthenticated };
