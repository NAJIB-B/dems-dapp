"use client";
import { api } from "@/trpc/react";
import { useAnchorProvider } from "@/app/solanaProvider";

import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "bn.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import React, { SetStateAction, useEffect, useState } from "react";
import {
  useDemsProgramAccount,
  useDemsProgram,
} from "@/components/dems/dems-data-access";
import { PublicKey } from "@solana/web3.js";
import { DepositSOLParams, CreatePollParams } from "@/types";
import Spinner from "@/components/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgramAccount, BN as ABN } from "@coral-xyz/anchor";

const EstatePage = () => {
  const { wallet } = useWallet();
  const provider = useAnchorProvider();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } =
    api.dems.findUserEstate.useQuery(
      provider.publicKey && { publicKey: provider.publicKey.toBase58() },
      { enabled: !!provider.publicKey }
    );

  // Compute estateKey safely
  const estateKey = data?.estate?.id ? new PublicKey(data.estate.id) : null;

  // Pass either estateKey or provider.publicKey
  const { depositSol, createPoll, castAVote } = useDemsProgramAccount({
    account: estateKey || provider?.publicKey,
  });

  const { transactions } = useDemsProgram();

  console.log("transaction",transactions.data)

  const [filteredTransactions, setFilteredTransactions] = useState<
    ProgramAccount<{
      estate: PublicKey;
      bump: number;
      timestamp: ABN;
      isDeposit: boolean;
      amount: ABN;
      from: PublicKey;
      to: PublicKey;
    }>[]
  >([]);

  useEffect(() => {
	console.log("came here")
	console.log("estate key", estateKey)
    if (estateKey) {
      const newArray = transactions.data
        ?.filter((tx) => tx.account.estate.toBase58() == estateKey.toBase58())
        .sort(
          (a, b) =>
            a.account.timestamp.toNumber() - b.account.timestamp.toNumber()
        );
		console.log("new ", newArray)
      setFilteredTransactions(newArray!);
    }
  }, [transactions.data]);



  const [amount, setAmount] = useState("");
  const [pollAmount, setPollAmount] = useState("");
  const [question, setQuestion] = useState("");

  const handleSetAmount = (e: {
    preventDefault: any;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();

    setAmount(e.target.value);
  };
  const handleSetPollAmount = (e: {
    preventDefault: any;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();

    setPollAmount(e.target.value);
  };

  const handleSetQuestion = (e: {
    preventDefault: any;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();

    setQuestion(e.target.value);
  };

  const pollAmountBN = new BN(+pollAmount * LAMPORTS_PER_SOL);

  const generateSeed = () => {
    const randomArray = new Uint8Array(8);
    window.crypto.getRandomValues(randomArray);
    return new BN(Buffer.from(randomArray));
  };

  const seed = generateSeed();
  const depositAmount = new BN(+amount * LAMPORTS_PER_SOL);

  if (isLoading) {
    return <Spinner></Spinner>;
  }
  return (
    <div className="w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 flex gap-6">
      <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
        {/* Estate Details */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🏠 {data?.estate.name}
        </h1>
        <div className="mb-6 text-gray-600">
          <p>
            <strong>Vault Balance:</strong>{" "}
            {data?.estate.vaultBalance! / LAMPORTS_PER_SOL} SOL
          </p>
          <p>
            <strong>Number of Residents:</strong> {data?.estate.members.length}
          </p>
          <p>
            <strong>Leader:</strong>{" "}
            <span className="text-sm text-gray-500 break-all">
              {data?.estate.leader}
            </span>
          </p>
          <p>
            <strong>Estate Key:</strong>{" "}
            <span className="text-sm text-gray-500 break-all">
              {data?.estate.id}
            </span>
          </p>
        </div>

        <label className="block py-2 font-mono font-semibold">Amount</label>
        <input
          type="text"
          onChange={handleSetAmount}
          value={amount}
          min={1}
          className="w-full mb-6 px-6 py-2  font-semibold rounded-lg shadow-md transition duration-300 border border-black"
          required
        />
        {estateKey ? (
          <button
            onClick={() => {
              depositSol.mutate(
                {
                  seed: seed,
                  amount: depositAmount,
                  estatePda: estateKey,
                },
                {
                  onSuccess: () => {
                    refetch();
                  },
                }
              );
              setAmount("");
            }}
            className="w-full mb-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Deposit SOL
          </button>
        ) : (
          ""
        )}

        {/* Create Poll Button */}
        <label className="block py-2 font-mono font-semibold">Question</label>
        <input
          type="text"
          onChange={handleSetQuestion}
          value={question}
          className="w-full mb-6 px-6 py-2  font-semibold rounded-lg shadow-md transition duration-300 border border-black"
          required
        />
        <label className="block py-2 font-mono font-semibold">Amount</label>
        <input
          type="text"
          onChange={handleSetPollAmount}
          value={pollAmount}
          min={1}
          className="w-full mb-6 px-6 py-2  font-semibold rounded-lg shadow-md transition duration-300 border border-black"
          required
        />
        {estateKey ? (
          <button
            onClick={() => {
              createPoll.mutate(
                {
                  description: question,
                  amount: pollAmountBN,
                  estatePda: estateKey,
                },
                {
                  onSuccess: () => {
                    refetch();
                  },
                }
              );
              setPollAmount("");
              setQuestion("");
            }}
            className="w-full mb-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Create Poll
          </button>
        ) : (
          ""
        )}

        {/* Vault & Residents Info */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg flex justify-between">
          <p>
            <strong>Vault Balance:</strong>{" "}
            {data?.estate.vaultBalance! / LAMPORTS_PER_SOL} SOL
          </p>
          <p>
            <strong>Residents:</strong> {data?.estate.members.length}
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
                <p className="text-gray-800 font-bold text-2xl">
                  {poll.question}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">
                    Votes: {poll.agreeVotes + poll.disagreeVotes}
                  </span>
                  <div className="flex flex-row gap-6">
                    {poll.closed ? (
                      <span className="text-gray-800 font-bold text-2xl">
                        {" "}
                        Poll has been finalized
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            castAVote.mutate(
                              {
                                seed,
                                vote: true,
                                estatePda: estateKey!,
                                pollPda: new PublicKey(poll.id),
                                pollCreator: new PublicKey(poll.pollCreator),
                              },
                              {
                                onSuccess: () => {
                                  refetch();
                                },
                              }
                            )
                          }
                          className="px-4 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                        >
                          Agree
                        </button>
                        <button
                          onClick={() =>
                            castAVote.mutate(
                              {
                                seed,
                                vote: false,
                                estatePda: estateKey!,
                                pollPda: new PublicKey(poll.id),
                                pollCreator: new PublicKey(poll.pollCreator),
                              },
                              {
                                onSuccess: () => {
                                  refetch();
                                },
                              }
                            )
                          }
                          className="px-4 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                        >
                          Disagree
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No active polls.</p>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="w-1/3 p-6 bg-gray-100 shadow-lg rounded-lg overflow-y-auto h-[500px]">
        <h2 className="text-xl font-semibold mb-3">💰 Recent Transactions</h2>
        {filteredTransactions.length ? (
          filteredTransactions.map((tx, index) => (
            <div key={index} className="p-3 border-b">
              <p><strong>{tx.account.isDeposit ? "Deposit" : "Withdraw"}:</strong> {+tx.account.amount / LAMPORTS_PER_SOL} SOL</p>
              <p className="text-sm text-gray-500">{new Date(tx.account.timestamp.toNumber() * 1000).toLocaleString()}</p>
			  <p className="text-sm text-gray-700 font-medium">
                  From: <span className="text-gray-500">{tx.account.from.toBase58()}</span>
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  To: <span className="text-gray-500">{tx.account.to.toBase58()}</span>
                </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent transactions.</p>
        )}
      </div>
    </div>
  );
};

export default EstatePage;
