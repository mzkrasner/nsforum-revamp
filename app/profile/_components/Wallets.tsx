"use client";

import { Button } from "@/shared/components/ui/button";
import useLinkedWallets from "@/shared/hooks/useLinkedWallets";
import {
  ConnectedWallet,
  usePrivy,
  useWallets,
  WalletWithMetadata,
} from "@privy-io/react-auth";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import WalletCard from "./WalletCard";

const Wallets = () => {
  const { ready, authenticated, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const { linkedWallets } = useLinkedWallets();

  const allWallets = useMemo(() => {
    const isPrivyWallet = (w: ConnectedWallet | WalletWithMetadata) =>
      w.walletClientType === "privy";
    const isUnlinkedWallet = (wallet: ConnectedWallet) => {
      return linkedWallets.find((w) => w.address !== wallet.address);
    };
    const privyWallet = wallets.find(isPrivyWallet);
    const unlinkedWallets = wallets.filter(
      (w) => isUnlinkedWallet(w) && !isPrivyWallet(w),
    );
    return [
      privyWallet,
      ...unlinkedWallets,
      ...linkedWallets.filter((w) => !isPrivyWallet(w)),
    ];
  }, [wallets, linkedWallets]);

  return (
    <div>
      <div className="mb-5 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {allWallets?.map((wallet, i) => {
          if (!wallet) return null;
          return <WalletCard key={i} wallet={wallet} />;
        })}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={connectWallet}
          disabled={!(ready && authenticated)}
        >
          <PlusIcon size={16} /> Add wallet
        </Button>
      </div>
    </div>
  );
};
export default Wallets;
