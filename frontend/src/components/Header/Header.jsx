import React from 'react'
import Container from "../container/container"
import Logo from "../Logo"
import {Link} from "react-router-dom"
import LogoutBtn from './LogoutBtn'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    const navItems = [
        {
            name: <b className='font-extrabold '>Home</b>,
            slug: "/",
            active: true
        },
        {
            name: <b className='font-extrabold'>Login</b>,
            slug: "/login",
            active: !authStatus
        },
        {
            name: <b className='font-extrabold'>Signup</b>,
            slug: "/signup",
            active: !authStatus
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus
        }
    ]

  return (
    <header className='py-3 shadow bg-gray-500'>
        <Container>
            <nav className='flex'>
                <div className='mr-4'>
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                <ul className='flex ml-auto'>
                    {
                        navItems.map((item) => item.active ? (
                            <li key={item.name}>
                                <button
                                onClick={() => navigate(item.slug)}
                                className='inline-bock px-10 py-2 transition-all duration-600 hover:scale-105 hover:shadow-xl hover:shadow-black rounded-full w-auto'
                                >
                                    {item.name}
                                </button>
                            </li>
                        ) : null)
                    }
                    {authStatus && (
                        <li>
                            <LogoutBtn />
                        </li>
                    )}
                </ul>
            </nav>
        </Container>
    </header>
  )
}

export default Header


// import React from 'react'
// import { container,Logo,LogoutBtn } from '../index'
// import { Link } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'

// const header = () => {
//   const authStatus=useSelector((status)=>status.auth.status)
//   const navigate=useNavigate();
//   const navItem=[
//     {
//       name: "Home",
//       slug: "/",
//       active: true
//     },
//     {
//       name: "Login",
//       slug: "/login",
//       active: !authStatus
//     },
//     {
//       name: "Signup",
//       slug: "/signup",
//       active: !authStatus
//     },
//     {
//       name: "All Posts",
//       slug: "/all-posts",
//       active: authStatus
//     },
//     {
//       name: "Add Post",
//       slug: "/add-post",
//       active: authStatus
//     }
//   ]
//   return (
//     <header className='py-3 shadow bg-gray-500'>
//       <container>
//         <nav className='flex'>
//           <div className='mr-4'>
//             <Link to='/'>
//               <Logo width='70px'/>
//             </Link>
//           </div>
//           <ul className='flex ml-auto'>
//             {navItem.map((item)=>
//             item.active ? (
//               <li key={item.name}>
//                 <button
//                 onClick={()=>navigate(item.slug)}
//                 className='inline-block px-6 py-2 duration-200 hover:bg-blue-200 rounded-full'
//                 >{item.name}</button>
//               </li>
//             ) : null
//             )}
//             {authStatus && (
//               <li>
//                 <LogoutBtn />
//               </li>
//             )}
//           </ul>
//         </nav>
//       </container>
//     </header>
//   )
// }

// export default header


// //useSelector is a React-Redux hook that lets your React component read data from the Redux store.
