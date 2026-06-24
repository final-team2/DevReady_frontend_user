# DevReady 프로젝트 구조 가이드

> 5개 레포 공통 스캐폴딩·네이밍·폴더 구조 기준 문서.
> 협업·git 안전 규칙은 `CLAUDE.md`, 기능 명세는 `요구사항정의서.md`를 참조한다. 이 문서는 **"폴더를 어떻게 잡고 무엇을 어디에 두는지"** 만 다룬다.

## 레포 구성 (5개)

| 레포 | 스택 | 도구 | 패키지/그룹 |
|---|---|---|---|
| `DevReady_frontend_user` | React + JavaScript + Vite | VS Code | — |
| `DevReady_frontend_admin` | React + JavaScript + Vite | VS Code | — |
| `DevReady_backend_user` | Spring Boot 3.5.x · Java 21 | IntelliJ | `com.devready.backend_user` |
| `DevReady_backend_admin` | Spring Boot 3.5.x · Java 21 | IntelliJ | `com.devready.backend_admin` |
| `DevReady_AI` | FastAPI · EXAONE-Deep-7.8B | — | — |

> user/admin은 같은 스택을 공유하되 **별도 레포**다. 폴더 구조·네이밍은 동일하게 가져간다.

---

## 1. 네이밍 규칙

### Frontend (React / JavaScript)

| 대상 | 규칙 | 예시 |
|---|---|---|
| 변수·함수 | camelCase | `userName`, `handleClick` |
| 컴포넌트 | PascalCase | `InterviewResult` |
| 훅(Hook) | `use` + camelCase | `useSTT`, `useRecorder` |
| 상수 | UPPER_SNAKE_CASE | `MAX_SILENCE_COUNT` |
| 파일 — 컴포넌트 | PascalCase.jsx | `InterviewPage.jsx` |
| 파일 — 훅 | camelCase.js | `useRecorder.js` |
| 파일 — 유틸 | camelCase.js | `formatWpm.js` |
| 파일 — API | camelCase.js | `interviewApi.js` |
| boolean | `is`/`has` 접두사 | `isRecording`, `hasError` |

> JavaScript 프로젝트이므로 `.tsx`/`.ts`·타입 선언·`types/` 폴더는 사용하지 않는다. (TypeScript 미사용)

### Backend (Spring Boot)

| 대상 | 규칙 | 예시 |
|---|---|---|
| 클래스 | PascalCase | `InterviewService` |
| 메서드·변수 | camelCase | `findById` |
| 패키지 | 소문자 | `com.devready.backend_user.interview` |
| 클래스 접미사 | `~Controller` · `~Service` · `~ServiceImpl` · `~VO` · `~Mapper` · `~Request` · `~Response` | `InterviewController` |

### DB

| 대상 | 규칙 | 예시 |
|---|---|---|
| 테이블명 | snake_case (소문자) | `interview_session` |
| 컬럼명 | snake_case | `wpm_score`, `silence_count` |
| PK | `테이블명_id` | `voice_id`, `video_id` |
| FK | `참조테이블명_id` | `answer_id` |

> 테이블 기술서가 이미 소문자 snake_case(`member`, `interview_session` 등)로 확정되어 있으므로 그 표기를 따른다.

---

## 2. Frontend 폴더 구조 (user / admin 공통)

```
src/
├── api/          # 서버 통신 (axios 기반 API 함수). 도메인별 파일: authApi.js, interviewApi.js ...
├── components/   # 재사용 UI 컴포넌트 (Navbar, PrivateRoute, 공용 버튼 등)
├── hooks/        # 커스텀 훅: useSTT, useRecorder, useFaceAnalysis, useSilenceDetection ...
├── pages/        # 라우트 단위 페이지 컴포넌트 (InterviewPage.jsx, LoginPage.jsx ...)
├── store/        # 전역 상태 관리 (Zustand) - 인증, 유저 정보 등
├── utils/        # 순수 함수 유틸 (formatWpm.js, dateFormat.js ...)
├── App.jsx       # 라우팅 정의
└── main.jsx      # 앱 진입점
```

### 폴더별 역할

| 폴더 | 담는 것 | 안 담는 것 |
|---|---|---|
| `api/` | axios 함수, 엔드포인트 호출 | UI·상태 로직 |
| `components/` | 재사용 컴포넌트 | 라우트 페이지(→ pages) |
| `hooks/` | 상태·부수효과 로직 (`use~`) | UI 마크업 |
| `pages/` | URL 1개당 1개 페이지 | 재사용 컴포넌트(→ components) |
| `store/` | 전역 상태 (auth, user) | 화면 로컬 상태(컴포넌트 내 useState) |
| `utils/` | 입출력만 있는 순수 함수 | 서버 통신(→ api), 상태(→ hooks) |

