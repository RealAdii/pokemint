import db from "../config/firestore.js";

async function addUser(userId, userData) {
  await db.collection("users").doc(userId).set(userData, { merge: true });
}

async function verifyUserExists(userId) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    return { success: false, data: null };
  }
  return { success: true, data: userDoc.data() };
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

async function verifyUser(userId) {
  await db.collection("users").doc(userId).update({ isVerified: true });
}

export { addUser, getUserDetails, updateUser, verifyUser, verifyUserExists };
