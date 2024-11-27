"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import "react-toastify/dist/ReactToastify.css";
import TransactionAccordion from "../test/TransactionAccordion";

const Sponsored = () => {
  const { address } = useAccount();
  const [transactions, setTransaction] = useState([]);

  useEffect(() => {
    if (address) {
      const fetchTransactions = async () => {
        const url = `/api/fetch-sponsored-transaction`;
        try {
          const response = await fetch(url, { cache: "no-store" });
          const data = await response.json();
          console.log(data);
          setTransaction(data);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        }
      };
      fetchTransactions();
    }
  }, [address]);

  return (
    <div>
      <h1 className="text-black font-semibold text-xl my-4">
        Sponsored Transactions
      </h1>
      {/* <Grid container spacing={3}>
        {transactions.map((transaction, index) => (
          <Grid item xs={12} key={index}>
            <TransactionPaper elevation={3}>
              <InfoItem>
                <Typography variant="subtitle1">{index + 1}</Typography>
              </InfoItem>
              <InfoItem>
                <Typography variant="body2">
                  Amount:{" "}
                  {transaction.isNFT
                    ? "NFT"
                    : `${formatUnits(
                        transaction.amount,
                        transaction.decimals
                      )} ${transaction.tokenName}`}
                </Typography>
              </InfoItem>
              <InfoItem>
                <Typography variant="body2">
                  Sender: {transaction.senderAddress.slice(0, 6)}...
                  {transaction.senderAddress.slice(-4)}
                </Typography>
              </InfoItem>
              <InfoItem>
                <Typography variant="body2">
                  Receiver: {transaction.receiverAddress.slice(0, 6)}...
                  {transaction.receiverAddress.slice(-4)}
                </Typography>
              </InfoItem>
              <InfoItem>
                <Typography variant="body2">
                  Token Address: {transaction.tokenAddress.slice(0, 6)}...
                  {transaction.tokenAddress.slice(-4)}
                </Typography>
              </InfoItem>
              <InfoItem>
                <Typography variant="body2">
                  Initiated:{" "}
                  {new Date(transaction.initiateDate).toLocaleString()}
                </Typography>
              </InfoItem>
              <InfoItem>
                <Typography variant="body2">
                  Deadline:{" "}
                  {new Date(
                    parseInt(transaction.deadline) * 1000
                  ).toLocaleString()}
                </Typography>
              </InfoItem>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSponsoredTxExecute(transaction)}
                disabled={isLoading || transaction.status !== "approved"}
              >
                {isLoading ? "Executing..." : "Execute"}
              </Button>
            </TransactionPaper>
          </Grid>
        ))}
      </Grid> */}
      <TransactionAccordion transactions={transactions} isSponsorTab={true} />
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Sponsored;
