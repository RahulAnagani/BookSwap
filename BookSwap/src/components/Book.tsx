import book from "../assets/login1.jpg"
import { IoBook } from "react-icons/io5";
import "./book.css"
import { FaStar } from "react-icons/fa";

type props={
    title:string,
    author:string,
    rating:number,
    genre:string,
    img?:string,
    badge:string,
}
const Book:React.FC<props>=({title,author,rating,genre,img,badge})=>{
    return (<>
        <div className="cursor-pointer group flex transition-transform duration-300 hover:scale-105 bg-gray-300 w-50 h-60 text-black rounded ">
            <div className="w-[70%] left overflow-hidden group-hover:w-[30%] h-full flex p-2 justify-center items-center">
                <img className="rounded object-cover h-[75%]" src={book}></img>
            </div>
            <div className="w-[30%] duration-200 overflow-x-hidden group-hover:w-[70%] p-3 right flex flex-col justify-center items-start gap-3 rounded bg-gradient-to-br from-red-200 via-white to-orange-200">
                <IoBook className="group-hover:hidden"/>
                <h1 className="group-hover:hidden text-xs font-bold text-gray-900">Details</h1>
                <h1 className="hyphens-auto font-bold group-hover:block hidden">{title}</h1>
                <p className="text-sm group-hover:block hidden text-gray-600">{author}</p>
                <span className="group-hover:block hidden bg-red-500 rounded font-bold p-2 text-white">{genre}</span>
                <div className=" justify-center group-hover:flex hidden items-center">
                    {rating}
                    {Array(rating).fill(0).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                ))}

                </div>
            </div>
        </div>
    </>)
}
export default Book;