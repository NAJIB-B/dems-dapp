"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import para from "../../client/para"; // or wherever your para instance is exported
import { OAuthMethod } from "@getpara/react-sdk";
import "@getpara/react-sdk/styles.css";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWallet as paraWallet } from '@getpara/react-sdk'
import { AnchorWallet } from "@solana/wallet-adapter-react";

// Dynamically import the ParaModal to avoid SSR issues
const Modal = dynamic(
  () => import("@getpara/react-sdk").then((mod) => mod.ParaModal),
  { ssr: false }
);

function ParaModal() {
  const [isOpen, setIsOpen] = useState(false);
//   const { wallet, publicKey } = useWallet();
  const {data, isSuccess} = paraWallet();



  return (
    <div>
      {isSuccess && data? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          View wallet
        </button>
      ) : (
        <button 
		className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
		onClick={() => setIsOpen(true)}>Sign in with Para</button>
      )}

      <Modal
        para={para}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        logo={""}
        theme={{}}
        oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER]}
        disableEmailLogin
        disablePhoneLogin
        authLayout={["AUTH:FULL", "EXTERNAL:FULL"]}
        externalWallets={["PHANTOM", "BACKPACK", "GLOW"]}
        recoverySecretStepEnabled
        onRampTestMode={true}
      />
    </div>
  );
}

export default ParaModal;
