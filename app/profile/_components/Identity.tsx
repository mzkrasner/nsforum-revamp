"use client";

import { VERIFICATION_METHODS } from "@/shared/constants";
import { useState } from "react";
import IdentityWalletsModal from "./IdentityWalletsModal";
import Verify from "./VerifyWith";
import Wallets from "./Wallets";

const Identity = () => {
  const [method, setMethod] = useState<
    (typeof VERIFICATION_METHODS)[number] | null
  >(null);

  return (
    <div className="space-y-2">
      <IdentityWalletsModal method={method} setMethod={setMethod} />
      <h3>Wallets</h3>
      <div className="mb-3">
        <Wallets />
      </div>
      <h3>Verify with</h3>
      <Verify method={method} setMethod={setMethod} />
    </div>
  );
};
export default Identity;
