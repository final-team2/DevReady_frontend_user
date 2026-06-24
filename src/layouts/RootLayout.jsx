import { useState } from 'react'
import { Outlet, useNavigate, Link as RouterLink } from 'react-router'
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Avatar,
  Typography,
} from '@mui/material'
import { useAuthStore } from '../store/useAuthStore'

// 네비 구성 출처: test-demo-UI/src/app/components/Root.tsx 의 NAV_MAIN.
// "관리자 패널" 링크는 의도적으로 제외(프로필 메뉴에서도 제외).
const NAV_MAIN = [
  {
    label: '교육',
    href: '/education',
    dropdown: [
      { label: '전체 강좌', href: '/education' },
      { label: '알고리즘', href: '/education?category=algorithm' },
      { label: 'CS 기초', href: '/education?category=cs' },
      { label: '프론트엔드', href: '/education?category=frontend' },
      { label: '백엔드', href: '/education?category=backend' },
      { label: 'AI 퀴즈 시작', href: '/education' },
    ],
  },
  {
    label: '공고',
    href: '/jobs',
    dropdown: [
      { label: '공고 리스트', href: '/jobs' },
      { label: '찜한 공고', href: '/jobs?saved=true' },
    ],
  },
  {
    label: '캘린더',
    href: '/calendar',
    dropdown: [
      { label: '교육 캘린더', href: '/calendar?type=edu' },
      { label: '공고 캘린더', href: '/calendar?type=job' },
    ],
  },
  {
    label: '이력서',
    href: '/resume',
    dropdown: [
      { label: '이력서 작성', href: '/resume' },
      { label: '히스토리', href: '/resume?tab=history' },
    ],
  },
  { label: '모의 면접', href: '/interview', badge: '유료' },
  {
    label: '커뮤니티',
    href: '/community',
    dropdown: [
      { label: '질문 아카이브', href: '/community?tab=qna' },
      { label: '자유 게시판', href: '/community?tab=free' },
    ],
  },
]

export default function RootLayout() {
  const navigate = useNavigate()
  const { isLoggedIn, user, login, logout } = useAuthStore()

  const [navAnchor, setNavAnchor] = useState(null)
  const [openMenu, setOpenMenu] = useState(null) // 열린 드롭다운 label
  const [profileAnchor, setProfileAnchor] = useState(null)

  const openNav = (e, label) => {
    setNavAnchor(e.currentTarget)
    setOpenMenu(label)
  }
  const closeNav = () => {
    setNavAnchor(null)
    setOpenMenu(null)
  }
  const go = (href) => {
    closeNav()
    setProfileAnchor(null)
    navigate(href)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            {/* 로고 */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                mr: 2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: '-0.05em' }}
                >
                  DR
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: 18 }}>
                DevReady
              </Typography>
            </Box>

            {/* 메인 네비 (md 이상) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
              {NAV_MAIN.map((item) => (
                <Box key={item.href}>
                  <Button
                    color="inherit"
                    onClick={(e) => (item.dropdown ? openNav(e, item.label) : go(item.href))}
                    sx={{ color: 'text.secondary' }}
                  >
                    {item.label}
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        color="primary"
                        sx={{ ml: 0.75, height: 18, fontSize: 11 }}
                      />
                    )}
                  </Button>
                  {item.dropdown && (
                    <Menu
                      anchorEl={navAnchor}
                      open={openMenu === item.label}
                      onClose={closeNav}
                    >
                      {item.dropdown.map((d) => (
                        <MenuItem key={`${item.label}-${d.label}`} onClick={() => go(d.href)}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </Box>
              ))}
            </Box>

            {/* 우측: 로그인 상태에 따라 프로필 메뉴 / 로그인 버튼 */}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoggedIn ? (
                <>
                  <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} size="small">
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        fontSize: 13,
                      }}
                    >
                      {user?.name?.[0] ?? '김'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={profileAnchor}
                    open={Boolean(profileAnchor)}
                    onClose={() => setProfileAnchor(null)}
                  >
                    <MenuItem onClick={() => go('/mypage')}>마이페이지</MenuItem>
                    <MenuItem onClick={() => go('/resume')}>이력서 관리</MenuItem>
                    <MenuItem onClick={() => go('/history')}>면접 기록</MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        logout()
                        setProfileAnchor(null)
                        navigate('/')
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      로그아웃
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" sx={{ color: 'text.secondary' }} onClick={() => navigate('/auth')}>
                    로그인
                  </Button>
                  {/* 데모: Zustand 스토어로 로그인 상태를 토글한다. 실제 인증은 이후 단계에서 연동. */}
                  <Button
                    variant="contained"
                    onClick={() => login({ name: '김지수', email: 'jisu@example.com' })}
                  >
                    무료 시작
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
