import { useState } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";

export default function NavBar() {
  const { isConnected } = useAccount();
  const [isMobileNavExpanded, setIsMobileNavExpanded] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <header>
      <nav className="px-4 md:px-6 py-3 md:py-5 mb-10">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center mx-auto max-w-screen-xl gap-10">
          <h1 className="self-center text-xl font-semibold whitespace-nowrap max-w-[150px]">
            <Link href="/" className="flex items-center">
              {/* Noun Seek ⌐◨-◨ */}
              <img src="/noun-seek-logo.svg" alt="Noun Seek logo" />
            </Link>
          </h1>

          <div className="flex items-center md:order-2 md:hidden">
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
              onClick={() => setIsMobileNavExpanded(!isMobileNavExpanded)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={cx(
                  isMobile && isMobileNavExpanded ? "hidden" : "block",
                  "w-6 h-6"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={cx(
                  isMobile && isMobileNavExpanded ? "flex" : "hidden",
                  "w-6 h-6"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <AnimatePresence>
            <motion.div
              key={`${isMobileNavExpanded} ${isMobile}`}
              className={cx(
                isMobile ? "hidden w-full" : "flex",
                isMobile && isMobileNavExpanded && "block",
                ``
              )}
              initial={
                isMobile
                  ? {
                      height: 0,
                      opacity: 0,
                    }
                  : {
                      height: "auto",
                      opacity: 1,
                    }
              }
              animate={
                isMobile &&
                isMobileNavExpanded && {
                  height: "auto",
                  opacity: 1,
                  transition: {
                    duration: 0.25,
                    delay: 0,
                  },
                }
              }
              exit={
                isMobile && {
                  height: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.15,
                    delay: 0,
                  },
                }
              }
            >
              <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 items-center">
                <li>
                  <Link href="/add">
                    <a
                      className="text-lg block py-2 pr-4 pl-3 bg-transparent text-blue-500 p-0 no-underline hover:underline leading-none"
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
                          className="text-lg block py-2 pr-4 pl-3 bg-transparent text-blue-500 p-0 no-underline hover:underline leading-none"
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
                    <a className="text-lg block py-2 pr-4 pl-3 bg-transparent text-blue-500 p-0 no-underline hover:underline leading-none">
                      About
                    </a>
                  </Link>
                </li>
                <li className="mt-3 md:mt-0 md:ml-4">
                  <ConnectButton showBalance={false} />
                </li>
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
