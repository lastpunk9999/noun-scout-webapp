import { useState } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function FocusedNav() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  function addOrConnect(event) {
    if (isConnected) return;
    event.preventDefault();
    openConnectModal();
  }

  return (
    <header>
      <nav className="w-full md:fixed z-10">
        <div className="flex flex-wrap justify-center md:justify-between items-center mx-auto max-w-screen-xl p-3 md:p-0">
          <h1 className="self-center text-xl font-semibold whitespace-nowrap max-w-[150px] md:absolute md:top-4 md:left-4">
            <a href="/" className="flex items-center">
              {/* Noun Seek ⌐◨-◨ */}
              <img src="/noun-seek-logo.svg" alt="Noun Seek logo" />
            </a>
          </h1>
          {/* <div className="">
            <ConnectButton showBalance={false} />
          </div> */}
        </div>
      </nav>
    </header>
  );
}
