import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,

    }
})

export default store



// import { configureStore } from "@reduxjs/toolkit";

// const store = configureStore({
//     reducer:{

//     }
// });

// export default store;

//notes->

// Because Redux = one place where all your app's data lives, so every component can access it without passing props everywhere (which gets messy fast).
// Think of the store as a global backpack your app carries around.

//configureStore()->

// Redux Toolkit (RTK) made Redux less headache.
// configureStore() is the modern, clean way to create a store because it:

// ->Auto-sets good defaults
// ->Adds debugging tools
// ->Handles middleware for async code
// ->Removes a TON of boilerplate
// ->Prevents common bugs

//reducer:{} work is plug in the slices.