### 코딩 규칙 (Frontend)

- 함수형 컴포넌트 + 화살표 함수만 사용
- 주석은 한국어로
- boolean은 `is`/`has` 접두사
- **영상 원본은 DB·서버에 저장 금지** — 클라이언트 메모리에서만 처리하고, 분석 결과(점수·수치)만 백엔드로 전송 (face-api.js는 브라우저에서 동작)
- 전역 상태는 Zustand(`store/`), 화면 로컬 상태는 컴포넌트 내 `useState`로 분리

---

## 3. Backend 폴더 구조 (user / admin 공통)

**기능(도메인)별 폴더**로 나누고, 각 폴더 안에 계층별 클래스를 둔다. 공통 영역은 `common`(재사용 코드)과 `config`(설정)로 **분리**한다.

```
com.devready.backend_user
├── auth/
│   ├── controller/      # AuthController  - 이동(요청 수신→service 호출→응답)만
│   ├── service/
│   │   ├── AuthService.java        # 인터페이스
│   │   └── AuthServiceImpl.java    # 구현 (실제 로직)
│   ├── vo/              # MemberVO, MemberSnsVO ... (DB 행 매핑)
│   └── mapper/          # AuthMapper.java (MyBatis) + AuthMapper.xml(resources)
├── interview/
│   ├── controller/
│   ├── service/  (Service + ServiceImpl)
│   ├── vo/
│   └── mapper/
├── resume/
├── community/
├── notification/
├── ...                  # 기능별 폴더 계속
│
├── config/              # 설정 클래스만 모음
│   ├── SecurityConfig.java     # Spring Security 설정
│   ├── MyBatisConfig.java      # MyBatis 설정
│   ├── CorsConfig.java         # CORS 설정
│   └── ...                     # 기타 @Configuration
│
├── common/              # 도메인 공통 재사용 코드
│   ├── vo/              # 공통 VO
│   │   └── DataVO.java         # 공통 응답 래퍼 (아래 4번 참조)
│   ├── jwt/             # JwtProvider, JwtFilter
│   ├── exception/       # 전역 예외 처리 (@RestControllerAdvice)
│   └── util/            # 공통 유틸
│
└── BackendUserApplication.java
```

### config 와 common 의 구분

| 폴더 | 담는 것 | 예시 |
|---|---|---|
| `config/` | `@Configuration` 설정 클래스 | SecurityConfig, MyBatisConfig, CorsConfig |
| `common/` | 도메인이 공유하는 **재사용 코드** | 공통 응답 VO, JWT, 예외 처리, 유틸 |

> 설정(config)과 공용 코드(common)를 섞지 않는다. "Spring이 뜰 때 읽는 설정"은 config, "여러 도메인이 가져다 쓰는 코드"는 common.

### 계층 규칙

| 계층 | 책임 | 금지 |
|---|---|---|
| `controller` | 요청 수신·검증·**적절한 service 호출 후 응답 반환(이동)만** | 비즈니스 로직 직접 작성 금지 → 전부 service로 |
| `service` | 인터페이스(`~Service`) + 구현(`~ServiceImpl`)로 분리. 실제 비즈니스 로직 | 컨트롤러 의존 금지 |
| `vo` | DB 테이블 행과 매핑되는 데이터 객체 | 로직 금지 |
| `mapper` | MyBatis 인터페이스 + XML로 SQL 매핑 | service 로직 금지 |

- **Controller는 "이동"만** — 요청을 받아 알맞은 service 메서드를 호출하고 결과를 반환하는 역할까지. 모든 처리 로직은 service(ServiceImpl)에 둔다.
- service는 **인터페이스 + Impl** 2개로 항상 분리한다.
- MyBatis Mapper XML은 `src/main/resources/mapper/` 아래에 도메인별로 둔다.

### 인증 — JWT

- Spring Security + JWT 기반.
- `common/jwt/`에 `JwtProvider`(토큰 발급·검증), `JwtFilter`(요청 인증) 배치.
- Access / Refresh 토큰 구조. 만료 시간은 `.env`의 `JWT_ACCESS_EXPIRATION`·`JWT_REFRESH_EXPIRATION`으로 주입.
- Refresh 갱신·폐기 로직은 auth 도메인 service에서 처리.

