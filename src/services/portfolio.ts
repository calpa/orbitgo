import axios from "../axios";
import { PorfolioResponse } from "../types";

/**
 * Fetches portfolio data for a given address with retry mechanism
 *
 * @param address - Ethereum address to fetch portfolio data for
 * @param maxRetries - Maximum number of retry attempts (default: 10)
 * @param retryDelay - Delay between retries in milliseconds (default: 1000)
 * @returns Portfolio data response
 * @throws Error if max retries reached and data still not ready
 */
export const fetchPortfolioData = async (
  address: `0x${string}`,
  maxRetries: number = 10,
  retryDelay: number = 1000
): Promise<PorfolioResponse | undefined> => {
  console.log(`Fetching portfolio data for: ${address}`);

  // First trigger a fetch of all chain data
  await axios.post("/portfolio/fetch/all", { address });

  // Try to get the aggregated portfolio data with retries
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get<PorfolioResponse>(
        `/portfolio/${address}`
      );

      console.log(`response`, response);

      // Check if all protocols are ready
      if (response.data.chains.every((chain) => chain.status === "completed")) {
        console.log(
          `Portfolio data fetched successfully after ${retries} retries`
        );
        return response.data;
      }

      // Wait before next retry
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    } catch (error) {
      console.error(
        `Error fetching portfolio data (attempt ${retries + 1}):`,
        error
      );

      // Wait before retry on error
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;

      // Throw error on last retry
      if (retries === maxRetries) {
        throw new Error(
          `Failed to fetch portfolio data after ${maxRetries} attempts`
        );
      }
    }
  }

  // This case handles when we've exhausted retries but data isn't ready
  console.warn(
    `Max retries (${maxRetries}) reached. Some data may not be fully loaded.`
  );
  return undefined;
};
