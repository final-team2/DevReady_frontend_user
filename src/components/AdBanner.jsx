import { Campaign, OpenInNew } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

/**
 * 광고 슬롯 (인피드 네이티브 카드)
 *
 * 현재는 UI 프로토타입용 mock 자리표시자입니다. (백엔드/외부 스크립트 없음)
 *
 * ▶ 추후 Google AdSense 연동 시:
 *   아래 "AdSense 연동 자리" 영역의 mock 콘텐츠를 광고 유닛으로 교체하면 됩니다.
 *
 *   <ins className="adsbygoogle"
 *        style={{ display: "block" }}
 *        data-ad-client="ca-pub-XXXXXXXXXXXX"
 *        data-ad-slot="XXXXXXXXXX"
 *        data-ad-format="auto"
 *        data-full-width-responsive="true" />
 *   // index.html에 AdSense 로더 스크립트 추가 후,
 *   // useEffect 안에서 (window.adsbygoogle = window.adsbygoogle || []).push({}) 호출
 */
export function AdBanner({ sx = {} }) {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* 광고 라벨 (정직 표기) */}
      <Box
        component="span"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          fontSize: '10px',
          fontWeight: 500,
          color: '#9CA3AF',
          bgcolor: '#F3F4F6',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          px: 0.75,
          py: 0.25,
        }}
      >
        광고 · AD
      </Box>

      {/* ── AdSense 연동 자리 (현재는 mock 콘텐츠) ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 2.5 } }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg,#EEF0FF,#E7E9FF)',
          }}
        >
          <Campaign sx={{ fontSize: 24, color: '#6C63FF' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#111827',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            이 자리에 광고가 표시됩니다
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#6B7280',
              mt: 0.25,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            추후 Google AdSense 등 광고 네트워크가 연동될 영역입니다. 파트너 프로모션·강의·채용 배너가 노출됩니다.
          </Typography>
        </Box>
        <Box
          component="span"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.75rem',
            color: '#9CA3AF',
            flexShrink: 0,
          }}
        >
          Sponsored <OpenInNew sx={{ fontSize: 12 }} />
        </Box>
      </Box>
    </Box>
  )
}

export default AdBanner
