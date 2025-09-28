import conf from '../conf/conf.js'
// Use function ID directly from conf
import { Client, Databases, ID, Storage, Query, Functions } from 'appwrite'

export class Service {
    client = new Client();
    databases;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId)
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);

    }

    async createPost({ title, content, featuredimage, status, userid, category, authorName }) {
        try {
            return await this.databases.createDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                ID.unique(),
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid,
                    category,
                    authorName: authorName || 'Anonymous'
                }
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    async updatePost({ id, title, content, featuredimage, status, category, authorName }) {
        try {
            return await this.databases.updateDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                id,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    category,
                    authorName: authorName || 'Anonymous'
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    async deletePost(id) {
        try {
            await this.databases.deleteDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                id
            )
            return true;
        } catch (error) {
            console.log(error)
        }
    }

    async getPost(id) {
        try {
            return await this.databases.getDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                id
            )
        } catch (error) {
            console.log(error)
        }
    }

    async getPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                queries
            );
        } catch (error) {
            throw new Error("Error:", error);
        }
    }

    async searchPosts(searchTerm) {
        try {
            // Search using title contains and status active
            return await this.databases.listDocuments(
                conf.appWriteDatabaseId,
                conf.appWriteCollectionId,
                [
                    Query.equal('status', 'active'),
                    Query.contains('title', searchTerm)
                ]
            );
        } catch (error) {
            console.log("Search error:", error);
            // Fallback to client-side search if server search fails
            return { documents: [] };
        }
    }

    async uploadFile(file, customName = null) {
        try {
            const fileId = customName || ID.unique();
            return await this.storage.createFile(
                conf.appWriteBucketId,
                fileId,
                file
            )
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getUserById(userId) {
        try {
            // Call appwrite function to get user by ID
            const functions = new Functions(this.client);
            const body = JSON.stringify({ userId });
            if (typeof conf.appWriteFetchUsersFunctionId !== 'string' || !conf.appWriteFetchUsersFunctionId) {
                throw new Error('Appwrite fetchUsersFunctionId is missing or not a string!');
            }
            const execution = await functions.createExecution(
                conf.appWriteFetchUserByIdFunctionId,
                body,
                false,
            );
            return JSON.parse(
                execution.responseBody || '{}'
            )
        } catch (error) {
            console.log("Error fetching user:", error);
            return null;
        }
    }

    async searchUsers({ name = '', limit = 25, offset = 0 } = {}) {
        try {
            const functions = new Functions(this.client);
            const body = JSON.stringify({ name, limit, offset });
            if (typeof conf.appWriteFetchUsersFunctionId !== 'string' || !conf.appWriteFetchUsersFunctionId) {
                throw new Error('Appwrite fetchUsersFunctionId is missing or not a string!');
            }
            const execution = await functions.createExecution(
                conf.appWriteFetchUsersFunctionId,
                body,
                false,
            );
            console.log("User search execution response:", execution);
            return execution.responseBody;
        } catch (error) {
            console.error("Error searching users:", error.message);
            return null;
        }
    }

    async deleteFile(fileid) {
        try {
            await this.storage.deleteFile(
                conf.appWriteBucketId,
                fileid
            )
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    getFileView(fileid) {
        return this.storage.getFileView(
            conf.appWriteBucketId,
            fileid
        )
    }
}

const service = new Service()
export default service