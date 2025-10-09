import { useEffect } from "react"
import { getMyInfo } from "../apis/auth"

const MyPage = () =>{
    useEffect(()=>{
        const getData = async () =>{
            const response = await getMyInfo();
        }
        getData();
    }, [])
    return <>
    </>
}
export default MyPage