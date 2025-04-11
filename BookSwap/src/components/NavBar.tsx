import SearchBar from "./SearchBar";
const NavBar=()=>{
    return (
        <>
        <div className="w-full h-full rounded-b-4xl overflow-hidden p-2">
            <ul className=" w-full  h-full flex">
                <div className="w-[25%]">
                    <img className="h-13 w-13 hover:cursor-pointer" src="book-svgrepo-com.svg"></img>
                </div>
                <div className="w-[50%] flex justify-center items-center ">
                    <SearchBar></SearchBar>
                </div>
                <div className="w-[25%] flex justify-around items-center ">
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <h1 className="text-sm font-bold hover:underline  text-gray-900">Near By</h1>
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <h1 className="text-sm font-bold hover:underline  text-gray-900">Explore</h1>
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                        <h1 className="text-sm font-bold hover:underline  text-gray-900">Requests</h1>
                    </div>
                    <div className="cursor-pointer flex flex-col justify-between items-center">
                    <div className="profile rounded-full flex-col bg-gray-300 p-1 flex justify-center items-center" >
                        <img className="h-8 w-8  hover:cursor-pointer" src="person.svg"></img>
                    </div>
                    <h1 className="text-xs hover:underline  text-white">Profile</h1>
                    </div>
                </div>
            </ul>
        </div>
        </>
    )
}
export default NavBar;