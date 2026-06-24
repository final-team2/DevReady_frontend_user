import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, Typography, Button, IconButton, InputBase, Avatar, Chip, Stack } from '@mui/material'
import {
  Search, ChevronRight, ChevronLeft, Place, Favorite, FavoriteBorder,
  ArrowForward, Bolt, CalendarMonth, School, TrendingUp, MenuBook,
  Description, Code, Storage, Layers, Memory, Public, DesignServices,
  BarChart, Apartment, Psychology, Work, People,
} from '@mui/icons-material'
import { AdBanner } from '../components/AdBanner'

// 미니 캘린더용 인라인 mock (면접·코딩테스트·공고 마감 일정)
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

const CALENDAR_EVENTS = [
  { date: '2026-06-16', type: '면접', company: '카카오', color: '#6C63FF' },
  { date: '2026-06-19', type: '코딩테스트', company: '네이버', color: '#10B981' },
  { date: '2026-06-20', type: '마감', company: '토스', color: '#EF4444' },
  { date: '2026-06-24', type: '면접', company: '당근', color: '#F59E0B' },
  { date: '2026-06-28', type: '마감', company: '라인', color: '#3B82F6' },
]

// 교육센터 학습 진행도 mock (EducationPage의 COURSES와 동일 값)
const LEARNING_COURSES = [
  { title: '알고리즘 기초 완성', done: 28, total: 42, color: '#6366F1' },
  { title: 'React & TypeScript 심화', done: 29, total: 36, color: '#F59E0B' },
  { title: '네트워크 & HTTP', done: 11, total: 24, color: '#3B82F6' },
]
const LEARNING_OVERALL = Math.round(
  (LEARNING_COURSES.reduce((s, c) => s + c.done, 0) /
    LEARNING_COURSES.reduce((s, c) => s + c.total, 0)) * 100,
)

const JOB_CATEGORIES = [
  { icon: Code, label: '프론트엔드' },
  { icon: Storage, label: '백엔드' },
  { icon: Layers, label: '풀스택' },
  { icon: Memory, label: 'AI/ML' },
  { icon: Public, label: 'DevOps' },
  { icon: DesignServices, label: 'UI/UX' },
  { icon: BarChart, label: '데이터' },
  { icon: Apartment, label: '기획/PM' },
]

const RECOMMENDED_JOBS = [
  {
    id: 1,
    company: '카카오',
    companyInitial: 'K',
    companyColor: '#FEE500',
    textColor: '#3C1E1E',
    title: '프론트엔드 개발자 (신입/경력)',
    location: '경기 성남시',
    experience: '신입·경력',
    tags: ['React', 'TypeScript'],
    deadline: 'D-5',
    isNew: true,
    isSaved: false,
  },
  {
    id: 2,
    company: '네이버',
    companyInitial: 'N',
    companyColor: '#03C75A',
    textColor: '#fff',
    title: '백엔드 개발자 (Java/Spring)',
    location: '경기 성남시',
    experience: '3년 이상',
    tags: ['Java', 'Spring Boot'],
    deadline: 'D-12',
    isNew: false,
    isSaved: true,
  },
  {
    id: 3,
    company: '토스',
    companyInitial: 'T',
    companyColor: '#1B6AF6',
    textColor: '#fff',
    title: 'iOS 개발자 (Swift)',
    location: '서울 강남구',
    experience: '신입·경력',
    tags: ['Swift', 'SwiftUI'],
    deadline: 'D-3',
    isNew: true,
    isSaved: false,
  },
  {
    id: 4,
    company: '당근',
    companyInitial: 'D',
    companyColor: '#FF7E36',
    textColor: '#fff',
    title: '풀스택 개발자',
    location: '서울 서초구',
    experience: '경력 2년↑',
    tags: ['React', 'Go'],
    deadline: 'D-8',
    isNew: false,
    isSaved: false,
  },
  {
    id: 5,
    company: '쿠팡',
    companyInitial: 'C',
    companyColor: '#EE1C25',
    textColor: '#fff',
    title: '데이터 엔지니어',
    location: '서울 송파구',
    experience: '3년 이상',
    tags: ['Python', 'Spark'],
    deadline: 'D-15',
    isNew: false,
    isSaved: false,
  },
  {
    id: 6,
    company: '라인',
    companyInitial: 'L',
    companyColor: '#00B900',
    textColor: '#fff',
    title: 'Android 개발자',
    location: '경기 성남시',
    experience: '신입·경력',
    tags: ['Kotlin', 'Jetpack'],
    deadline: 'D-20',
    isNew: true,
    isSaved: false,
  },
]

