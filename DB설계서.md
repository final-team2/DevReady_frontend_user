# DevReady DB 설계서

> 2조 · 2026 한국ICT인재개발원 최종프로젝트 — *AI 융합 React 기반 개발자 진로·역량 통합 관리 시스템*  
> 원본 `DB설계서_2조_DevReady.pptx`(48슬라이드)를 마크다운으로 변환. **ERD 다이어그램**(개념·논리·물리)과 **테이블 기술서**(67개 테이블 컬럼 정의)를 포함한다.  
> 설계 4단계: 개념적 → 논리적 → 물리적 → 테이블 기술서.

**도메인 9 · 테이블 67개** — 회원&로그인 · 구독&결제&동의 · 이력서 · 모의면접 · 교육 · 커뮤니티 · 알림&신고 · 챗봇 · 관리자

---

## ERD 다이어그램

> 통합 ERD는 전체 구조 조감용이라 글자가 작습니다. 각 테이블의 컬럼·타입·키 상세는 아래 **테이블 기술서**를 참조하세요. 원본 PPT에는 도메인별 ERD(논리 6~13p, 물리 16~23p)도 있습니다.

### 개념적 설계 (Conceptual)

![개념적 설계 ERD](images/conceptual_erd.png)

### 논리적 설계 통합 ERD (Logical)

![논리적 설계 통합 ERD](images/logical_erd.png)

### 물리적 설계 통합 ERD (Physical)

![물리적 설계 통합 ERD](images/physical_erd.png)

---

## 테이블 기술서

표기: **PK / FK / N-N(NOT NULL)** 열의 `O`=해당, 빈칸=미해당. DEFAULT·CHECK는 원본 값 그대로.


### 1. 회원&로그인

#### `member` — 회원

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | member_id | 회원 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | email | 이메일 | VARCHAR(255) |  |  | O |  | UNIQUE |
| 3 | email_verified | 이메일 인증 여부 | TINYINT(1) |  |  | O | 0 |  |
| 4 | password | 비밀번호 | VARCHAR(255) |  |  | X |  |  |
| 5 | name | 이름 | VARCHAR(50) |  |  | O |  |  |
| 6 | phone | 전화번호 | VARCHAR(20) |  |  | O |  | UNIQUE |
| 7 | nickname | 닉네임 | VARCHAR(50) |  |  | O |  | UNIQUE |
| 8 | last_login_method | 최근 로그인 방식 | VARCHAR(30) |  |  | O |  | 'EMAIL','KAKAO','NAVER' |
| 9 | role | 권한 | VARCHAR(30) |  |  | O | 'USER' | 'USER','ADMIN' |
| 10 | status | 상태 | VARCHAR(30) |  |  | O | 'ACTIVE' | 'ACTIVE','DORMANT','WITHDRAWN','SUSPENDED','BANNED' |
| 11 | withdrawn_at | 탈퇴 일시 | DATETIME |  |  |  |  |  |
| 12 | joined_at | 가입일 | DATE |  |  | O | CURRENT_DATE |  |
| 13 | warning_count | 누적 경고 횟수 | INT |  |  | O | 0 |  |

#### `member_face` — Face ID 등록

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | face_id | Face ID 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  | UNIQUE |
| 3 | face_data | 얼굴 특징 데이터 | TEXT |  |  | O |  |  |
| 4 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `member_sns` — 회원 SNS 연동

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | sns_account_id | SNS 연동 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  | UNIQUE(member_id, provider) |
| 3 | provider | 제공자 | VARCHAR(100) |  |  | O |  | 'KAKAO','NAVER' |
| 4 | provider_uid | 제공자 고유 ID | VARCHAR(100) |  |  | O |  | UNIQUE(provider, provider_uid) |
| 5 | sns_email | 제공자 전달 이메일 | VARCHAR(255) |  |  |  |  |  |
| 6 | verified_at | 통합 인증 시각 | DATETIME |  |  |  |  |  |
| 7 | linked_at | 연동일 | DATE |  |  | O | CURRENT_DATE |  |


### 2. 구독&결제&동의

#### `subscription` — 구독

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | subscription_id | 구독 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  |  |
| 3 | plan_type | 플랜 종류 | VARCHAR(100) |  |  | O |  | 'ONE_TIME','STANDARD','PREMIUM' |
| 4 | start_date | 시작일 | DATE |  |  | O |  |  |
| 5 | end_date | 종료일 | DATE |  |  |  |  | CHECK(end_date >= start_date) |
| 6 | status | 상태 | VARCHAR(30) |  |  | O | ACTIVE | 'ACTIVE','EXPIRED','CANCELLED' |

#### `payment` — 결제

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | payment_id | 결제 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  |  |
| 3 | subscription_id | 구독 | BIGINT |  | O | O |  |  |
| 4 | amount | 결제 금액 | DECIMAL(10,2) |  |  | O |  | CHECK(amount>0) |
| 5 | transaction_no | 거래번호 | VARCHAR(100) |  |  | O |  | UNIQUE |
| 6 | paid_at | 결제일 | DATETIME |  |  |  |  |  |
| 7 | status | 상태 | VARCHAR(30) |  |  | O |  | 'PAID','FAILED','REFUNDED','READY','IN_PROGRESS' |
| 8 | created_at | 주문일 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `terms_agreement` — 회원 약관 동의 이력

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | agreement_id | 동의 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  | UNIQUE(member_id, policy_id) |
| 3 | policy_id | 정책 문서 | BIGINT |  | O | O |  |  |
| 4 | agreed | 동의 여부 | TINYINT(1) |  |  | O | 0 |  |
| 5 | responded_at | 응답 일시 | DATETIME |  |  | O |  |  |


