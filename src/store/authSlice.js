import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData
        },
        logout: (state) => {
            state.status = false;
            state.userData = null
        }
    }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer



// //basically slice is feature in technical language.like counting something, like something etc.
// // like how to solve a big problem? solution the problem break in the small pices and solve indiviual and last combine that.
// // approx similer there are many features in particular project so indiviually parted the features in redux that is know as slice.
// // every slice has initial_state and slice function/method and it has [name the slice,insert the initial_state,reducer(state and action)] all this pass as object in createSlice() method.
// // eg-> auth slice, user slice, cart slice, theme slice and so on features.
// // there are three main things in the slice.
// // 1.state->What your slice stores and State is basically the data your slice controls.
// // 2.Action->What your app wants to do and Actions are the instructions you send to Redux.
// // 3.Reducers—> How the state actually changes and Reducers are the functions that update the state when an action happens.


// import { createSlice } from "@reduxjs/toolkit";

// const initialState={
//     status:false,
//     userData:null
// }
// const authSlice=createSlice({
//     name:"auth",
//     initialState,
//     reducers:{
//         login:(state,action)=>{
//             state.status=true,
//             state.userData=action.payload.userData
//         },
//         logout:(state)=>{
//             state.status=false,
//             state.userData=null
//         }
//     }
// });

// export const {login,logout}=authSlice.actions; // here the all features(currently feature is login and logout) are dispatch.
// export default authSlice.reducer;
// //After complete the all set-up of slice the tie-up with store(redux tlk).





// //NOTE -> THERE ARE THE TWO GENERAL LIBRARIES FOR STATE MANEGEMENT IN REACT [1. REDUX TOOL KIT AND 2. ZUSTAND].
// //--> Redux tool is mainly simple and munually control library it is use for medium or large and complex propertis
// //--> Zustand is the automate mostly, super simple for implementation use in simple and beginners friendly to understand state management in the react.
// // redux toolkit is use for state management library of javaScript for work in the big project.
// //  -> It helps you manage data that needs to be shared across multiple components.
// //Redux Toolkit still uses:
//     // > reducers
//     // > actions
//     // > dispatch
//     // > global store


// // A reducer is just a pure function that:
// // takes the current state
// // takes an action
// // returns the new state

// // Context API = React’s way to share data globally without passing props everywhere.