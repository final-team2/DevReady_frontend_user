import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Box, Typography, Button } from '@mui/material'
import {
  Code, Storage, Dashboard, Public, Terminal, Person, Work,
  Psychology, ChatBubbleOutlineOutlined, ChevronRight, CheckCircle,
  Description, Shield, Mood, Bolt, WarningAmber, CreditCard, Lock, Videocam, Mic,
} from '@mui/icons-material'
import { useAuthStore } from '../store/useAuthStore'

const STEPS = ['이용 동의', '이력서·질문 수', '면접 환경', '설정 요약', '장비 점검']

const JOBS = [
  { id: 'frontend', icon: Dashboard, label: '프론트엔드', desc: 'React, Vue, CSS' },
  { id: 'backend', icon: Storage, label: '백엔드', desc: 'Node, Spring, DB' },
  { id: 'fullstack', icon: Public, label: '풀스택', desc: 'Frontend + Backend' },
  { id: 'devops', icon: Terminal, label: 'DevOps', desc: 'Docker, K8s, CI/CD' },
  { id: 'web-general', icon: Code, label: '웹 개발 전반', desc: 'ICT 공통' },
]

const LEVELS = [
  { id: 'newcomer', label: '신입 (0년)', desc: '졸업 예정 / 인턴 경험' },
  { id: 'junior', label: '주니어 (1~3년)', desc: '실무 경험 1~3년' },
  { id: 'mid', label: '미들 (3년+)', desc: '프로젝트 리드 경험' },
]

const TYPES = [
  { id: 'tech', icon: Psychology, label: '기술 면접', desc: 'CS·언어·프레임워크 지식 검증' },
  { id: 'personality', icon: Person, label: '인성 면접', desc: '가치관·협업·문제해결 성향' },
  { id: 'job', icon: Work, label: '직무 면접', desc: '실무 경험·프로젝트 기반 질문' },
  { id: 'comprehensive', icon: ChatBubbleOutlineOutlined, label: '종합 면접', desc: '기술+인성+직무 통합' },
]

const INTERVIEWER_TYPES = [
  { id: 'normal', icon: Mood, label: '일반형', desc: '표준적인 면접 방식, 균형 잡힌 질문', color: '#6366F1' },
  { id: 'pressure', icon: WarningAmber, label: '압박형', desc: '날카로운 질문, 모순 지적형', color: '#EF4444' },
  { id: 'followup', icon: ChatBubbleOutlineOutlined, label: '꼬리질문형', desc: '답변마다 심화 꼬리질문 연속', color: '#F59E0B' },
  { id: 'friendly', icon: Mood, label: '친화형', desc: '편안한 분위기, 대화형 진행', color: '#10B981' },
]

const CONSENT_ITEMS = [
  { id: 'ai_data', label: 'AI 학습 목적 답변 데이터 활용', required: true, detail: '답변 내용은 서비스 품질 개선에 익명으로 사용됩니다.' },
  { id: 'video_record', label: '면접 영상 분석 (선택)', required: false, detail: "동의하면 카메라로 표정·시선을 분석하는 '영상 면접'으로, 미동의 시 카메라 없이 '음성 면접'으로 진행됩니다." },
  { id: 'voice_analyze', label: '음성 STT 및 분석 데이터 활용', required: true, detail: 'Web Speech API로 음성을 텍스트로 변환하고 분석합니다.' },
  { id: 'marketing', label: '서비스 개선을 위한 익명 통계 활용', required: false, detail: '익명 처리된 통계 데이터를 서비스 개선에 활용합니다.' },
]

const RESUMES = [
  { id: 'r1', title: '프론트엔드 신입 이력서', date: '2026-06-10', desc: 'React · TypeScript 중심' },
  { id: 'r2', title: 'React 개발자 이력서', date: '2026-05-22', desc: '실무 프로젝트 2건 포함' },
  { id: 'r3', title: '포트폴리오 통합본', date: '2026-04-30', desc: '전체 경력·프로젝트 요약' },
]

// Mock subscription check
const IS_PREMIUM = true

