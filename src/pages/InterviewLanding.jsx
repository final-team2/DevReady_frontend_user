import { useNavigate } from 'react-router'
import { Box, Typography, Button } from '@mui/material'
import {
  Psychology, CheckCircle, Star, PlayArrow, Mic, BarChart, Videocam,
  Description, Bolt, ChevronRight, EmojiEvents, TrendingUp, ChatBubbleOutlineOutlined,
} from '@mui/icons-material'
import { AIRecommendCard } from '../components/AIRecommendCard'
import { useAuthStore } from '../store/useAuthStore'

const FEATURES = [
  {
    icon: Psychology,
    title: 'AI 실시간 분석',
    desc: '답변 내용, 말하는 속도, 키워드 분포를 실시간으로 분석합니다.',
  },
  {
    icon: Description,
    title: '이력서 기반 맞춤 질문',
    desc: '내 이력서와 지원 공고를 바탕으로 맞춤형 면접 질문을 생성합니다.',
  },
  {
    icon: Videocam,
    title: '화상·음성 모의 면접',
    desc: '실제 면접처럼 카메라·마이크를 활용해 현장감 있는 연습이 가능합니다.',
  },
  {
    icon: BarChart,
    title: '상세 피드백 리포트',
    desc: '면접 종료 후 강점·약점·개선 포인트를 담은 리포트를 제공합니다.',
  },
  {
    icon: ChatBubbleOutlineOutlined,
    title: '꼬리 질문 대응 훈련',
    desc: 'AI 면접관이 답변에 맞게 즉석 꼬리 질문을 던져 실전 감각을 높입니다.',
  },
  {
    icon: TrendingUp,
    title: '성장 추이 트래킹',
    desc: '회차별 점수 변화를 비교해 실력 향상 추이를 한눈에 확인합니다.',
  },
]

const PLANS = [
  {
    id: 'basic',
    name: '1회 이용권',
    price: '9,900',
    originalPrice: null,
    per: '1회',
    desc: '단건 면접 연습에 적합',
    features: ['AI 모의면접 1회', '기본 피드백 리포트', '30일 이내 사용'],
    badge: null,
    highlight: false,
  },
  {
    id: 'standard',
    name: '월정액 스탠다드',
    price: '29,900',
    originalPrice: '39,900',
    per: '월',
    desc: '꾸준히 연습하는 취준생 추천',
    features: ['AI 모의면접 무제한', '상세 피드백 리포트', '이력서 기반 맞춤 질문', '성장 추이 리포트', '커뮤니티 프리미엄 배지'],
    badge: '가장 인기',
    highlight: true,
  },
  {
    id: 'premium',
    name: '월정액 프리미엄',
    price: '59,900',
    originalPrice: '79,900',
    per: '월',
    desc: '전문 피드백까지 원하는 분께',
    features: ['스탠다드 모든 혜택', '전문 면접관 1:1 피드백 (월 1회)', '공고 맞춤 자기소개서 첨삭', '우선 고객지원'],
    badge: '프리미엄',
    highlight: false,
  },
]

const REVIEWS = [
  { name: '이*현', company: '카카오 합격', rating: 5, text: '꼬리 질문이 진짜 면접이랑 거의 똑같아서 실전에서 당황하지 않았어요. 피드백 리포트도 구체적이고 정말 도움됐습니다.' },
  { name: '박*준', company: '네이버 합격', rating: 5, text: '이력서 기반 맞춤 질문이 신기했어요. 내 프로젝트 경험 기반으로 질문해줘서 어색함 없이 연습할 수 있었습니다.' },
  { name: '김*영', company: '토스 최종합격', rating: 5, text: '말하는 속도와 키워드 분석이 특히 좋았어요. 제가 말이 빠르다는 걸 처음 깨달았습니다. 덕분에 고쳤어요!' },
]

// How it works 3단계 (인라인 mock)
const HOW_STEPS = [
  { step: '01', icon: Description, title: '이력서 & 공고 선택', desc: '내 이력서와 지원할 공고를 선택하면 AI가 맞춤 질문을 생성합니다.' },
  { step: '02', icon: Mic, title: 'AI 면접 진행', desc: '실제 면접처럼 답변하면 AI 면접관이 꼬리 질문을 이어갑니다.' },
  { step: '03', icon: BarChart, title: '리포트 확인', desc: '면접 후 강점·약점·키워드 분석이 담긴 상세 리포트를 받습니다.' },
]

const STATS = [
  { value: '12,400+', label: '누적 면접 세션' },
  { value: '94%', label: '사용자 만족도' },
  { value: '3.2배', label: '합격률 향상' },
]