### 3. 이력서

#### `resume` — 기본 이력서

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | resume_id | 이력서 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O | null |  |
| 3 | birth_date | 생년월일 | DATE |  |  |  | null |  |
| 4 | address | 주소 | VARCHAR(500) |  |  |  | null | ‘주소’, ‘세부주소’, ‘우편번호’ |
| 5 | github_url | 깃허브 링크 | VARCHAR(500) |  |  |  | null |  |
| 6 | portfolio_url | 포트폴리오 링크 | VARCHAR(500) |  |  |  | null |  |
| 7 | is_primary | 대표 이력서 여부 | TINYINT(1) |  |  | O | 0 |  |
| 8 | created_at | 작성일 | DATE |  |  | O | CURRENT_DATE |  |
| 9 | updated_at | 수정일 | DATE |  |  | O | null |  |

#### `job_resume` — 공고별 이력서

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | job_resume_id | 공고별이력서 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | resume_id | 기본 이력서 | BIGINT |  | O | O | null |  |
| 3 | job_posting_id | 대상 공고 | BIGINT |  | O | O | null |  |
| 4 | pdf_path | PDF 경로 | VARCHAR(500) |  |  | O | null |  |
| 5 | created_at | 작성일 | DATE |  |  | O | CURRENT_DATE |  |
| 6 | updated_at | 수정일 | DATE |  |  | O | null |  |

#### `academic` — 학력

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | academic_id | 학력 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | job_resume_id | 공고별이력서 | BIGINT |  | O | O | null |  |
| 3 | school_name | 학교명 | VARCHAR(100) |  |  | O | null |  |
| 4 | major | 학과 | VARCHAR(100) |  |  | O | null |  |
| 5 | admission_date | 입학일 | DATE |  |  | O | null |  |
| 6 | graduation_date | 졸업일 | DATE |  |  | O | null |  |
| 7 | gpa | 학점 | DECIMAL(3,2) |  |  | O | null |  |

#### `career` — 경력

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | career_id | 경력 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | resume_id | 기본이력서 | BIGINT |  | O | O | null |  |
| 3 | company_name | 회사명 | VARCHAR(100) |  |  | O | null |  |
| 4 | job_position | 직무 | VARCHAR(100) |  |  | O | null |  |
| 5 | start_date | 시작일 | DATE |  |  | O | null |  |
| 6 | end_date | 종료일 | DATE |  |  |  | null |  |
| 7 | employment_type | 근무 형태 | VARCHAR(100) |  |  | O | null | '정규직','계약직','인턴' |
| 8 | main_duties | 주요 업무 | VARCHAR(100) |  |  | O | null |  |

#### `certificate` — 자격증

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | certificate_id | 자격증 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | job_resume_id | 공고별이력서 | BIGINT |  | O | O | null |  |
| 3 | acquired_date | 취득년월 | DATE |  |  | O | null |  |
| 4 | certificate_name | 자격증명 | VARCHAR(100) |  |  | O | null |  |
| 5 | issuer | 발행기관 | VARCHAR(100) |  |  | O | null |  |

#### `resume_skill` — 이력서-스킬 연결

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | resume_skill_id | 연결 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | resume_id | 기본이력서 | BIGINT |  | O | O | null |  |
| 3 | skill_id | 스킬 | BIGINT |  | O | O | null |  |

#### `cover_letter_item` — 자기소개서 항목

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | cover_letter_item_id | 항목 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | job_resume_id | 공고별이력서 | BIGINT |  | O | O | null |  |
| 3 | template_id | 템플릿 | BIGINT |  | O | O | null |  |
| 4 | item_name | 항목명 | VARCHAR(100) |  |  | O | null |  |
| 5 | content | 내용 | TEXT |  |  | O | null |  |
| 6 | item_order | 항목 순서 | INT |  |  | O | null |  |

#### `cover_letter_template` — 자기소개서 기본 항목 템플릿 (관리자 관리)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | template_id | 템플릿 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | item_name | 항목명 | VARCHAR(100) |  |  | O | null |  |
| 3 | default_order | 기본 노출 순서 | INT |  |  | O | null |  |
| 4 | is_active | 사용 여부 | TINYINT(1) |  |  | O | 0 |  |
| 5 | admin_id | 등록 관리자 | BIGINT |  | O | O | null |  |

#### `skill` — 스킬

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | skill_id | 스킬 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | skill_name | 스킬명 | VARCHAR(100) |  |  | O | null |  |
| 3 | usage_count | 사용 횟수 | INT |  |  | O | 0 |  |


### 4. 모의면접

