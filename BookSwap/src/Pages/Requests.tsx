import { useState } from "react";
import NavBar from "../components/NavBar";
import Request from "../components/Request";
import { FaPaperPlane } from "react-icons/fa";
import { CiInboxIn } from "react-icons/ci";
type Book = {
  title: string;
  author: string;
  genre: string;
};

type Req = {
  time: string;
  username: string;
  type: "sent" | "received";
  requestType: "swap" | "buy";
  status: string;
  fromBook: Book | { title: ""; author: ""; genre: "" };
  toBook: Book;
};

const Requests = () => {
    const [tab,setTab]=useState<"sent"|"received">("sent");
  const requests: Req[] = [
    {
      time: "2025-04-12T10:30:00Z",
      username: "john_doe",
      type: "sent",
      requestType: "swap",
      status: "Pending",
      fromBook: {
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
      },
      toBook: {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
      },
    },
    {
      time: "2025-04-11T14:00:00Z",
      username: "alice_writes",
      type: "received",
      requestType: "buy",
      status: "Accepted",
      fromBook: { title: "", author: "", genre: "" },
      toBook: {
        title: "Deep Work",
        author: "Cal Newport",
        genre: "Productivity",
      },
    },
    {
      time: "2025-04-10T09:15:00Z",
      username: "rahul_reader",
      type: "sent",
      requestType: "buy",
      status: "Rejected",
      fromBook: { title: "", author: "", genre: "" },
      toBook: {
        title: "Homo Deus",
        author: "Yuval Noah Harari",
        genre: "Future",
      },
    },
    {
      time: "2025-04-09T12:45:00Z",
      username: "booklover99",
      type: "received",
      requestType: "swap",
      status: "Pending",
      fromBook: {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
      },
      toBook: {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Classic",
      },
    },
  ];

  return (
    <div className="min-h-screen w-screen dark-mode ">
      <div className="h-[15%] p-4 w-full">
        <NavBar />
      </div>
      <div className="w-full p-4">
        <h1 className="font-bold text-2xl">Requests</h1>
        <div className="w-full">
            <div className="flex gap-2 p-2  ">
            <button 
  onClick={() => setTab("sent")} 
  className={`dark:bg-gray-800 p-4 rounded ${tab === 'sent' ? "bg-black text-white shadow-md shadow-gray-700" : "bg-gray-300"}`}
>
  <FaPaperPlane className="focus:invert" />
</button>
<button 
  onClick={() => setTab("received")}  
  className={`dark:bg-gray-800 p-4 rounded ${tab === 'received' ? "bg-black text-white shadow-md shadow-gray-700" : "bg-gray-300"}`}
>
  <CiInboxIn />
</button>


            </div>
        </div>
        <div className="w-full min-h-[50dvh] flex flex-col gap-3 p-1">
            <h1 className="font-bold  mt-3">{tab.toUpperCase()}</h1>
            <div 
        className={`flex justify-center  rounded items-center p-1 transition-all duration-300 h-[10dvh] `}>
        <div className="w-[10%] flex justify-start items-center">
          <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">Profile</h1>
        </div>

        <div className="w-[20%] flex justify-start items-center">
          <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">Username</h1>
        </div>

        <div className="w-[20%] flex relative justify-start items-center">
          <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">Book Title</h1>
          
        </div>

        <div className="w-[20%] flex flex-col justify-start items-center">
          <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">Request Type</h1>
        </div>

        <div className="w-[10%] flex justify-start items-center" >
          <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500">Status</h1>
        </div>

        <div className="w-[20%] flex justify-around items-center">
          <h1 className="font-bold text-sm text-gray-500 dark:text-gray-500 ">Time of Request</h1>
         
        </div>
      </div>
          {requests.map((e, i) => (
            tab===e.type?
            <Request
              key={i}
              username={e.username}
              status={e.status}
              fromBook={e.fromBook}
              toBook={e.toBook}
              time={e.time}
              type={e.type}
              requestType={e.requestType}
            />:<></>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
