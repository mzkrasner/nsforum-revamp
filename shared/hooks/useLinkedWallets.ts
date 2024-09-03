import { usePrivy } from "@privy-io/react-auth";

const useLinkedWallets = () => {
  const { ready, authenticated, user } = usePrivy();
  const linkedWallets =
    (ready &&
      authenticated &&
      user?.linkedAccounts.filter((acct) => acct.type === "wallet")) ||
    [];
  return {
    linkedWallets,
  };
};

export default useLinkedWallets;
