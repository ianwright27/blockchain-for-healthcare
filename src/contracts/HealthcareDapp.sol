// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareDapp {
    address owner;

    struct Record {
        uint256 recordId;
        string patientName;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    mapping(uint256 => Record[]) private patientRecords;
    mapping(address => bool) private authorizedProviders;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this function");
        _;
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Not an authorized provider.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function authorizeProvider(address provider) public onlyOwner {
        authorizedProviders[provider] = true;
    }

    function addRecord(
        uint256 patientId,
        string memory patientName,
        string memory diagnosis,
        string memory treatment
    ) public onlyAuthorizedProvider {
        uint256 recordId = patientRecords[patientId].length + 1;
        patientRecords[patientId].push(
            Record(recordId, patientName, diagnosis, treatment, block.timestamp)
        );
    }

    function getPatientRecords(
        uint256 patientId
    ) public view onlyAuthorizedProvider returns (Record[] memory) {
        return patientRecords[patientId];
    }
}
