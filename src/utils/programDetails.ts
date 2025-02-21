// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import DemsIDL from "./demsIdl.json";
import type { DecentralizedEstateManagementSystem } from "./types/dems";

// Re-export the generated IDL and type
export { DecentralizedEstateManagementSystem, DemsIDL };

// The programId is imported from the program IDL.
export const DEMS_PROGRAM_ID = new PublicKey(DemsIDL.address);

// This is a helper function to get the Counter Anchor program.
export function getDemsProgram(
  provider: any,
  address?: PublicKey
) {
  return new Program(
    {
      ...DemsIDL,
    } as DecentralizedEstateManagementSystem,
    provider
  );
}

	
	

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getDemsProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
    case "mainnet-beta":
    default:
      return DEMS_PROGRAM_ID;
  }
}
