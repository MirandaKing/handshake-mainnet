"use client";
import React, { useEffect, useState } from "react";
import "./singletxexpanded.css";
import { formatUnits } from "viem";
import AddressWithCopy from "../quickaccess/AddressWithCopy";
import Blockies from "react-blockies";
import { useAccount } from "wagmi";

function SingleTranscationAccordianExpanded({
  transaction,
  cancelTransaction,
  isLoading,
  index,
  selectedIndex,
  isRejectedBtn,
  handleActionButtonClick,
  isSponsorTab,
}) {
  const { address } = useAccount();
  const [nftDetails, setNftDetails] = useState(null);

  const loadNFTDetails = async (id) => {
    setNftDetails(null);
    try {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/67019e9ee41b4d34e43d9b6f`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch NFT details");
      }
      const data = await response.json();
      console.log("nft", data);
      setNftDetails(data);
    } catch (error) {
      toast.error(
        "Failed to load NFT details. Please check the Token ID and try again."
      );
      console.error("Error loading NFT details:", error);
    }
  };
  useEffect(() => {
    const getNftDetails = async () => {
      if (transaction.isNFT) {
        await loadNFTDetails();
      }
    };
    getNftDetails();
  }, [transaction]);

  return (
    <>
      <div className="expanded-single-tx-parent">
        <div className="left border-r-none md:border-r border-[#dcdee0]">
          <div className="left-child">
            <div className="expaned-left-top">
              <div
                style={{
                  textAlign: "left",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                Send
                {transaction.isNFT ? (
                  <span style={{ fontWeight: "700", marginLeft: "5px" }}>
                    NFT
                  </span>
                ) : (
                  <span style={{ fontWeight: "700", marginLeft: "5px" }}>
                    {formatUnits(transaction.amount, transaction.decimals)}
                    <span style={{ marginLeft: "5px", marginRight: "5px" }}>
                      {transaction.tokenName}
                    </span>
                  </span>
                )}
                to:
              </div>
              <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                <div className="table-user">
                  <Blockies
                    className="table-user-gradient"
                    seed={
                      transaction.receiverAddress
                        ? transaction.receiverAddress
                        : null
                    }
                    size={10}
                    scale={3}
                  />
                  <div className="table-user-details">
                    <AddressWithCopy
                      address={transaction.receiverAddress}
                      short={true}
                    />
                  </div>
                  {address && address === transaction.receiverAddress ? (
                    <span className="ml-1 rounded-full bg-[#29FF81] py-[0] px-2 text-black text-sm">
                      You
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="expaned-left-bottom flex flex-col">
              <div className="flex flex-row justify-start items-start gap-4">
                <div className="lables">
                  <div className="lable">Sponsored:</div>
                  <div className="lable">Transaction Hash:</div>
                  <div className="lable">Initiated Date:</div>
                  <div className="lable">Status:</div>
                  <div className="lable">Sender:</div>
                </div>
                <div className="values">
                  <div className="value">
                    {transaction.isSponsored ? "Yes" : "No"}
                  </div>
                  <div className="value">
                    {transaction.transactionHash ? (
                      <Link
                        href={`https://testnet.bttcscan.com/tx/${transaction.transactionHash}`}
                        target="_blank"
                        className="underline decoration-2 hover:decoration-[#29FF81]"
                      >
                        Open Link
                      </Link>
                    ) : (
                      "txHash"
                    )}
                  </div>
                  <div className="value">
                    {transaction?.initiateDate
                      ? formatToHumanReadableDate(transaction.initiateDate)
                      : ""}
                  </div>
                  <div className="value">{transaction.status}</div>
                  <div className="value">
                    <div className="table-user">
                      <Blockies
                        className="table-user-gradient"
                        seed={
                          transaction.senderAddress
                            ? transaction.senderAddress
                            : null
                        }
                        size={10}
                        scale={3}
                      />
                      <div className="table-user-details">
                        <AddressWithCopy
                          address={transaction.senderAddress}
                          short={true}
                        />
                      </div>
                      {address && address === transaction.senderAddress ? (
                        <span className="ml-1 rounded-full bg-[#29FF81] py-[0] px-2 text-black text-sm">
                          You
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              {/* nftDetails Section */}
              <div>
                {nftDetails && (
                  <div className="bg-gray-100 p-4 rounded-md ">
                    <div className="max-w-[80%] mx-auto space-y-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        NFT Details
                      </h3>
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
                          {new Date(
                            nftDetails.metadata.createdAt
                          ).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="right border-t md:border-none">
          <div className="process">
            <ul>
              <li
                className={`step ${
                  transaction.status === "inititated" ||
                  transaction.status === "approved" ||
                  transaction.status === "completed" ||
                  transaction.status === "rejected"
                    ? "completed"
                    : null
                }`}
              >
                <div className="name">Request Initiated</div>
              </li>
              <li
                className={`step ${
                  transaction.status === "inititated" ? "current" : null
                } ${
                  transaction.status === "approved" ||
                  transaction.status === "completed"
                    ? "completed"
                    : null
                }`}
              >
                <div className="name">
                  {transaction.status === "approved" ||
                  transaction.status === "completed"
                    ? "Approved"
                    : "Waiting for Receiver's Approval"}
                </div>
              </li>
              <li
                className={`step ${
                  transaction.status === "approved" ? "current" : null
                } ${transaction.status === "completed" ? "completed" : null}`}
              >
                <div className="name">
                  {transaction.status === "approved" ||
                  transaction.status === "inititated" ||
                  transaction.status === "rejected"
                    ? isSponsorTab && transaction.senderAddress !== address
                      ? "Waiting for Sponsor to Execute"
                      : "Waiting for Sender to Execute"
                    : transaction.status === "completed"
                    ? "Executed"
                    : null}
                </div>
              </li>
              <li
                className={`step ${
                  transaction.status === "rejected" ||
                  transaction.status === "completed"
                    ? "completed"
                    : null
                }`}
              >
                <div className="name">
                  {transaction.status === "rejected" ? "Rejected" : "Completed"}
                </div>
              </li>
            </ul>
          </div>

          <div className="action-btns-expanded">
            {transaction.status === "rejected" ? (
              <button className="rejected-action-btn action-btn">
                Rejected
              </button>
            ) : transaction.status === "completed" ? (
              <button className="completed-action-btn action-btn">
                Completed
              </button>
            ) : (
              <>
                <button
                  className={
                    isSponsorTab && transaction.status === "approved"
                      ? "execute-action-btn action-btn"
                      : address &&
                        transaction.senderAddress === address &&
                        transaction.status === "inititated"
                      ? "waiting-action-btn action-btn"
                      : transaction.senderAddress === address &&
                        transaction.status === "approved"
                      ? "execute-action-btn action-btn"
                      : transaction.receiverAddress === address &&
                        transaction.status === "inititated"
                      ? "execute-action-btn action-btn"
                      : "waiting-action-btn action-btn"
                  }
                  onClick={() => handleActionButtonClick(transaction, index)}
                >
                  {isLoading &&
                  isRejectedBtn !== index &&
                  selectedIndex === index
                    ? "Loading..."
                    : isSponsorTab &&
                      transaction.status === "approved" &&
                      transaction.senderAddress !== address
                    ? "Sponsor Transaction"
                    : address &&
                      transaction.senderAddress === address &&
                      transaction.status === "inititated"
                    ? "Waiting"
                    : transaction.senderAddress === address &&
                      transaction.status === "approved"
                    ? "Execute"
                    : transaction.receiverAddress === address &&
                      transaction.status === "inititated"
                    ? "Approve"
                    : transaction.status === "rejected"
                    ? "Rejected"
                    : "Waiting"}
                </button>
                {!isSponsorTab && (
                  <button
                    className="rejected-action-btn action-btn"
                    onClick={() => cancelTransaction(transaction, index)}
                  >
                    {isLoading && isRejectedBtn === index
                      ? "Loading..."
                      : "Reject"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {isSponsorTab && (
        <div
          className="my-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-left"
          role="alert"
        >
          <p className="font-bold mb-2">⭐ Sponsored Transaction</p>
          <p className="text-sm">
            This transaction is sponsored, meaning zero gas fees for sender!
          </p>
          <p className="text-sm">
            Enjoy faster and more cost-effective transactions on the network.
          </p>
          <p className="mt-3 text-sm italic">
            Note: Currently, for testing purposes, anyone can be the sponsor and
            execute sponsored transactions by covering the gas fees.
          </p>
        </div>
      )}
    </>
  );
}

export default SingleTranscationAccordianExpanded;
