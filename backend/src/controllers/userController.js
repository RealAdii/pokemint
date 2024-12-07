import {
  addUser,
  getUserDetails,
  verifyUser,
  verifyUserExists,
} from "../models/userModel.js";

export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, defaultWalletAddress, userId } =
      req.body;
    const userPayload = {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      userId: userId || "",
      walletAddresses: [defaultWalletAddress],
      coinsCollectedTotal: 0,
      coinsCollectedDetails: [],
      tasks: [],
      currentActiveTask: null,
      isVerified: false,
      createdAt: Date.now(),
    };

    const userExists = await verifyUserExists(userId);
    if (userExists.success) {
      return res.status(201).send({
        success: true,
        message: "User already exists",
        userData: userExists.data,
      });
    }

    await addUser(userId, userPayload);
    const userData = await getUserDetails(userId);

    console.log("User created successfully");
    return res
      .status(201)
      .send({ success: true, message: "User created successfully", userData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
}

export async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const userData = await getUserDetails(userId);
    res.status(200).send({ success: true, data: userData });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
}

export async function verifyUserHandler(req, res) {
  try {
    const { userId } = req.params;
    await verifyUser(userId);
    res
      .status(200)
      .send({ success: true, message: "User verified successfully" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}
