"use client";

import React, { useEffect, useRef, useState } from "react";
import "./InitiateTransaction.css";
import { getTokenDetails } from "@/app/quickaccess/getTokenDetails";
import { useAccount } from "wagmi";
import { createPublicClient, formatEther, formatUnits, http } from "viem";
import { createWalletClient, custom } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseUnits, parseEther } from "viem";
import { formSchemaLoadToken, formSchemaTransaction } from "./schema";
import LoadingSpinner from "./LoadingSpinner";
import { Send } from "lucide-react";

const publicClient = createPublicClient({
  chain: {
    id: 199, // BTTC Donau mainnet chain ID
    rpcUrls: {
      public: "https://rpc.bittorrentchain.io",
      websocket: "https://rpc.bittorrentchain.io", // WebSocket URL (optional)
    },
  },
  transport: http("https://rpc.bittorrentchain.io/"), // Passing RPC URL to http function
});

const InitiateTransaction = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingToken, setisLoadingToken] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState();
  const [errorLoadToken, setErrorLoadToken] = useState();
  const [transaction, setTransaction] = useState({
    sender: "",
    receiver: "",
    token: "",
    amount: "",
  });
  const [isERC20, setIsERC20] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [showSavings, setShowSavings] = useState(false);
  const videoRef = useRef(null);

  const defaultTokenDetails = {
    name: "",
    symbol: "",
    decimals: "",
    balance: "",
  };

  const [transactionDetails, setTransactionDetails] = useState({
    tokenToSend: "BTTC",
    amountToSend: "0",
    approxGasFees: "700",
    remainingBalance: "0",
    totalCost: "0",
  });
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  // fetching user balance function
  const [userBTTCBalance, setuserBTTCBalance] = useState(0);

  const fetchUserBalance = async () => {
    const userBTTC = await publicClient.getBalance({
      address: address ? address : "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    });
    console.log("userBTTC", formatEther(userBTTC));
    setuserBTTCBalance(formatEther(userBTTC));
  };

  useEffect(() => {
    fetchUserBalance();
  }, [address]);

  //  Handle sponsored video checkbox
  const handleSponsoredChange = () => {
    setIsSponsored(!isSponsored);
    if (!isSponsored) {
      setIsFetchingVideo(true);
      setTimeout(() => {
        setIsFetchingVideo(false);
        setIsVideoReady(true);
      }, Math.random() * 1000 + 2000); // Random time between 2-3 seconds
    } else {
      setIsVideoReady(false);
      setHasWatchedVideo(false);
      setShowSavings(false);
    }
  };
  const handleVideoEnd = () => {
    setHasWatchedVideo(true);
    setShowSavings(true);
  };

  // Handle onchange event for input fields and update the transaction state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const loadTokenDetails = async () => {
    setErrorDisplay(false);
    const formData = {
      token: transaction.token,
    };

    try {
      formSchemaLoadToken.parse(formData);
      setisLoadingToken(true);
      console.log(transaction.token, address);
      console.log(await getTokenDetails(transaction.token));
      const getToken = await getTokenDetails(transaction.token);
      console.log(getToken);
      if (getToken !== null) {
        setTokenDetails(getToken);
      }
    } catch (err) {
      console.log(err);
      setErrorLoadToken(err.formErrors?.fieldErrors?.token);
      setErrorDisplay(true);
    } finally {
      setisLoadingToken(false);
    }
  };

  useEffect(() => {
    if (!isERC20) {
      setTokenDetails(defaultTokenDetails);
      setTransaction({ ...transaction, ["token"]: "" });
    }
  }, [isERC20]);

  const handleCheckboxChange = () => {
    setIsERC20(!isERC20);
  };

  const signTransaction = async (e) => {
    e.preventDefault();
    // if (transaction.receiver === "" || transaction.amount === "") {
    //   console.log("Please Enter Details");
    //   return;
    // }

    setErrorDisplay(false);

    const formData = {
      receiver: transaction.receiver,
      amount: transaction.amount,
      token: isERC20 ? transaction.token : undefined,
    };

    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }
    // let amount = parseUnits(transaction.amount, tokenDetails.decimals);
    console.log(transaction.amount);

    try {
      formSchemaTransaction.parse(formData);
      setIsLoading(true);
      const client = createWalletClient({
        chain: {
          id: 199, // BTTC Donau mainnet chain ID
          rpcUrls: {
            public: "https://rpc.bittorrentchain.io",
            websocket: "https://rpc.bittorrentchain.io", // WebSocket URL (optional)
          },
        },
        transport: custom(window ? window.ethereum : ""),
      });

      const url = `/api/latest-nonce?address=${address}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      let nonce = parseInt(data.nonce) + 1;
      var amount = transaction.amount;
      if (isERC20) {
        amount = parseUnits(transaction.amount, tokenDetails.decimals);
      } else {
        amount = parseEther(transaction.amount);
      }

      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "HandshakeTokenTransfer",
          version: "1",
          chainId: "199",
          verifyingContract: "0x184e1b0b544Da324e2D37Bb713b9D0c16c9eF671",
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          initiateTransaction: [
            { name: "nonce", type: "uint256" },
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "tokenName", type: "string" },
          ],
        },
        primaryType: "initiateTransaction",
        message: {
          nonce: nonce,
          sender: address,
          receiver: transaction.receiver,
          amount: amount,
          tokenName: tokenDetails.symbol !== "" ? tokenDetails.symbol : "BTTC",
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          senderAddress: address,
          receiverAddress: transaction.receiver,
          amount: amount.toString(),
          tokenAddress: transaction.token,
          senderSignature: signature,
          receiverSignature: "",
          status: "inititated",
          tokenName: tokenDetails.symbol !== "" ? tokenDetails.symbol : "BTTC",
          initiateDate: currentDate,
          decimals: tokenDetails.symbol !== "" ? tokenDetails.decimals : 18,
          nonce: nonce,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(`api/store-transaction`, {
            method: "POST",
            body: JSON.stringify(userData),
          });
          const response = await result.json();
          toast.success("Signed Sucessfully");
          await new Promise((resolve) => setTimeout(resolve, 3000));
          window.location.reload();

          setIsLoading(false);
          onClose();
          // console.log(response.message);
        } catch (error) {
          toast.error("Error while signing");
          setIsLoading(false);
          console.error("Error signing transaction:", error);
          // throw error;
        }
      }
    } catch (err) {
      console.log(err.formErrors ? err.formErrors : err);
      setErrors(err.formErrors?.fieldErrors);
      setErrorDisplay(true);
      console.error("Error signing transaction:", err);

      // throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transaction.receiver || transaction.token || transaction.amount) {
      setErrors({});
      setErrorDisplay(false);
    }

    return () => {
      setErrors({});
      setErrorDisplay(false);
    };
  }, [transaction.receiver, transaction.token, transaction.amount]);

  const updateTransactionDetails = () => {
    const amountToSend = parseFloat(transaction.amount) || 0;
    const gasFees = parseFloat(transactionDetails.approxGasFees);
    const totalCost = amountToSend ? amountToSend : 0 + gasFees;
    console.log("totalCost", totalCost);
    const currentBalance = isERC20
      ? formatEther(tokenDetails.balance) || 0
      : userBTTCBalance; // Assume 100 BTTC for demo
    const remainingBalance = Math.max(currentBalance - totalCost, 0).toFixed(6);

    setTransactionDetails({
      tokenToSend: isERC20 ? tokenDetails.symbol || "ERC20" : "BTTC",
      amountToSend: amountToSend.toFixed(6),
      approxGasFees: gasFees.toFixed(6),
      remainingBalance,
      totalCost: totalCost.toFixed(6),
    });
  };

  useEffect(() => {
    updateTransactionDetails();
  }, [transaction, isERC20, tokenDetails, userBTTCBalance]);

  return (
    <div className="p-2 md:p-8 md:pt-2">
      <h1 className="text-3xl font-bold text-center text-black mb-6 font-dmsans">
        Token Transfer
      </h1>
      <form onSubmit={signTransaction} className="space-y-6">
        <div>
          <label
            htmlFor="receiver"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Receiver Address
          </label>
          <input
            type="text"
            id="receiver"
            name="receiver"
            placeholder="Enter Receiver's Address"
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errorDisplay && errors?.receiver
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={transaction.receiver}
            onChange={handleInputChange}
          />
          {errorDisplay && errors?.receiver && (
            <p className="mt-1 text-sm text-red-500">{errors.receiver}</p>
          )}
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isERC20}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-gray-600"
            />
            <span className="text-gray-700">Send ERC-20 Token</span>
          </label>
        </div>

        {isERC20 && (
          <>
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                placeholder="Enter Token Address"
                className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errorDisplay && errorLoadToken
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={transaction.token}
                onChange={handleInputChange}
              />
              {errorDisplay && errorLoadToken && (
                <p className="mt-1 text-sm text-red-500">{errorLoadToken}</p>
              )}
            </div>
            <button
              onClick={loadTokenDetails}
              type="button"
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                isLoadingToken ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isLoadingToken}
            >
              {isLoadingToken ? "Loading..." : "Load Token"}
            </button>
          </>
        )}

        {transaction.token && tokenDetails.name && (
          <div className="bg-gray-100 p-4 rounded-md space-y-2">
            <p className="text-sm text-gray-600">
              Name:{" "}
              <span className="font-semibold text-gray-800">
                {tokenDetails.name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Symbol:{" "}
              <span className="font-semibold text-gray-800">
                {tokenDetails.symbol}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Total Balance:{" "}
              <span className="font-semibold text-gray-800">
                {tokenDetails.balance
                  ? `${formatUnits(
                      tokenDetails.balance,
                      tokenDetails.decimals
                    )} ${tokenDetails.symbol}`
                  : "N/A"}
              </span>
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            placeholder="Enter Amount"
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errorDisplay && errors?.amount
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={transaction.amount}
            onChange={handleInputChange}
          />
          {errorDisplay && errors?.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md space-y-2">
          <h3 className="font-semibold text-gray-800 mb-2">
            Transaction Details
          </h3>
          <p className="text-sm text-gray-600">
            Token to Send:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.tokenToSend}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Amount to Send:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.amountToSend}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Approx. Gas Fees:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.approxGasFees} BTTC
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Total Cost:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.totalCost} {transactionDetails.tokenToSend}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Remaining Balance:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.remainingBalance}{" "}
              {transactionDetails.tokenToSend}
            </span>
          </p>
        </div>

        <div>
          {isERC20 ? (
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isSponsored}
                onChange={handleSponsoredChange}
                className="form-checkbox h-5 w-5 text-gray-600"
              />
              <span className="text-gray-700">Sponsored Transaction</span>
            </label>
          ) : null}
        </div>

        {isFetchingVideo && (
          <p className="text-sm text-gray-600 animate-pulse">
            Fetching sponsored video...
          </p>
        )}

        {isVideoReady && !hasWatchedVideo && (
          <div className="mt-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sponsored Video
            </label>
            <video
              ref={videoRef}
              className="w-full rounded-md"
              controls
              onEnded={handleVideoEnd}
            >
              <source src="/video/test.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {showSavings && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
            role="alert"
          >
            <p className="font-bold">Savings</p>
            <p>You've saved approximately 700 BTT in gas fees!</p>
            <p>This transaction gas fees will be paid by the Sponsor!</p>
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-[#29FF81] text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${
            isLoading || (isSponsored && !hasWatchedVideo)
              ? "opacity-75 cursor-not-allowed"
              : ""
          }`}
          disabled={isLoading || (isSponsored && !hasWatchedVideo)}
        >
          {isLoading ? (
            "Loading..."
          ) : isSponsored && !hasWatchedVideo ? (
            "Watch Full Video"
          ) : (
            <>
              <Send className="w-5 h-5 text-black" />
              <span className="ml-2">Send Token </span>
            </>
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default InitiateTransaction;
