// src/store/useStore.js
import { create } from "zustand";

const userStore = create((set) => ({
  user: null,
  setUserDetails: (user) => set(() => ({ user })),
  updateUserDetails: (user) =>
    set((state) => ({ user: { ...state.user, ...user } })),
}));

export default userStore;
