"use client";

import dynamic from "next/dynamic";
import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode, useCallback, useMemo } from "react";
import {
	backpackWallet,
	ParaSolanaProvider,
	glowWallet,
	phantomWallet,
  } from "@getpara/solana-wallet-connectors";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
	const solanaNetwork = WalletAdapterNetwork.Devnet;
	const endpoint = clusterApiUrl(solanaNetwork);
	// const endpoint = "https://devnet.helius-rpc.com/?api-key=1ee96ef1-ec76-4ae4-bfc1-35cecd254408"
  
	const onError = useCallback((error: WalletError) => {
	  console.error(error);

  }, []);

  return (
    <ParaSolanaProvider
    endpoint={endpoint}
      wallets={[glowWallet, phantomWallet, backpackWallet]}
      chain={"solana:devnet"}
      appIdentity={{
        name: "Your App Name",
        uri: `http://localhost:3000`,
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
	  </ParaSolanaProvider>
 
  );
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}
