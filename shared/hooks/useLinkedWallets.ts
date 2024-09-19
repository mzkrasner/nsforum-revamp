import { usePrivy } from "@privy-io/react-auth";

const useLinkedWallets = () => {
  const { user } = usePrivy();
  const linkedWallets =
    user?.linkedAccounts.filter((acct) => acct.type === "wallet") || [];
  return {
    linkedWallets,
  };
};

export default useLinkedWallets;
