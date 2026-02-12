# 📋 수강 신청 시스템 PRD (Product Requirements Document)


## 0. 보안 관련 요구사항
*   .env 파일에 DB 접속 정보 저장 (아이디, 패스워드)
*   .gitignore 파일에 .env 파일 추가


## 1. 프로젝트 개요
*   **프로젝트명:** 수강 신청 시스템 (The Registration System)
*   **목표:** 관리자가 판을 깔아주고(Create), 학생이 참여하는(Enroll) 전체 사이클을 완성합니다.
*   **주요 기술 스택:**
    *   **Database:** MySQL (Workbench)
    *   **Backend:** FastAPI (Python), ORM(Object Relational Mapping) 사용할 것.
    *   **Frontend:** React (JavaScript/TypeScript)

---

## 2. 데이터베이스 요구사항 (MySQL)

데이터의 무결성과 관계를 유지하기 위해 3개의 테이블을 구성합니다. 모든 테이블 생성 시 `id`는 PK 및 Auto Increment를 적용합니다.

### 2.1 `courses` 테이블 (강의 정보)
| 컬럼명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, AI | 강의 고유 식별자 |
| `title` | VARCHAR | NOT NULL | 강의명 |
| `instructor` | VARCHAR | NOT NULL | 담당 강사명 |
| `max_students` | INT | NOT NULL | 최대 수강 인원 |

### 2.2 `students` 테이블 (학생 정보)
| 컬럼명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, AI | 학생 고유 식별자 |
| `name` | VARCHAR | NOT NULL | 학생 이름 |
| `email` | VARCHAR | UNIQUE | 학생 이메일 |

### 2.3 `enrollments` 테이블 (수강 신청 내역)
| 컬럼명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, AI | 신청 내역 식별자 |
| `student_id` | INT | FK (students.id) | 신청한 학생 ID |
| `course_id` | INT | FK (courses.id) | 신청된 강의 ID |

> **Tip:** 한 학생이 동일 강의를 중복 신청할 수 없도록 DB 레벨이나 로직에서 중복 체크가 필요합니다.

---

## 3. 백엔드 요구사항 (FastAPI)

### 3.1 관리자용 API
*   **강의 개설:** `POST /courses`
    *   Body: `{ "title": string, "instructor": string, "max_students": number }`
*   **학생 등록:** `POST /students`
    *   Body: `{ "name": string, "email": string }`
*   **수강신청 현황 조회:** `GET /admin/enrollments`
    *   Response: 과목별로 그룹화된 신청 학생 목록 (일련번호, 학생 이름 포함)

### 3.2 학생용 API
*   **학생 목록 조회:** `GET /students` (신분 선택 시뮬레이션용)
*   **강의 목록 조회:** `GET /courses`
*   **수강 신청:** `POST /enroll`
    *   Body: `{ "student_id": number, "course_id": number }`
    *   **방어 코드:** 요청 시 DB에 이미 같은 `(student_id, course_id)` 쌍이 있는지 확인하여 중복 신청 시 `400 Bad Request` 반환.

---

## 4. 프론트엔드 요구사항 (React)

### 4.1 화면 구성 (Core Pages)

#### A. 진입 화면 (Home)
*   **기능:** 사용자의 역할을 선택합니다.
*   **UI:** [관리자 모드] 버튼, [학생 모드] 버튼 배치.

#### B. 관리자 모드 (Admin Page)
*   **기능 1 (강의 개설):** 강의명과 수강 정원을 입력받아 `POST /courses` 호출.
*   **기능 2 (학생 등록):** 학생 이름과 이메일을 입력받아 `POST /students` 호출.
*   **기능 3 (수강신청 현황):** 과목별 수강신청현황을 테이블 형태로 표시 (일련번호, 학생 이름).
*   **UI:** 입력 폼들과 현황판을 세 개의 그룹으로 나란히 배치 (Grid Layout).

#### C. 학생 모드 (Student Page)
*   **기능 1 (신분 선택):** `GET /students`로 목록을 불러와 Select Box에 표시. 선택된 ID를 상태로 저장.
*   **기능 2 (강의 목록):** 페이지 로드 시 `GET /courses`를 호출하여 카드 형태로 표시.
*   **기능 3 (수강 신청):** [신청] 버튼 클릭 시 저장된 `student_id`와 해당 강의의 `course_id`를 담아 `POST /enroll` 호출.
*   **UI:** 신청 성공 시 `alert("신청 완료!")`, 실패 시 에러 메시지 노출.

---

## 5. 구현 시 주의사항 (Developer Checklist)

1.  **DB 설계:** `enrollments` 테이블의 `student_id`는 반드시 `students.id`와 FK로 연결되어야 합니다.
2.  **백엔드 방어 코드:** `POST /enroll` 요청 처리 시 `query(...).first()` 등을 사용하여 중복 여부를 먼저 확인하세요.
3.  **프론트엔드 예외 처리:** 
    *   학생 목록이 로딩 중일 때 처리.
    *   학생을 선택하지 않고 신청 버튼 클릭 시 "학생을 먼저 선택해주세요" 경고창 표시.

---

## 6. 보안 및 방어 요구사항 (Security & Defense)

1.  **환경 변수 관리:** 데이터베이스 접속 설정(`DATABASE_URL`) 및 CORS 허용 도메인(`CORS_ORIGINS`)은 `.env` 파일을 통해 관리하며, 소스 코드에 노출되지 않도록 합니다.
2.  **CORS 보안:** 프론트엔드가 실행되는 특정 도메인만 API에 접근할 수 있도록 제한합니다.
3.  **수강 정원 방어:** 수강 신청(`/enroll`) 시 해당 강의의 최대 수강 인원(`max_students`)을 초과하지 않는지 백엔드에서 검증합니다.
4.  **중복 신청 방지:** 동일한 학생이 동일한 강의를 중복해서 신청할 수 없도록 DB 유니크 제약 조건 및 백엔드 로직으로 이중 방어합니다.
5.  **입력값 검증:** 학생 등록 시 이메일 형식 등을 Pydantic의 `EmailStr` 등을 통해 검증합니다.
