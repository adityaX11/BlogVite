// import conf from "../conf/conf"
// import { Client, Databases, Storage, Query, ID } from "appwrite";


// export class Service {
//     client = new Client()
//     databases;
//     bucket;

//     constructor(){
//         this.client.setEndpoint(conf.appwriteUrl)
//         .setProject(conf.appwriteProjectId)
//         this.databases = new Databases(this.client)
//         this.bucket = new Storage(this.client)
//     }

//     async getPost(slug){
//         try {
//             return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
//         } catch (error) {
//             console.log("Appwrite service :: getPost() :: ", error);
//             return false
//         }
//     }

//     async getPosts(queries = [Query.equal("status", "active")] ){
//         try {
//             return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, queries)
//         } catch (error) {
//             console.log("Appwrite service :: getPosts() :: ", error);
//             return false
//         }
//     }

//     async createPost({title, slug, content, featuredImage, status, userId}){
//         try {
//             return await this.databases.createDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title, content, featuredImage, status, userId
//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite service :: createPost() :: ", error);
//             return false
//         }
//     }

//     async updatePost(slug, {title, content, featuredImage, status}){
//         try {
//             return await this.databases.updateDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 {
//                     title, content, featuredImage, status
//                 }
//             )
//         } catch (error) {
//             console.log("Appwrite service :: updateDocument() :: ", error);
//             return false
//         }
//     }

//     async deletePost(slug){
//         try {
//             await this.databases.deleteDocument(
//                 conf.appwriteDatabaseId,
//                 conf.appwriteCollectionId,
//                 slug,
//                 )
//             return true;
//         } catch (error) {
//             console.log("Appwrite service :: deleteDocument() :: ", error);
//             return false
//         }
//     }

//     // storage service

//     async uploadFile(file){
//         try {
//             return await this.bucket.createFile(
//                 conf.appwriteBucketId,
//                 ID.unique(),
//                 file
//             )
//         } catch (error) {
//             console.log("Appwrite service :: uploadFile() :: ", error);
//             return false
//         }
//     }

//     async deleteFile(fileId){
//         try {
//             return await this.bucket.deleteFile(
//                 conf.appwriteBucketId,
//                 fileId

//             )
//         } catch (error) {
//             console.log("Appwrite service :: deleteFile() :: ", error);
//             return false
//         }
//     }

//     getFilePreview(fileId){
//         return this.bucket.getFilePreview(
//             conf.appwriteBucketId,
//             fileId
//         ).href
//     }
// }


// const service = new Service()
// export default service;




// // this is my work.

// // import conf from "../conf/conf";
// // import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

// // export class Service{
// //     client = new Client();
// //     databases;
// //     bucket; // use for storage.
// //     constructor() {
// //         this.client
// //             .setEndpoint(conf.appwriteUrl)
// //             .setProject(conf.appwriteProID);
// //         this.databases=new Databases(this.client);
// //         this.bucket=new Storage(this.client)
// //     }

// //     async createPost({title, slug, content, featureImg, status, userId}){ // this promise use in create post.
// //         try{
// //             return await this.databases.createDocument(
// //                 conf.appwriteDatabID,
// //                 conf.appwriteCollectionId,
// //                 slug,
// //                 {
// //                     title,
// //                     content,
// //                     featureImg,
// //                     status,
// //                     userId,
// //                 }
// //             )
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: create post :: error",error)
// //         }
// //     }

// //     // eslint-disable-next-line no-unused-vars
// //     async updatepost(slug,{title, content, featureImg, status, userId}){ // this is use in update stuff.
// //         try{
// //             return await this.databases.updateDocument(
// //                 conf.appwriteDatabID,
// //                 conf.appwriteCollectionId,
// //                 slug,
// //                 {
// //                     title,
// //                     content,
// //                     featureImg,
// //                     status,
// //                 }
// //             )
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: update post :: error",error)
// //         }
// //     }

// //     async deletePost(slug){
// //         try{
// //             await this.databases.deleteDocument(
// //                 conf.appwriteDatabID,
// //                 conf.appwriteCollectionId,
// //                 slug
// //             )
// //             return true;
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: delete post :: error",error)
// //             return false;
// //         }
// //     }

// //     async getPost(slug){
// //         try{
// //             return await this.databases.getDocument(
// //                 conf.appwriteDatabID,
// //                 conf.appwriteCollectionId,
// //                 slug
// //             )
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: get post :: error",error)
// //         }
// //     }

// //     async getPosts(queries=[Query.equal("status","active")]){
// //         try{
// //             return await this.databases.listDocuments(
// //                 conf.appwriteDatabID,
// //                 conf.appwriteCollectionId,
// //                 queries,
// //             )
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: get posts :: error",error)
// //         }
// //     }

// //     // file uploade services..........

// //     async uploadfile(file){
// //         try{
// //             return await this.bucket.createFile(
// //                 conf.appwriteBucketId,
// //                 ID.unique(),
// //                 file
// //             )
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: upload File :: error",error);
// //             return false;

// //         }
// //     }

// //     async deleteFile(fileId){
// //         try{
// //             await this.bucket.deleteFile(
// //                 conf.appwriteBucketId,
// //                 fileId
// //             )
// //             return true;
// //         }
// //         catch(error){
// //             console.log("Appwrite Service :: delete file :: error",error)
// //             return false;
// //         }
// //     }

// //     getFilePreview(fileId){
// //         return this.bucket.getFilePreview(
// //             conf.appwriteBucketId,
// //             fileId
// //         )
// //     }

// // };
// // const service=new Service();
// // export default service;


// // notes-> what is slug in JS (react).
// //---->A slug is a URL-friendly version of text.
// //     It’s basically a string converted into a clean, readable, lowercase, hyphen-separated format that can be used safely in URLs.

import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID, Permission, Role } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite service :: getPost() :: ", error);
      return null;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts() :: ", error);
      return null;
    }
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featureImg: featuredImage, // ✅ matches Appwrite attribute name
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createPost() :: ", error);
      return null;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const payload = { title, content, status };

      if (featuredImage) payload.featureImg = featuredImage;

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        payload
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost() :: ", error);
      return null;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost() :: ", error);
      return false;
    }
  }

  getFilePermissions(userId) {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ];
  }

  async uploadFile(file, userId) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
        this.getFilePermissions(userId)
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile() :: ", error);
      return null;
    }
  }

  async makeFileReadable(fileId, userId) {
    try {
      if (!fileId || !userId) return null;
      return await this.bucket.updateFile({
        bucketId: conf.appwriteBucketId,
        fileId,
        permissions: this.getFilePermissions(userId),
      });
    } catch (error) {
      console.log("Appwrite service :: makeFileReadable() :: ", error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!fileId) return false; // ✅ safe
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile() :: ", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    // ✅ FIX: prevent crash when fileId missing
    if (!fileId) return "";
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
