import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center md:text-left">
        휴런(Heuron) 프론트엔드 개발자 과제
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
        <Link
          to="/gallery"
          className="block p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <h2 className="text-lg md:text-xl font-bold mb-2">
            과제 1: 이미지 갤러리
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            이미지 갤러리 및 Canvas API 구현
          </p>
          <div className="mt-3 md:mt-4 text-blue-500 text-xs md:text-sm font-medium">
            더 알아보기 →
          </div>
        </Link>

        <Link
          to="/card-game"
          className="block p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <h2 className="text-lg md:text-xl font-bold mb-2">
            과제 2: 카드 게임
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            플레이어 카드 게임 구현
          </p>
          <div className="mt-3 md:mt-4 text-blue-500 text-xs md:text-sm font-medium">
            더 알아보기 →
          </div>
        </Link>

        <Link
          to="/data-table"
          className="block p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          <h2 className="text-lg md:text-xl font-bold mb-2">
            과제 3: 검색 필터링 테이블
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            검색어 하이라이팅 기능이 있는 테이블 구현
          </p>
          <div className="mt-3 md:mt-4 text-blue-500 text-xs md:text-sm font-medium">
            더 알아보기 →
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
