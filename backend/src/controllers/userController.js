import { addUser, getUserDetails } from "../models/userModel.js";

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

    const existingUser = await getUserDetails(userId);
    if (existingUser) {
      return res.status(201).send({
        success: true,
        message: "User already exists",
        userData: existingUser,
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
    const userData = await _getUser(userId);
    res.status(200).send({ success: true, data: userData });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
}

// userId (document)
//         ├── firstName: string
//         ├── lastName: string
//         ├── email: string (optional)
//         ├── walletAddresses: array of strings (supports multiple wallets)
//         ├── coinsCollectedTotal: number (cumulative total of coins collected)
//         ├── coinsCollectedDetails: array of objects (details of individual coin collections)
//         │       [
//         │           {
//         │               coinUniqueId: string,
//         │               tokenNumber: number,
//         │               lat: number,
//         │               long: number,
//         │               taskId: string
//         │           },
//         │           ...
//         │       ]
//         ├── tasks: array of objects (list of all tasks user has been assigned or completed)
//         │       [
//         │           {
//         │               taskId: string,
//         │               status: string ("completed" | "pending" | "active"),
//         │               description: string,
//         │               createdAt: timestamp,
//         │               completedAt: timestamp (optional)
//         │           },
//         │           ...
//         │       ]
//         ├── currentActiveTask: object (details of the active task, if any)
//         │       {
//         │           taskId: string,
//         │           description: string,
//         │           deadline: timestamp (optional)
//         │       }
//         ├── isVerified: boolean (indicates if the user is verified)
//         ├── createdAt: timestamp (auto-generated)
