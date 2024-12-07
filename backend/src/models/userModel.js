import db from "../config/firestore.js";

async function addUser(userData) {
  await db.collection("users").doc().set(userData);
}

async function getUser(userId) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  return userDoc.data();
}

async function updateUser(userId, updateData) {
  await db.collection("users").doc(userId).update(updateData);
}

export { addUser, getUser, updateUser };
