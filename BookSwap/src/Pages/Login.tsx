import Form from "../components/Form";
import "./Login.css";
import login from "../assets/login1.jpg"
import Input from "../components/Input";
import { useState } from "react";
import { Link } from "react-router-dom";
const Login=()=>{
    const [Creds,setCreds]=useState<{userName:string,password:string}>({userName:"",password:""});
    const Ihandler=(e:React.ChangeEvent<HTMLInputElement>):void=>{
        const {name,value}=e.target;
        setCreds((prev)=>({
            ...prev,
            [name]:value,
        }));
    }
    return (
        <>
            <div className="w-screen login h-screen flex overflow-hidden">
                <div className="cover w-[60%] h-full bg-[#FFF8EA]">
                    <img src={login} className="h-full w-full object-cover"></img>
                </div>
                <div className="creds w-[40%] h-screen bg-gradient-to-r from-blue-300 via-white to-blue-300 flex flex-col justify-center items-center ">
                    <Form submitHandler={()=>{}}>
                        <h1 className="font-bold hover:text-gray-500 mb-3 text-xl">Login</h1>
                        <Input handler={Ihandler} type="text" name="userName" placeHolder="Enter your Username"></Input>
                        <Input handler={Ihandler} type="password" name="password" placeHolder="Enter your password"></Input>
                        <button className="text-white bg-blue-400 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white">Login</button>
                        <p className="absolute bottom-0 text-xs text-gray-600 font-bold p-2">New to BookSwap? <Link to={"/register"}><span className="text-black underline hover:cursor-pointer">Register</span></Link></p>
                    </Form> 
                </div>
            </div>
        </>
    )
}
export default Login