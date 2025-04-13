# PRD: 프론트엔드 과제 웹 애플리케이션

## 1. 개요
React 19, TypeScript, Tailwind CSS v4로 이미지 갤러리, 카드 게임, 검색 테이블을 구현한 웹 애플리케이션. 코드 품질, 재사용성, 최적화 목표.

## 2. 목표
- **사용자**: 평가자가 요구사항 충족과 코드 품질 확인.
- **비즈니스 목표**: 깔끔한 UI/UX, 안정적 기능, 타입 안전성.
- **기술 목표**: React 19, TypeScript, Tailwind CSS v4 활용.

## 3. MVP 기능 요구사항

### 3.1 공통
- 페이지 전환: 내부 라우팅 (React Router).
- URL 접근: 페이지별 고유 URL.
- API 처리: 로딩 표시, 응답 후 제거.
- 에러 처리: API 에러 예외 처리.
- 메뉴 분리: 독립적 메뉴/페이지.

### 3.2 과제 1: 이미지 갤러리
- API: Lorem Picsum.
- 기능: 테이블로 썸네일 표시, 흑백/컬러 스위치, 캔버스로 확대/축소, 회전.
- UI/UX: Tailwind CSS 테이블, 부드러운 캔버스 조작.
- 기술: TypeScript, `fetch` API.

### 3.3 과제 2: 카드 게임
- 기능: 플레이어 수 입력, 카드 랜덤 분배, 점수 합계로 승자 결정(동점 시 후순위).
- UI/UX: Tailwind CSS로 입력 폼, 결과 표시.
- 기술: TypeScript, React 상태 관리.

### 3.4 과제 3: 검색 테이블
- 기능: 3개 컬럼, 10개 데이터, 실시간 AND 필터링, 검색어 하이라이트.
- UI/UX: Tailwind CSS로 테이블, 입력 필드.
- 기술: TypeScript, React Hooks.

### 3.5 개발 환경
- 언어: TypeScript, ES6+.
- 프레임워크: React 19.
- 스타일링: Tailwind CSS v4.
- 실행: `npm start` 또는 `yarn start`.
- 문서화: README.md.

## 4. MVP 이후 기능
- 반응형 디자인, 접근성, 테스트, 성능 최적화, 다크 모드, 애니메이션.

## 5. 비기능적 요구사항
- 코드 품질: 재사용성, ESLint/Prettier, TypeScript.
- 문서화: README, 주석.
- 제출: GitHub 또는 zip (node_modules 제외).

## 6. 기술 스택
- React 19, TypeScript, Tailwind CSS v4, React Router, `fetch` API.

## 7. 프로젝트 구조
```
my-app/
├── public/
├── src/
│   ├── components/
│   │   ├── gallery/
│   │   ├── cardGame/
│   │   ├── dataTable/
│   ├── contexts/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
├── README.md
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
```

## 8. 성공 지표
- MVP 기능 완성.
- 안정적 페이지 전환, API 호출, 에러 처리.
- 코드 가독성, 재사용성.
- README 명확성.
