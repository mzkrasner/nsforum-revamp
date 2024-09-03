"use client";

import { Button } from "@/shared/components/ui/button";
import { SiX } from "@icons-pack/react-simple-icons";
import { useLinkAccount } from "@privy-io/react-auth";

const Verification = () => {
  const { linkTwitter } = useLinkAccount();

  return (
    <Button variant="outline" className="w-fit gap-2.5" onClick={linkTwitter}>
      {/* <a
            target="_blank"
            href={`https://silksecure.net/holonym/diff-wallet/phone/issuance/prereqs`}
          > */}
      <SiX size={16} />
      Verify with X{/* </a> */}
    </Button>
  );
};
export default Verification;