// 미니 캘린더 기준일 (보고서 화면이 항상 일정과 맞물려 보이도록 고정)
const CAL_TODAY = new Date(2026, 5, 16)

function calDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate()
}
function calFirstWeekday(y, m) {
  return new Date(y, m, 1).getDay()
}
function calDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function calDaysUntil(dateStr) {
  const d = new Date(dateStr)
  d.setHours(23, 59, 59, 999)
  return Math.ceil((d.getTime() - CAL_TODAY.getTime()) / 86400000)
}

const QUICK_LINKS = [
  { icon: Psychology, label: 'AI 모의면접', href: '/interview', highlight: true },
  { icon: MenuBook, label: '교육 강의', href: '/education' },
  { icon: Work, label: '공고 검색', href: '/jobs' },
  { icon: Description, label: '이력서 작성', href: '/resume' },
  { icon: CalendarMonth, label: '일정 관리', href: '/calendar' },
  { icon: People, label: '커뮤니티', href: '/community' },
]

const PARTNER_COMPANIES = [
  { name: '카카오', color: '#FEE500', text: '#3C1E1E', initial: 'K' },
  { name: '네이버', color: '#03C75A', text: '#fff', initial: 'N' },
  { name: '토스', color: '#1B6AF6', text: '#fff', initial: 'T' },
  { name: '당근마켓', color: '#FF7E36', text: '#fff', initial: 'D' },
  { name: '쿠팡', color: '#EE1C25', text: '#fff', initial: 'C' },
  { name: '라인', color: '#00B900', text: '#fff', initial: 'L' },
  { name: '넥슨', color: '#2D2D2D', text: '#fff', initial: 'NX' },
  { name: '크래프톤', color: '#1A2847', text: '#fff', initial: 'KR' },
]

const COMMUNITY_POSTS = [
  { id: 1, tag: '면접후기', title: '카카오 프론트엔드 최종합격 후기 공유합니다', likes: 148, time: '30분 전' },
  { id: 2, tag: '스터디', title: 'React/TypeScript 스터디 3기 모집 (주 2회)', likes: 67, time: '1시간 전' },
  { id: 3, tag: '질문', title: 'CS 질문 - OS 스케줄링 알고리즘 이해가 잘 안되는데요', likes: 34, time: '2시간 전' },
  { id: 4, tag: '자유', title: '취준 6개월 만에 토스 최종합격했습니다 ㅠㅠ', likes: 312, time: '3시간 전' },
]

const TAG_COLORS = {
  면접후기: '#6C63FF',
  스터디: '#10B981',
  질문: '#F59E0B',
  자유: '#6B7280',
}

