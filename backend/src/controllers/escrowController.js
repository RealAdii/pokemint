const blockchainService = require("../services/blockchainService");

async function createTask(req, res) {
  try {
    const { token, recipient, amount } = req.body;
    const txHash = await blockchainService.createTask(token, recipient, amount);
    res.status(201).send({ success: true, transactionHash: txHash });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

async function completeTask(req, res) {
  try {
    const { taskId } = req.body;
    const txHash = await blockchainService.completeTask(taskId);
    res.status(200).send({ success: true, transactionHash: txHash });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

async function getTask(req, res) {
  try {
    const { taskId } = req.params;
    const taskDetails = await blockchainService.getTask(taskId);
    res.status(200).send({ success: true, task: taskDetails });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

export default { createTask, completeTask, getTask };