#### `interview_session` — 모의면접 세션

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | session_id | 세션 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | job_resume_id | 선택 이력서 | BIGINT |  | O | O |  |  |
| 4 | question_count | 질문 수 | INT |  |  | O |  |  |
| 5 | interview_type | 면접 유형 | VARCHAR(30) |  |  | O |  | '인성','기술','종합' |
| 6 | interviewer_type | 면접관 유형 | VARCHAR(30) |  |  | O |  | 'PRESSURE','FRIENDLY','NORMAL' |
| 7 | interviewer_count | 면접관 수 | INT |  |  | O |  |  |
| 8 | input_mode | 입력 모드 | VARCHAR(30) |  |  | O |  | 'TEXT','VOICE' |
| 9 | use_video | 영상 사용 여부 | TINYINT(1) |  |  | O | 0 |  |
| 10 | is_completed | 완료 여부 | TINYINT(1) |  |  | O | 0 |  |
| 11 | started_at | 시작 시각 | DATETIME |  |  | O |  |  |
| 12 | ended_at | 종료 시각 | DATETIME |  |  |  |  |  |

#### `question` — 질문

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | question_id | 질문 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | session_id | 세션 | BIGINT |  | O | O |  |  |
| 3 | question_text | 질문 텍스트 | TEXT |  |  | O |  |  |
| 4 | question_type | 질문 유형 | VARCHAR(30) |  |  | O |  |  |
| 5 | source | 출처 | VARCHAR(30) |  |  | O |  | 'AI','BANK' |
| 6 | difficulty | 난이도 | VARCHAR(100) |  |  | O |  | '하','중','상' |
| 7 | display_order | 제시 순서 | INT |  |  | O |  |  |
| 8 | parent_question_id | 부모 질문 | BIGINT |  | O |  |  |  |

#### `interview_report` — 종합 리포트

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | interview_report_id | 리포트 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | session_id | 세션 | BIGINT |  | O | O |  |  |
| 3 | item_score | 항목별 집계 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 4 | total_score | 총점 | DECIMAL(5,2) |  |  | O |  | BETWEEN 0 AND 100 |
| 5 | overall_comment | 총평 | TEXT |  |  | O |  |  |
| 6 | strengths | 강점 | TEXT |  |  | O |  |  |
| 7 | weaknesses | 약점 | TEXT |  |  | O |  |  |
| 8 | good_answer | 잘한_답변 | TEXT |  |  | O |  |  |
| 9 | improvement_needed | 개선_필요 | TEXT |  |  | O |  |  |
| 10 | model_answer | 모범_답변 | TEXT |  |  | O |  |  |
| 11 | created_at | 생성 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `answer` — 답변 코어

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | answer_id | 답변 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | question_id | 질문 | BIGINT |  | O | O |  |  |
| 3 | answer_text | 답변 텍스트 | TEXT |  |  | O |  |  |
| 4 | answer_order | 답변 순서 | INT |  |  | O |  | BETWEEN 1 AND 10 |

#### `answer_voice` — 답변 음성

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | answer_id | 답변 식별 값 | BIGINT |  | O | O |  |  |
| 2 | stt_text | STT 텍스트 | TEXT |  |  | O |  |  |
| 3 | speech_rate | 말하기 속도 | FLOAT |  |  | O |  |  |
| 4 | pause_time | 공백 시간 | FLOAT |  |  | O |  |  |
| 5 | pause_count | 공백 횟수 | INT |  |  | O | 0 |  |

#### `answer_video` — 답변 영상

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | answer_id | 답변 식별 | BIGINT | O | O | O |  |  |
| 2 | expression_score | 표정 수치 | TEXT |  |  | O |  |  |
| 3 | gaze_score | 시선 수치 | FLOAT |  |  | O |  |  |

#### `star_analysis` — STAR 분석

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | star_analysis_id | STAR 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | answer_id | 답변 | BIGINT |  | O | O |  |  |
| 3 | star_element | STAR 요소 | VARCHAR(100) |  |  | O |  |  |
| 4 | segment_text | 구간 텍스트 | TEXT |  |  | O |  |  |
| 5 | correction_highlight | 교정 하이라이트 | VARCHAR(100) |  |  | O |  |  |

#### `answer_score` — 5항목 채점

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | answer_id | 답변 | BIGINT |  | O | O |  |  |
| 2 | technical_accuracy_score | 기술정확성 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 3 | logical_structure_score | 논리구조 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 4 | specificity_score | 구체성 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 5 | depth_understanding_score | 심화이해 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 6 | communication_score | 커뮤니케이션 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 7 | total_score | 합산 점수 | DECIMAL(5,2) |  |  | O | 0 | BETWEEN 0 AND 100 |
| 8 | item_feedback | 항목별 피드백 | TEXT |  |  | O |  |  |

#### `interview_consent` — 면접 동의 이력

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | consent_id | 동의 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  |  |
| 3 | terms_type | 약관 유형 | VARCHAR(30) |  |  | O |  | 'SERVICE','PRIVACY','MARKETING' |
| 4 | agreed | 동의 여부 | TINYINT(1) |  |  | O | 0 |  |
| 5 | agreed_at | 동의 일시 | DATETIME |  |  | O |  |  |


### 5. 교육

