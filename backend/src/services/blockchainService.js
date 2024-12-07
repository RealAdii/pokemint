import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/constants";

const provider = new ethers.providers.JsonRpcProvider(
  process.env.BASE_SEPOLIA_RPC_URL
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function createTask(token, recipient, amount) {
  const tx = await contract.createTask(
    token,
    recipient,
    ethers.BigNumber.from(amount)
  );
  await tx.wait();
  return tx.hash;
}

async function completeTask(taskId) {
  const tx = await contract.completeTask(taskId);
  await tx.wait();
  return tx.hash;
}

async function getTask(taskId) {
  const task = await contract.getTask(taskId);
  return {
    token: task[0],
    sender: task[1],
    recipient: task[2],
    amount: task[3].toString(),
    isCompleted: task[4],
  };
}

export default { createTask, completeTask, getTask };
