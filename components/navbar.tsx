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
    <div>
      <ul>
        <li>
          <ConnectButton />
        </li>
        {isConnected && (
          <li>
            <Link href="/manage">
              <a>Manage Requests</a>
            </Link>
          </li>
        )}
        <li>
          <Link href={isConnected ? "/add" : {}}>
            <a onClick={addOrConnect}>Add</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