#### `category` — 카테고리 (마스터)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | category_id | 카테고리 코드 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | category_name | 카테고리명 | VARCHAR(100) |  |  | O |  |  |

#### `career_profile` — 기본 정보 (맞춤 진로)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | career_profile_id | 맞춤 진로 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  |  |
| 3 | target_job_category | 희망 직군 | VARCHAR(50) |  |  | O |  |  |
| 4 | experience_level | 경력 수준 | VARCHAR(30) |  |  | O |  | '신입','경력' |
| 5 | goal | 목표 | VARCHAR(200) |  |  |  |  |  |

#### `level_test` — 레벨 테스트

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | level_test_id | 레벨테스트 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | career_profile_id | 기본 정보 | BIGINT |  | O | O |  |  |
| 4 | job_category_score | 직군별 측정 점수 | INT |  |  | O | 0 | BETWEEN 0 AND 100 |
| 5 | grade | 등급 | VARCHAR(10) |  |  | O |  | '상','중','하' |
| 6 | taken_at | 응시 시각 | DATETIME |  |  | O |  |  |

#### `course` — 강의

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | course_id | 강의 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | course_name | 강의명 | VARCHAR(100) |  |  | O |  |  |
| 3 | category_id | 카테고리 | BIGINT |  | O | O |  |  |
| 4 | difficulty | 난이도 | VARCHAR(10) |  |  | O |  | '상','중','하' |
| 5 | chapter_count | 챕터 수 | INT |  |  | O |  |  |
| 6 | course_description | 강의 설명 | TEXT |  |  | O |  |  |

#### `chapter` — 챕터 (콘텐츠 마스터)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | chapter_id | 챕터 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | course_id | 강의 | BIGINT |  | O | O |  |  |
| 3 | chapter_name | 챕터명 | VARCHAR(100) |  |  | O |  |  |
| 4 | display_order | 제시 순서 | INT |  |  | O |  |  |
| 5 | body | 본문 | TEXT |  |  | O |  |  |
| 6 | code_example | 코드 예제 | TEXT |  |  | O |  |  |

#### `enrollment` — 수강

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | enrollment_id | 수강 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | course_id | 강의 | BIGINT |  | O | O |  |  |
| 4 | enroll_source | 등록 경로 | VARCHAR(500) |  |  | O |  |  |
| 5 | start_date | 시작일 | DATE |  |  | O |  |  |
| 6 | end_date | 종료일 | DATE |  |  |  |  |  |
| 7 | progress_rate | 진행률 | DECIMAL(5,2) |  |  | O |  | BETWEEN 0 AND 100 |
| 8 | is_completed | 완료 여부 | TINYINT(1) |  |  | O | 0 |  |

#### `chapter_progress` — 챕터 진행 (회원별)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | chapter_progress_id | 챕터진행 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | enrollment_id | 수강 | BIGINT |  | O | O |  | UNIQUE |
| 3 | chapter_id | 챕터 | BIGINT |  | O | O |  | UNIQUE |
| 4 | is_completed | 완료 여부 | TINYINT(1) |  |  | O | 0 |  |
| 5 | completed_at | 완료 시각 | DATETIME |  |  |  |  |  |

#### `chapter_quiz` — 챕터 퀴즈 (문제 마스터)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | chapter_quiz_id | 퀴즈 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | chapter_id | 챕터 | BIGINT |  | O | O |  |  |
| 3 | problem_type | 문제 유형 | VARCHAR(30) |  |  | O |  | 'MULTIPLE','OX','SHORT','CODING' |
| 4 | problem_text | 문제 텍스트 | TEXT |  |  | O |  |  |
| 5 | correct_answer | 정답 | VARCHAR(100) |  |  | O |  |  |

#### `chapter_quiz_option` — 챕터 퀴즈 선택지

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | option_id | 선택지 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | chapter_quiz_id | 퀴즈 식별 값 | BIGINT |  | O | O |  | UNIQUE |
| 3 | option_text | 선택지 텍스트 | VARCHAR(200) |  |  | O |  |  |
| 4 | option_order | 선택지 순서 | INT |  |  | O |  | UNIQUE |
| 5 | is_correct | 정오 여부 | TINYINT(1) |  |  | O | 0 |  |

#### `quiz_attempt` — 챕터 퀴즈 응시

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | quiz_attempt_id | 응시 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | chapter_quiz_id | 챕터 퀴즈 | BIGINT |  | O | O |  |  |
| 4 | submitted_answer | 제출 답안 | VARCHAR(100) |  |  | O |  |  |
| 5 | is_correct | 정오 여부 | TINYINT(1) |  |  | O | 0 |  |
| 6 | submitted_at | 제출 시각 | DATETIME |  |  | O |  |  |

#### `coding_problem` — 코딩테스트 문제

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | coding_problem_id | 문제 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | problem_name | 문제명 | VARCHAR(100) |  |  | O |  |  |
| 3 | category_id | 카테고리 | BIGINT |  | O | O |  |  |
| 4 | difficulty | 난이도 | VARCHAR(10) |  |  | O |  | '상','중','하' |
| 5 | tags | 태그 | VARCHAR(100) |  |  | O |  |  |
| 6 | problem_description | 문제 설명·제약조건 | TEXT |  |  | O |  |  |
| 7 | example_io | 예시 입출력 | TEXT |  |  | O |  |  |
| 8 | correct_rate | 정답률 | DECIMAL(5,2) |  |  | O |  | BETWEEN 0 AND 100 |

