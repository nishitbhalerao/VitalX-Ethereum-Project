const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VitalXRecordStorage", function () {
  let VitalX, vitalX, user1, user2;

  beforeEach(async () => {
    [user1, user2] = await ethers.getSigners();
    VitalX = await ethers.getContractFactory("VitalXRecordStorage");
    vitalX = await VitalX.deploy();
    await vitalX.waitForDeployment();
  });

  // ----------------------------
  // 1. Uploading Records
  // ----------------------------
  describe("Upload Records", function () {
    it("should upload a new record", async () => {
      const tx = await vitalX.connect(user1).uploadRecord("QmTestHash", "Medical Report");
      const receipt = await tx.wait();
      const newId = receipt.logs[0].args.id;

      // Fetch the record
      const record = await vitalX.getRecord(newId);

      expect(record.id).to.equal(1);
      expect(record.uploader).to.equal(user1.address);
      expect(record.ipfsHash).to.equal("QmTestHash");
      expect(record.label).to.equal("Medical Report");
    });

    it("should increment recordCount", async () => {
      await vitalX.connect(user1).uploadRecord("QmHash1", "File1");
      await vitalX.connect(user1).uploadRecord("QmHash2", "File2");

      expect(await vitalX.recordCount()).to.equal(2);
    });

    it("should revert if IPFS hash is empty", async () => {
      await expect(
        vitalX.connect(user1).uploadRecord("", "NoHash")
      ).to.be.revertedWith("IPFS hash required");
    });
  });

  // ----------------------------
  // 2. Fetching Records by ID
  // ----------------------------
  describe("Get Record By ID", function () {
    beforeEach(async () => {
      await vitalX.connect(user1).uploadRecord("QmHashA", "DocA");
    });

    it("should return the correct record", async () => {
      const record = await vitalX.getRecord(1);

      expect(record.id).to.equal(1);
      expect(record.uploader).to.equal(user1.address);
      expect(record.ipfsHash).to.equal("QmHashA");
      expect(record.label).to.equal("DocA");
    });

    it("should revert if record ID does not exist", async () => {
      await expect(vitalX.getRecord(99)).to.be.revertedWith("Record does not exist");
    });
  });

  // ----------------------------
  // 3. Fetch Records by Uploader===
  // ----------------------------
  describe("Get Records By Uploader", function () {
    beforeEach(async () => {
      await vitalX.connect(user1).uploadRecord("QmHash1", "Doc1");
      await vitalX.connect(user1).uploadRecord("QmHash2", "Doc2");
      await vitalX.connect(user2).uploadRecord("QmHash3", "Doc3");
    });

    it("should return all records uploaded by a user", async () => {
      const user1Records = await vitalX.getRecordsByUploader(user1.address);
      const user2Records = await vitalX.getRecordsByUploader(user2.address);

      expect(user1Records.length).to.equal(2);
      expect(user1Records[0]).to.equal(1);
      expect(user1Records[1]).to.equal(2);

      expect(user2Records.length).to.equal(1);
      expect(user2Records[0]).to.equal(3);
    });

    it("should return empty array if user has no records", async () => {
      const records = await vitalX.getRecordsByUploader("0x0000000000000000000000000000000000000001");
      expect(records.length).to.equal(0);
    });
  });
});
