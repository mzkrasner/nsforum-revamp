import { ComposeClient } from "@composedb/client";

import { definition } from "../src/__generated__/definition.js";

export default async function getAttestationsReceived(account) {

  //instantiate a composeDB client instance
  const composeClient = new ComposeClient({
    ceramic: "https://ceramic-arcanumsci-mainnet.hirenodes.io/",
    definition,
  });

  try {
    const data = await composeClient.executeQuery(`
            query {
              accountAttestationIndex(filters: 
          {
            where: {
              recipient: { 
                    equalTo: "${account}"
                  } 
            }
          }
          first: 100) {
            edges {
              node {
                    id
                    uid
                    schema
                    attester
                    verifyingContract 
                    easVersion
                    version 
                    chainId 
                    types{
                      name
                      type
                    }
                    r
                    s
                    v
                    recipient
                    refUID
                    data
                    time
                }
              }
            }
          }
      `);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
