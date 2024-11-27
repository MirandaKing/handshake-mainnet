// pages/api/queryTransactions.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
  const db = client.db();
  const collection = db.collection("transactions-mainnet");

  try {
    const query = { isSponsored: true };

    const transactions = await collection
      .find(query)
      .sort({ initiateDate: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching transactions", error },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
