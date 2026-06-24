import { createTheme } from '@mui/material/styles'

// 디자인 토큰 출처: test-demo-UI/src/styles/theme.css
// CSS 변수(--primary, --foreground 등)를 MUI 테마 팔레트로 이식한다.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // --primary
      dark: '#4F46E5', // --accent-foreground (primary.dark)
      light: '#818CF8',
      contrastText: '#FFFFFF', // --primary-foreground
    },
    secondary: {
      main: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    error: { main: '#EF4444' }, // --destructive
    success: { main: '#10B981' }, // --chart-2
    warning: { main: '#F59E0B' }, // --chart-3
    info: { main: '#3B82F6' }, // --chart-5
    text: {
      primary: '#0F172A', // --foreground
      secondary: '#64748B', // --muted-foreground
    },
    background: {
      default: '#FFFFFF', // --background
      paper: '#FFFFFF', // --card
    },
    divider: 'rgba(0,0,0,0.07)', // --border
  },
  shape: {
    borderRadius: 12, // --radius: 0.75rem
  },
  typography: {
    fontFamily:
      "'Inter', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeightMedium: 500,
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiAppBar: {
      defaultProps: { color: 'inherit', elevation: 0 },
    },
  },
})

export default theme