// 공통 sx
const CARD = { bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px' }
const CARD_TITLE = { fontWeight: 600, fontSize: '0.875rem', color: '#111827' }
const SECTION_HEAD = {
  px: 2, py: 1.5, borderBottom: '1px solid #F3F4F6',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
}
const MORE_BTN = {
  minWidth: 0, p: 0, lineHeight: 1, textTransform: 'none', fontSize: '0.75rem',
  color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: 0.25,
  '&:hover': { bgcolor: 'transparent', color: '#4F46E5' },
}
const DIVIDE_50 = { '& > *': { borderTop: '1px solid #F9FAFB' }, '& > *:first-of-type': { borderTop: 'none' } }

export function LandingPage() {
  const navigate = useNavigate()
  const [calView, setCalView] = useState({ year: CAL_TODAY.getFullYear(), month: CAL_TODAY.getMonth() })
  const [selectedDate, setSelectedDate] = useState(null)

  function shiftMonth(delta) {
    setCalView((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
    setSelectedDate(null)
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [savedJobs, setSavedJobs] = useState(new Set([2]))

  function toggleSave(id) {
    setSavedJobs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F8FA' }}>

      {/* ── Hero Search ─────────────────────────────────────── */}
      <Box component="section" sx={{ bgcolor: '#fff', borderBottom: '1px solid #E5E7EB', py: 4, px: 2 }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto', textAlign: 'center' }}>
          <Typography component="h1" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', mb: 0.5 }}>
            AI가 함께하는 <Box component="span" sx={{ color: '#6C63FF' }}>취업 준비</Box>, 지금 시작하세요
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', mb: 2.5 }}>
            공고 검색부터 AI 모의면접까지, 합격의 모든 과정을 지원합니다
          </Typography>

          <Box sx={{ maxWidth: 672, mx: 'auto', display: 'flex', gap: 1 }}>
            <Box
              sx={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff',
                border: '2px solid #E5E7EB', borderRadius: '12px', px: 2, py: 1.5,
                transition: 'border-color .15s', '&:focus-within': { borderColor: '#6C63FF' },
              }}
            >
              <Search sx={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0 }} />
              <InputBase
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="직무, 회사, 기술 스택으로 검색하세요"
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/jobs?q=${searchQuery}`)}
                sx={{ flex: 1, fontSize: '0.875rem', '& input::placeholder': { color: '#9CA3AF', opacity: 1 } }}
              />
            </Box>
            <Button
              onClick={() => navigate(`/jobs?q=${searchQuery}`)}
              sx={{
                px: 3, py: 1.5, borderRadius: '12px', bgcolor: '#6C63FF', color: '#fff',
                fontSize: '0.875rem', fontWeight: 600, textTransform: 'none', boxShadow: 'none',
                '&:hover': { bgcolor: '#6C63FF', opacity: 0.9, boxShadow: 'none' },
              }}
            >
              검색
            </Button>
          </Box>

          {/* Job category quick links */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
            {JOB_CATEGORIES.map(({ icon: Icon, label }) => (
              <Box
                component="button"
                key={label}
                onClick={() => navigate(`/jobs?category=${label}`)}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.75,
                  borderRadius: '9999px', border: 0, cursor: 'pointer', bgcolor: '#F3F4F6',
                  color: '#4B5563', fontSize: '0.75rem', transition: 'all .15s',
                  '&:hover': { bgcolor: '#EEF2FF', color: '#4F46E5' },
                }}
              >
                <Icon sx={{ fontSize: 12 }} />
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Main Content ─────────────────────────────────────── */}
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 2, py: 3 }}>
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>

          {/* ── LEFT: Recommended Jobs ───────────────────── */}
          <Box component="aside" sx={{ display: { xs: 'none', lg: 'block' }, width: 288, flexShrink: 0 }}>
            <Box sx={{ ...CARD, overflow: 'hidden' }}>
              <Box sx={SECTION_HEAD}>
                <Typography component="span" sx={CARD_TITLE}>오늘의 맞춤 공고</Typography>
                <Button onClick={() => navigate('/jobs')} sx={MORE_BTN}>
                  더보기 <ChevronRight sx={{ fontSize: 12 }} />
                </Button>
              </Box>
              <Box sx={DIVIDE_50}>
                {RECOMMENDED_JOBS.map((job) => (
                  <Box
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    sx={{ px: 2, py: 1.5, cursor: 'pointer', transition: 'background-color .15s', '&:hover': { bgcolor: '#F9FAFB' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
                          fontSize: '0.75rem', fontWeight: 700,
                          bgcolor: job.companyColor, color: job.textColor,
                        }}
                      >
                        {job.companyInitial}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
                          <Typography component="span" sx={{ fontSize: '0.75rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.company}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            {job.isNew && (
                              <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, px: 0.75, py: 0.25, borderRadius: '4px', bgcolor: '#EEF2FF', color: '#6C63FF' }}>
                                NEW
                              </Box>
                            )}
                            <Box
                              component="span"
                              sx={{ fontSize: '0.75rem', fontWeight: 500, color: parseInt(job.deadline.replace('D-', '')) <= 5 ? '#EF4444' : '#9CA3AF' }}
                            >
                              {job.deadline}
                            </Box>
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1F2937', mt: 0.25, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Box component="span" sx={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <Place sx={{ fontSize: 10 }} />{job.location}
                          </Box>
                          <Box component="span" sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{job.experience}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
                          {job.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ height: 20, borderRadius: '4px', bgcolor: '#F3F4F6', color: '#6B7280', fontSize: '0.75rem', '& .MuiChip-label': { px: 0.75 } }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); toggleSave(job.id) }}
                        sx={{ p: 0.5, mt: 0.25, flexShrink: 0, borderRadius: '4px', '&:hover': { bgcolor: '#F3F4F6' } }}
                      >
                        {savedJobs.has(job.id)
                          ? <Favorite sx={{ fontSize: 14, color: '#F87171' }} />
                          : <FavoriteBorder sx={{ fontSize: 14, color: '#D1D5DB' }} />}
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Quick links */}
            <Box sx={{ ...CARD, mt: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                <Typography component="span" sx={CARD_TITLE}>바로가기</Typography>
              </Box>
              <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {QUICK_LINKS.map(({ icon: Icon, label, href, highlight }) => (
                  <Box
                    component="button"
                    key={label}
                    onClick={() => navigate(href)}
                    sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, p: 1,
                      borderRadius: '8px', border: 0, cursor: 'pointer', textAlign: 'center',
                      bgcolor: highlight ? '#EEF2FF' : 'transparent', transition: 'background-color .15s',
                      '&:hover': { bgcolor: highlight ? '#E0E7FF' : '#F9FAFB' },
                    }}
                  >
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: highlight ? '#E0E7FF' : '#F3F4F6' }}>
                      <Icon sx={{ fontSize: 16, color: highlight ? '#4F46E5' : '#6B7280' }} />
                    </Box>
                    <Typography component="span" sx={{ fontSize: '0.75rem', lineHeight: 1.2, color: highlight ? '#4F46E5' : '#4B5563', fontWeight: highlight ? 500 : 400 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── CENTER: Main feed ─────────────────────── */}
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>

            {/* AI Interview promo banner */}
            <Box sx={{ borderRadius: '12px', p: 2.5, color: '#fff', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)' }}>
              <Box sx={{ position: 'absolute', right: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center', opacity: 0.1 }}>
                <Box component="span" sx={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, fontSize: '130px' }}>DR</Box>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', px: 1.25, py: 0.5, borderRadius: '9999px', mb: 1 }}>
                  <Bolt sx={{ fontSize: 12 }} />
                  AI 기반 모의면접
                </Box>
                <Typography component="h2" sx={{ fontSize: '1.125rem', fontWeight: 700, mb: 0.5 }}>실전처럼 연습하고, 합격을 앞당기세요</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', mb: 1.5 }}>이력서 기반 맞춤 질문 · 실시간 AI 피드백 · 상세 리포트 제공</Typography>
                <Button
                  onClick={() => navigate('/interview')}
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 2, py: 1, bgcolor: '#fff', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#6C63FF', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#F9FAFB', boxShadow: 'none' } }}
                >
                  모의면접 시작 <ArrowForward sx={{ fontSize: 14 }} />
                </Button>
              </Box>
            </Box>

            {/* Mini calendar (캘린더 자리) */}
            <Box sx={{ ...CARD, overflow: 'hidden' }}>
              {/* 헤더: 연·월 + 이전/다음 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth sx={{ fontSize: 16, color: '#6C63FF' }} />
                  <Typography component="span" sx={CARD_TITLE}>{calView.year}년 {calView.month + 1}월 일정</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton onClick={() => shiftMonth(-1)} aria-label="이전 달" sx={{ p: 0.5, borderRadius: '6px', color: '#9CA3AF', '&:hover': { bgcolor: '#F3F4F6', color: '#374151' } }}>
                    <ChevronLeft sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton onClick={() => shiftMonth(1)} aria-label="다음 달" sx={{ p: 0.5, borderRadius: '6px', color: '#9CA3AF', '&:hover': { bgcolor: '#F3F4F6', color: '#374151' } }}>
                    <ChevronRight sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* 월 달력 그리드 */}
              <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
                  {WEEK_DAYS.map((d, i) => (
                    <Box key={d} sx={{ textAlign: 'center', fontSize: '11px', py: 0.5, color: i === 0 ? '#F87171' : i === 6 ? '#60A5FA' : '#9CA3AF' }}>{d}</Box>
                  ))}
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 0.5 }}>
                  {(() => {
                    const cells = []
                    const firstWd = calFirstWeekday(calView.year, calView.month)
                    const total = calDaysInMonth(calView.year, calView.month)
                    const todayStr = calDateStr(CAL_TODAY.getFullYear(), CAL_TODAY.getMonth(), CAL_TODAY.getDate())
                    for (let i = 0; i < firstWd; i++) cells.push(<Box key={`blank-${i}`} />)
                    for (let day = 1; day <= total; day++) {
                      const ds = calDateStr(calView.year, calView.month, day)
                      const evs = CALENDAR_EVENTS.filter((e) => e.date === ds)
                      const isToday = ds === todayStr
                      const isSelected = ds === selectedDate
                      cells.push(
                        <Box
                          component="button"
                          key={ds}
                          className="cal-day-btn"
                          onClick={() => setSelectedDate((prev) => (prev === ds ? null : ds))}
                          title={evs.length > 0 ? evs.map((e) => `${e.company} · ${e.type}`).join(', ') : '일정 없음'}
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.25, border: 0, bgcolor: 'transparent', cursor: 'pointer' }}
                        >
                          <Box
                            component="span"
                            sx={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: 24, height: 24, borderRadius: '9999px', fontSize: '0.75rem', transition: 'background-color .15s',
                              ...(isToday
                                ? { bgcolor: '#4F46E5', color: '#fff', fontWeight: 600 }
                                : isSelected
                                  ? { bgcolor: '#E0E7FF', color: '#4338CA', fontWeight: 600, boxShadow: '0 0 0 1px #A5B4FC' }
                                  : { color: '#374151', '.cal-day-btn:hover &': { bgcolor: '#F3F4F6' } }),
                            }}
                          >
                            {day}
                          </Box>
                          <Box component="span" sx={{ display: 'flex', gap: '2px', height: 6, mt: 0.25 }}>
                            {evs.slice(0, 3).map((e, idx) => (
                              <Box component="span" key={idx} sx={{ width: 4, height: 4, borderRadius: '9999px', backgroundColor: e.color }} />
                            ))}
                          </Box>
                        </Box>,
                      )
                    }
                    return cells
                  })()}
                </Box>
              </Box>

              {/* 일정: 날짜 선택 시 해당 날짜 일정, 아니면 다가오는 일정 */}
              <Box sx={{ borderTop: '1px solid #F3F4F6', px: 2, py: 1.5, '& > * + *': { mt: 0.5 } }}>
                {selectedDate ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>
                        {Number(selectedDate.split('-')[1])}월 {Number(selectedDate.split('-')[2])}일 일정
                      </Typography>
                      <Box component="button" onClick={() => setSelectedDate(null)} sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, fontSize: '11px', color: '#4F46E5', '&:hover': { textDecoration: 'underline' } }}>
                        다가오는 일정 보기
                      </Box>
                    </Box>
                    {(() => {
                      const dayEvents = CALENDAR_EVENTS.filter((e) => e.date === selectedDate)
                      if (dayEvents.length === 0) {
                        return <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', px: 0.75, py: 1 }}>이 날은 등록된 일정이 없습니다.</Typography>
                      }
                      return dayEvents.map((e) => {
                        const dday = calDaysUntil(e.date)
                        return (
                          <Box
                            component="button"
                            key={e.date + e.company}
                            onClick={() => navigate('/calendar')}
                            sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.25, textAlign: 'left', border: 0, bgcolor: 'transparent', cursor: 'pointer', borderRadius: '8px', px: 0.75, py: 0.75, '&:hover': { bgcolor: '#F9FAFB' } }}
                          >
                            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '9999px', flexShrink: 0, backgroundColor: e.color }} />
                            <Typography component="span" sx={{ fontSize: '0.875rem', color: '#1F2937', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.company} · {e.type}</Typography>
                            <Box
                              component="span"
                              sx={{
                                fontSize: '11px', fontWeight: 600, px: 0.75, py: 0.25, borderRadius: '9999px', flexShrink: 0,
                                ...(dday === 0
                                  ? { bgcolor: '#EF4444', color: '#fff' }
                                  : dday > 0 && dday <= 3
                                    ? { bgcolor: '#FFEDD5', color: '#EA580C' }
                                    : dday > 0
                                      ? { bgcolor: '#F3F4F6', color: '#6B7280' }
                                      : { bgcolor: '#F3F4F6', color: '#9CA3AF' }),
                              }}
                            >
                              {dday === 0 ? 'D-DAY' : dday > 0 ? `D-${dday}` : '지난 일정'}
                            </Box>
                          </Box>
                        )
                      })
                    })()}
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', mb: 0.75 }}>다가오는 일정</Typography>
                    {CALENDAR_EVENTS
                      .filter((e) => calDaysUntil(e.date) >= 0)
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .slice(0, 3)
                      .map((e) => {
                        const dday = calDaysUntil(e.date)
                        const [, mm, dd] = e.date.split('-')
                        return (
                          <Box
                            component="button"
                            key={e.date + e.company}
                            onClick={() => setSelectedDate(e.date)}
                            sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.25, textAlign: 'left', border: 0, bgcolor: 'transparent', cursor: 'pointer', borderRadius: '8px', px: 0.75, py: 0.75, '&:hover': { bgcolor: '#F9FAFB' } }}
                          >
                            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '9999px', flexShrink: 0, backgroundColor: e.color }} />
                            <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9CA3AF', width: 36, flexShrink: 0 }}>{Number(mm)}/{Number(dd)}</Typography>
                            <Typography component="span" sx={{ fontSize: '0.875rem', color: '#1F2937', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.company} · {e.type}</Typography>
                            <Box
                              component="span"
                              sx={{
                                fontSize: '11px', fontWeight: 600, px: 0.75, py: 0.25, borderRadius: '9999px', flexShrink: 0,
                                ...(dday === 0
                                  ? { bgcolor: '#EF4444', color: '#fff' }
                                  : dday <= 3
                                    ? { bgcolor: '#FFEDD5', color: '#EA580C' }
                                    : { bgcolor: '#F3F4F6', color: '#6B7280' }),
                              }}
                            >
                              {dday === 0 ? 'D-DAY' : `D-${dday}`}
                            </Box>
                          </Box>
                        )
                      })}
                  </>
                )}
              </Box>

              {/* 학습 진행도 (교육센터 연동) */}
              <Box sx={{ borderTop: '1px solid #F3F4F6', px: 2, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <School sx={{ fontSize: 14, color: '#6C63FF' }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>학습 진행도</Typography>
                  </Box>
                  <Button onClick={() => navigate('/education')} sx={{ minWidth: 0, p: 0, lineHeight: 1, textTransform: 'none', fontSize: '11px', color: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: 0.25, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                    교육센터 <ChevronRight sx={{ fontSize: 12 }} />
                  </Button>
                </Box>

                {/* 전체 진행률 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                  <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9CA3AF', width: 32, flexShrink: 0 }}>전체</Typography>
                  <Box sx={{ flex: 1, height: 6, borderRadius: '9999px', bgcolor: '#F3F4F6', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', borderRadius: '9999px', width: `${LEARNING_OVERALL}%`, background: 'linear-gradient(90deg,#6C63FF,#8B5CF6)' }} />
                  </Box>
                  <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', width: 36, textAlign: 'right' }}>{LEARNING_OVERALL}%</Typography>
                </Box>

                {/* 강의별 진행률 */}
                <Stack spacing={1}>
                  {LEARNING_COURSES.slice(0, 2).map((c) => {
                    const pct = Math.round((c.done / c.total) * 100)
                    return (
                      <Box
                        component="button"
                        key={c.title}
                        onClick={() => navigate('/education')}
                        sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, textAlign: 'left', border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, '&:hover .courseTitle': { color: '#4F46E5' } }}
                      >
                        <Typography component="span" className="courseTitle" sx={{ fontSize: '0.75rem', color: '#4B5563', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color .15s' }}>{c.title}</Typography>
                        <Box sx={{ width: 64, height: 6, borderRadius: '9999px', bgcolor: '#F3F4F6', overflow: 'hidden', flexShrink: 0 }}>
                          <Box sx={{ height: '100%', borderRadius: '9999px', width: `${pct}%`, backgroundColor: c.color }} />
                        </Box>
                        <Typography component="span" sx={{ fontSize: '11px', color: '#9CA3AF', width: 32, textAlign: 'right', flexShrink: 0 }}>{pct}%</Typography>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Box sx={{ borderTop: '1px solid #F3F4F6', p: 1.5, textAlign: 'center' }}>
                <Button
                  onClick={() => navigate('/calendar')}
                  sx={{ minWidth: 0, p: 0, mx: 'auto', textTransform: 'none', fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { bgcolor: 'transparent', color: '#4F46E5' } }}
                >
                  캘린더 전체보기 <ChevronRight sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            </Box>

            {/* 인피드 광고 (추후 Google AdSense 연동) */}
            <AdBanner />

            {/* Community posts */}
            <Box sx={{ ...CARD, overflow: 'hidden' }}>
              <Box sx={SECTION_HEAD}>
                <Typography component="span" sx={CARD_TITLE}>커뮤니티 인기글</Typography>
                <Button onClick={() => navigate('/community')} sx={MORE_BTN}>
                  더보기 <ChevronRight sx={{ fontSize: 12 }} />
                </Button>
              </Box>
              <Box sx={DIVIDE_50}>
                {COMMUNITY_POSTS.map((post) => (
                  <Box
                    key={post.id}
                    onClick={() => navigate('/community')}
                    sx={{ px: 2, py: 1.5, cursor: 'pointer', transition: 'background-color .15s', display: 'flex', alignItems: 'center', gap: 1.5, '&:hover': { bgcolor: '#F9FAFB' } }}
                  >
                    <Chip
                      label={post.tag}
                      size="small"
                      sx={{ height: 'auto', borderRadius: '4px', bgcolor: `${TAG_COLORS[post.tag]}15`, color: TAG_COLORS[post.tag], fontSize: '0.75rem', fontWeight: 500, flexShrink: 0, '& .MuiChip-label': { px: 1, py: 0.25 } }}
                    />
                    <Typography sx={{ fontSize: '0.875rem', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', color: '#9CA3AF', flexShrink: 0 }}>
                      <FavoriteBorder sx={{ fontSize: 12 }} />{post.likes}
                    </Box>
                    <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9CA3AF', flexShrink: 0, display: { xs: 'none', sm: 'block' } }}>{post.time}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Education quick CTA */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box
                onClick={() => navigate('/education')}
                sx={{ borderRadius: '12px', p: 2, cursor: 'pointer', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', transition: 'opacity .15s', '&:hover': { opacity: 0.95 } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MenuBook sx={{ fontSize: 16, color: '#4F46E5' }} />
                  </Box>
                  <Typography component="span" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1F2937' }}>무료 강의</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#4B5563', mb: 1.5 }}>CS 기초부터 React 심화까지<br />무료로 학습하세요</Typography>
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                  강의 보러가기 <ChevronRight sx={{ fontSize: 12 }} />
                </Typography>
              </Box>
              <Box
                onClick={() => navigate('/resume')}
                sx={{ borderRadius: '12px', p: 2, cursor: 'pointer', background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', transition: 'opacity .15s', '&:hover': { opacity: 0.95 } }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Description sx={{ fontSize: 16, color: '#059669' }} />
                  </Box>
                  <Typography component="span" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1F2937' }}>AI 이력서 작성</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#4B5563', mb: 1.5 }}>AI가 내 경험을 분석해<br />매력적인 이력서를 완성해드려요</Typography>
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                  이력서 작성하기 <ChevronRight sx={{ fontSize: 12 }} />
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* ── RIGHT: Sidebar ───────────────────── */}
          <Stack spacing={2} sx={{ display: { xs: 'none', xl: 'flex' }, width: 224, flexShrink: 0 }}>
            {/* CTA card */}
            <Box sx={{ ...CARD, p: 2, textAlign: 'center' }}>
              <Box
                sx={{
                  position: 'relative', width: 48, height: 48, borderRadius: '14px', mx: 'auto', mb: 1.5, overflow: 'hidden',
                  background: 'linear-gradient(135deg,#7B6CFF 0%,#6C63FF 50%,#8B5CF6 100%)',
                  boxShadow: '0 8px 20px -4px rgba(108,99,255,0.5)',
                }}
              >
                {/* 상단 광택 하이라이트 */}
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: '50%', pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)' }} />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="span" sx={{ color: '#fff', lineHeight: 1, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em' }}>DR</Box>
                </Box>
              </Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937', mb: 0.5 }}>지금 무료로 시작</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 1.5 }}>가입하고 AI 면접<br />무료 체험 1회 제공</Typography>
              <Button
                fullWidth
                onClick={() => navigate('/auth')}
                sx={{ py: 1.25, borderRadius: '8px', bgcolor: '#6C63FF', color: '#fff', fontSize: '0.875rem', fontWeight: 600, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#6C63FF', opacity: 0.9, boxShadow: 'none' } }}
              >
                회원가입
              </Button>
              <Button
                fullWidth
                onClick={() => navigate('/auth')}
                sx={{ py: 1, borderRadius: '8px', color: '#4B5563', fontSize: '0.875rem', mt: 1, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#F9FAFB', boxShadow: 'none' } }}
              >
                로그인
              </Button>
            </Box>

            {/* Stats */}
            <Box sx={{ ...CARD, p: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', mb: 1.5 }}>플랫폼 현황</Typography>
              {[
                { label: '누적 면접 세션', value: '12,400+' },
                { label: '등록 기업', value: '1,240+' },
                { label: '채용 공고', value: '3,890' },
                { label: '합격 후기', value: '2,100+' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid #F9FAFB', '&:last-of-type': { borderBottom: 'none' } }}>
                  <Typography component="span" sx={{ fontSize: '0.75rem', color: '#6B7280' }}>{stat.label}</Typography>
                  <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1F2937' }}>{stat.value}</Typography>
                </Box>
              ))}
            </Box>

            {/* Trending keywords */}
            <Box sx={{ ...CARD, p: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 12, color: '#6366F1' }} />
                급상승 키워드
              </Typography>
              {['React 18', 'TypeScript', 'Next.js', 'Spring Boot', 'Kubernetes', 'LLM 파인튜닝'].map((kw, i) => (
                <Box
                  component="button"
                  key={kw}
                  onClick={() => navigate(`/jobs?q=${kw}`)}
                  sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1, py: 0.75, fontSize: '0.75rem', color: '#4B5563', textAlign: 'left', border: 0, bgcolor: 'transparent', cursor: 'pointer', transition: 'color .15s', '&:hover': { color: '#4F46E5' } }}
                >
                  <Box component="span" sx={{ width: 16, textAlign: 'center', fontWeight: 700, color: i < 3 ? '#6C63FF' : '#9CA3AF' }}>{i + 1}</Box>
                  {kw}
                </Box>
              ))}
            </Box>

            {/* SNS login hint */}
            <Box sx={{ bgcolor: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '12px', p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#854D0E', fontWeight: 500, mb: 0.5 }}>SNS 간편 로그인 지원</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#CA8A04' }}>카카오 · 네이버 · 구글</Typography>
            </Box>
          </Stack>
        </Box>

        {/* ── Partner companies strip ─────────────────────── */}
        <Box sx={{ mt: 3, ...CARD, overflow: 'hidden' }}>
          <Box sx={SECTION_HEAD}>
            <Typography component="span" sx={CARD_TITLE}>채용 중인 기업</Typography>
            <Button onClick={() => navigate('/jobs')} sx={MORE_BTN}>
              전체보기 <ChevronRight sx={{ fontSize: 12 }} />
            </Button>
          </Box>
          <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            {PARTNER_COMPANIES.map((co) => (
              <Box
                component="button"
                key={co.name}
                onClick={() => navigate('/jobs')}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0, border: 0, bgcolor: 'transparent', cursor: 'pointer', '&:hover .partnerLogo': { transform: 'scale(1.05)' } }}
              >
                <Avatar
                  variant="rounded"
                  className="partnerLogo"
                  sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: co.color, color: co.text, fontSize: '0.875rem', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'transform .15s' }}
                >
                  {co.initial}
                </Avatar>
                <Typography component="span" sx={{ fontSize: '0.75rem', color: '#4B5563' }}>{co.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Full-width banner ─────────────────────── */}
        <Box
          onClick={() => navigate('/education')}
          sx={{ mt: 2, borderRadius: '12px', p: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2, cursor: 'pointer', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', transition: 'opacity .15s', '&:hover': { opacity: 0.95 } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <School sx={{ fontSize: 24, color: '#fff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>취업 역량 강화 무료 특강</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', mt: 0.25 }}>코딩테스트 · CS · 면접 · 포트폴리오 완성 과정</Typography>
            </Box>
          </Box>
          <Button sx={{ ml: { sm: 'auto' }, flexShrink: 0, px: 2.5, py: 1.25, bgcolor: '#fff', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#312E81', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#F9FAFB', boxShadow: 'none' } }}>
            강의 보러가기
          </Button>
        </Box>
      </Box>

      {/* ── Footer ────────────────────────────────────────── */}
      <Box component="footer" sx={{ mt: 6, borderTop: '1px solid #E5E7EB', bgcolor: '#fff', py: 4, px: 2 }}>
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#6C63FF' }}>
                <Box component="span" sx={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, fontSize: '13px' }}>DR</Box>
              </Box>
              <Typography component="span" sx={{ fontWeight: 700, color: '#111827' }}>DevReady</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 3, rowGap: 1, fontSize: '0.75rem', color: '#6B7280' }}>
              {['이용약관', '개인정보처리방침', '고객센터', '공지사항', '회사소개', '광고문의'].map((link) => (
                <Box component="button" key={link} sx={{ border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, fontSize: '0.75rem', color: '#6B7280', transition: 'color .15s', '&:hover': { color: '#1F2937' } }}>{link}</Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            <Typography component="p" sx={{ m: 0 }}>(주)DevReady | 대표: 홍길동 | 사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-0000호</Typography>
            <Typography component="p" sx={{ m: 0, mt: 0.5 }}>서울특별시 강남구 테헤란로 000, 00층 | 고객센터: 02-0000-0000 | 이메일: help@interviewai.kr</Typography>
            <Typography component="p" sx={{ m: 0, mt: 1 }}>© 2026 DevReady Corp. All rights reserved.</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LandingPage
