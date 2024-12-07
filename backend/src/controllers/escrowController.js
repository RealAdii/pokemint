import {
  createTask,
  completeTask,
  getTask,
} from "../services/blockchainService.js";
import { updateUser } from "../models/userModel.js";
import admin from "firebase-admin";
const { firestore } = admin;

export async function createTaskHandler(req, res) {
  try {
    const { token, recipient, amount } = req.body;
    console.log("token", token);
    console.log("recipient", recipient);
    console.log("amount", amount);

    if (!token || !recipient || !amount) {
      return res
        .status(400)
        .send({ success: false, error: "Fields are required" });
    }

    const txHash = await createTask(token, recipient, amount);
    console.log("txHash", txHash);
    res.status(201).send({ success: true, transactionHash: txHash });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

export async function completeTaskHandler(req, res) {
  try {
    const { taskId, coinDetails, uploadUrl, userId } = req.body;
    const txHash = await completeTask(taskId);
    await updateUser(userId, {
      isVerified: true,
      coinsCollectedDetails: firestore.FieldValue.arrayUnion({
        taskId,
        txHash: `${txHash}` ?? "",
        coinDetails,
        uploadUrl,
      }),
      coinsCollectedTotal: firestore.FieldValue.increment(1),
    });
    res.status(200).send({ success: true, transactionHash: txHash });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, error: error.message });
  }
}

export async function getTaskHandler(req, res) {
  try {
    const { taskId } = req.params;
    console.log("taskId", taskId);
    const taskDetails = await getTask(taskId);
    res.status(200).send({ success: true, task: taskDetails });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}