// 섹션 헤더 공통
function SectionHead({ title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 7 }}>
      <Typography component="h2" sx={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', mb: 1.5 }}>{title}</Typography>
      <Typography sx={{ color: '#6B7280' }}>{subtitle}</Typography>
    </Box>
  )
}

export function InterviewLanding() {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  function handleSelectPlan(planId) {
    if (!isLoggedIn) {
      navigate('/auth')
      return
    } // 비로그인 시 로그인 창으로
    // TODO: 이력서/인증 실제 연동(김진희·김윤수 영역) — 현재는 mock으로 기본 통과
    navigate('/interview/setup', { state: { planId } })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Hero */}
      <Box
        component="section"
        sx={{ position: 'relative', overflow: 'hidden', pt: 10, pb: 12, px: 2, background: 'linear-gradient(to bottom right, #EEF2FF, #FFFFFF, #FAF5FF)' }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #6C63FF22 0%, transparent 50%), radial-gradient(circle at 80% 70%, #8B5CF622 0%, transparent 50%)',
          }}
        />
        <Box sx={{ position: 'relative', maxWidth: 1024, mx: 'auto', textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(108,99,255,0.1)', color: '#6C63FF', borderRadius: '9999px', px: 2, py: 0.75, fontSize: '0.875rem', fontWeight: 500, mb: 3 }}>
            <Bolt sx={{ fontSize: 14 }} />
            AI 기반 모의 면접 서비스
          </Box>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '2.25rem', sm: '3rem', lg: '3.75rem' }, fontWeight: 700, color: '#111827', mb: 3, lineHeight: 1.25 }}
          >
            실전처럼 연습하고<br />
            <Box component="span" sx={{ color: '#6C63FF' }}>합격을 앞당기세요</Box>
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', color: '#6B7280', mb: 5, maxWidth: 672, mx: 'auto', lineHeight: 1.625 }}>
            AI 면접관이 내 이력서와 지원 공고를 분석해 맞춤 질문을 제시합니다. 실시간 피드백과 상세 리포트로 빠르게 성장하세요.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'center' }}>
            <Button
              onClick={() => handleSelectPlan('standard')}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, px: 4, py: 2, borderRadius: '12px',
                bgcolor: '#6C63FF', color: '#fff', fontWeight: 600, fontSize: '1rem', textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(108,99,255,0.25), 0 4px 6px -4px rgba(108,99,255,0.25)',
                '&:hover': { bgcolor: '#4F46E5', boxShadow: '0 10px 15px -3px rgba(108,99,255,0.25), 0 4px 6px -4px rgba(108,99,255,0.25)' },
              }}
            >
              <PlayArrow sx={{ fontSize: 16 }} />
              지금 시작하기
            </Button>
            <Button
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, px: 4, py: 2, borderRadius: '12px',
                border: '2px solid #E5E7EB', color: '#374151', fontWeight: 600, fontSize: '1rem', textTransform: 'none', bgcolor: 'transparent',
                '&:hover': { borderColor: '#6C63FF', color: '#6C63FF', bgcolor: 'transparent' },
              }}
            >
              요금제 보기
              <ChevronRight sx={{ fontSize: 16 }} />
            </Button>
          </Box>

          {/* Stats */}
          <Box sx={{ mt: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, maxWidth: 512, mx: 'auto' }}>
            {STATS.map((s) => (
              <Box key={s.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', mt: 0.5 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 기본 베이스 정보 → 레벨테스트 기준 AI 추천 */}
      <Box component="section" sx={{ px: 2, mt: -6, position: 'relative', zIndex: 10 }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto' }}>
          <AIRecommendCard variant="interview" />
        </Box>
      </Box>

      {/* How it works */}
      <Box component="section" sx={{ py: 10, px: 2, bgcolor: '#fff' }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto' }}>
          <SectionHead title="어떻게 진행되나요?" subtitle="간단한 3단계로 실전 면접을 경험하세요" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {HOW_STEPS.map(({ step, icon: Icon, title, desc }) => (
              <Box key={step} sx={{ position: 'relative', textAlign: 'center' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <Icon sx={{ fontSize: 24, color: '#6C63FF' }} />
                </Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#6C63FF', mb: 1 }}>STEP {step}</Typography>
                <Typography component="h3" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>{title}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.625 }}>{desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Features */}
      <Box component="section" sx={{ py: 10, px: 2, bgcolor: '#F9FAFB' }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto' }}>
          <SectionHead title="주요 기능" subtitle="DevReady만의 차별화된 기능을 경험하세요" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Box
                key={title}
                sx={{ bgcolor: '#fff', borderRadius: '16px', p: 3, border: '1px solid #F3F4F6', transition: 'box-shadow .15s', '&:hover': { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' } }}
              >
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Icon sx={{ fontSize: 20, color: '#6C63FF' }} />
                </Box>
                <Typography component="h3" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>{title}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.625 }}>{desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Plans */}
      <Box component="section" id="plans" sx={{ py: 10, px: 2, bgcolor: '#fff' }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto' }}>
          <SectionHead title="요금제 선택" subtitle="나에게 맞는 플랜으로 시작하세요" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, alignItems: 'stretch' }}>
            {PLANS.map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  position: 'relative', borderRadius: '16px', p: 3, display: 'flex', flexDirection: 'column', transition: 'box-shadow .15s',
                  border: plan.highlight ? '2px solid #6C63FF' : '2px solid #E5E7EB',
                  boxShadow: plan.highlight ? '0 20px 25px -5px rgba(108,99,255,0.1), 0 8px 10px -6px rgba(108,99,255,0.1)' : 'none',
                  '&:hover': plan.highlight ? {} : { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
                }}
              >
                {plan.badge && (
                  <Box
                    sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', px: 2, py: 0.5, borderRadius: '9999px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', bgcolor: '#6C63FF' }}
                  >
                    {plan.badge}
                  </Box>
                )}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>{plan.name}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>{plan.desc}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  {plan.originalPrice && (
                    <Typography sx={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'line-through', mb: 0.25 }}>₩{plan.originalPrice}</Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                    <Typography component="span" sx={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>₩{plan.price}</Typography>
                    <Typography component="span" sx={{ fontSize: '0.875rem', color: '#6B7280', mb: 0.5 }}>/ {plan.per}</Typography>
                  </Box>
                </Box>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 4, flex: 1, '& > li + li': { mt: 1.25 } }}>
                  {plan.features.map((f) => (
                    <Box component="li" key={f} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.875rem', color: '#374151' }}>
                      <CheckCircle sx={{ fontSize: 16, mt: 0.25, flexShrink: 0, color: '#6C63FF' }} />
                      {f}
                    </Box>
                  ))}
                </Box>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  fullWidth
                  sx={{
                    py: 1.5, borderRadius: '12px', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', boxShadow: 'none',
                    ...(plan.highlight
                      ? { bgcolor: '#6C63FF', color: '#fff', '&:hover': { bgcolor: '#4F46E5', boxShadow: 'none' } }
                      : { border: '2px solid #E5E7EB', color: '#374151', bgcolor: 'transparent', '&:hover': { borderColor: '#6C63FF', color: '#6C63FF', bgcolor: 'transparent' } }),
                  }}
                >
                  선택하기
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Reviews */}
      <Box component="section" sx={{ py: 10, px: 2, bgcolor: '#F9FAFB' }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto' }}>
          <SectionHead title="합격자들의 후기" subtitle="DevReady와 함께 꿈의 기업에 합격했습니다" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {REVIEWS.map((r) => (
              <Box key={r.name} sx={{ bgcolor: '#fff', borderRadius: '16px', p: 3, border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mb: 1.5 }}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} sx={{ fontSize: 16, color: '#FACC15' }} />
                  ))}
                </Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.625, mb: 2 }}>"{r.text}"</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '9999px', bgcolor: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#6C63FF' }}>
                    {r.name[0]}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{r.name}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6C63FF' }}>{r.company}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* CTA */}
      <Box component="section" sx={{ py: 10, px: 2 }}>
        <Box
          sx={{ maxWidth: 768, mx: 'auto', borderRadius: '24px', p: 6, textAlign: 'center', color: '#fff', background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)' }}
        >
          <EmojiEvents sx={{ fontSize: 48, display: 'block', mx: 'auto', mb: 2, opacity: 0.9 }} />
          <Typography component="h2" sx={{ fontSize: '1.875rem', fontWeight: 700, mb: 1.5 }}>지금 바로 시작하세요</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, fontSize: '1rem' }}>
            합격을 향한 첫 번째 모의 면접, 오늘부터 시작해보세요.
          </Typography>
          <Button
            onClick={() => handleSelectPlan('standard')}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 4, py: 2, borderRadius: '12px', bgcolor: '#fff', color: '#6C63FF', fontWeight: 600, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#F9FAFB', boxShadow: 'none' } }}
          >
            <PlayArrow sx={{ fontSize: 16 }} />
            모의 면접 시작하기
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default InterviewLanding
