import Form from "../components/Form";
import "./Login.css";
import login from "../../public/login.jpg"
import Input from "../components/Input";
import { useState } from "react";
import { Link } from "react-router-dom";
const Register=()=>{
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
            <div className="w-screen h-screen flex overflow-hidden">
                <div className="creds w-[40%] h-screen bg-gradient-to-r from-green-300 to-orange-200 flex flex-col justify-center items-center ">
                    <Form submitHandler={()=>{}}>
                        <h1 className="font-bold hover:text-gray-500  text-xl">Register</h1>
                        <Input handler={Ihandler} type="text" name="userName" placeHolder="Enter your Email"></Input>
                        <Input handler={Ihandler} type="text" name="userName" placeHolder="Enter your Username"></Input>
                        <Input handler={Ihandler} type="password" name="password" placeHolder="Enter your password"></Input>
                        <button className="text-white bg-blue-400 rounded py-2 px-2 font-bold mt-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white">Register</button>
                        <p className="absolute bottom-0 text-xs text-gray-600 font-bold p-2">Already a user? <Link to={"/login"}><span className="text-black underline hover:cursor-pointer">Login</span></Link></p>
                    </Form> 
                </div>
                <div className="cover w-[60%] h-full bg-[#FFF8EA]">
                    <img src={login} className="h-full w-full object-cover object-right"></img>
                </div>
            </div>
        </>
    )
}
export default Register