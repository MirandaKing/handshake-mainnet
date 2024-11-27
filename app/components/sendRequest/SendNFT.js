"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import {
  createWalletClient,
  custom,
  encodePacked,
  getAddress,
  keccak256,
} from "viem";
import { formSchemaNFTTransfer } from "../Modal/schema";
import { Send } from "lucide-react";
import { getNftDetails } from "@/app/quickaccess/getTokenDetails";
import { useAccount } from "wagmi";

export default function SendNFT() {
  const { address, isConnected } = useAccount();
  const [transaction, setTransaction] = useState({
    receiver: "",
    contractAddress: "",
    tokenId: "",
  });
  const [isSponsored, setIsSponsored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [showSavings, setShowSavings] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState({});
  const [nftDetails, setNftDetails] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState({
    approxGasFees: "0.001",
    totalCost: "0.0015",
    nftTokenId: "",
    receiver: "",
  });

  useEffect(() => {
    updateTransactionDetails();
  }, [transaction]);

  const updateTransactionDetails = () => {
    const gasFees = parseFloat(transactionDetails.approxGasFees);
    const totalCost = gasFees;

    setTransactionDetails({
      approxGasFees: gasFees.toFixed(6),
      totalCost: totalCost.toFixed(6),
      nftTokenId: transaction.tokenId,
      receiver: transaction.receiver,
    });
  };

  const handleInputChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

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

  const loadNFTDetails = async () => {
    setIsLoadingNFT(true);
    setNftDetails(null);
    console.log("whole tx", transaction);
    try {
      const nftDetails = await getNftDetails(
        address,
        transaction.contractAddress,
        transaction.tokenId
      );
      console.log("the details", nftDetails);
      const response = await fetch(nftDetails.tokenUri);
      if (!response.ok) {
        throw new Error("Failed to fetch NFT details");
      }
      if (address != nftDetails.owner) {
        console.log("You are not the owner of the TokenId");
        throw new Error("You are not the owner of the TokenId");
      }
      const data = await response.json();
      setNftDetails(data);
    } catch (error) {
      toast.error(
        "Failed to load NFT details. Please check the Token ID and try again."
      );
      console.error("Error loading NFT details:", error);
    } finally {
      setIsLoadingNFT(false);
    }
  };

  const handleVideoEnd = () => {
    setHasWatchedVideo(true);
    setShowSavings(true);
  };

  //   const signTransaction = async (e) => {
  //     e.preventDefault();
  //     if (isSponsored && !hasWatchedVideo) {
  //       toast.error("Please watch the video before proceeding.");
  //       return;
  //     }
  //     setIsLoading(true);
  //     // Implement NFT transfer logic here
  //     toast.success("NFT transfer initiated successfully!");
  //     setIsLoading(false);
  //   };

  const generateNonce = async () => {
    if (!address) {
      throw new Error("Address is required");
    }

    console.log("The address:", address);

    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    console.log("Timestamp:", timestamp.toString()); // Convert BigInt to string for loggin

    const packedData = keccak256(
      encodePacked(["address", "uint256"], [address, timestamp])
    );

    console.log("nonce data:", packedData);
    return keccak256(packedData);
    // return 0x0000000000000000000000000000000000000000000000000000000000000001
  };

  const signTransaction = async (e) => {
    e.preventDefault();
    // if (transaction.receiver === "" || transaction.amount === "") {
    //   console.log("Please Enter Details");
    //   return;
    // }
    if (isSponsored && !hasWatchedVideo) {
      toast.error("Please watch the video before proceeding.");
      return;
    }

    setErrorDisplay(false);

    const formData = {
      receiver: transaction.receiver,
      receiver: transaction.contractAddress,
      tokenId: transaction.tokenId,
    };

    console.log("formdata", formData);

    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }
    // let amount = parseUnits(transaction.amount, tokenDetails.decimals);

    try {
      formSchemaNFTTransfer.parse(formData);
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

      // const url = `/api/latest-nonce?address=${address}`;

      // const response = await fetch(url);
      // const data = await response.json();
      // console.log(data);

      // let nonce = parseInt(data.nonce) + 1;
      let nonce = await generateNonce();
      // let nonce = "0x0000000000000000000000000000000000000000000000000000000000000001";
      console.log("nonceeeeee", nonce);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 604800);
      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "HandshakeTokenTransfer", // change the name based on contract
          version: "1",
          chainId: "199",
          verifyingContract: "0x0856Ab13d8BFC644c1096554Bd23779dc42e4cDE",
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          initiateTransaction: [
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "tokenAddress", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        primaryType: "initiateTransaction",
        message: {
          sender: address,
          receiver: transaction.receiver,
          tokenAddress: getAddress(transaction.contractAddress),
          tokenId: transaction.tokenId,
          deadline: deadline,
          nonce: nonce,
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          senderAddress: address,
          receiverAddress: transaction.receiver,
          tokenAddress: transaction.contractAddress,
          senderSignature: signature,
          receiverSignature: "",
          status: "inititated",
          isNFT: true,
          tokenId: transaction.tokenId,
          isSponsored: isSponsored ? true : false,
          tokenName: "",
          initiateDate: currentDate,
          deadline: deadline.toString(),
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
          toast.success("NFT transfer initiated successfully!");
          setIsLoading(false);
          // onClose();
          console.log("api call done");
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
    if (
      transaction.receiver ||
      transaction.tokenId ||
      transaction.contractAddress
    ) {
      setErrors({});
      setErrorDisplay(false);
    }

    return () => {
      setErrors({});
      setErrorDisplay(false);
    };
  }, [transaction.receiver, transaction.tokenId, transaction.contractAddress]);

  return (
    <div className="p-2 md:p-8 md:pt-2">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        NFT Transfer
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
                ? "border-red"
                : "border-gray-300"
            }`}
            value={transaction.receiver}
            onChange={handleInputChange}
          />

          <label
            htmlFor="receiver"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contract Address
          </label>
          <input
            type="text"
            id="contractAddress"
            name="contractAddress"
            placeholder="Enter Contract Address"
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errorDisplay && errors?.receiver
                ? "border-red"
                : "border-gray-300"
            }`}
            value={transaction.contractAddress}
            onChange={handleInputChange}
          />
          {errorDisplay && errors?.receiver && (
            <p className="mt-1 text-sm text-red">{errors.receiver}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tokenId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            NFT Token ID
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="tokenId"
              name="tokenId"
              placeholder="Enter NFT Token ID"
              className={`flex-grow px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                errorDisplay && errors?.tokenId
                  ? "border-red"
                  : "border-gray-300"
              }`}
              value={transaction.tokenId}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={loadNFTDetails}
              className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                isLoadingNFT ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isLoadingNFT}
            >
              {isLoadingNFT ? "Loading..." : "Load"}
            </button>
          </div>
          {errorDisplay && errors?.tokenId && (
            <p className="mt-1 text-sm text-red">{errors.tokenId}</p>
          )}
        </div>

        {nftDetails && (
          <div className="bg-gray-100 p-4 rounded-md space-y-4">
            <h3 className="font-semibold text-gray-800 mb-2">NFT Details</h3>
            {nftDetails.record.image && (
              <div className="relative w-full h-52 flex justify-center items-center">
                <img
                  src={nftDetails.record.image}
                  alt={nftDetails.record.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md max-h-full"
                />
              </div>
            )}
            <p className="text-sm text-gray-600">
              Name:{" "}
              <span className="font-semibold text-gray-800">
                {nftDetails.record.name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Description:{" "}
              <span className="font-semibold text-gray-800">
                {nftDetails.record.description}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Created At:{" "}
              <span className="font-semibold text-gray-800">
                {new Date(nftDetails.metadata.createdAt).toLocaleString()}
              </span>
            </p>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-md space-y-2">
          <h3 className="font-semibold text-gray-800 mb-2">
            Transaction Details
          </h3>
          <p className="text-sm text-gray-600">
            Receiver's Address:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.receiver}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Token ID:{" "}
            <span className="font-semibold text-gray-800">
              {transactionDetails.nftTokenId}
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
              {transactionDetails.totalCost} BTTC
            </span>
          </p>
        </div>

        {isFetchingVideo && (
          <p className="text-sm text-gray-600 animate-pulse">
            Fetching sponsored video...
          </p>
        )}

        {isVideoReady && !hasWatchedVideo && (
          <div className="mt-4">
            <video
              className="w-full rounded-md"
              controls
              onEnded={handleVideoEnd}
            >
              <source src="video/test.mp4" type="video/mp4" />
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
            <p>You've saved approximately 700 BTTC in gas fees!</p>
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
              <span className="ml-2">Transfer NFT</span>
            </>
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
