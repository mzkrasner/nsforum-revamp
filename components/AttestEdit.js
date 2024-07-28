import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useOrbis } from "@orbisclub/components";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import TextareaAutosize from "react-textarea-autosize";
import { shortAddress } from "../utils";
import { CUSTOM_SCHEMAS, EASContractAddress } from "../utils/utils";

const AttestEditor = ({ context }) => {
  const eas = new EAS(EASContractAddress);
  const { orbis, user, credentials } = useOrbis();
  const [unique, setIsUnique] = useState(0);
  const [checked, setChecked] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [attestations, setAttestations] = useState([]);
  const textareaRef = useRef();

  /** Will load the details of the context and check if user has access to it  */
  useEffect(() => {
    if (user) {
      async function checkHolo(address) {
        const resp = await fetch(
          `https://api.holonym.io/sybil-resistance/phone/optimism?user=${address}&action-id=123456789`,
        );
        const { result: isUnique } = await resp.json();
        if (isUnique) {
          setIsUnique(1);
        } else {
          setIsUnique(2);
        }
      }

      checkHolo(user.metadata.address);
    }
    setChecked(true);
    grabAttestations();
  }, [grabAttestations, user]);

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        });
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (error.code === 4902) {
          try {
            // Try to have the user add the chain
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1",
                  rpcUrls: ["https://mainnet.infura.io/v3/"],
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
      }
    }
  };

  async function grabAttestations() {
    const requestBody = {
      account: user.metadata.address.toLowerCase(),
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };
    const gotAttestations = await fetch(
      "/api/getattestations",
      requestOptions,
    ).then((response) => response.json());
    if (gotAttestations.data.accountAttestationIndex === null) {
      console.log(gotAttestations.data);
      return;
    }
    console.log(gotAttestations.data.accountAttestationIndex.edges.length);
    const arr = [];
    for (
      let i = 0;
      i < gotAttestations.data.accountAttestationIndex.edges.length;
      i++
    ) {
      const obj = {
        given:
          gotAttestations.data.accountAttestationIndex.edges[i].node
            .attester === user.metadata.address.toLowerCase()
            ? true
            : false,
        attester:
          gotAttestations.data.accountAttestationIndex.edges[i].node.attester,
        recipient:
          gotAttestations.data.accountAttestationIndex.edges[i].node.recipient,
        id: gotAttestations.data.accountAttestationIndex.edges[i].node.id,
      };

      arr.push(obj);
    }
    setAttestations(arr);
    setLoaded(true);
  }

  async function attest(address) {
    const network = await ethereum.request({ method: "eth_chainId" });
    if (network !== "0x1") {
      await switchNetwork();
    }
    if (!address) {
      alert("Please enter a recipient address");
      setRecipient("");
      return;
    }
    if (address.toLowerCase() === user.metadata.address.toLowerCase()) {
      alert("You cannot attest to yourself");
      setRecipient("");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("address account");
    const encoded = schemaEncoder.encodeData([
      { name: "account", type: "address", value: address },
    ]);
    console.log(window.ethereum);
    const offchain = await eas.getOffchain();
    console.log(offchain);
    const time = Math.floor(Date.now() / 1000);
    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: address.toLowerCase(),
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time,
        revocable: true,
        version: 1,
        nonce: 0,
        schema: CUSTOM_SCHEMAS.ACCOUNT_SCHEMA,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encoded,
      },
      signer,
    );
    // un-comment the below to process an on-chain timestamp
    // const transaction = await eas.timestamp(offchainAttestation.uid);
    // // Optional: Wait for the transaction to be validated
    // await transaction.wait();

    const requestBody = {
      ...offchainAttestation,
      account: user.metadata.address.toLowerCase(),
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };
    // call attest api endpoint to store attestation on ComposeDB
    await fetch("/api/attest", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));

    setRecipient("");
    grabAttestations();
  }

  /** Will update title field */
  const handleAddressChange = (e) => {
    setRecipient(e.target.value);
  };

  return (
    <div className="container mx-auto text-gray-900">
      {checked && (
        <div className="w-full">
          {unique === 1 && (
            <div>
              <TextareaAutosize
                ref={textareaRef}
                className="h-full w-full resize-none rounded-md border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Recipient Eth address here"
                value={recipient}
                onChange={handleAddressChange}
              />
              <button
                className="btn-sm btn-brand py-1.5"
                onClick={() => attest(recipient)}
              >
                Attest
              </button>
              <div className="mt-5 w-full rounded border border-[#619575] bg-white/10 p-6 text-center">
                <p className="text-secondary mb-2 text-base">
                  Current Attestations:
                </p>
                {loaded && attestations.length ? (
                  attestations.map((a, i) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div key={i} className="flex flex-row justify-between">
                        <div className="flex flex-row">
                          <p className="text-secondary mb-2 text-base">
                            {shortAddress(a.attester)}&nbsp;
                          </p>
                          <p className="text-secondary mb-2 text-base">
                            {a.given ? "gave to " : "received from "}&nbsp;
                          </p>
                          <p className="text-secondary mb-2 text-base">
                            {shortAddress(a.recipient)}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <p className="text-secondary mb-2 text-right text-base">
                            <a
                              href={`https://ceramic-arcanumsci-mainnet.hirenodes.io/api/v0/streams/${a.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500"
                            >
                              Proof
                            </a>
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : loaded && !attestations.length ? (
                  <p className="text-secondary mb-2 text-base">
                    No attestations yet
                  </p>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <RotatingLines
                      strokeColor="grey"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="96"
                      visible={true}
                    />{" "}
                  </div>
                )}
              </div>
            </div>
          )}
          {unique === 2 && (
            <div className="w-full rounded border border-[#619575] bg-white/10 p-6 text-center">
              <p className="text-secondary mb-2 text-base">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                You can't create attestations yet. Click the button below and
                create a unique identity using your phone number to get started.
              </p>
              <button
                className="btn-sm btn-brand py-1.5"
                onClick={() =>
                  window.open("https://silksecure.net/holonym/silk")
                }
              >
                Visit Silk
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AttestEditor;
