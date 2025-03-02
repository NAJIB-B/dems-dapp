import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

export type DepositSOLParams = {
	seed: BN;
	amount: BN;
	estatePda: PublicKey;
  };

  export type CreatePollParams = {
	description: string;
	amount: BN;
	estatePda: PublicKey;
  };

  export type CastVoteParams = {
	seed: BN;
	vote: boolean;
	estatePda: PublicKey;
	pollPda: PublicKey;
	pollCreator: PublicKey;
  };