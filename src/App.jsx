import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import authService from './appwrite/auth'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

    useEffect(() => {
        authService
            .getCurrentUser()
            .then((userData) => {
                if (userData) dispatch(login({ userData }));
                else dispatch(logout());
            })
            .finally(() => setLoading(false));
    }, [dispatch]);

    return !loading ? (
      <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
          <div className="w-full block">
              <Header />
              <main>
                  <Outlet />
              </main>
          </div>
          <div className="w-full block">
              <Footer />
          </div>
      </div>
  ) : null;
}

export default App

// import  React, { useState,useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import authService from './appwrite/auth';
// import {login,logout} from "./store/authSlice"

// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer.jsx";


// import './App.css'
// import { Outlet } from 'react-router-dom';

// function App() {
//   const [loading, setLoading]=useState(true);
//   const dispatch=useDispatch();

//   useEffect(()=>{
//     authService.getCurrentUser()
//       .then((userData)=>{
//         if(userData){
//           dispatch(login({userData}))
//         }
//         else{
//           dispatch(logout())
//         }
//       })
//       .catch((err)=>{
//         console.log("Error fetching user:",err);
//         dispatch(logout());
//       })
//       .finally(()=>setLoading(false))
//   },[dispatch])
//   return !loading ? (
//     <div className='min-h-screen flex flex-wrap content-between bg-gray-500'>
//       <div className='w-full block'>
//         <Header />
//         <main>
//           {/* <Outlet/> */}
//         </main>
//         <Footer />
//       </div>
//     </div>
//   ): null
// }

// export default App
