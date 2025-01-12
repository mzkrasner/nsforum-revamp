"use client";

import { env } from "@/env";
import { ethers } from "ethers";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface GovernanceOperationsParameters {
  proposalLifetime: string;
  quorum: string;
  voteLockTime: string;
  proposeLockTime: string;
  voteChangeTime: string;
  voteChangeCutOff: string;
  opThreshold: string;
  maxVotingStreak: string | null;
}

const walletAddress = "0x1234567890...";
const sciManagerAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getLockedSci",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const govOpsAbi = [
  {
    inputs: [],
    name: "getGovernanceParameters",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "proposalLifetime",
            type: "uint256",
          },
          { internalType: "uint256", name: "quorum", type: "uint256" },
          { internalType: "uint256", name: "voteLockTime", type: "uint256" },
          { internalType: "uint256", name: "proposeLockTime", type: "uint256" },
          { internalType: "uint256", name: "voteChangeTime", type: "uint256" },
          {
            internalType: "uint256",
            name: "voteChangeCutOff",
            type: "uint256",
          },
          { internalType: "uint256", name: "opThreshold", type: "uint256" },
          { internalType: "uint256", name: "maxVotingStreak", type: "uint256" },
        ],
        internalType: "struct GovernorOperations.GovernanceParameters",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const useLockedSciBalance = (sciManager: string | undefined) => {
  const [lockedSciBalance, setLockedSciBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  const provider = useMemo(
    () => new ethers.JsonRpcProvider(env.NEXT_PUBLIC_RPC_URL),
    [],
  );

  const sciManagerContract = useMemo(
    () =>
      provider && sciManager
        ? new ethers.Contract(sciManager, sciManagerAbi, provider)
        : null,
    [provider, sciManager],
  );

  const fetchLockedSciBalance = useCallback(async () => {
    if (!walletAddress || !sciManagerContract) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await sciManagerContract.getLockedSci(walletAddress);
      const balance = ethers.formatEther(result);
      setLockedSciBalance(balance);
    } catch (error) {
      console.error("Error fetching locked SCI balance:", error);
    } finally {
      setLoading(false);
    }
  }, [sciManagerContract]);

  useEffect(() => {
    fetchLockedSciBalance();
  }, [fetchLockedSciBalance]);

  return { lockedSciBalance, loading };
};

const getNetworkInfo = () => ({
  chainId: 84532,
  sciManager: "0xd0eFd83eD3F0519eF4fAfde4C3ACD84353f3d97b",
  governorOperations: "0xD6cB2848F4c4504051915a401BB80ba32f5692f8",
});

const safeBigNumberToString = (
  value: ethers.BigNumberish,
  formatEther = false,
) => (formatEther ? ethers.formatEther(value).toString() : value.toString());

const getGovernanceOperationsParameters = async (abi: any, address: string) => {
  const provider = new ethers.JsonRpcProvider(env.NEXT_PUBLIC_RPC_URL);

  try {
    const contract = new ethers.Contract(address, abi, provider);
    const params = await contract.getGovernanceParameters();

    return {
      proposalLifetime: safeBigNumberToString(params.proposalLifetime),
      quorum: safeBigNumberToString(params.quorum, true),
      voteLockTime: safeBigNumberToString(params.voteLockTime),
      proposeLockTime: safeBigNumberToString(params.proposeLockTime),
      voteChangeTime: safeBigNumberToString(params.voteChangeTime),
      voteChangeCutOff: safeBigNumberToString(params.voteChangeCutOff),
      opThreshold: safeBigNumberToString(params.opThreshold, true),
      maxVotingStreak: safeBigNumberToString(params.maxVotingStreak),
    };
  } catch (error) {
    console.error("Error getting governance operations parameters:", error);
    return null;
  }
};

export const checkAddressLockThreshold = async (
  address: string,
): Promise<boolean> => {
  const provider = new ethers.JsonRpcProvider(env.NEXT_PUBLIC_RPC_URL);
  const sciManagerContract = new ethers.Contract(
    "0xd0eFd83eD3F0519eF4fAfde4C3ACD84353f3d97b",
    sciManagerAbi,
    provider,
  );

  try {
    const lockedSci = await sciManagerContract.getLockedSci(address);
    const lockedSciValue = Number(ethers.formatEther(lockedSci));
    const requiredThreshold = Number("5000");
    return lockedSciValue >= requiredThreshold;
  } catch (error) {
    console.error("Error checking address lock threshold:", error);
    return false;
  }
};

type Props = { checkWalletAddress?: string } & PropsWithChildren;

export default function SciLockThresholdCheck({
  children,
  checkWalletAddress,
}: Props) {
  const [thresholdError, setThresholdError] = useState("");
  const [thresholdReached, setThresholdReached] = useState(false);
  const [governanceParams, setGovernanceParams] =
    useState<GovernanceOperationsParameters>();
  const [isLoadingParams, setIsLoadingParams] = useState(false);

  const networkInfo = getNetworkInfo();
  const { lockedSciBalance } = useLockedSciBalance(networkInfo?.sciManager);

  useEffect(() => {
    if (networkInfo) {
      const fetchParams = async () => {
        try {
          setIsLoadingParams(true);
          const params = await getGovernanceOperationsParameters(
            govOpsAbi,
            networkInfo.governorOperations,
          );
          if (params) setGovernanceParams(params);
        } catch (error) {
          console.error("Error fetching governance parameters:", error);
        } finally {
          setIsLoadingParams(false);
        }
      };

      fetchParams();
    }
  }, [networkInfo]);

  const checkThreshold = useCallback(() => {
    const lockingThreshold = governanceParams?.opThreshold;

    if (lockingThreshold && lockedSciBalance) {
      const lockedSciValue = Number(lockedSciBalance);
      const threshold = Number(lockingThreshold);

      if (lockedSciValue < threshold) {
        const deficit = threshold - lockedSciValue;
        setThresholdError(
          `Insufficient SCI locked. Lock ${deficit} more SCI tokens to create proposals.`,
        );
        setThresholdReached(false);
      } else {
        setThresholdError("");
        setThresholdReached(true);
      }
    }
  }, [lockedSciBalance, governanceParams?.opThreshold]);

  useEffect(() => {
    if (checkWalletAddress && lockedSciBalance) {
      checkThreshold();
    }
  }, [lockedSciBalance, checkThreshold, checkWalletAddress]);

  return (
    <div>
      {thresholdReached ? (
        children
      ) : (
        <p className="mx-auto">{thresholdError}</p>
      )}
    </div>
  );
}
