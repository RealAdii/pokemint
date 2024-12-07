// src/store/useStore.js
import create from "zustand";

const userStore = create((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
}));

export default userStore;
