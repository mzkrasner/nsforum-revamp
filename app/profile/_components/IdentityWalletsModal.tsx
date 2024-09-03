import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  VERIFIABLE_WALLET_TYPES,
  VERIFICATION_METHODS,
} from "@/shared/constants";
import useAuth from "@/shared/hooks/useAuth";
import useLinkedWallets from "@/shared/hooks/useLinkedWallets";
import useVerification from "@/shared/hooks/useVerification";
import { cn, shortenAddress } from "@/shared/lib/utils";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { capitalize } from "lodash-es";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Method = (typeof VERIFICATION_METHODS)[number] | null;
type Props = {
  method?: Method;
  setMethod: (method: Method) => void;
};
const IdentityWalletsModal = ({ method, setMethod }: Props) => {
  const [open, setOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const { linkedWallets } = useLinkedWallets();
  const { wallets } = useWallets();
  const { ready, authenticated, connectWallet } = usePrivy();
  const { verified } = useVerification();
  const { isLoggedIn } = useAuth();

  // Link a new address when it is connected
  // const lastConnectedWallet = wallets.length ? wallets[0] : undefined;
  // useEffect(() => {
  //   if (!isLoggedIn || !lastConnectedWallet || isConnecting) return;

  //   const isConnected = linkedWallets.find(
  //     (wallet) => wallet.address === lastConnectedWallet?.address,
  //   );
  //   if (isConnected) return;

  //   console.log("Last connected waller: ", lastConnectedWallet?.address);
  //   console.log(
  //     "Wakkets: ",
  //     linkedWallets.map((w) => w.address),
  //   );
  //   console.log("Conn: ", isConnected);

  //   const connect = async () => {
  //     console.log("connecting");
  //     setIsConnecting(true);
  //     await lastConnectedWallet.loginOrLink();
  //     setIsConnecting(false);
  //     console.log("done connecting");
  //   };

  //   if (lastConnectedWallet && !isConnected) {
  //     console.log("Login or link");
  //     connect();
  //   }
  // }, [
  //   lastConnectedWallet,
  //   linkedWallets,
  //   isLoggedIn,
  //   isConnecting,
  //   setIsConnecting,
  // ]);

  useEffect(() => {
    if (method && !open) setOpen(true);
  }, [method, open, setOpen]);

  const disabled = !(ready && authenticated);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        !open && setMethod(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify with {method}</DialogTitle>
          <DialogDescription>
            Select or add a wallet, and use it in the verification process,
            supported wallets are: MetaMask, Coinbase and Rainbow.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-wrap gap-2">
          {linkedWallets.map((wallet, i) => {
            const { walletClientType, address } = wallet;
            const isValid =
              walletClientType &&
              VERIFIABLE_WALLET_TYPES.includes(walletClientType);
            const isSelected = address === selectedAddress;
            const name = capitalize(walletClientType?.replaceAll("_", " "));
            return (
              <Card
                key={i}
                className={cn(
                  "cursor-pointer p-1 hover:border-neutral-500 hover:bg-neutral-50",
                  {
                    "border-neutral-500 bg-neutral-50": isSelected,
                    "pointer-events-none opacity-50": !isValid,
                  },
                )}
                onClick={() => setSelectedAddress(address)}
              >
                <CardHeader className="p-1 text-xs">{name}</CardHeader>
                <CardContent className="p-1 text-sm">
                  {shortenAddress(address, 8, 8)}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            className="w-fit gap-2"
            onClick={connectWallet}
            disabled={disabled}
          >
            <PlusIcon size={16} /> Add wallet
          </Button>
          <Button
            className="w-fit gap-2"
            disabled={disabled}
            asChild={!disabled}
          >
            <a
              target="_blank"
              href={`https://silksecure.net/holonym/diff-wallet/${method}/issuance/prereqs`}
            >
              Verify
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default IdentityWalletsModal;
