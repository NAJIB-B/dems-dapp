"use client"
import React, { useState } from "react";
import dynamic from "next/dynamic";
import para from "../../client/para"; // or wherever your para instance is exported
import { OAuthMethod } from "@getpara/react-sdk";
import "@getpara/react-sdk/styles.css";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider } from '@coral-xyz/anchor'
import { useWallet } from "@solana/wallet-adapter-react";
import {
	AnchorWallet,

  } from '@solana/wallet-adapter-react'


// Dynamically import the ParaModal to avoid SSR issues
const Modal = dynamic(() => import("@getpara/react-sdk").then((mod) => mod.ParaModal), { ssr: false });

function ParaModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Sign in with Para</button>

	  <Modal
  para={para}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  logo={""}
  theme={{}}
  oAuthMethods={[OAuthMethod.GOOGLE,OAuthMethod.TWITTER]}
  disableEmailLogin
  disablePhoneLogin
  authLayout={["AUTH:FULL","EXTERNAL:FULL"]}
  externalWallets={["PHANTOM","BACKPACK","GLOW"]}
  recoverySecretStepEnabled
  onRampTestMode={true}
/>
    </div>
  );
}




export default ParaModal;