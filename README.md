# 프론트엔드 과제

## 프로젝트 개요

React 19, TypeScript, Tailwind CSS v4로 이미지 갤러리, 카드 게임, 검색 테이블을 구현한 웹 애플리케이션. 코드 품질, 재사용성, 최적화에 중점.

## 설치 및 실행

1. 저장소 클론: `git clone [repository-url]`
2. 의존성 설치: `npm install` 또는 `yarn install`
3. 개발 서버 실행: `npm start` 또는 `yarn start`
4. 브라우저에서 `http://localhost:3000` 접속

## 기술 스택

- **React 19**: 최신 Hooks(`use`, `useTransition`) 활용.
- **TypeScript**: 구조적 타이핑으로 타입 안전성.
- **Tailwind CSS v4**: 빠른 스타일링과 JIT 컴파일.
- **React Router**: 페이지별 URL 라우팅.
- **fetch API**: API 호출.

## 프로젝트 구조

```
src/
├── components/       # 공통 및 과제별 컴포넌트
│   ├── gallery/      # 이미지 갤러리 컴포넌트
│   ├── cardGame/     # 카드 게임 컴포넌트
│   ├── dataTable/    # 검색 테이블 컴포넌트
├── contexts/         # 상태 관리 컨텍스트
├── pages/            # 라우팅 페이지
├── types/            # TypeScript 타입 정의
├── utils/            # 유틸리티 함수
├── App.tsx           # 메인 앱 컴포넌트
├── index.tsx         # 진입점
```

## 과제별 특징

1. **이미지 갤러리**
   - Lorem Picsum API로 이미지 목록 표시.
   - 캔버스 API로 확대/축소, 회전.
   - Context API로 흑백/컬러 전환.
   - Tailwind CSS로 테이블 레이아웃.
2. **카드 게임**
   - 플레이어/카드 수 입력, 랜덤 분배.
   - 점수 합계로 승자 결정(동점 시 후순위 승리).
   - Tailwind CSS로 입력 폼과 결과 UI.
3. **검색 테이블**
   - 3개 컬럼, 10개 데이터로 실시간 필터링.
   - 검색어 녹색 배경 하이라이트.
   - Tailwind CSS로 테이블과 입력 필드.

## 선택사항 구현

- **ESLint/Prettier**: 코드 일관성 유지.
- **반응형 디자인**: 요구사항 외 UX 개선 위해 추가.

## 개발 환경

- Node.js: v18 이상
- npm: v9 이상 또는 yarn
- 브라우저: 최신 Chrome, Firefox, Safari

## 참고

- Tailwind CSS v4는 빠른 스타일링과 최적화를 위해 선택.
- 반응형 디자인은 평가를 고려해 추가.
