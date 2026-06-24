import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AutoAwesome, ChevronRight, Tune, Speed } from '@mui/icons-material'
import { Box, Typography, Select, MenuItem } from '@mui/material'

// 회원가입/온보딩에서 받은 "기본 베이스 정보" 선택지 (mock)
const ROLES = ['프론트엔드', '백엔드', '풀스택', 'AI/ML', 'DevOps', '데이터']
const PURPOSES = ['실무 역량 강화', '취업 준비', '이직 준비', '기초 다지기']
const CAREERS = ['신입 (0~1년)', '주니어 (1~3년)', '미들 (3~5년)', '시니어 (5년+)']
const LANGUAGES = ['JavaScript', 'TypeScript', 'React']

// 레벨 테스트 결과 (mock)
const LEVEL_TEST = { label: '중급', score: 68 }

const RECO = {
  education: {
    title: '맞춤 학습 경로',
    desc: '레벨 테스트 결과와 기본 정보를 기준으로 추천된 강의예요.',
    items: ['React 성능 최적화 심화', 'TypeScript 타입 시스템', '프론트엔드 CS 면접 대비'],
    cta: '추천 강의 보기',
    href: '/education',
  },
  jobs: {
    title: '맞춤 공고 추천',
    desc: '희망 직군·경력·사용 언어에 맞는 공고를 우선 보여드려요.',
    items: ['카카오 프론트엔드 (신입)', '토스 React 개발자', '당근 웹 프론트엔드'],
    cta: '추천 공고 보기',
    href: '/jobs',
  },
  interview: {
    title: '맞춤 모의면접',
    desc: '레벨과 직군에 맞춘 난이도로 예상 질문을 구성했어요.',
    items: ['프론트엔드 기술면접 (중급)', 'React 심화 질문', 'CS 기초 면접'],
    cta: '모의면접 시작',
    href: '/interview/setup',
  },
}

const SELECT_SX = {
  bgcolor: '#fff',
  borderRadius: '8px',
  fontSize: '0.875rem',
  color: '#0F172A',
  '& .MuiSelect-select': { px: 1.25, py: 1 },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.07)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.07)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108,99,255,0.6)' },
}

function Field({ label, value, options, onChange }) {
  return (
    <Box>
      <Typography component="label" sx={{ fontSize: '11px', color: '#64748B', mb: 0.5, display: 'block' }}>{label}</Typography>
      <Select value={value} onChange={(e) => onChange(e.target.value)} fullWidth size="small" sx={SELECT_SX}>
        {options.map((o) => (
          <MenuItem key={o} value={o} sx={{ fontSize: '0.875rem' }}>{o}</MenuItem>
        ))}
      </Select>
    </Box>
  )
}

export function AIRecommendCard({ variant }) {
  const navigate = useNavigate()
  const [role, setRole] = useState(ROLES[0])
  const [purpose, setPurpose] = useState(PURPOSES[0])
  const [career, setCareer] = useState(CAREERS[0])
  const r = RECO[variant]

  return (
    <Box
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(108,99,255,0.2)',
        p: 2.5,
        mb: 4,
        background: 'linear-gradient(135deg, rgba(108,99,255,0.06), rgba(139,92,246,0.08))',
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome sx={{ fontSize: 20, color: '#6C63FF' }} />
          <Typography component="h2" sx={{ fontWeight: 700, color: '#0F172A' }}>AI 맞춤 추천</Typography>
          <Box
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', fontWeight: 500, color: '#6C63FF', bgcolor: 'rgba(108,99,255,0.1)', px: 1, py: 0.25, borderRadius: '9999px' }}
          >
            <Speed sx={{ fontSize: 12 }} />레벨테스트 {LEVEL_TEST.label} · {LEVEL_TEST.score}점
          </Box>
        </Box>
        <Box
          component="button"
          onClick={() => navigate('/resume')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, fontSize: '0.75rem', color: '#64748B', transition: 'color .15s', '&:hover': { color: '#6C63FF' } }}
        >
          <Tune sx={{ fontSize: 14 }} />이력서 작성하기
        </Box>
      </Box>

      {/* 기본 베이스 정보 4가지 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 1.25, mb: 2 }}>
        <Field label="희망 직군" value={role} options={ROLES} onChange={setRole} />
        <Field label="교육 목적" value={purpose} options={PURPOSES} onChange={setPurpose} />
        <Field label="경력" value={career} options={CAREERS} onChange={setCareer} />
        <Box>
          <Typography component="label" sx={{ fontSize: '11px', color: '#64748B', mb: 0.5, display: 'block' }}>사용 가능 언어</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 0.5, py: 0.75 }}>
            {LANGUAGES.map((l) => (
              <Box component="span" key={l} sx={{ fontSize: '11px', bgcolor: '#fff', border: '1px solid rgba(108,99,255,0.2)', color: '#6C63FF', px: 0.75, py: 0.25, borderRadius: '9999px' }}>{l}</Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 추천 결과 */}
      <Box sx={{ borderRadius: '12px', bgcolor: '#fff', border: '1px solid rgba(108,99,255,0.1)', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{r.title}</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 1.5 }}>{r.desc}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          {r.items.map((it) => (
            <Box component="span" key={it} sx={{ fontSize: '0.75rem', bgcolor: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.15)', color: '#0F172A', px: 1.25, py: 0.5, borderRadius: '8px' }}>{it}</Box>
          ))}
        </Box>
        <Box
          component="button"
          onClick={() => navigate(r.href)}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, fontSize: '0.875rem', fontWeight: 500, color: '#6C63FF', transition: 'color .15s', '&:hover': { color: '#4F46E5' } }}
        >
          {r.cta} <ChevronRight sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    </Box>
  )
}

export default AIRecommendCard
