import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'

import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import SignupPage from './pages/SignupPage'
import EducationPage from './pages/EducationPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CodingTestPage from './pages/CodingTestPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import CalendarPage from './pages/CalendarPage'
import ResumePage from './pages/ResumePage'
import InterviewLanding from './pages/InterviewLanding'
import InterviewPayment from './pages/InterviewPayment'
import InterviewSetup from './pages/InterviewSetup'
import InterviewSession from './pages/InterviewSession'
import InterviewReport from './pages/InterviewReport'
import CommunityPage from './pages/CommunityPage'
import HistoryPage from './pages/HistoryPage'
import SessionDetail from './pages/SessionDetail'
import MyPage from './pages/MyPage'
import NotFoundPage from './pages/NotFoundPage'

// 라우트 구성 출처: test-demo-UI/src/app/routes.ts
// 원본을 그대로 미러링하되 /admin 항목은 제외(관리자는 별도 레포/보류).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'education', element: <EducationPage /> },
      { path: 'education/course/:id', element: <CourseDetailPage /> },
      { path: 'education/coding-test', element: <CodingTestPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'interview', element: <InterviewLanding /> },
      { path: 'interview/payment', element: <InterviewPayment /> },
      { path: 'interview/setup', element: <InterviewSetup /> },
      { path: 'interview/session', element: <InterviewSession /> },
      { path: 'interview/report/:id', element: <InterviewReport /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'history/:id', element: <SessionDetail /> },
      { path: 'mypage', element: <MyPage /> },
      // /admin 은 의도적으로 제외
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