#### `coding_submission` — 코딩테스트 제출

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | coding_submission_id | 제출 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | coding_problem_id | 문제 | BIGINT |  | O | O |  |  |
| 4 | language | 사용 언어 | VARCHAR(100) |  |  | O |  |  |
| 5 | submitted_code | 제출 코드 | TEXT |  |  | O |  |  |
| 6 | execution_result | 실행 결과 | TEXT |  |  | O |  |  |
| 7 | is_passed | 통과 여부 | TINYINT(1) |  |  | O | 0 |  |
| 8 | submitted_at | 제출 시각 | DATETIME |  |  | O |  |  |

#### `ai_quiz` — AI 추천 퀴즈

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | ai_quiz_id | AI퀴즈 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | category_id | 카테고리 | BIGINT |  | O | O |  |  |
| 4 | weak_concept_id | 취약 개념 | BIGINT |  | O |  |  |  |
| 5 | recommended_topic | 추천 주제 | VARCHAR(100) |  |  | O |  |  |
| 6 | problem_type | 문제 유형 | VARCHAR(30) |  |  | O |  | 'MULTIPLE','OX','SHORT','CODING' |
| 7 | problem_text | 문제 텍스트 | TEXT |  |  | O |  |  |
| 8 | correct_answer | 정답 | VARCHAR(100) |  |  | O |  |  |
| 9 | grading_result | 채점 결과 | VARCHAR(100) |  |  | O |  |  |
| 10 | created_at | 생성 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |
| 11 | submitted_answer | 제출/선택한 답안 | VARCHAR(200) |  |  |  |  |  |

#### `weak_concept` — 취약 개념

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | weak_concept_id | 취약개념 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | category_id | 카테고리 | BIGINT |  | O | O |  |  |
| 4 | concept_name | 개념명 | VARCHAR(100) |  |  | O |  |  |
| 5 | wrong_count | 오답 횟수 | INT |  |  | O | 0 |  |
| 6 | recommended_content_id | 추천 콘텐츠 | BIGINT |  | O |  |  |  |
| 7 | updated_at | 갱신 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `study_goal` — 학습 목표·체크리스트

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | study_goal_id | 목표 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | category_id | 카테고리 | BIGINT |  | O |  |  |  |
| 4 | week_no | 주차 | INT |  |  | O |  |  |
| 5 | goal_item_name | 목표 항목명 | VARCHAR(100) |  |  | O |  |  |
| 6 | is_achieved | 달성 여부 | TINYINT(1) |  |  | O | 0 |  |
| 7 | achievement_rate | 달성률 | DECIMAL(5,2) |  |  | O |  | BETWEEN 0 AND 100 |

#### `study_stat` — 학습 통계 (일별 스냅샷)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | study_stat_id | 통계 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  | UNIQUE |
| 3 | category_id | 카테고리 | BIGINT |  | O | O |  | UNIQUE |
| 4 | base_date | 기준 일자 | DATE |  |  | O |  | UNIQUE |
| 5 | completed_count | 완료 문항 수 | INT |  |  | O |  |  |
| 6 | in_progress_course_count | 진행 강좌 수 | INT |  |  | O |  |  |
| 7 | total_study_time | 총 학습 시간 | INT |  |  | O |  |  |
| 8 | quiz_correct_rate | 퀴즈 정답률 | DECIMAL(5,2) |  |  | O |  | BETWEEN 0 AND 100 |
| 9 | recorded_at | 기록 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |


### 6. 커뮤니티

#### `post` — 게시글

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | post_id | 게시글 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | author_id | 작성 회원 | BIGINT |  | O | O |  |  |
| 3 | board_type | 게시판 구분 | VARCHAR(30) |  |  | O |  | 'FREE','QNA','INFO' |
| 4 | title | 제목 | VARCHAR(200) |  |  | O |  |  |
| 5 | content | 내용 | TEXT |  |  | O |  |  |
| 6 | view_count | 조회 수 | INT |  |  | O | 0 |  |
| 7 | status | 상태 | VARCHAR(30) |  |  | O | NORMAL | 'NORMAL','HIDDEN','DELETED' |
| 8 | created_at | 작성 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |
| 9 | updated_at | 수정 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `comment` — 댓글

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | comment_id | 댓글 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | post_id | 소속 게시글 | BIGINT |  | O | O |  |  |
| 3 | author_id | 작성 회원 | BIGINT |  | O | O |  |  |
| 4 | parent_comment_id | 부모 댓글 | BIGINT |  | O |  |  |  |
| 5 | content | 내용 | TEXT |  |  | O |  |  |
| 6 | status | 상태 | VARCHAR(30) |  |  | O | NORMAL | 'NORMAL','HIDDEN','DELETED' |
| 7 | created_at | 작성 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `post_attachment` — 게시글 첨부 (이미지)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | attachment_id | 첨부 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | post_id | 소속 게시글 | BIGINT |  | O | O |  |  |
| 3 | file_url | 파일 경로/URL | VARCHAR(500) |  |  | O |  |  |
| 4 | file_type | 파일 유형 | VARCHAR(30) |  |  | O |  | 'IMAGE','VIDEO','FILE' |
| 5 | display_order | 표시 순서 | INT |  |  | O |  |  |
| 6 | uploaded_at | 업로드 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `post_like` — 게시글 좋아요

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | post_like_id | 좋아요 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | post_id | 대상 게시글 | BIGINT |  | O | O |  |  |
| 3 | member_id | 누른 회원 | BIGINT |  | O | O |  |  |
| 4 | liked_at | 누른 시각 | DATETIME |  |  | O |  |  |

