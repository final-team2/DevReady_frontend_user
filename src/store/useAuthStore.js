import { create } from 'zustand'

// 패턴용 최소 인증 스토어.
// 실제 토큰 저장/유저 정보 연동은 이후 단계(로그인 화면 구현 시)에 채운다.
export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null, // { name, email }

  login: (user) => set({ isLoggedIn: true, user: user ?? null }),
  logout: () => set({ isLoggedIn: false, user: null }),
}))

export default useAuthStore
