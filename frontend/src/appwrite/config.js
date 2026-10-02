// Appwrite Database & Storage Service — kept during transition to MongoDB backend
import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID, Permission, Role } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
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
            console.log("Appwrite :: getPost ::", error);
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
            console.log("Appwrite :: getPosts ::", error);
            return null;
        }
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { title, content, featureImg: featuredImage, status, userId }
            );
        } catch (error) {
            console.log("Appwrite :: createPost ::", error);
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
            console.log("Appwrite :: updatePost ::", error);
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
            console.log("Appwrite :: deletePost ::", error);
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
            console.log("Appwrite :: uploadFile ::", error);
            return null;
        }
    }

    async deleteFile(fileId) {
        try {
            if (!fileId) return false;
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.log("Appwrite :: deleteFile ::", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        if (!fileId) return "";
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    }
}

const service = new Service();
export default service;
