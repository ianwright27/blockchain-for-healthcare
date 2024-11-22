const contract_address = "0x95b7119d2B6b5DbDd7b18E3186e4589456C151b8";
const contract_abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "patientId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "patientName",
        type: "string",
      },
      {
        internalType: "string",
        name: "diagnosis",
        type: "string",
      },
      {
        internalType: "string",
        name: "treatment",
        type: "string",
      },
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "authorizeProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "patientId",
        type: "uint256",
      },
    ],
    name: "getPatientRecords",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "recordId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "patientName",
            type: "string",
          },
          {
            internalType: "string",
            name: "diagnosis",
            type: "string",
          },
          {
            internalType: "string",
            name: "treatment",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct HealthcareRecords.Record[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export { contract_address };
export { contract_abi };
