import { create } from 'zustand';

type User = {
    email: string;
    nickname: string;
};

type UserStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    isLoggedIn: () => boolean;
};

const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    isLoggedIn: () => get().user !== null,
}));

export default useUserStore;