---

## 4. 공통 응답 VO (`common/vo/DataVO`)

모든 API 응답을 동일한 형태로 감싸 프론트가 일관되게 처리하도록 한다.

```java
// com.devready.backend_user.common.vo.DataVO
private boolean success;   // 성공 여부
private String message;    // 결과 메시지
private Object data;       // 실제 응답 데이터 (없으면 null)
```

- 모든 Controller는 이 `DataVO`(또는 동등한 공통 응답)로 감싸서 반환한다.
- 성공/실패와 무관하게 `success`·`message`를 항상 채워 프론트의 분기 처리를 단순화한다.
- 예외는 `common/exception/`의 전역 핸들러(`@RestControllerAdvice`)에서 잡아 동일한 `DataVO` 형태로 응답한다.

---

## 5. 환경변수 관리

비밀값·환경별 설정은 코드에 하드코딩하지 않고 환경변수 파일로 관리한다. **환경변수 파일은 전부 `.gitignore`에 포함하고 절대 커밋하지 않는다.**

### Backend — `.env` (레포 루트)

Spring Boot는 `.env`를 기본으로 읽지 않으므로 `spring-dotenv` 의존성을 추가하고, `application.yml`에서 `${...}`로 참조한다.

```env
# 서버
SERVER_PORT=8080

# DB
DB_URL=jdbc:mysql://localhost:3306/devready
DB_USERNAME=root
DB_PASSWORD=비밀번호

# JWT
JWT_SECRET=아주긴랜덤문자열
JWT_ACCESS_EXPIRATION=3600000       # 1시간 (ms)
JWT_REFRESH_EXPIRATION=604800000    # 7일 (ms)

# OAuth (네이버 / 카카오)
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
OAUTH_REDIRECT_URI=http://localhost:5173/oauth/callback

# 파일 업로드 (이미지 업로드 API용)
UPLOAD_DIR=/data/uploads
# 또는 S3 사용 시
AWS_ACCESS_KEY=...
AWS_SECRET_KEY=...
AWS_BUCKET_NAME=...

# CORS
FRONTEND_URL=http://localhost:5173
```

