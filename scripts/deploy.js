const hre = require("hardhat");

async function main() {
  const VitalXRecordStorage = await hre.ethers.getContractFactory("VitalXRecordStorage");

  const contract = await VitalXRecordStorage.deploy();

  await contract.waitForDeployment();

  console.log("✅ Contract deployed successfully!");
  console.log("📌 Contract address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