#### `comment_like` — 댓글 좋아요

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | comment_like_id | 좋아요 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | comment_id | 대상 댓글 | BIGINT |  | O | O |  |  |
| 3 | member_id | 누른 회원 | BIGINT |  | O | O |  |  |
| 4 | liked_at | 누른 시각 | DATETIME |  |  | O |  |  |

#### `tag` — 태그

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | tag_id | 태그 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | tag_name | 태그명 | VARCHAR(100) |  |  | O |  |  |

#### `post_tag` — 게시글-태그 연결

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | post_tag_id | 연결 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | post_id | 게시글 | BIGINT |  | O | O |  |  |
| 3 | tag_id | 태그 | BIGINT |  | O | O |  |  |


### 7. 알림&신고

#### `notification` — 알림

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | notification_id | 알림 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  |  |
| 3 | notification_type | 알림 유형 | VARCHAR(30) |  |  | O |  |  |
| 4 | content | 내용 | TEXT |  |  | O |  |  |
| 5 | target_type | 대상 유형 | VARCHAR(30) |  |  |  | 0 |  |
| 6 | target_id | 대상식별값 | BIGINT |  |  |  |  |  |
| 7 | is_read | 읽음 여부 | TINYINT(1) |  |  | O | 0 |  |
| 8 | sent_at | 발송일 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `survey` — 만족도 조사 (5회 면접마다)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | survey_id | 조사 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 회원 | BIGINT |  | O | O |  | UNIQUE(member_id, session_id) |
| 3 | session_id | 트리거 면접 | BIGINT |  | O | O |  |  |
| 4 | feedback | 의견 | TEXT |  |  | O |  |  |
| 5 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `survey_score` — 만족도 항목별 별점

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | survey_score_id | 점수 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | survey_id | 조사 | BIGINT |  | O | O |  | UNIQUE(survey_id, category) |
| 3 | category | 카테고리 | VARCHAR(30) |  |  | O |  | 'QUESTION_FIT','FEEDBACK_ACCURACY','ANALYSIS_ACCURACY','USABILITY','OVERALL' |
| 4 | rating | 별점 | DECIMAL(2,1) |  |  | O |  | BETWEEN 0 AND 5 |

#### `report` — 신고

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | report_id | 신고 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | reporter_id | 신고자 | BIGINT |  | O | O |  |  |
| 3 | reported_member_id | 피신고 회원 | BIGINT |  | O | O |  |  |
| 4 | target_type | 신고 대상 유형 | VARCHAR(30) |  |  | O |  | 'POST','COMMENT' |
| 5 | target_id | 대상 식별 값 | BIGINT |  |  | O |  |  |
| 6 | report_source | 신고 출처 | VARCHAR(30) |  |  | O |  |  |
| 7 | reason_code | 신고 사유 코드 | VARCHAR(30) |  |  | O |  | 'ABUSE','SPAM','OBSCENE','PERSONAL_INFO','IRRELEVANT','ETC' |
| 8 | reason_detail | 신고 사유 상세 | TEXT |  |  | O |  |  |
| 9 | handle_status | 처리 상태 | VARCHAR(30) |  |  | O | 'PENDING' | 'PENDING','PROCESSING','DONE' |
| 10 | admin_id | 처리 관리자 | BIGINT |  | O | X |  |  |
| 11 | action_detail | 조치 내용 | TEXT |  |  |  |  |  |
| 12 | handle_reason | 처리 사유 | TEXT |  |  |  |  |  |
| 13 | reported_at | 신고 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |
| 14 | handled_at | 처리 시각 | DATETIME |  |  |  |  |  |

#### `sanction` — 회원 제재

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | sanction_id | 제재 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 제재대상 회원 | BIGINT |  | O | O |  |  |
| 3 | report_id | 근거 신고 | BIGINT |  | O | X |  |  |
| 4 | filter_log_id | 근거 필터링 로그 | BIGINT |  | O |  |  |  |
| 5 | admin_id | 처리 관리자 | BIGINT |  | O | X |  |  |
| 6 | sanction_type | 제재 유형 | VARCHAR(30) |  |  | O |  | 'WARNING','SUSPEND','BAN' |
| 7 | sanction_reason | 제재 사유 | TEXT |  |  | O |  |  |
| 8 | sanction_start_date | 제재 시작일 | DATE |  |  | O |  | CHECK(end_date >= start_date) |
| 9 | sanction_end_date | 제재 종료일 | DATE |  |  | X |  |  |

