import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BookCard from "../components/BookCard";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import FloatingBar from "../components/FloatingBar";
import FloatAdd from "../components/FloatAdd";

interface Book {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  key: string;
  genre: string;
  condition: string;
  isAvailable: boolean;
  location: {
    ltd: number;
    lng: number;
  };
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const NearbyBooks = () => {
  const [sideBar, setSideBar] = useState<boolean>(false);
  const [floater, setFloater] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  
  const apiUrl = import.meta.env.VITE_API_URL;


  const sideRef = useRef(null);
  const leftTab = useRef(null);

  
  const handleSuccess = () => {
    toast.success('Book is Added!');
  };
  const handleError = (message: string = 'Operation failed!') => {
    toast.error(message);
  };

  useGSAP(() => {
    if (sideBar) {
      gsap.to(sideRef.current, {
        right: 0,
        width: window.innerWidth >= 768 ? "25%" : "100%",
      });
      gsap.to(leftTab.current, {
        width: window.innerWidth >= 768 ? "75%" : "0%",
      });
    } else {
      gsap.to(sideRef.current, {
        right: "-10%",
        width: 0,
      });
      gsap.to(leftTab.current, {
        width: "100%",
      });
    }
  }, [sideBar]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false
          });
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: `Unable to retrieve your location: ${error.message}`,
            loading: false
          });
          handleError("Location access denied. Please enable location services to find nearby books.");
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by your browser",
        loading: false
      });
      handleError("Your browser doesn't support geolocation. Please try a different browser.");
    }
  }, []);
  useEffect(() => {
    const fetchNearbyBooks = async () => {
      const token=localStorage.getItem("token");
      if (!location.latitude || !location.longitude||!token) return;
      try {
        setIsLoading(true);
        const response = await axios.post(`${apiUrl}/book/aroundMe`, {
          lat: location.latitude,
          lng: location.longitude,
          radius: selectedRadius
        },{headers:{"Authorization":`pspk ${token}`}});
    
        if (response.data.success) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching nearby books:", error);
        handleError("Failed to fetch nearby books. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyBooks();
  }, [location.latitude, location.longitude, selectedRadius, apiUrl]);

  const distanceOptions = [5, 10, 15, 20, 50, 100];

  return (
    <div className="w-screen h-screen relative bg-white dark-mode overflow-x-hidden">
      <ToastContainer />
      
      {floater && (
        <FloatAdd
          handle={() => { setFloater(false); }}
          handleSucces={handleSuccess}
          handlerError={handleError}
        />
      )}
      
      <div className="h-[15%] p-4 w-full flex justify-center items-center">
        <NavBar handler={() => { setSideBar(!sideBar); }} />
      </div>

      <div className="h-[85%] w-full flex gap-4 p-5 relative overflow-hidden">
        <div ref={leftTab} className="w-full h-full relative flex flex-col overflow-hidden">
          <FloatingBar handler={() => { setFloater(true); }} />
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl text-gray-700 font-bold">Discover Books Near You</h1>
            
            <div className="flex items-center gap-2">
              <label htmlFor="distance" className="text-gray-700 font-semibold">
                Search Radius (km):
              </label>
              <select 
                id="distance"
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {distanceOptions.map((distance) => (
                  <option key={distance} value={distance}>
                    {distance}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {location.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{location.error}</p>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : books.length > 0 ? (
              <div className="w-full mt-6 p-2">
                <p className="text-gray-600 mb-4">
                  Showing {books.length} book{books.length !== 1 ? 's' : ''} within {selectedRadius} km of your location
                </p>
                <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      Okey={book.key}
                      title={book.title}
                      author={book.author}
                      cover={book.imageUrl}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="96" fill="#f4f4f5" stroke="#e4e4e7" stroke-width="2"/>
  
  <g transform="translate(50, 55)">
    <rect x="0" y="70" width="100" height="20" rx="2" fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/>
    <rect x="0" y="68" width="100" height="2" rx="1" fill="#9ca3af"/>
    <rect x="45" y="75" width="10" height="10" rx="1" fill="#9ca3af"/>
    
    <rect x="10" y="50" width="90" height="20" rx="2" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1" transform="rotate(-5 10 50)"/>
    <rect x="50" y="55" width="10" height="10" rx="1" fill="#9ca3af" transform="rotate(-5 50 55)"/>
    
    <rect x="5" y="30" width="80" height="20" rx="2" fill="#f3f4f6" stroke="#9ca3af" stroke-width="1" transform="rotate(8 5 30)"/>
    <rect x="40" y="35" width="10" height="10" rx="1" fill="#9ca3af" transform="rotate(8 40 35)"/>
    
    <circle cx="70" cy="15" r="12" fill="none" stroke="#6b7280" stroke-width="3"/>
    <line x1="78" y1="23" x2="90" y2="35" stroke="#6b7280" stroke-width="3" stroke-linecap="round"/>
    
    <text x="98" y="85" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#9ca3af" text-anchor="middle">?</text>
  </g>
</svg>
                <p className="text-gray-500 text-lg font-medium">
                  No books found within {selectedRadius} km of your location
                </p>
                <p className="text-gray-400 mt-2">
                  Try increasing your search radius or add some books yourself!
                </p>
              </div>
            )}
          </div>
        </div>

        <div 
          ref={sideRef} 
          className="w-[25%] right-[-100%] absolute flex flex-col sm:grid-cols-1 gap-2 justify-center items-center overflow-y-auto"
        >
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default NearbyBooks;