import { ethers } from "ethers";
import contractABI from "./VitalXRecordStorageABI.json"; 
// ⬆️ ABI file (explained below)

// 🔹 YOUR DEPLOYED CONTRACT ADDRESS
export const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

/**
 * Get connected contract instance
 * Uses user's wallet (MetaMask / Privy)
 */
export async function getContract() {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found");
  }

  // Request wallet access
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Get signer (current connected wallet)
  const signer = await provider.getSigner();

  // Create contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    signer
  );

  return contract;
}
