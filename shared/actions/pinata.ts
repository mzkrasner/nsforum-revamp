"use server";

import { env } from "@/env";
import { PinataSDK } from "pinata";
import { v4 as uuidv4 } from "uuid";

const pinata = new PinataSDK({
  pinataJwt: `${env.PINATA_JWT}`,
  pinataGateway: `${env.NEXT_PUBLIC_GATEWAY_URL}`,
});

const getKey = async () => {
  try {
    const uuid = uuidv4();
    const keyData = await pinata.keys.create({
      keyName: uuid.toString(),
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
          },
        },
      },
      maxUses: 1,
    });
    return keyData.JWT;
  } catch (error) {
    return null;
  }
};

export const uploadToPinata = async (formData: FormData) => {
  const file = formData.get("file") as File;
  if (!file) return null;

  const key = await getKey();
  if (!key) return null;

  const upload = await pinata.upload.file(file).key(key);
  const cid = upload.IpfsHash;
  return cid;
};
