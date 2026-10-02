import React from 'react'
import {useDispatch} from "react-redux"
import authService from "../../appwrite/auth.js"
import {logout } from "../../store/authSlice.js"

function LogoutBtn() {
    const dispatch = useDispatch()

    const lougoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        })
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={lougoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn


// import React from 'react'
// import { useDispatch } from 'react-redux'
// import authService from '../../appwrite/config'
// import { logout } from '../../store/authSlice'

// function LogoutBtn() {
//     const dispatch=useDispatch();
//     const logoutHandler=()=>{
//         authService.logout()
//          .then(()=>{
//             dispatch(logout());
//          })
//          .catch((err)=>{
//             console.log("Logout button error :: backend ::",err);
//          })
//     }
//   return (
//     <button
//     className='inline-block px-6 py-2 duration-200 hover:bg-blue-200 rounded-full'
//     >Logout</button>
//   )
// }

// export default LogoutBtn


// // this logout file is why seperated because it will be set as a conditionaly.
// // means when user is loged in the it will be rendering. otherwise not show there.
