export interface Chain {
  id: number;
  name: string;
  icon: string;
}

export interface ChainData {
  [key: number]: Chain;
}

const chainsData: ChainData = {
  1: {
    id: 1,
    name: "Ethereum",
    icon: "/chain-icons/ethereum.svg",
  },
  // Add other chains as needed
};

export default chainsData;
