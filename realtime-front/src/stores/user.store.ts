import { create } from 'zustand';

interface User {
  id: string;
  nickname: string;
  setNickname: (nickname: string) => void
}

const useUserStore = create<User>(set => ({
  id: '',
  nickname: '',
  setNickname: (nickname: string) => {}
}));