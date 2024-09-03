import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { VERIFIABLE_WALLET_TYPES } from "@/shared/constants";
import useLinkedWallets from "@/shared/hooks/useLinkedWallets";
import { cn, shortenAddress } from "@/shared/lib/utils";
import { ConnectedWallet, WalletWithMetadata } from "@privy-io/react-auth";
import { capitalize } from "lodash-es";

type Props = {
  wallet: ConnectedWallet | WalletWithMetadata;
};
const WalletCard = ({ wallet }: Props) => {
  const { linkedWallets } = useLinkedWallets();
  const { walletClientType, address } = wallet;
  const isValid =
    !!walletClientType && !VERIFIABLE_WALLET_TYPES.includes(walletClientType);
  const isDefault = walletClientType === "privy";
  const name = capitalize(walletClientType?.replaceAll("_", " "));
  const isLinked = !!linkedWallets.find((wallet) => wallet.address === address);

  return (
    <Card
      className={cn("w-full cursor-pointer p-1", {
        "pointer-events-none opacity-50": isValid,
        "cursor-default border-neutral-500 bg-neutral-50": isLinked,
      })}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-10 p-1 text-xs">
        <span>
          {name} {isDefault ? " (default)" : ""}
        </span>
        {!isDefault &&
          (isLinked ? (
            <Badge variant="secondary" className="!m-0">
              Linked
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="!m-0 h-5 rounded-full text-xs"
              onClick={() => (wallet as ConnectedWallet).loginOrLink?.()}
            >
              Link wallet
            </Button>
          ))}
      </CardHeader>
      <CardContent className="p-1 text-sm">
        {shortenAddress(address, 8, 8)}
      </CardContent>
    </Card>
  );
};
export default WalletCard;