**application.yml 에서 참조 예시**
```yaml
server:
  port: ${SERVER_PORT}
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

### Frontend — `.env.development` / `.env.production`

Vite는 환경별 파일을 자동 로드한다 (`npm run dev` → development, `npm run build` → production).
**Vite는 `VITE_` 접두사가 붙은 변수만 클라이언트에 노출한다.** 접두사 없는 변수는 무시되므로 반드시 `VITE_`를 붙인다.

```env
# .env.development (로컬 개발)
VITE_API_BASE_URL=http://localhost:8080
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/oauth/callback
VITE_NAVER_CLIENT_ID=...
VITE_KAKAO_CLIENT_ID=...
```

```env
# .env.production (배포)
VITE_API_BASE_URL=https://api.devready.com
VITE_OAUTH_REDIRECT_URI=https://devready.com/oauth/callback
VITE_NAVER_CLIENT_ID=...
VITE_KAKAO_CLIENT_ID=...
```

**코드 참조**: `import.meta.env.VITE_API_BASE_URL`

> ⚠️ 프론트 환경변수는 빌드 결과물에 그대로 박혀 브라우저에 노출된다. **client_secret 같은 비밀값은 절대 프론트 .env에 넣지 않는다** (OAuth secret은 백엔드 `.env`에만). 프론트엔 `client_id`·리다이렉트 URI·API 주소 등 공개돼도 되는 값만 둔다.

### .gitignore 포함 목록

| 레포 | 무시할 파일 |
|---|---|
| Backend | `.env`, `application-local.yml`, `build/` |
| Frontend | `.env.development`, `.env.production`, `.env.local`, `node_modules` |

### 비밀값 관리 — 개발 단계 → 배포 단계

`.env` 파일은 **개발 내내 GitHub에 올리지 않는다.** 배포 시점에만 GitHub Secrets로 옮겨 자동 주입한다.

| 단계 | 비밀값 위치 | 공유/주입 방법 |
|---|---|---|
| **개발 중** | 각자 로컬 `.env` | GitHub에 커밋 금지. 팀원에게는 **레포 밖 경로**(팀 드라이브·메신저 DM 등 안전한 채널)로 직접 전달 |
| **배포 (프로젝트 막바지, 1회)** | **GitHub Secrets** | GitHub Actions 워크플로우가 빌드·배포 시 Secrets에서 값을 꺼내 주입 |

- **배포 방식**: 개발 기간 내내는 로컬 실행으로 진행하고, **프로젝트 종료 시점에 한 번** GitHub Actions로 빌드·배포한다. (상시 CI/CD가 아니라 마무리 배포)
- GitHub Actions에서는 `.env` 대신 `${{ secrets.DB_PASSWORD }}` 형태로 Secrets를 참조한다.
- 로컬 `.env`의 키 이름과 GitHub Secrets의 키 이름을 **동일하게 맞춰두면** 전환이 매끄럽다 (예: 로컬 `DB_PASSWORD` ↔ Secrets `DB_PASSWORD`).
- 담당: 배포·Actions·Secrets 설정은 팀장(김진희). README 개발 일정의 마지막(기능 구현 이후)에 "배포" 단계로 둔다.

> 정리하면 — `.env` 파일 자체는 끝까지 레포에 올라가지 않고, 배포 단계에서 그 값들이 GitHub Secrets로 이동한다.

---

## 6. Backend 프로젝트 설정 (Spring Initializr)

user·admin 두 백엔드 레포 공통 생성 기준.

| 항목 | 값 |
|---|---|
| Project | **Gradle - Groovy** |
| Language | **Java** |
| Spring Boot | 3.5.x |
| Java | **21** |
| Packaging | **Jar** |
| 설정 파일 | **YAML** (`application.yml`) |
| Group | `com.devready` |
| Package | `com.devready.backend_user` / `com.devready.backend_admin` |

### 종속성 (Dependencies)

| 의존성 | 용도 |
|---|---|
| Lombok | 보일러플레이트 제거 |
| Spring Boot DevTools | 개발 핫리로드 |
| Spring Configuration Processor | 설정 메타데이터 |
| Spring Web | REST API |
| MyBatis Framework | SQL 매핑 |
| MySQL Driver | DB 연결 |
| JDBC API | DB 접근 |
| Spring Security | 인증·인가 (+ JWT) |

추가로 필요 (Initializr 외 build.gradle에 수동 추가):
- `spring-dotenv` — `.env` 파일 로드용
- (JWT 라이브러리, 예: `jjwt`) — 토큰 발급·검증

> 그 외 필요 시 추가 가능 (Validation, Kafka 클라이언트 등). 추가할 때는 팀 합의 후 `build.gradle`에 반영하고 CLAUDE.md 고정 스택 표도 갱신한다.

---

## 7. AI 레포 (참고)

`DevReady_AI`는 FastAPI 단일 서빙(`server.py`)이며 고정 스택을 절대 변경하지 않는다. 상세는 `AI시스템명세.md`·`CLAUDE.md` 7번 참조.

---

## 부록. 새 레포 초기 생성 체크리스트

**Frontend (user/admin 각각)**
- [ ] `npm create vite@latest` → React + JavaScript 선택
- [ ] 위 `src/` 폴더 구조 생성 (api·components·hooks·pages·store·utils)
- [ ] axios·zustand·react-router 설치
- [ ] `.env.development`·`.env.production` 생성 (VITE_ 접두사) → `.gitignore` 확인

**Backend (user/admin 각각)**
- [ ] Spring Initializr로 위 설정대로 생성 (Gradle-Groovy / Java 21 / Jar / 위 종속성)
- [ ] `spring-dotenv`·JWT 라이브러리 build.gradle 추가
- [ ] 기능별 도메인 폴더 + controller/service/vo/mapper 구조 잡기
- [ ] `config/`(설정) + `common/`(vo·jwt·exception·util) 분리 생성
- [ ] `common/vo/DataVO` 공통 응답 VO 생성
- [ ] `resources/mapper/` 폴더 생성 (MyBatis XML 위치)
- [ ] `.env` 생성 → `.gitignore` 확인, application.yml에서 `${...}` 참조

**배포 (프로젝트 막바지, 1회)**
- [ ] GitHub Actions 워크플로우 작성 (빌드·배포)
- [ ] 로컬 `.env` 값을 GitHub Secrets에 등록 (키 이름 동일하게)
- [ ] 워크플로우에서 `${{ secrets.* }}`로 참조하도록 연결
- [ ] 담당: 팀장(김진희)

---

*이 문서는 5개 레포의 폴더·네이밍·설정 기준이다. 구조 변경은 PR + 팀 합의로만.*
