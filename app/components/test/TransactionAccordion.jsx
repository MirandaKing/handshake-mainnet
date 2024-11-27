"use client";

import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";

import handshakeABI from "../../transaction-queue/[id]/Handshake.json";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
  parseUnits,
} from "viem";
import TimeAgoComponent from "../TimeAgoComponent";
import { useAccount } from "wagmi";
import { ToastContainer, toast } from "react-toastify";

import SingleTranscationAccordianExpanded from "../SingleTranscationAccordianExpanded";
import { approveToken } from "@/app/quickaccess/ApproveTokens";

const CustomAccordion = styled(Accordion)({
  margin: "10px 0",
  marginBottom: "20px",
  "&:before": {
    display: "none",
  },

  boxShadow: "none",
  borderRadius: "10px",
  "&.Mui-expanded": {
    border: "1px solid rgb(176, 255, 201)",
    background: "rgb(239, 255, 244)",
  },
  "&.MuiAccordion-root": {
    borderRadius: "10px",
  },
});

const CustomAccordionSummary = styled(AccordionSummary)({
  backgroundColor: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid #dcdee0",
  "&.MuiAccordionSummary-content": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "&:hover": {
    border: "1px solid rgb(176, 255, 201)",
    background: "rgb(239, 255, 244)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  "&.Mui-expanded": {
    border: "none",
    borderBottom: "1px solid #dcdee0",
    background: "rgb(239, 255, 244)",
    borderTopRightRadius: "10px",
    borderTopLeftRadius: "10px",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
  },
});

const CustomAccordionDetails = styled(AccordionDetails)({
  backgroundColor: "white",
  borderBottomRightRadius: "10px",
  borderBottomLeftRadius: "10px",
});
const CustomGridItem = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const publicClient = createPublicClient({
  chain: {
    id: 199, // BTTC Donau mainnet chain ID
    rpcUrls: {
      public: "https://rpc.bittorrentchain.io", // BTTC Donau mainnet RPC URL
    },
  },
  transport: http("https://rpc.bittorrentchain.io"), // Passing RPC URL to http function
});

