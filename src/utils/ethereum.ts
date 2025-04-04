export type EthAddress = `0x${string}`;

export function isEthAddress(value: string | undefined): value is EthAddress {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function validateEthAddress(value: string | undefined): EthAddress {
  if (!isEthAddress(value)) {
    throw new Error('Invalid Ethereum address');
  }
  return value;
}
