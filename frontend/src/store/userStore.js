// src/store/useStore.js
import { create } from "zustand";

const userStore = create((set) => ({
  userDetails: null,
  setUserDetails: (user) => set(() => ({ userDetails: user })),
  updateUserDetails: (user) =>
    set((state) => ({ userDetails: { ...state.userDetails, ...user } })),
}));

export default userStore;
