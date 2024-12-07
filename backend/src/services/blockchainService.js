import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/constants";
const provider = new ethers.providers.JsonRpcProvider(
  process.env.BASE_SEPOLIA_RPC_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function createTask(token, recipient, amount) {
  const tx = await contract.createTask(token, recipient, amount);
  await tx.wait();
  return tx.hash;
}

export default { createTask };
