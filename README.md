# 휴런(Heuron) 프론트엔드 개발자 과제

## 프로젝트 개요

React 19, TypeScript, Tailwind CSS v4를 활용하여 세 가지 과제를 구현한 웹 애플리케이션입니다. 각 과제는 독립적인 페이지로 구성되어 있으며, 재사용성, 타입 안전성, 최적화에 중점을 두었습니다.

## 기술 스택

- **React 19**: 함수형 컴포넌트, Hooks(useState, useEffect, useContext, useMemo, useCallback), Suspense, Error Boundary 활용
- **TypeScript**: 구조적 타입 시스템을 활용한 타입 안전성 확보
- **Tailwind CSS v4**: 유틸리티 기반 스타일링, JIT 컴파일러 활용
- **React Router**: 페이지 라우팅 및 중첩 라우팅 구현
- **Context API**: 상태 관리(Gallery, CardGame)
- **Fetch API**: 외부 API 호출 및 데이터 처리

## 설치 및 실행 방법

```bash
# 저장소 클론
git clone https://github.com/yourusername/frontend-heuron.git

# 프로젝트 폴더로 이동
cd frontend-heuron

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 코드 린트 실행
npm run lint

# 코드 포맷팅
npm run format
```

## 과제 구현 내용

### 1. 이미지 갤러리

- **데이터 처리**: Lorem Picsum API로 이미지 목록 로드, useImageCache로 사전 로딩.
- **테이블 구현**: 썸네일, 작가, 크기 표시, 반응형 그리드(sm:grid-cols-2).
- **Canvas 기능**:
   - 흑백/컬러 전환: ImageControls와 GalleryContext 연동
   - 마우스 왼쪽 드래그: 이미지 확대/축소
   - 마우스 오른쪽 드래그: 이미지 회전
   - 이미지 최적화 및 로딩 성능 개선
   - 도전: Y축 드래그 감지 불안정 → 좌표 보정으로 해결
- **상태 관리**: GalleryContext를 통한 이미지 뷰 상태 관리
- **에러 처리**: 로딩 중 상태 표시, API 오류 예외 처리

### 2. 카드 게임

- **설정**: 플레이어 수/이름 입력, 유효성 검사.
- **카드 분배**: 입력한 카드 수에 따라 플레이어에게 랜덤 점수 카드 분배
- **애니메이션**: 카드 분배 과정 시각화를 위한 애니메이션 효과
- **승자 결정**: 카드 점수 합산으로 승자 결정 (동점 시 후순위 플레이어 승리)
- **결과 표시**: 승리 플레이어, 점수, 보유 카드 목록 표시
- **상태 관리**: CardGameContext를 통한 게임 상태 관리

### 3. 검색 필터링 테이블

- **데이터**: 3개 컬럼을 가진 데이터 테이블 구현(News API로 테슬라 뉴스 로드)
- **실시간 필터링**: 컬럼별 검색 필드를 통한 실시간 필터링(useDebounce로 300ms 지연)
- **AND 검색 조건**: 여러 검색 필드 간 AND 조건 연결
- **검색어 하이라이트**: 검색된 텍스트에 녹색 배경 하이라이트 적용(escapeRegExp로 특수문자 처리)
- **무한 스크롤**: 성능 최적화를 위한 무한 스크롤 구현
- **유저 경험**: 로딩 상태 표시, 에러 처리, 반응형 UI

## 프로젝트 구조

```
src/
├── assets/         # 정적 파일 (이미지, 아이콘)
├── components/     # 재사용 가능한 컴포넌트
│   ├── common/     # 공통 컴포넌트
│   ├── gallery/    # 이미지 갤러리 관련 컴포넌트
│   ├── cardGame/   # 카드 게임 관련 컴포넌트
│   ├── dataTable/  # 검색 테이블 관련 컴포넌트
│   └── ui/         # UI 컴포넌트
├── context/        # Context API 관련 파일
│   ├── gallery/    # 이미지 관련 컨텍스트
│   └── cardGame/   # 카드 게임 관련 컨텍스트
├── hooks/          # 커스텀 훅
├── pages/          # 페이지 컴포넌트
│   ├── Gallery/    # 이미지 갤러리 페이지
│   ├── CardGame/   # 카드 게임 페이지
│   ├── DataTable/  # 데이터 테이블 페이지
│   └── Home/       # 홈 페이지
├── services/       # API 호출 및 데이터 처리
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수
└── App.tsx         # 메인 앱 컴포넌트
```

## 개발 특징 및 최적화

1. **코드 품질**

   - ESLint, Prettier를 활용한 코드 품질 관리
   - TypeScript 타입 안전성 확보
   - 컴포넌트 재사용성 고려

2. **성능 최적화**

   - React.memo, useMemo, useCallback을 통한 렌더링 최적화
   - 이미지 로딩 최적화 (지연 로딩, 점진적 로딩)
   - 코드 스플리팅 (React.lazy, Suspense)

3. **접근성**

   - 시맨틱 HTML 태그 사용
   - ARIA 속성 추가
   - 키보드 접근성 고려

4. **반응형 디자인**
   - Tailwind CSS를 활용한 모바일 퍼스트 접근법
   - 다양한 화면 크기에 대응하는 레이아웃

## 추가 구현 및 개선 사항

- **무한 스크롤**: 데이터 테이블에 무한 스크롤 기능 추가
- **애니메이션**: 카드 게임에 분배 애니메이션 추가
- **이미지 상세 페이지**: 이미지 갤러리에 상세 페이지 추가
- **로딩 상태 표시**: 모든 API 호출에 로딩 상태 표시
- **에러 처리**: 일관된 에러 처리 및 사용자 피드백
- **토스트 메시지**: 사용자 액션에 대한 피드백 제공
- **프로그레시브 이미지 로딩**: 이미지 갤러리에 적용

## 라이브러리 선택 이유

- **React 19**: 최신 기능(Hooks, Suspense)을 활용한 선언적 UI 개발
- **TypeScript**: 타입 안전성을 통한 버그 감소 및 코드 품질 향상
- **Tailwind CSS v4**: 빠른 프로토타이핑, 반응형 UI 구현

