import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contract_abi, contract_address } from "./constants";

// const ethers = require("ethers");

const Healthcare = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        // basic setup
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        // console.log(accountAddress);

        const contract = new ethers.Contract(
          contract_address,
          contract_abi,
          signer
        );
        setContract(contract);

        // functionality local/specific to this dApp
        const ownerAddress = await contract.getOwner();
        setIsOwner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());
      } catch (error) {
        console.error("Error connecting wallet: ", error);
      }
    };
    connectWallet();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Healthcare</h1>
      {account && <p className="account-info">Connected account: {account}</p>}
      {isOwner && <p className="owner-info">[You are the contract owner]</p>}
    </div>
  );
};

export default Healthcare;
