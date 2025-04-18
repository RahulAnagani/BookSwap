import Login from './Pages/Login'
import Register from './Pages/Register'
import DashBoard from './Pages/DashBoard'
import "./app.css"
import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import AAth from './context/AAth'
import Requests from './Pages/Requests'
import Explore from './Pages/explore'
import BookPage from './Pages/BookPage'

function App() {
  return (
    <>
      <title>Swipe Swap Read</title>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/home' element={<AAth><DashBoard/></AAth>}></Route>
          <Route path='/requests' element={<AAth><Requests/></AAth>}></Route>
          <Route path='/explore' element={<AAth><><Explore></Explore></></AAth>}></Route>
          <Route path='/book/:title' element={<AAth><BookPage></BookPage></AAth>}></Route>
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
