"use client";

import Header from "@/app/components/header/Header";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http, pubKeyToAddress } from "viem";
import handshakeABI from "./Handshake.json";
import { createWalletClient, custom } from "viem";
import { approveToken } from "@/app/quickaccess/ApproveTokens";
import { parseUnits, parseEther } from "viem";

const publicClient = createPublicClient({
  chain: {
    id: 1029, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://pre-rpc.bittorrentchain.io/", // BTTC Donau testnet RPC URL
    },
  },
  transport: http("https://pre-rpc.bittorrentchain.io/"), // Passing RPC URL to http function
});
const walletClient = createWalletClient({
  chain: {
    id: 1029, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://pre-rpc.bittorrentchain.io/",
      websocket: "https://pre-rpc.bittorrentchain.io/", // WebSocket URL (optional)
    },
  },
  transport: custom(window.ethereum),
});

export default function TransactionRequestDetails({ params }) {
  const [transaction, setTransaction] = useState();
  const { address, isConnected } = useAccount();
  const [buttonName, setbuttonName] = useState("");
  let activeTab = params?.activeTab ? params.activeTab : "all";
  console.log(activeTab);

  const executeTransaction = async () => {
    try {
      const TransactionDetails = [
        transaction.TransactionId,
        transaction.senderAddress,
        transaction.receiverAddress,
        transaction.amount,
        transaction.tokenAddress !== ""
          ? transaction.tokenAddress
          : "0x0856Ab13d8BFC644c1096554Bd23779dc42e4cDE",
        transaction.tokenName,
      ];
      let amount = parseUnits(transaction.amount, 18);

      let functionCalled = "";
      if (transaction.tokenAddress === "") {
        functionCalled = "transferNative";
      } else {
        functionCalled = "transferTokens";
        let approve = await approveToken(
          amount,
          transaction.tokenAddress,
          address
        );
      }
      const { request } = await publicClient.simulateContract({
        account: address,
        address: "0x0856Ab13d8BFC644c1096554Bd23779dc42e4cDE",
        abi: handshakeABI,
        functionName: functionCalled,
        args: [
          transaction.senderSignature,
          transaction.receiverSignature,
          TransactionDetails,
        ],
        ...(functionCalled === "transferNative"
          ? { value: parseEther(transaction.amount) }
          : {}),
      });

      const execute = await walletClient.writeContract(request);
      const currentDate = new Date();

      if (execute) {
        const userData = {
          TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
          status: "completed",
          transectionDate: currentDate,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}api/payment-completed`,
            {
              method: "PUT",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json", // This header is crucial for sending JSON data
              },
            }
          );
          const response = await result.json();
          // console.log(response.message);
        } catch (error) {
          console.error("Error signing transaction:", error);
          // throw error;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const signTransaction = async () => {
    try {
      const client = createWalletClient({
        chain: {
          id: 1029, // BTTC Donau testnet chain ID
          rpcUrls: {
            public: "https://pre-rpc.bittorrentchain.io/",
            websocket: "https://pre-rpc.bittorrentchain.io/", // WebSocket URL (optional)
          },
        },
        transport: custom(window.ethereum),
      });

      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "HandshakeTokenTransfer",
          version: "1",
          chainId: "1029",
          verifyingContract: "0x0856Ab13d8BFC644c1096554Bd23779dc42e4cDE",
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          signByReceiver: [
            { name: "id", type: "uint256" },
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "tokenName", type: "string" },
          ],
        },
        primaryType: "signByReceiver",
        message: {
          id: transaction.TransactionId,
          sender: transaction.senderAddress,
          receiver: transaction.receiverAddress,
          amount: transaction.amount,
          tokenName: transaction.tokenName,
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
          receiverSignature: signature,
          status: "approved",
          approveDate: currentDate,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}api/store-transaction`,
            {
              method: "PUT",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json", // This header is crucial for sending JSON data
              },
            }
          );
          const response = await result.json();
          // console.log(response.message);
        } catch (error) {
          console.error("Error signing transaction:", error);
          // throw error;
        }
      }
    } catch (error) {
      console.error("Error signing transaction:", error);
      // throw error;
    }
  };

  useEffect(() => {
    if (address) {
      const fetchTransactions = async () => {
        const url = `/api/fetch-transaction?address=${address}&type=${activeTab}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
          if (data) {
            console.log(params?.id);
            let id = params?.id ? params.id : 0;
            // console.log(transaction);
            const transactions = data.find(
              (transaction) => transaction.TransactionId == id
            );
            console.log(transactions, activeTab);
            if (
              transactions.status === "approved" &&
              transactions.receiverSignature !== "" &&
              transactions.senderSignature !== "" &&
              activeTab === "initiated"
            ) {
              setbuttonName("Execute Transaction");
            } else if (
              transactions.status === "inititated" &&
              transactions.senderSignature !== "" &&
              transactions.receiverSignature === "" &&
              activeTab === "received"
            ) {
              setbuttonName("Sign Transaction");
            }

            setTransaction(transactions);
            if (!transactions) {
              // Handle case when transaction is not found
              return <div>Transaction not found</div>;
            }
          }
        } catch (error) {
          console.error("Failed to fetch transaction:", error);
        }
      };
      fetchTransactions();
    }
  }, [address]);

  return (
    <>
      <Header />
      <div className="container-parent">
        <h1 className="reqheader">Transaction Details</h1>
        <div className="container">
          <div className="modal-content2">
            <div className="my-6 flex flex-col item-center justify-center w-full">
              <div className="w-full inputParent">
                <label>ID:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.TransactionId}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Sender:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.senderAddress}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Receiver:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.receiverAddress}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Token:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.tokenName}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Amount:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.amount}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Date:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.initiateDate}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                {buttonName === "Sign Transaction" ? (
                  <button
                    className="approveBtn"
                    onClick={() => signTransaction()}
                  >
                    {buttonName}
                  </button>
                ) : buttonName === "Execute Transaction" ? (
                  <button
                    className="approveBtn"
                    onClick={() => executeTransaction()}
                  >
                    {buttonName}
                  </button>
                ) : null}
              </div>
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>
      </div>
    </>
  );
}
