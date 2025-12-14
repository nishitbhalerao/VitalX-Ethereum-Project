// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VitalXRecordStorage {
    // A single stored record
    struct Record {
        uint256 id;         // unique ID
        address uploader;   // who created this record
        string ipfsHash;    // IPFS CID of the file (encrypted or plain)
        string label;       // optional label / filename / short description
        uint256 timestamp;  // when it was created
    }

    // Auto-incrementing ID for records
    uint256 public recordCount;

    // ID => Record
    mapping(uint256 => Record) public records;

    // Uploader => list of their record IDs
    mapping(address => uint256[]) private recordsByUploader;

    // Emitted whenever a new record is stored
    event RecordUploaded(
        uint256 indexed id,
        address indexed uploader,
        string ipfsHash,
        string label,
        uint256 timestamp
    );

    /// @notice Upload a new record reference (IPFS CID + optional label)
    /// @param _ipfsHash The IPFS CID of the file (e.g., "Qm...")
    /// @param _label A short label/filename/description for the record
    /// @dev Does NOT upload the file itself – you must upload to IPFS off-chain first.
    function uploadRecord(string calldata _ipfsHash, string calldata _label) external returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");

        recordCount += 1;
        uint256 newId = recordCount;

        records[newId] = Record({
            id: newId,
            uploader: msg.sender,
            ipfsHash: _ipfsHash,
            label: _label,
            timestamp: block.timestamp
        });

        recordsByUploader[msg.sender].push(newId);

        emit RecordUploaded(newId, msg.sender, _ipfsHash, _label, block.timestamp);

        return newId;
    }

    /// @notice Get a record by its ID
    /// @param _id The record ID
    /// @return id The record id
    /// @return uploader The address that uploaded it
    /// @return ipfsHash The stored IPFS CID
    /// @return label The label/description
    /// @return timestamp The creation time (unix)
    function getRecord(uint256 _id)
        external
        view
        returns (
            uint256 id,
            address uploader,
            string memory ipfsHash,
            string memory label,
            uint256 timestamp
        )
    {
        require(_id > 0 && _id <= recordCount, "Record does not exist");
        Record storage r = records[_id];
        return (r.id, r.uploader, r.ipfsHash, r.label, r.timestamp);
    }

    /// @notice Get all record IDs uploaded by a specific address
    /// @param _uploader The address to query
    /// @return ids Array of record IDs
    function getRecordsByUploader(address _uploader) external view returns (uint256[] memory ids) {
        return recordsByUploader[_uploader];
    }
}
