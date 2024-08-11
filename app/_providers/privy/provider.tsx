import { PrivyProvider } from "@privy-io/react-auth";
import { PropsWithChildren } from "react";
import config from "./config";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const AppPrivyProvider = ({ children }: PropsWithChildren) => {
  if (!PRIVY_APP_ID) return <>{children}</>;
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={config}>
      {children}
    </PrivyProvider>
  );
};
export default AppPrivyProvider;