#### `banned_word` — 금지어 사전

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | banned_word_id | 금지어 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | word | 금지어 | VARCHAR(100) |  |  | O |  | UNIQUE |
| 3 | category | 분류 | VARCHAR(30) |  |  | O |  | 'ABUSE','SPAM','OBSCENE','PERSONAL_INFO' |
| 4 | is_active | 사용여부 | TINYINT(1) |  |  | O | 1 |  |
| 5 | admin_id | 등록 관리자 | BIGINT |  | O | O |  |  |
| 6 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `content_filter_log` — 콘텐츠 필터링 로그

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | filter_log_id | 필터 로그 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | target_type | 대상 유형 | VARCHAR(30) |  |  | O |  | 'POST','COMMENT' |
| 3 | target_id | 대상 식별 값 | BIGINT |  |  | O |  |  |
| 4 | filter_type | 필터 종류 | VARCHAR(30) |  |  | O |  | 'KEYWORD','AI' |
| 5 | matched_keyword | 매칭 키워드 | VARCHAR(100) |  |  |  |  | filter_type='KEYWORD'일 때만 |
| 6 | ai_score | AI 유해점수 | DECIMAL(5,2) |  |  |  |  | filter_type='AI'일 때만, BETWEEN 0 AND 100 |
| 7 | action_taken | 처리 결과 | VARCHAR(30) |  |  | O |  | 'BLOCKED','HIDDEN' |
| 8 | detected_at | 탐지 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |


### 8. 챗봇

#### `chat_conversation` — 챗봇 대화

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | conversation_id | 대화 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | member_id | 대상 회원 | BIGINT |  | O | O |  |  |
| 3 | title | 대화 제목/요약 | VARCHAR(200) |  |  | O |  |  |
| 4 | started_at | 시작 시각 | DATETIME |  |  | O |  |  |
| 5 | last_active_at | 마지막 활동 시각 | DATETIME |  |  | O |  |  |

#### `chat_message` — 챗봇 메시지

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | message_id | 메시지 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | conversation_id | 소속 대화 | BIGINT |  | O | O |  |  |
| 3 | sender | 발신자 | VARCHAR(100) |  |  | O |  | 'USER','BOT' |
| 4 | message_content | 메시지 내용 | TEXT |  |  | O |  |  |
| 5 | faq_id | 연계 FAQ | BIGINT |  | O |  |  |  |
| 6 | answer_type | 답변 방식 | VARCHAR(30) |  |  | O |  | 'AI','FIXED' |
| 7 | created_at | 생성 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `chatbot_setting` — 챗봇 설정 (관리자)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | setting_id | 설정 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | use_ai | AI 사용 여부 | TINYINT(1) |  |  | O | 0 |  |
| 3 | fallback_type | 폴백 답변 방식 | VARCHAR(30) |  |  | O |  |  |
| 4 | fixed_response | 고정 응답 내용 | TEXT |  |  | O |  |  |
| 5 | admin_id | 수정 관리자 | BIGINT |  | O | O |  |  |
| 6 | updated_at | 수정 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |


### 9. 관리자

#### `admin_permission` — 관리자 권한

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | permission_id | 권한 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | admin_id | 관리자 | BIGINT |  | O | O |  |  |
| 3 | menu_name | 메뉴명 | VARCHAR(100) |  |  | O |  |  |
| 4 | read_permission | 조회 권한 | VARCHAR(30) |  |  | O |  |  |
| 5 | write_permission | 수정 권한 | VARCHAR(30) |  |  | O |  |  |
| 6 | is_active | 활성 여부 | TINYINT(1) |  |  | O | 0 |  |

#### `job_posting` — 공고 (관리자 등록·수정·삭제)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | job_posting_id | 공고 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | company_name | 기업명 | VARCHAR(100) |  |  | O |  |  |
| 3 | job_category | 직군 | VARCHAR(100) |  |  | O |  |  |
| 4 | requirements | 자격요건 | TEXT |  |  | O |  |  |
| 5 | preferred_qualifications | 우대사항 | TEXT |  |  | O |  |  |
| 6 | deadline | 마감일 | DATE |  |  | O |  |  |
| 7 | posting_url | 공고 링크 | VARCHAR(500) |  |  | O |  |  |
| 8 | status | 상태 | VARCHAR(30) |  |  | O | OPEN | 'OPEN','CLOSED' |
| 9 | admin_id | 등록 관리자 | BIGINT |  | O | O |  |  |
| 10 | is_deleted | 삭제 여부 | TINYINT(1) |  |  | O | 0 |  |
| 11 | deleted_at | 삭제 일시 | DATETIME |  |  |  |  |  |
| 12 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `chatbot_faq` — 챗봇 FAQ

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | faq_id | FAQ 식별 값 | BIGINT | O |  |  | AUTO_INCREMENT |  |
| 2 | category | 분류 | VARCHAR(100) |  |  | O |  |  |
| 3 | question | 질문 | VARCHAR(255) |  |  | O |  |  |
| 4 | answer | 답변 | TEXT |  |  | O |  |  |
| 5 | admin_id | 등록 관리자 | BIGINT |  | O | O |  |  |
| 6 | is_deleted | 삭제 여부 | TINYINT(1) |  |  | O | 0 |  |
| 7 | deleted_at | 삭제 일시 | DATETIME |  |  |  |  |  |
| 8 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `daily_stat` — 통계 일별 스냅샷 (신규 제안)

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | snapshot_date | 집계일자 | BIGINT | O |  | O |  |  |
| 2 | new_signup_count | 신규 가입자 수 | INT |  |  | O |  |  |
| 3 | active_member_count | 활성 회원 수 | INT |  |  | O |  |  |
| 4 | total_interview_count | 누적 면접 횟수 | INT |  |  | O |  |  |
| 5 | total_posting_count | 누적 공고 수 | INT |  |  | O |  |  |
| 6 | daily_revenue | 일일 매출액 | BIGINT |  |  | O | 0 |  |
| 7 | created_at | 생성 시각 | DATETIME |  |  | O | CURRENT_TIMESTAMP |  |

