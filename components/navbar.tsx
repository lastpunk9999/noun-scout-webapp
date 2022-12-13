import { useState } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function NavBar() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  function addOrConnect(event) {
    if (isConnected) return;
    event.preventDefault();
    openConnectModal();
  }

  return (
    <header>
      <nav className=" border-gray-200 px-4 md:px-6 py-3 md:py-5 border-b-2 mb-10">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <h1 className="self-center text-xl font-semibold whitespace-nowrap max-w-[150px]">
            <a href="/" className="flex items-center">
              {/* Noun Seek ⌐◨-◨ */}
              <img src="/noun-seek-logo.svg" alt="Noun Seek logo" />
            </a>
          </h1>
          <div className="flex items-center md:order-2 md:hidden">
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0 items-center">
              <li>
                {/* 
                            show add button for logged out users to clarify how to add.
                            include connect button on /add page if logged out.
                           */}
                <Link href="/add">
                  <a
                    // see note above
                    // onClick={addOrConnect}
                    className="text-md md:text-lg block py-2 pr-4 pl-3 text-white rounded bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 no-underline hover:underline"
                    aria-current="page"
                  >
                    Add Sponsorship
                  </a>
                </Link>
              </li>
              {isConnected && (
                <>
                  <li>
                    <Link href="/manage">
                      <a
                        className="text-md md:text-lg block py-2 pr-4 pl-3 text-white rounded bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 no-underline hover:underline"
                        aria-current="page"
                      >
                        Your Sponsorships
                      </a>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/about">
                  <a className="text-md md:text-lg block py-2 pr-4 pl-3 text-white rounded bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 no-underline hover:underline">
                    About
                  </a>
                </Link>
              </li>
              <li>
                <ConnectButton showBalance={false} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
