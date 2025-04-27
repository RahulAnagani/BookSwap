import { useRef, useState } from "react";
import { MdOutlineSwapVerticalCircle, MdExpandMore } from "react-icons/md";
import TooltipTitle from "./Tool";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdDone, MdCancel } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type book = {
  title: string;
  author: string;
  genre: string;
};

type Request = {
  time: string;
  username: string;
  type: "sent" | "received";
  requestType: "swap" | "buy";
  status: "pending" | "accepted" | "declined" | "received" | "canceled";
  fromBook: book | { title: ""; author: ""; genre: "" };
  toBook: book;
  id: string;
  handler: (val: boolean) => void;
};

const Request: React.FC<Request> = ({
  time,
  requestType,
  username,
  type,
  toBook,
  fromBook,
  status,
  id,
  handler
}) => {
  const nav = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<Request["status"]>(status);
  const serverApi = import.meta.env.VITE_API_URL;
  const controller = useRef<AbortController | null>(null);
  
  const acceptHandler = async () => {
    handler(true);
    const token = localStorage.getItem("token")
    if (!token) { handler(false); return; }
    if (controller.current) controller.current.abort();
    const actualController = new AbortController();
    controller.current = actualController
    axios.post(`${serverApi}/request/accept`, { reqId: id }, { headers: { "Authorization": `pspk ${token}` }, signal: actualController.signal })
      .then((res) => {
        if (res.data.success) {
          setCurrentStatus("accepted");
          handler(false);
        }
        else {
          handler(false);
          return;
        }
      })
      .catch(e => {
        handler(false);
        console.log(e);
      })
  }
  
  const ignoreHandler = async () => {
    handler(true);
    const token = localStorage.getItem("token")
    if (!token) { handler(false); return; }
    if (controller.current) controller.current.abort();
    const actualController = new AbortController();
    controller.current = actualController
    axios.post(`${serverApi}/request/decline`, { reqId: id }, { headers: { "Authorization": `pspk ${token}` }, signal: actualController.signal })
      .then((res) => {
        if (res.data.success) {
          setCurrentStatus("declined");
          handler(false);
        }
        else {
          handler(false);
          return;
        }
      })
      .catch(e => {
        console.log(e);
        handler(false);
      })
  }
  
  const cancelHandler = async () => {
    handler(true);
    const token = localStorage.getItem("token")
    if (!token) { handler(false); return; }
    if (controller.current) controller.current.abort();
    const actualController = new AbortController();
    controller.current = actualController
    axios.post(`${serverApi}/request/cancel`, { reqId: id }, { headers: { "Authorization": `pspk ${token}` }, signal: actualController.signal })
      .then((res) => {
        if (res.data.success) {
          setCurrentStatus("canceled");
          handler(false);
        }
        else {
          handler(false);
          return;
        }
      })
      .catch(e => {
        handler(false);
        console.log(e);
      })
  }
  
  const markReceivedHandler = async () => {
    setCurrentStatus("received");
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case "Accept":
        await acceptHandler();
        break;
      case "Ignore":
      case "Decline":
        await ignoreHandler();
        break;
      case "Cancel":
        await cancelHandler();
        break;
      case "MarkReceived":
        await markReceivedHandler();
        break;
      default:
        break;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "received":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "canceled":
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const renderActionButtons = () => {
    if (type === "sent" && currentStatus === "pending") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction("Cancel");
          }}
          className="px-2 py-1 md:px-3 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md shadow hover:shadow-md transition-all duration-200 text-xs md:text-sm font-medium"
          title="Cancel Request"
        >
          Cancel
        </button>
      );
    }
    
    if (type === "received" && currentStatus === "pending") {
      return (
        <div className="flex flex-col md:flex-row gap-1 md:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction("Decline");
            }}
            className="px-2 py-1 md:px-3 bg-white border cursor-pointer border-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-50 transition-all duration-200 text-xs md:text-sm font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            title="Decline Request"
          >
            Decline
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction("Accept");
            }}
            className="px-2 py-1 md:px-3 cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md shadow hover:shadow-md transition-all duration-200 text-xs md:text-sm font-medium"
            title="Approve Request"
          >
            Accept
          </button>
        </div>
      );
    }
    
    if (type === "sent" && currentStatus === "accepted") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction("MarkReceived");
          }}
          className="px-2 py-1 md:px-3 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow hover:shadow-md transition-all duration-200 text-xs md:text-sm font-medium flex items-center gap-1"
          title="Mark as Received"
        >
          <MdDone className="text-sm" /> Received
        </button>
      );
    }
    
    if (type === "received" && currentStatus === "accepted" && requestType === "swap") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction("MarkReceived");
          }}
          className="px-2 py-1 md:px-3 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow hover:shadow-md transition-all duration-200 text-xs md:text-sm font-medium flex items-center gap-1"
          title="Mark as Received"
        >
          <MdDone className="text-sm" /> Received
        </button>
      );
    }
    
    return (
      <span className="text-xs hidden md:inline">{new Date(time).toLocaleString()}</span>
    );
  };

  return (
    <div className="flex flex-col border-b relative border-gray-300">

      <div className="md:hidden p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
              {username && username.charAt(0).toUpperCase()}
            </div>
            <div onClick={() => nav(`/chat/${username}`)} className="cursor-pointer">
              <h1>
                @<span className="font-bold">{username}</span>
              </h1>
            </div>
          </div>
          <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusBadgeStyle(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1">
            <h2 className="text-sm font-medium mb-1">Requested:</h2>
            <div className="text-xs">
              <TooltipTitle
                title={toBook.title}
                author={toBook.author}
                genre={toBook.genre}
              />
            </div>
          </div>
          
          <div className="ml-2 text-right">
            <h2 className="text-sm font-medium mb-1 flex items-center justify-end gap-1">
              {requestType === 'swap' ? (
                <>
                  Swap <MdOutlineSwapVerticalCircle />
                </>
              ) : (
                <>
                  Buy <BiSolidPurchaseTagAlt />
                </>
              )}
            </h2>
            <span className="text-xs text-gray-500">{new Date(time).toLocaleDateString()}</span>
          </div>
        </div>
        
        {requestType === "swap" && (
          <div className="mb-2">
            <h2 className="text-sm font-medium mb-1">Offered:</h2>
            <div className="text-xs">
              <TooltipTitle
                title={fromBook.title}
                author={fromBook.author}
                genre={fromBook.genre}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            {renderActionButtons()}
          </div>
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
          >
            <MdExpandMore
              className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      <div 
        className={`md:flex hidden justify-between items-center p-2 transition-all duration-300 ${
          isExpanded ? "border-b-0" : "h-[10dvh]"
        }`}
      >
        <div className="w-[10%] flex justify-start items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-semibold">
            {username && username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div onClick={() => nav(`/chat/${username}`)} className="w-[30%] flex justify-start items-center text-sm">
          <h1>
            @<span className="font-bold cursor-pointer">{username}</span>
          </h1>
        </div>

        <div className="w-[40%] p-2 flex relative justify-start items-center">
          <TooltipTitle
            title={toBook.title}
            author={toBook.author}
            genre={toBook.genre}
          />
        </div>
        <div className="w-[30%] right-0">
          <div className="flex flex-col justify-start items-center">
            <h1 className="font-semibold flex items-center gap-1">
              {requestType === 'swap' ? (
                <>
                  {requestType}
                  <MdOutlineSwapVerticalCircle />
                </>
              ) : (
                <>
                  {requestType}
                  <BiSolidPurchaseTagAlt />
                </>
              )}
            </h1>
            {requestType === "swap" && (
              <div className="flex text-sm">
                <h1 className="text-gray-600 mr-1">title:</h1>
                <TooltipTitle
                  title={fromBook.title}
                  author={fromBook.author}
                  genre={fromBook.genre}
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-[10%] flex justify-start items-center">
          <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusBadgeStyle(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>

        <div className="w-[20%] flex justify-around items-center">
          <div className="flex items-center gap-2">
            {!isExpanded && renderActionButtons()}
            <MdExpandMore
              className={`cursor-pointer bg-gray-300 dark:text-black text-bold rounded-full transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="dark:bg-slate-900 bg-gray-50 cursor-default p-3 md:p-6 text-sm rounded-b-md shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="space-y-2">
              <h2 className="text-base font-semibold border-b pb-2 border-gray-300 dark:border-gray-700 mb-3">Request Details</h2>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Status:</span>
                <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusBadgeStyle(currentStatus)}`}>
                  {currentStatus}
                </span>
                {currentStatus === "received" && (
                  <span className="ml-2 text-green-600 dark:text-green-400 flex items-center gap-1">
                    <MdDone className="text-lg" /> Complete
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Type:</span>
                <span>{type === "sent" ? "Outgoing" : "Incoming"}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Date:</span>
                <span>{new Date(time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Time:</span>
                <span>{new Date(time).toLocaleTimeString()}</span>
              </div>
              
              {currentStatus === "received" && (
                <div className="mt-2 bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-200 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-300 flex items-center gap-1">
                    <MdDone className="text-lg" /> 
                    {type === "received" 
                      ? `Book has been successfully delivered to ${username}.`
                      : "You've confirmed receiving this book."}
                  </p>
                </div>
              )}
              
              {currentStatus === "declined" && (
                <div className="mt-2 bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-300 flex items-center gap-1">
                    <MdCancel className="text-lg" /> 
                    {type === "received" 
                      ? "You declined this request."
                      : `Your request was declined by ${username}.`}
                  </p>
                </div>
              )}
              
              {currentStatus === "canceled" && (
                <div className="mt-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <MdCancel className="text-lg" /> This request has been canceled.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold border-b pb-2 border-gray-300 dark:border-gray-700 mb-3">Requested Book</h2>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Title:</span>
                <TooltipTitle
                  title={toBook.title}
                  author={toBook.author}
                  genre={toBook.genre}
                />
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Author:</span>
                <span>{toBook.author}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20 md:w-24">Genre:</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-md text-xs">{toBook.genre}</span>
              </div>
            </div>

            {requestType === "swap" && (
              <div className="space-y-2">
                <h2 className="text-base font-semibold border-b pb-2 border-gray-300 dark:border-gray-700 mb-3">Offered Book</h2>
                <div className="flex items-center">
                  <span className="font-medium w-20 md:w-24">Title:</span>
                  <TooltipTitle
                    title={fromBook.title}
                    author={fromBook.author}
                    genre={fromBook.genre}
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-20 md:w-24">Author:</span>
                  <span>{fromBook.author}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-20 md:w-24">Genre:</span>
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-2 py-1 rounded-md text-xs">{fromBook.genre}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-8">
            {currentStatus === "accepted" && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 md:p-4 rounded-md border border-blue-200 dark:border-blue-800 mb-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Next Steps</h3>
                <p className="text-blue-700 dark:text-blue-200 text-xs md:text-sm">
                  {type === "received" && requestType === "swap"
                    ? `Please arrange the handover of "${toBook.title}" with ${username}. Once you receive the book "${fromBook.title}", mark this exchange as "Received".`
                    : type === "received" && requestType === "buy"
                    ? `Please arrange the handover of "${toBook.title}" with ${username}.`
                    : `Your request has been accepted. Please arrange with ${username} to complete the ${requestType}. Once you receive the book "${toBook.title}", mark it as "Received".`
                  }
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-2 md:gap-3 justify-end border-t pt-4 border-gray-300 dark:border-gray-700">
            {type === "received" && currentStatus === "pending" && (
              <>
                <button
                  className="bg-gray-200 cursor-pointer text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm md:text-base w-full md:w-auto"
                  onClick={() => handleAction("Decline")}
                >
                  Decline
                </button>
                <button
                  className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm md:text-base w-full md:w-auto"
                  onClick={() => handleAction("Accept")}
                >
                  Accept
                </button>
              </>
            )}
            {type === "sent" && currentStatus === "pending" && (
              <button
                className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium text-sm md:text-base w-full md:w-auto"
                onClick={() => handleAction("Cancel")}
              >
                Cancel Request
              </button>
            )}
            {type === "sent" && currentStatus === "accepted" && (
              <button
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm md:text-base w-full md:w-auto flex items-center justify-center gap-1"
                onClick={() => handleAction("MarkReceived")}
              >
                <MdDone className="text-lg" /> Mark as Received
              </button>
            )}
            {type === "received" && currentStatus === "accepted" && requestType === "swap" && (
              <button
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm md:text-base w-full md:w-auto flex items-center justify-center gap-1"
                onClick={() => handleAction("MarkReceived")}
              >
                <MdDone className="text-lg" /> Mark as Received
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;