import axios from "axios";
import { Transaction } from "../types";

const BASE_URL = "https://treasury-management-backend.calpa.workers.dev";

interface TransactionsResponse {
  items: Transaction[];
  cache_counter: number;
}

export async function fetchTransactions(
  address: string
): Promise<Transaction[]> {
  const response = await axios.get<TransactionsResponse>(
    `${BASE_URL}/portfolio/${address}/history`
  );
  console.log("response.data", response.data);

  return response.data.items;
}
