import {
  JsonRpcProvider,
  Wallet,
  Contract,
  parseUnits,
  formatUnits,
  toBigInt,
} from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/constants.js";

// Initialize provider
const provider = new JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

// Initialize wallet
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// Initialize contract
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Create a task
export async function createTask(token, recipient, amount) {
  try {
    console.log("Creating task...");
    const tx = await contract.createTask(token, recipient, amount);
    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    const log = receipt.logs[1];
    const taskId = toBigInt(log.data.slice(0, 66));
    console.log("Task ID:", taskId.toString());
    console.log("Task created, TX Hash:", receipt.transactionHash);
    return { receipt, taskId: taskId.toString() };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

// Complete a task
export async function completeTask(taskId) {
  try {
    console.log("Completing task...");
    const tx = await contract.completeTask(taskId);
    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Task completed, TX Hash:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
}

// Get task details
export async function getTask(taskId) {
  try {
    console.log("Fetching task details...");
    const task = await contract.getTask(taskId);
    return {
      token: task[0],
      sender: task[1],
      recipient: task[2],
      amount: formatUnits(task[3], 18), // Convert BigNumber to readable amount
      isCompleted: task[4],
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
}