let walletClient;
if (typeof window !== "undefined" && window.ethereum) {
  walletClient = createWalletClient({
    chain: {
      id: 199, // BTTC Donau mainnet chain ID
      rpcUrls: {
        public: "https://rpc.bittorrentchain.io",
        websocket: "https://rpc.bittorrentchain.io", // WebSocket URL (optional)
      },
    },
    transport: custom(window ? window.ethereum : ""),
  });
}
const TransactionAccordion = ({ transactions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isRejectedBtn, setIsRejectedBtn] = useState(-1);
  const { address } = useAccount();

  const signTransaction = async (transaction) => {
    console.log(transaction);
    try {
      setIsLoading(true);
      console.log("cp3");

      const client = createWalletClient({
        chain: {
          id: 199, // BTTC Donau mainnet chain ID
          rpcUrls: {
            public: "https://rpc.bittorrentchain.io/",
            websocket: "https://rpc.bittorrentchain.io/", // WebSocket URL (optional)
          },
        },
        transport: custom(window.ethereum),
      });
      console.log("cp2");

      // const amount = parseUnits(transaction.amount, transaction.decimals);
      let signature;
      console.log("cp1");
      if (transaction.isNFT) {
        console.log("inside NFT");
        signature = await client.signTypedData({
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
            signByReceiver: [
              { name: "sender", type: "address" },
              { name: "receiver", type: "address" },
              { name: "tokenAddress", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "bytes32" },
            ],
          },
          primaryType: "signByReceiver",
          message: {
            sender: transaction.senderAddress,
            receiver: transaction.receiverAddress,
            tokenAddress: transaction.tokenAddress,
            tokenId: transaction.tokenId,
            deadline: transaction.deadline,
            nonce: transaction.nonce,
          },
        });
      } else {
        console.log("inside token");
        const amount = parseUnits(transaction.amount, transaction.decimals); // cn1 change needed in API
        // amount can't be null but api passed it null because when data is null

        signature = await client.signTypedData({
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
            signByReceiver: [
              { name: "sender", type: "address" },
              { name: "receiver", type: "address" },
              { name: "tokenAddress", type: "address" },
              { name: "amount", type: "uint256" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "bytes32" },
            ],
          },
          primaryType: "signByReceiver",
          message: {
            sender: transaction.senderAddress,
            receiver: transaction.receiverAddress,
            tokenAddress: transaction.tokenAddress,
            amount: transaction.amount,
            deadline: transaction.deadline,
            nonce: transaction.nonce,
          },
        });
      }
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
          let result = await fetch(`api/store-transaction`, {
            method: "PUT",
            body: JSON.stringify(userData),
            headers: {
              "Content-Type": "application/json", // This header is crucial for sending JSON data
            },
          });
          const response = await result.json();
          // console.log(response.message);
          setIsLoading(false);
          toast.success("Signed Sucessfully");

          // await new Promise((resolve) => setTimeout(resolve, 3000));

          // window.location.reload();
        } catch (error) {
          console.error("Error signing transaction:", error);
          setIsLoading(false);
          toast.error("Error while signing");
        }
      }
    } catch (error) {
      console.error("Error signing transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelTransaction = async (transaction, index) => {
    // setSelectedIndex(index);
    setIsRejectedBtn(index);
    setIsLoading(true);
    const currentDate = new Date();
    const userData = {
      TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
      receiverSignature: "rejection-no signature",
      status: "rejected",
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

      setIsLoading(false);
      toast.success("Rejected Sucessfully");
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // window.location.reload();
    } catch (error) {
      console.error("Error Rejecting transaction:", error);
      setIsLoading(false);
      toast.error("Error while rejecting transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // sponsored transaction

  const handleSponsoredTxExecute = async (transaction) => {
    setIsLoading(true);
    try {
      const publicClient = createPublicClient({
        chain: {
          id: 199,
          rpcUrls: {
            public: "https://rpc.bittorrentchain.io/",
          },
        },
        transport: http("https://rpc.bittorrentchain.io/"),
      });

      const permitsignaturs = transaction.permitSignature;
      const { v, r, s } = parseSignature(permitsignaturs);
      const TransactionDetails = [
        transaction.senderAddress,
        transaction.receiverAddress,
        transaction.tokenAddress,
        transaction.amount,
        transaction.deadline,
        transaction.nonce,
      ];

      const args = [
        transaction.senderSignature,
        transaction.receiverSignature,
        transaction.deadline,
        TransactionDetails,
        v,
        r,
        s,
      ];

      const { request } = await publicClient.simulateContract({
        account: address,
        address: "0x184e1b0b544Da324e2D37Bb713b9D0c16c9eF671",
        abi: handshakeABI.abi,
        functionName: "transferFromWithPermit",
        args,
        gasLimit: 3000000,
      });

      let walletClient;
      if (typeof window !== "undefined" && window.ethereum) {
        walletClient = createWalletClient({
          chain: {
            id: 199,
            rpcUrls: {
              public: "https://rpc.bittorrentchain.io/",
              websocket: "https://rpc.bittorrentchain.io/",
            },
          },
          transport: custom(window.ethereum),
        });
      }

      const execute = await walletClient.writeContract(request);
      if (execute) {
        await publicClient.waitForTransactionReceipt({ hash: execute });
      } else {
        console.log("transaction hash is undefined");
      }

      if (execute) {
        const userData = {
          TransactionId: transaction.TransactionId,
          status: "completed",
          transectionDate: new Date().toISOString(),
          transactionHash: execute,
        };

        try {
          let result = await fetch(`/api/payment-completed`, {
            method: "PUT",
            body: JSON.stringify(userData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const response = await result.json();
          console.log("Payment update response: ", response);
        } catch (error) {
          console.error("Error updating payment status:", error);
        }

        toast.success("Transaction executed successfully");
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      toast.error("Failed to execute transaction");
    } finally {
      setIsLoading(false);
    }
  };

  //normal transaction execution
  const executeTransaction = async (transaction) => {
    setIsLoading(true);

    try {
      let functionCalled;
      let TransactionDetails;

      // Define function and parameters based on transaction type (NFT, Token, or Native)
      if (transaction.isNFT) {
        // NFT transfer logic
        TransactionDetails = [
          transaction.senderAddress,
          transaction.receiverAddress,
          transaction.tokenAddress,
          transaction.tokenId, // NFT specific parameter
          transaction.deadline,
          transaction.nonce,
        ];
        functionCalled = "transferNft"; // Call the NFT transfer function

        // Handle NFT approval
        let approve = await approveNftToken(
          transaction.tokenId,
          transaction.tokenAddress,
          address
        );
        console.log("NFT approved: ", approve);
      } else if (transaction.tokenAddress === "") {
        console.log("in native accordion");
        // Native token transfer logic, no approval needed
        TransactionDetails = [
          transaction.senderAddress,
          transaction.receiverAddress,
          transaction.amount,
          transaction.deadline, // Assuming deadline is part of the transaction object
          transaction.nonce,
        ];
        functionCalled = "transferNative"; // Call the native token transfer function
      } else {
        // ERC20 token transfer logic
        console.log("in tokenAddress accordion");
        TransactionDetails = [
          transaction.senderAddress,
          transaction.receiverAddress,
          transaction.tokenAddress,
          transaction.amount,
          transaction.deadline, // Assuming deadline is part of the transaction object
          transaction.nonce,
        ];
        functionCalled = "transferTokens"; // Call the token transfer function

        console.log(TransactionDetails);
        // Handle ERC20 token approval
        let approve = await approveToken(
          transaction.amount,
          transaction.tokenAddress,
          address
        );
        console.log("Token approved: ", approve);
      }

      console.log("Transaction Details: ", TransactionDetails);
      console.log("Function Called: ", functionCalled);

      // Prepare arguments for contract call
      const args = [
        transaction.senderSignature,
        transaction.receiverSignature,
        TransactionDetails,
      ];

      console.log("cp1");
      console.log(transaction, functionCalled);
      console.log("--->", args);
      // Simulate the contract execution
      const { request } = await publicClient.simulateContract({
        account: address,
        address: "0x184e1b0b544Da324e2D37Bb713b9D0c16c9eF671",
        abi: handshakeABI.abi,
        functionName: functionCalled,
        args,
        ...(functionCalled === "transferNative"
          ? { value: transaction.amount ?? 0 }
          : {}),
        gasLimit: 3000000,
      });

      console.log(request);

      // Execute the contract function
      const currentDate = new Date();
      const execute = await walletClient.writeContract(request);

      if (execute) {
        await publicClient.waitForTransactionReceipt({ hash: execute });
      } else {
        // throw new Error("Transaction hash is undefined");
        console.log("tranaction hash is undefined");
      }

      // Update transaction status upon success
      if (execute) {
        console.log("cp#1 for db");
        const userData = {
          TransactionId: transaction.TransactionId,
          status: "completed",
          transectionDate: currentDate,
          transactionHash: execute,
        };

        try {
          let result = await fetch(`/api/payment-completed`, {
            method: "PUT",
            body: JSON.stringify(userData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const response = await result.json();
          console.log("Payment update response: ", response);
        } catch (error) {
          console.error("Error updating payment status:", error);
        }

        toast.success("Execution successful");
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        // window.location.reload();
      }
    } catch (error) {
      toast.error("Execution failed");
      console.error("Error executing transaction: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionButtonClick = async (transaction, index) => {
    setSelectedIndex(index);
    if (
      isSponsorTab &&
      transaction.isSponsored &&
      transaction.senderAddress !== address
    ) {
      console.log("Sponsored tx called");
      await handleSponsoredTxExecute(transaction);
    }
    if (
      address &&
      transaction.senderAddress === address &&
      transaction.status === "inititated"
    ) {
      console.log("wait for receiver to approve");
    }

    if (
      address &&
      transaction.senderAddress === address &&
      transaction.status === "approved"
    ) {
      console.log("Normal Execute tx called");
      await executeTransaction(transaction);
    }

    if (
      address &&
      transaction.receiverAddress === address &&
      transaction.status === "inititated"
    ) {
      await signTransaction(transaction);
    }
  };
  return (
    <div className="accordian-parent">
      {transactions.length > 0 &&
        transactions.map((transaction, index) => (
          <CustomAccordion key={index} classes={"muiTopContainer"}>
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 6, sm: 10, md: 10 }}
              >
                <CustomGridItem item xs={3} sm={1} md={1}>
                  <div>{index + 1}</div>
                </CustomGridItem>
                <CustomGridItem item xs={3} sm={2} md={2}>
                  <div className="senderOrReceiverOnAccordian">
                    {isSponsorTab && transaction.isSponsored ? (
                      <>
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="send rounded-full bg-[#29FF81] p-1"
                        >
                          <path
                            d="M12 7V20M12 7H8.46429C7.94332 7 7.4437 6.78929 7.07533 6.41421C6.70695 6.03914 6.5 5.53043 6.5 5C6.5 4.46957 6.70695 3.96086 7.07533 3.58579C7.4437 3.21071 7.94332 3 8.46429 3C11.2143 3 12 7 12 7ZM12 7H15.5357C16.0567 7 16.5563 6.78929 16.9247 6.41421C17.293 6.03914 17.5 5.53043 17.5 5C17.5 4.46957 17.293 3.96086 16.9247 3.58579C16.5563 3.21071 16.0567 3 15.5357 3C12.7857 3 12 7 12 7ZM5 12H19V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V12ZM4.6 12H19.4C19.9601 12 20.2401 12 20.454 11.891C20.6422 11.7951 20.7951 11.6422 20.891 11.454C21 11.2401 21 10.9601 21 10.4V8.6C21 8.03995 21 7.75992 20.891 7.54601C20.7951 7.35785 20.6422 7.20487 20.454 7.10899C20.2401 7 19.9601 7 19.4 7H4.6C4.03995 7 3.75992 7 3.54601 7.10899C3.35785 7.20487 3.20487 7.35785 3.10899 7.54601C3 7.75992 3 8.03995 3 8.6V10.4C3 10.9601 3 11.2401 3.10899 11.454C3.20487 11.6422 3.35785 11.7951 3.54601 11.891C3.75992 12 4.03995 12 4.6 12Z"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Sponsored
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${
                            transaction.senderAddress === address
                              ? "send"
                              : "receive"
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.56854 5.0101H6.9697C6.41462 5.0101 5.96465 4.56012 5.96465 4.00505C5.96465 3.44998 6.41462 3 6.9697 3H11.9949C12.2725 3 12.5237 3.11249 12.7056 3.29437C12.8875 3.47625 13 3.72751 13 4.00505V9.0303C13 9.58538 12.55 10.0354 11.9949 10.0354C11.4399 10.0354 10.9899 9.58538 10.9899 9.0303V6.43146L4.71573 12.7056C4.32323 13.0981 3.68687 13.0981 3.29437 12.7056C2.90188 12.3131 2.90188 11.6768 3.29437 11.2843L9.56854 5.0101Z"
                            fill="#F02525"
                          />
                        </svg>
                        {transaction.senderAddress === address
                          ? "Send"
                          : "Receive"}
                      </>
                    )}
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={3} sm={2} md={2}>
                  {transaction.isNFT ? (
                    <div style={{ fontWeight: "700" }}>NFT</div>
                  ) : (
                    <div style={{ fontWeight: "700" }}>
                      {formatUnits(transaction.amount, transaction.decimals)}
                      <span style={{ marginLeft: "10px" }}>
                        {transaction.tokenName}
                      </span>
                    </div>
                  )}
                </CustomGridItem>
                <CustomGridItem item xs={3} sm={2} md={2}>
                  <div style={{ color: "#a1a3a7" }}>
                    <TimeAgoComponent timestamp={transaction.initiateDate} />
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={3} sm={1} md={1}>
                  <div className="accordian-txn-status">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16px"
                      viewBox="0 0 24 24"
                      width="16px"
                      fill="#028d4c"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z" />
                    </svg>
                    {transaction.status === "inititated"
                      ? "1 out of 3"
                      : transaction.status === "approved"
                      ? "2 out of 3"
                      : transaction.status === "completed"
                      ? "3 out of 3"
                      : "0 out of 3"}
                  </div>
                </CustomGridItem>
                <CustomGridItem item xs={3} sm={2} md={2}>
                  <button
                    className={
                      address &&
                      isSponsorTab &&
                      transaction.status === "approved"
                        ? "execute-action-btn action-btn"
                        : transaction.senderAddress === address &&
                          transaction.status === "inititated"
                        ? "waiting-action-btn action-btn"
                        : transaction.senderAddress === address &&
                          transaction.status === "approved"
                        ? "execute-action-btn action-btn"
                        : transaction.receiverAddress === address &&
                          transaction.status === "inititated"
                        ? "execute-action-btn action-btn"
                        : transaction.status === "completed"
                        ? "completed-action-btn action-btn"
                        : transaction.status === "rejected"
                        ? "rejected-action-btn action-btn pointer-none"
                        : "waiting-action-btn action-btn"
                    }
                    onClick={() => handleActionButtonClick(transaction, index)}
                  >
                    {isLoading &&
                    isRejectedBtn !== index &&
                    selectedIndex === index
                      ? "Loading..."
                      : address &&
                        isSponsorTab &&
                        transaction.status === "approved" &&
                        transaction.senderAddress !== address
                      ? "Sponsor"
                      : transaction.senderAddress === address &&
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
                      : transaction.status === "completed"
                      ? "Completed"
                      : "waiting"}
                  </button>
                </CustomGridItem>
              </Grid>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <SingleTranscationAccordianExpanded
                transaction={transaction}
                cancelTransaction={cancelTransaction}
                isLoading={isLoading}
                index={index}
                handleActionButtonClick={handleActionButtonClick}
                selectedIndex={selectedIndex}
                isRejectedBtn={isRejectedBtn}
                isSponsorTab={isSponsorTab}
              />
            </CustomAccordionDetails>
          </CustomAccordion>
        ))}
      <ToastContainer />
      {transactions.length === 0 && (
        <CustomAccordion key={"0"} classes={"muiTopContainer"}>
          <CustomAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel0-content`}
            id={`panel0-header`}
          >
            <div style={{ textAlign: "center", width: "100%" }}>
              No transactions found for this address.
              <div style={{ marginTop: "10px" }}>
                To start a new request, please click on the "Initiate Request"
                button located in the top right corner.
              </div>
            </div>
          </CustomAccordionSummary>
        </CustomAccordion>
      )}
    </div>
  );
};

export default TransactionAccordion;
