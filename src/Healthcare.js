import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contract_abi, contract_address } from "./constants";

// const ethers = require("ethers");

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;
  const separator = "...";
  let separatorLength = separator.length;
  const charsToShow = strLen - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

const Healthcare = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(null);

  // local / specific to the dApp
  const [providerAddress, setProviderAddress] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

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

  // dApp functionalities <--> solidity contract
  const fetchPatientRecords = async () => {
    try {
      const records = await contract.getPatientRecords(patientId);
      setPatientRecords(records);
      console.log(patientRecords);
    } catch (error) {
      console.error("Error fetching patient records: ", error);
    }
  };

  const authorizeProvider = async () => {
    if (isOwner) {
      try {
        const tx = await contract.authorizeProvider(providerAddress);
        await tx.wait();
        alert(`${providerAddress} is authorized successfully!`);
      } catch (error) {
        console.log("Error adding provider: ", error);
      }
    } else {
      alert("Only the owner can authorize providers.");
    }
  };

  const addRecord = async () => {
    try {
      const tx = await contract.addRecord(
        patientId,
        "Alice",
        diagnosis,
        treatment
      );
      await tx.wait();
      fetchPatientRecords();
      await tx.wait();
      alert("Patient record added successfully!");
    } catch (error) {
      console.log("Error adding patient records: ", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Healthcare dApp</h1>
      {account && (
        <p className="account-info">
          Connected Account: <b>{truncateStr(account || "", 12)}</b>
        </p>
      )}
      {isOwner && (
        <p className="owner-info">
          <i>[Contract Owner]</i>
        </p>
      )}

      <div className="form-section">
        <h3>Fetch Patient Records</h3>
        <input
          className="input-field"
          type="text"
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        ></input>
        <button className="action-button" onClick={fetchPatientRecords}>
          Fetch Records
        </button>
      </div>

      {patientRecords.length !== 0 && (
        <div className="records-section">
          <div className="record-card">
            <h2>Records</h2>
            {patientRecords.map((record, index) => (
              <div key={index}>
                <p>ID: {record.recordId.toNumber()}</p>
                <p>Name: {record.patientName}</p>
                <p>Diagnosis: {record.diagnosis}</p>
                <p>Treatment: {record.treatment}</p>
                <p>
                  Date:{" "}
                  {new Date(
                    record.timestamp.toNumber() * 1000
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="form-section">
        <h3>Add Patient Records</h3>
        <input
          className="input-field"
          type="text"
          placeholder="Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        ></input>
        <input
          className="input-field"
          type="text"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        ></input>
        <input
          className="input-field"
          type="text"
          placeholder="Treatment"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
        ></input>
        <button className="action-button" onClick={addRecord}>
          Add Record
        </button>
      </div>

      <div className="form-section">
        <h3>Authorize Health Care Provider</h3>
        <input
          className="input-field"
          type="text"
          placeholder="Provider's ETH Address"
          onChange={(e) => setProviderAddress(e.target.value)}
        ></input>
        <button className="action-button" onClick={authorizeProvider}>
          Authorize Provider
        </button>
      </div>
    </div>
  );
};

export default Healthcare;
