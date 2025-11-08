import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
const HomePage= ()=>{
    return <div>
        <Navbar/>
        <Outlet/>
        <div className="flex items-center justify-center gap-10 text-bold ">홈</div>
    </div>
}
export default HomePage;