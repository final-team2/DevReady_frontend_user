import { Container, Typography } from '@mui/material'

// 스텁: 실제 화면은 프로토타입(feat/jsc-ui-import)을 참고해 MUI로 단계별 이식한다.
export default function NotFoundPage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">404</Typography>
      <Typography color="text.secondary">요청하신 페이지를 찾을 수 없습니다.</Typography>
    </Container>
  )
}