#### `popup` — 팝업

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | popup_id | 팝업 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | category | 카테고리 | VARCHAR(100) |  |  | O |  |  |
| 3 | title | 제목 | VARCHAR(200) |  |  | O |  |  |
| 4 | content | 내용 | TEXT |  |  | O |  |  |
| 5 | image_url | 이미지 URL | VARCHAR(500) |  |  | O |  |  |
| 6 | link_url | 링크 URL | VARCHAR(500) |  |  | O |  |  |
| 7 | expose_start_date | 노출 시작일 | DATE |  |  | O |  |  |
| 8 | expose_end_date | 노출 종료일 | DATE |  |  | O |  |  |
| 9 | is_exposed | 노출 여부 | TINYINT(1) |  |  | O | 0 |  |
| 10 | admin_id | 등록 관리자 | BIGINT |  | O | O |  |  |
| 11 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `ad_banner` — 상단 광고 배너

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | banner_id | 배너 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | banner_text | 배너 문구 | VARCHAR(100) |  |  | O |  |  |
| 3 | link_url | 링크 URL | VARCHAR(500) |  |  | O |  |  |
| 4 | expose_order | 노출 순서 | INT |  |  | O |  |  |
| 5 | expose_start_date | 노출 시작일 | DATE |  |  | O |  |  |
| 6 | expose_end_date | 노출 종료일 | DATE |  |  | O |  |  |
| 7 | is_exposed | 노출 여부 | TINYINT(1) |  |  | O | 0 |  |
| 8 | admin_id | 등록 관리자 | BIGINT |  | O | O |  |  |
| 9 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `policy` — 정책 문서

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | policy_id | 정책 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | type | 유형 | VARCHAR(30) |  |  | O |  |  |
| 3 | is_required | 필수 여부 | TINYINT(1) |  |  | O | 0 |  |
| 4 | version | 버전 | VARCHAR(100) |  |  | O |  |  |
| 5 | body | 본문 | TEXT |  |  | O |  |  |
| 6 | effective_date | 시행일 | DATE |  |  | O |  |  |
| 7 | admin_id | 작성 관리자 | BIGINT |  | O | O |  |  |
| 8 | created_at | 등록일 | DATE |  |  | O | CURRENT_DATE |  |

#### `ad_inquiry` — 광고 문의

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | ad_inquiry_id | 문의 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | company_name | 문의 기업명 | VARCHAR(100) |  |  | O |  |  |
| 3 | manager_name | 담당자명 | VARCHAR(100) |  |  | O |  |  |
| 4 | email | 이메일 | VARCHAR(255) |  |  | O |  |  |
| 5 | phone | 전화번호 | VARCHAR(20) |  |  | O |  |  |
| 6 | preferred_post_date | 희망 게재일 | DATE |  |  | O |  |  |
| 7 | other_inquiry | 기타 문의사항 | VARCHAR(100) |  |  | O |  |  |
| 8 | privacy_agreed | 개인정보 수집 동의 여부 | TINYINT(1) |  |  | O | 0 |  |
| 9 | handle_status | 처리 상태 | VARCHAR(30) |  |  | O |  | 'PENDING','PROCESSING','DONE' |
| 10 | admin_id | 처리 관리자 | BIGINT |  | O | O |  |  |
| 11 | answer_content | 답변 내용 | TEXT |  |  |  |  |  |
| 12 | handled_at | 처리일시 | DATETIME |  |  |  |  |  |
| 13 | inquired_at | 문의일 | DATE |  |  | O |  |  |

#### `ad_product` — 광고 상품

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | ad_product_id | 상품 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | product_name | 상품명 | VARCHAR(100) |  |  | O |  |  |

#### `ad_inquiry_product` — 광고문의-상품 연결

| NO | 컬럼명 | 논리이름 | DATA 타입 | PK | FK | N-N | DEFAULT | CHECK |
|---|---|---|---|---|---|---|---|---|
| 1 | inquiry_product_id | 연결 식별 값 | BIGINT | O |  | O | AUTO_INCREMENT |  |
| 2 | ad_inquiry_id | 광고 문의 | BIGINT |  | O | O |  |  |
| 3 | ad_product_id | 광고 상품 | BIGINT |  | O | O |  |  |
