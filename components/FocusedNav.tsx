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
      <nav className="w-full fixed z-10">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <h1 className="self-center text-xl font-semibold whitespace-nowrap max-w-[250px] absolute top-4 left-4">
            <a href="/" className="flex items-center">
              {/* Noun Seek ⌐◨-◨ */}
              <img src="/noun-seek-logo.svg" alt="Noun Seek logo" />
            </a>
          </h1>
          <div className="absolute top-4 right-4">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </nav>
    </header>
  );
}
