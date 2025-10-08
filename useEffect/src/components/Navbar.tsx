import { NavLink } from "react-router-dom"

const Links =[
    {to: '/', lable: '홈'},
    {to:'/movies/category/popular', lable: '인기 영화'},
    {to:'/movies/category/now_playing', lable: '상영 중'},
    {to:'/movies/category/top_rated', lable: '평점 높음'},
    {to:'/movies/category/upcoming', lable: '개봉 예정'},
]

export const Navbar =()=>{
    return <div className="flex gap-3 p-4">
        {Links.map(({to, lable})=>(
            <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
            isActive 
              ? 'text-black font-bold' 
              : 'text-gray-500 hover:text-gray-900'
          }>{lable}</NavLink>
        ))}
    </div>
}