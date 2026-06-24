import axios from 'axios'

// 패턴용 최소 axios 인스턴스.
// baseURL 은 .env(.local) 의 VITE_API_URL 로 주입한다. (예: VITE_API_URL=http://localhost:8080)
// 토큰 주입·에러 처리 인터셉터는 이후 단계에서 추가한다.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export default apiClient
