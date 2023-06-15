import { useState } from "react";
import Link from "next/link";

export default function FocusedNav() {
  return (
    <header>
      <nav className="w-full md:fixed z-10">
        <div className="flex flex-wrap justify-center md:justify-between items-center mx-auto max-w-screen-xl p-3 md:p-0">
          <div className="self-center text-xl font-semibold whitespace-nowrap max-w-[150px] md:absolute md:top-4 md:left-10">
            <Link href="/" className="flex items-center">
              <a>
                {/* Noun Seek ⌐◨-◨ */}
                <img
                  src="/noun-scout-logo.svg"
                  alt="Noun Scout logo"
                  width="100%"
                />
              </a>
            </Link>
          </div>
          {/* <div className="">
            <ConnectButton showBalance={false} />
          </div> */}
        </div>
      </nav>
    </header>
  );
}
