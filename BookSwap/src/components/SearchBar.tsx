import Input from "./Input";
import { BsSearch } from "react-icons/bs";
const SearchBar=()=>{
    return (
        <>
            <div className="w-[75%] p-2  bg-gray-100 h-[75%] rounded flex justify-center items-center">
            <input type="text" name="search" className="focus:outline-0 h-full w-[80%] p-3 rounded-r" onChange={()=>{}} placeholder="Search"></input>
            <div className="   rounded-l h-full p-3 flex justify-center items-center w-[20%] cursor-pointer" ><BsSearch /></div>
            </div>
        </>
    )
}
export default SearchBar;