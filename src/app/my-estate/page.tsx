"use client";
import { api } from "@/trpc/react";
import { useAnchorProvider } from "@/app/solanaProvider";

import { useWallet } from "@solana/wallet-adapter-react";

import React, { useState } from "react";

const EstatePage = () => {
  const { wallet } = useWallet();
  const provider = useAnchorProvider();

  const {data, isLoading, isError} = api.dems.findUserEstate.useQuery({
    publicKey: provider?.publicKey?.toBase58(),
  });


  console.log(data)





  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      {/* Estate Details */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🏠 {data?.estate.name}</h1>
      <div className="mb-6 text-gray-600">
        <p>
          <strong>Vault Balance:</strong> {data?.estate.vaultBalance} SOL
        </p>
        <p>
          <strong>Number of Residents:</strong>  {data?.estate.members.length}
        </p>
        <p>
          <strong>Leader:</strong>{" "}
          <span className="block text-sm text-gray-500 break-all">
          {data?.estate.leader}
          </span>
        </p>
      </div>

      {/* Create Poll Button */}
      <button className="w-full mb-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Create Poll
      </button>

      {/* Vault & Residents Info */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg flex justify-between">
        <p>
          <strong>Vault Balance:</strong> {data?.estate.vaultBalance} SOL
        </p>
        <p>
          <strong>Residents:</strong> 2
        </p>
      </div>

      {/* Poll Section */}
      <h2 className="text-xl font-semibold text-gray-700 mb-3">
        📢 Active Polls
      </h2>
      <div className="space-y-4">
        {data?.estate?.polls?.length! > 0 ? (
          data?.estate.polls.map((poll) => (
            <div key={poll.id} className="p-4 border rounded-lg shadow">
              <p className="text-gray-800 font-medium">{poll.question}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Votes: {poll.agreeVotes + poll.disagreeVotes}</span>
                <button
                //   onClick={() => handleVote(poll.id)}
                  className="px-4 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                  Vote
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active polls.</p>
        )}
      </div>
    </div>
  );
};

export default EstatePage;
