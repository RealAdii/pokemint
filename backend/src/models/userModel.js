import db from "../config/firestore.js";

async function addUser(userId, userData) {
  await db.collection("users").doc(userId).set(userData, { merge: true });
}

async function getUserDetails(userId) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  return userDoc.data();
}

async function updateUser(userId, updateData) {
  await db.collection("users").doc(userId).update(updateData);
}

export { addUser, getUserDetails, updateUser };
