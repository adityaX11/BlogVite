// start with appwrite auth service
import conf from "../conf/conf"
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client)
        // console.log("Appwrite URL:", conf.appwriteUrl);
        // console.log("Appwrite Project:", conf.appwriteProjectId);
        // console.log("CONF:", conf);


    }

    async createAccount({email, password, name}){
        // eslint-disable-next-line no-useless-catch
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                // console.log(ID.unique());
                return this.login({email, password})
            } else {
                return userAccount
            }
        } catch (error) {
            throw error
        }
    }
    async login({email, password}){
        // eslint-disable-next-line no-useless-catch
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            throw error
        }
    }
    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser() :: ", error);
            return null;
        }
        // return null
    }
    async logout(){
        try {
            await this.account.deleteSessions()
        } catch (error) {
            console.log("Appwrite service :: logout() :: ", error);
        }
    }
}



const authService = new AuthService()

export default authService

// import conf from "../config/config";
// import { Client, Account, ID } from "appwrite";
// // for authentication, mostly focus on clinte and accound keywords.
// // for separed backend we use class. like multiple object have other type backend senario like currently i use appwrite, may be someone use firebase, superbase etc. so all are create the intenses and basically frontend is independent of backend
// // -actually frontend run any backend.

// export class AuthService{
//     client = new Client();
//     account;
//     constructor(){
//         this.client
//           .setEndpoint(conf.appwriteUrl)
//           .setProject(conf.appwriteProID);
//         this.account = new Account(this.client);
//     }
//     async createAccount({email,password,name}){ // this promise for sign-up
//         // eslint-disable-next-line no-useless-catch
//         try{
//             const userAccount = await this.account.create(ID.unique(),email,password,name);
//             if(userAccount){
//                 // import other method like login some activity.
//                 return this.login({email,password});
//             }
//             else{
//                 return userAccount;
//             }
//         }
//         catch(error){
//             throw error;
//         }
//     }

//     async login({email,password}){  // login promises.
//         // eslint-disable-next-line no-useless-catch
//         try{
//             return await this.account.createEmailPasswordSession(email,password); // might be issue will be create.
//         }
//         catch(error){
//             throw error;
//         }
//     }

//     async getCurrentUser(){ // after login you get the user is login or not at Home page.
//         try{
//             return await this.account.get();
//         }
//         catch(error){
//             console.log("Backend service :: getCurrentUser :: error",error);
//         }
//         return null; // this is cleanly show user is not asign yet.
//     }

//     async logout(){
//         try{
//             return await this.account.deleteSessions();
//         }
//         catch(error){
//             console.log("Backend service :: logout :: error",error);
//         }
//     }
// }

// const authService = new AuthService();
// export default authService;