// 공통 sx
const SECONDARY = '#F8F9FF' // --secondary (원본 bg-secondary)
const CARD = { borderRadius: '12px', bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider' }
const SECTION_TITLE = { fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', mb: 1.5 }

export function InterviewSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const planId = location.state?.planId ?? null
  const jobContext = location.state?.jobId
    ? {
        jobId: location.state.jobId,
        company: location.state.company,
        title: location.state.title,
      }
    : null

  // 진입 가드: 비로그인 → 로그인. (이력서/결제/프리미엄 가드는 현재 mock 통과)
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth')
      return
    }
    // TODO: 인증/결제/이력서 실제 연동(김진희·김윤수 영역) — 이력서/프리미엄 가드는 현재 mock으로 기본 통과
  }, [isLoggedIn, navigate])

  const [step, setStep] = useState(0)
  const [job, setJob] = useState(jobContext ? 'frontend' : '')
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [interviewer, setInterviewer] = useState('normal')
  const [count, setCount] = useState(5)
  const [coverText, setCoverText] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [consents, setConsents] = useState(
    Object.fromEntries(CONSENT_ITEMS.map((c) => [c.id, false])),
  )
  const [resume, setResume] = useState('')

  const requiredIds = CONSENT_ITEMS.filter((c) => c.required).map((c) => c.id)
  const consentOk = requiredIds.every((id) => consents[id])
  const allChecked = CONSENT_ITEMS.every((c) => consents[c.id])
  const videoEnabled = consents.video_record // 영상 동의 → 영상 면접 / 미동의 → 음성 면접

  const canNext = [
    consentOk,
    !!resume,
    !!type,
    true,
    true,
  ][step]

  const toggleAll = () => {
    const next = !allChecked
    setConsents(Object.fromEntries(CONSENT_ITEMS.map((c) => [c.id, next])))
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      navigate('/interview/session', {
        state: { job, level, type, interviewer, count, coverText, resume, jobContext, videoEnabled, planId },
      })
    }
  }

  if (!IS_PREMIUM) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF0FF 100%)' }}>
        <Box sx={{ width: '100%', maxWidth: 448, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
            <Lock sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography component="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary', mb: 1.5 }}>프리미엄 전용 기능</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>AI 모의 면접은 프리미엄 구독자만 이용할 수 있습니다.</Typography>
          <Button
            onClick={() => navigate('/interview')}
            fullWidth
            sx={{ py: 1.5, borderRadius: '12px', bgcolor: 'primary.main', color: '#fff', fontWeight: 600, textTransform: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, '&:hover': { bgcolor: '#4F46E5', boxShadow: 'none' } }}
          >
            <CreditCard sx={{ fontSize: 16 }} />요금제 보러가기
          </Button>
          <Button onClick={() => navigate(-1)} sx={{ mt: 1.5, fontSize: '0.875rem', color: 'text.secondary', textTransform: 'none', '&:hover': { color: 'text.primary', bgcolor: 'transparent' } }}>
            돌아가기
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 8, background: 'linear-gradient(135deg, #F8F9FF 0%, #EEF0FF 100%)' }}>
      <Box sx={{ width: '100%', maxWidth: 672 }}>
        {jobContext && (
          <Box sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'rgba(99,102,241,0.2)', bgcolor: 'rgba(99,102,241,0.05)', p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Work sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0, mt: 0.25 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 0.25 }}>
                  {jobContext.company} — {jobContext.title} 맞춤 면접
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>해당 공고에 최적화된 면접 질문으로 연습합니다</Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: '9999px', bgcolor: 'rgba(99,102,241,0.1)', border: '1px solid', borderColor: 'rgba(99,102,241,0.2)', color: 'primary.main', fontSize: '0.75rem', mb: 2 }}>
            <Bolt sx={{ fontSize: 12 }} />프리미엄 서비스
          </Box>
          <Typography component="h1" sx={{ fontSize: '1.875rem', fontWeight: 700, color: 'text.primary', mb: 1 }}>면접 설정</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>맞춤 면접을 위한 정보를 입력해주세요</Typography>
        </Box>

        {/* Progress */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 1 }}>
          {STEPS.map((label, i) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 500, transition: 'all .2s',
                    ...(i <= step ? { bgcolor: 'primary.main', color: '#fff' } : { bgcolor: '#fff', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }),
                  }}
                >
                  {i < step ? <CheckCircle sx={{ fontSize: 14 }} /> : i + 1}
                </Box>
                <Typography
                  component="span"
                  sx={{ fontSize: '0.75rem', mt: 0.5, display: { xs: 'none', sm: 'block' }, ...(i === step ? { color: 'primary.main', fontWeight: 500 } : { color: 'text.secondary' }) }}
                >
                  {label}
                </Typography>
              </Box>
              {i < STEPS.length - 1 && <Box sx={{ flex: 1, height: '1px', mx: 0.5, bgcolor: i < step ? 'primary.main' : 'divider' }} />}
            </Box>
          ))}
        </Box>

        <Box sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', p: 4 }}>

          {/* Step 0: Consent */}
          {step === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Shield sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>면접 전 동의 절차</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2.5, lineHeight: 1.625 }}>
                AI 모의 면접 진행을 위해 아래 항목에 동의해주세요.<br />
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>필수 항목 동의 후 면접 시작이 가능합니다.</Box>
              </Typography>

              {/* All agree */}
              <Box
                onClick={toggleAll}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1.5, borderRadius: '12px', bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider', cursor: 'pointer', transition: 'border-color .15s', '&:hover': { borderColor: 'rgba(99,102,241,0.3)' } }}
              >
                <Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color .15s', ...(allChecked ? { bgcolor: 'primary.main', borderColor: 'primary.main' } : { borderColor: 'divider' }) }}>
                  {allChecked && <CheckCircle sx={{ fontSize: 14, color: '#fff' }} />}
                </Box>
                <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>전체 동의 (필수 + 선택)</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[...CONSENT_ITEMS].sort((a, b) => Number(b.required) - Number(a.required)).map((item) => (
                  <Box
                    key={item.id}
                    onClick={() => setConsents((c) => ({ ...c, [item.id]: !c[item.id] }))}
                    sx={{ p: 1.5, borderRadius: '12px', bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider', cursor: 'pointer', transition: 'border-color .15s', '&:hover': { borderColor: 'rgba(99,102,241,0.3)' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color .15s', ...(consents[item.id] ? { bgcolor: 'primary.main', borderColor: 'primary.main' } : { borderColor: 'divider' }) }}>
                          {consents[item.id] && <CheckCircle sx={{ fontSize: 14, color: '#fff' }} />}
                        </Box>
                        <Typography component="span" sx={{ fontSize: '0.875rem', color: 'text.primary' }}>{item.label}</Typography>
                      </Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', px: 1, py: 0.25, borderRadius: '9999px', fontWeight: 500, ...(item.required ? { bgcolor: 'rgba(99,102,241,0.1)', color: 'primary.main', border: '1px solid', borderColor: 'rgba(99,102,241,0.2)' } : { bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider', color: 'text.secondary' }) }}>
                        {item.required ? '필수' : '선택'}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.75, ml: '28px' }}>{item.detail}</Typography>
                  </Box>
                ))}
              </Box>

              {/* 선택된 방식 안내 (실시간) */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-start', gap: 1.25, p: 1.75, borderRadius: '12px', border: '1px solid', fontSize: '0.875rem', transition: 'border-color .15s', ...(videoEnabled ? { bgcolor: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' } : { bgcolor: SECONDARY, borderColor: 'divider' }) }}>
                {videoEnabled
                  ? <Videocam sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0, mt: 0.25 }} />
                  : <Mic sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0, mt: 0.25 }} />}
                <Box>
                  <Typography component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>선택된 방식: {videoEnabled ? '영상 면접' : '음성 면접'}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
                    {videoEnabled ? '카메라로 표정·시선까지 분석합니다.' : '카메라 없이 음성으로만 진행합니다.'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 1: 이력서 선택 + 질문 수 */}
          {step === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Description sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>이력서를 선택하세요</Typography>
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2 }}>면접에 사용할 이력서를 골라주세요. <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>(필수)</Box></Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                {RESUMES.map((r) => (
                  <Box
                    component="button"
                    key={r.id}
                    onClick={() => setResume(r.id)}
                    sx={{ p: 1.75, borderRadius: '12px', border: '1px solid', textAlign: 'left', cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...(resume === r.id ? { borderColor: 'primary.main', bgcolor: 'rgba(99,102,241,0.05)' } : { borderColor: 'divider', bgcolor: SECONDARY, '&:hover': { borderColor: 'rgba(99,102,241,0.4)' } }) }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Description sx={{ fontSize: 16, flexShrink: 0, color: resume === r.id ? 'primary.main' : 'text.secondary' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }}>{r.title}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>{r.desc} · {r.date}</Typography>
                      </Box>
                    </Box>
                    {resume === r.id && <CheckCircle sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0 }} />}
                  </Box>
                ))}
              </Box>

              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5 }}>
                <Typography component="label" sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', display: 'block', mb: 1.5 }}>질문 수</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[5, 10, 15].map((n) => (
                    <Box
                      component="button"
                      key={n}
                      onClick={() => setCount(n)}
                      sx={{ flex: 1, py: 1.25, borderRadius: '12px', border: '1px solid', fontSize: '0.875rem', cursor: 'pointer', transition: 'all .15s', ...(count === n ? { borderColor: 'primary.main', bgcolor: 'rgba(99,102,241,0.05)', color: 'primary.main', fontWeight: 500 } : { borderColor: 'divider', bgcolor: SECONDARY, color: 'text.secondary', '&:hover': { borderColor: 'rgba(99,102,241,0.3)' } }) }}
                    >
                      {n}문항
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 2: 면접 환경 (면접 유형 + 면접관 유형) */}
          {step === 2 && (
            <Box>
              <Typography component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>면접 환경을 설정하세요</Typography>

              <Typography component="h3" sx={SECTION_TITLE}>면접 유형</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 3 }}>
                {TYPES.map(({ id, icon: Icon, label, desc }) => (
                  <Box
                    component="button"
                    key={id}
                    onClick={() => setType(id)}
                    sx={{ p: 2, borderRadius: '12px', border: '1px solid', textAlign: 'left', cursor: 'pointer', transition: 'all .15s', ...(type === id ? { borderColor: 'primary.main', bgcolor: 'rgba(99,102,241,0.05)' } : { borderColor: 'divider', bgcolor: SECONDARY, '&:hover': { borderColor: 'rgba(99,102,241,0.4)' } }) }}
                  >
                    <Icon sx={{ fontSize: 20, mb: 1, color: type === id ? 'primary.main' : 'text.secondary' }} />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>{desc}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5 }}>
                <Typography component="h3" sx={SECTION_TITLE}>면접관 유형</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                  {INTERVIEWER_TYPES.map(({ id, icon: Icon, label, desc, color }) => (
                    <Box
                      component="button"
                      key={id}
                      onClick={() => setInterviewer(id)}
                      sx={{ p: 1.75, borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all .15s', ...(interviewer === id ? { border: '2px solid', borderColor: color, bgcolor: `${color}10` } : { border: '1px solid', borderColor: 'divider', bgcolor: SECONDARY, '&:hover': { borderColor: 'rgba(99,102,241,0.3)' } }) }}
                    >
                      <Icon sx={{ fontSize: 16, mb: 0.75, color: interviewer === id ? color : undefined }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}>{label}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25, lineHeight: 1.25 }}>{desc}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 3: 면접 설정 요약 (크게) */}
          {step === 3 && (
            <Box>
              <Typography component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>면접 설정 요약</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}>아래 설정으로 면접을 시작합니다. 확인 후 <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>면접 시작</Box>을 눌러주세요.</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                {[
                  ['이력서', RESUMES.find((r) => r.id === resume)?.title ?? '-'],
                  ['면접 방식', videoEnabled ? '영상 면접' : '음성 면접'],
                  ['면접 유형', TYPES.find((t) => t.id === type)?.label ?? '-'],
                  ['면접관', INTERVIEWER_TYPES.find((i) => i.id === interviewer)?.label ?? '-'],
                  ['질문 수', `${count}문항`],
                ].map(([k, v]) => (
                  <Box key={k} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 2, py: 2, borderRadius: '12px', bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider' }}>
                    <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{k}</Typography>
                    <Typography component="span" sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary' }}>{v}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Step 4: 장비 점검 (카메라·음성) */}
          {step === 4 && (
            <Box>
              <Typography component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>{videoEnabled ? '카메라·음성 점검' : '마이크 점검'}</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2.5 }}>
                {videoEnabled
                  ? '면접 전 카메라와 마이크가 정상 동작하는지 확인하세요.'
                  : '영상 미동의 — 카메라 없이 음성으로만 진행됩니다. 마이크가 정상 동작하는지 확인하세요.'}
              </Typography>

              <Box sx={{ display: 'grid', gap: 1.5, mb: 2, gridTemplateColumns: videoEnabled ? { xs: '1fr', sm: 'repeat(2, 1fr)' } : '1fr' }}>
                {/* 카메라 미리보기 (mock) — 영상 면접일 때만 */}
                {videoEnabled && (
                  <Box sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: '#111827', aspectRatio: '16 / 9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', position: 'relative', overflow: 'hidden' }}>
                    <Videocam sx={{ fontSize: 32, mb: 1 }} />
                    <Typography component="span" sx={{ fontSize: '0.75rem' }}>카메라 미리보기</Typography>
                    <Box component="span" sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#4ADE80' }}>
                      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '9999px', bgcolor: '#4ADE80', animation: 'srpulse 2s cubic-bezier(0.4,0,0.6,1) infinite', '@keyframes srpulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />정상 인식
                    </Box>
                  </Box>
                )}
                {/* 음성 입력 레벨 (mock) */}
                <Box sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: SECONDARY, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontSize: '0.875rem', color: 'text.primary' }}><Mic sx={{ fontSize: 16, color: 'primary.main' }} />마이크 입력</Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 40 }}>
                    {[40, 70, 55, 85, 60, 75, 45, 90, 50, 65].map((h, i) => (
                      <Box key={i} sx={{ flex: 1, borderRadius: '2px', bgcolor: 'rgba(99,102,241,0.6)', height: `${h}%` }} />
                    ))}
                  </Box>
                  <Box component="span" sx={{ fontSize: '11px', color: '#16A34A', mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircle sx={{ fontSize: 12 }} />음성이 정상적으로 입력됩니다</Box>
                </Box>
              </Box>

              {/* 환경 안내 — 영상이면 조도(표정) 경고, 음성이면 마이크 안내 */}
              {videoEnabled ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, borderRadius: '12px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', fontSize: '0.75rem', mb: 2 }}>
                  <WarningAmber sx={{ fontSize: 16, flexShrink: 0, mt: 0.25 }} />
                  <Box component="span">현재 주변 조도는 적절합니다. 빛이 부족하면 표정 분석 정확도가 떨어질 수 있어요.</Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, borderRadius: '12px', bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider', color: 'text.secondary', fontSize: '0.75rem', mb: 2 }}>
                  <Mic sx={{ fontSize: 16, flexShrink: 0, mt: 0.25, color: 'primary.main' }} />
                  <Box component="span">영상 미동의 — 카메라 없이 음성으로만 진행됩니다. 조용한 환경에서 또렷하게 답변해주세요.</Box>
                </Box>
              )}

              {/* 경고문 */}
              <Box sx={{ borderRadius: '12px', bgcolor: SECONDARY, border: '1px solid', borderColor: 'divider', p: 2 }}>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <WarningAmber sx={{ fontSize: 16, color: '#F97316' }} />면접 전 꼭 확인하세요
                </Box>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, fontSize: '0.75rem', color: 'text.secondary', '& > li + li': { mt: 0.75 } }}>
                  <Box component="li">• 주변 환경이나 장비에 따라 피드백 정확도에 영향을 줄 수 있습니다.</Box>
                  <Box component="li">• 면접 진행 중에는 <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>중단이 불가</Box>합니다.</Box>
                  <Box component="li">• 중단할 경우 분석·피드백 결과에 영향을 줄 수 있습니다.</Box>
                  <Box component="li">• 조용한 환경에서 정면을 바라보며 진행해주세요.</Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5 }}>
          {step > 0 ? (
            <Button onClick={() => setStep(step - 1)} sx={{ px: 2.5, py: 1.25, borderRadius: '12px', border: '1px solid', borderColor: 'divider', color: 'text.secondary', fontSize: '0.875rem', textTransform: 'none', boxShadow: 'none', '&:hover': { color: 'text.primary', bgcolor: '#fff' } }}>이전</Button>
          ) : <Box />}
          <Button
            onClick={handleNext}
            disabled={!canNext}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1.25, borderRadius: '12px', bgcolor: 'primary.main', color: '#fff', fontSize: '0.875rem', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#4F46E5', boxShadow: 'none' }, '&.Mui-disabled': { opacity: 0.4, bgcolor: 'primary.main', color: '#fff' } }}
          >
            {step < STEPS.length - 1 ? '다음' : '면접 시작'}
            <ChevronRight sx={{ fontSize: 16 }} />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default InterviewSetup
