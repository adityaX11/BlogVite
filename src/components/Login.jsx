import authService from "../appwrite/auth"
import {Link, useNavigate} from "react-router-dom"
import React, {useState} from 'react'
import Button from "./Button"
import Input from './Input'
import Logo from "./Logo"
import {useForm} from "react-hook-form"
import {useDispatch} from "react-redux"
import {login as authLogin} from "../store/authSlice"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async (data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin({userData}))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center w-full">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Email : "
                            placeholder="Email Address"
                            type="email"
                            {...register("email", {
                                required: true,

                            })}
                        />
                        <Input
                            label="Password : "
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Log in{" "}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login





// import authService from "../appwrite/auth"
// import {Link, useNavigate} from "react-router-dom"
// import React, {useState} from 'react'
// import Button from "./Button"
// import Input from './Input'
// import Logo from "./Logo"
// import {useForm} from "react-hook-form"
// import {useDispatch} from "react-redux"
// import {login as authLogin} from "../store/authSlice"

// function Login() {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const {register, handleSubmit} = useForm() // both register and handleSubmit are the event.
//     const [error, setError] = useState("")

//     const login = async (data) => { // this is the function that is run by handleSubmit() event. 
//         setError("") // basically this use for fix or clean the error.
//         try {
//             const session = await authService.login(data)
//             if (session) {
//                 const userData = await authService.getCurrentUser()
//                 if (userData) dispatch(authLogin({userData}))
//                 navigate("/")
//             }
//         } catch (error) {
//             setError(error.message)
//         }
//     }

//     return (
//         <div className="flex items-center justify-center w-full">
//             <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
//                 <div className="mb-2 flex justify-center">
//                     <span className="inline-block w-full max-w-[100px]">
//                         <Logo width="100%" />
//                     </span>
//                 </div>
//                 <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
//                 <p className="mt-2 text-center text-base text-black/60">
//                     Don&apos;t have any account?&nbsp;
//                     <Link
//                         to="/signup"
//                         className="font-medium text-primary transition-all duration-200 hover:underline"
//                     >
//                         Sign Up
//                     </Link>
//                 </p>
//                 {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

//                 <form onSubmit={handleSubmit(login)} className="mt-8"> // the form game is start here. basically how the both event register and handleSubmit work in the form.
//                     <div className="space-y-5">
//                         <Input
//                             label="Email : "
//                             placeholder="Email Address"
//                             type="email"
//                             {...register("email", {
//                                 required: true,
//                                 validate:{
//                                     matchPater:(value)=>/^[\w.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i test(value) || "Email Address must be valid address",

//                                 }
//                             })}
//                         />
//                         <Input
//                             label="Password : "
//                             type="password"
//                             placeholder="Password"
//                             {...register("password", { required: true })}
//                         />
//                         <Button type="submit" className="w-full">
//                             Sign in{" "}
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Login




// // important notes on the register() and handleSubmit()->
// // In simple word register work for collect the data from input and check and verify that is clean or not then send for form submition work for the handleSubmit.
// //  and handleSubmit work as if current input data is correct having no any error then run the inside function.

// //register — connects your input to React Hook Form
// //register handles ALL of that automatically
// //register() is like plugging your input into the React Hook Form ecosystem.
// //    Without register, the form doesn't know your input even exists

// //handleSubmit — controls form submission
// //handleSubmit = “When user submits, check everything. If clean → run my function.”


// // why are we use validate-> Because validate is where you put your OWN custom validation logic

// //-> React Hook Form gives you simple validators like:
// // required: true
// // minLength: 5
// // maxLength: 20

// // -> But when you need your own rule, like checking:
// // email pattern
// // strong password
// // username rules
// // phone formatting
// // …then you use validate.