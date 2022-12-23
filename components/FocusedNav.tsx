import { useState } from "react";
import Link from "next/link";

export default function FocusedNav() {
  return (
    <header>
      <nav className="w-full md:fixed z-10">
        <div className="flex flex-wrap justify-center md:justify-between items-center mx-auto max-w-screen-xl p-3 md:p-0">
          <h1 className="self-center text-xl font-semibold whitespace-nowrap max-w-[150px] md:absolute md:top-4 md:left-4">
            <Link href="/" className="flex items-center">
              {/* Noun Seek ⌐◨-◨ */}
              <img src="/noun-seek-logo.svg" alt="Noun Seek logo" />
            </Link>
          </h1>
          {/* <div className="">
            <ConnectButton showBalance={false} />
          </div> */}
        </div>
      </nav>
    </header>
  );
}
