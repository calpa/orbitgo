declare module '../constants/transactionTypes.json' {
  interface TransactionType {
    type: string;
    icon: string;
  }

  interface TransactionTypes {
    result: TransactionType[];
  }

  const value: TransactionTypes;
  export default value;
}
