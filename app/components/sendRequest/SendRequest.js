"use client";
import "@/app/components/TransactionTypes.css";
import { useState } from "react";
import InitiateTransaction from "../Modal/InitiateTransaction";
import SendNFT from "./SendNFT";

export default function SendRequest() {
  const [activeTab, setActiveTab] = useState("token");

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pt-[100px]">
      <div className="table-tabs w-full border-b border-[#dcdee0] px-[24px] pt-[24px]">
        <div className="flex justify-left space-x-4  ">
          <button
            className={`px-6 py-4  text-base font-bold ${
              activeTab === "token" ? "activeTabBtn" : "inactiveBtn"
            }`}
            onClick={() => setActiveTab("token")}
          >
            Send Token
          </button>
          <button
            className={`px-4 py-2  text-base font-bold ${
              activeTab === "nft" ? "activeTabBtn" : "inactiveBtn"
            }`}
            onClick={() => setActiveTab("nft")}
          >
            Send NFT
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-b-lg shadow max-w-3xl">
        {activeTab === "token" ? <InitiateTransaction /> : <SendNFT />}
      </div>
    </div>
  );
}
