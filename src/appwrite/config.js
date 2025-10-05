import conf from '../conf/conf.js'
import { Client, Databases, ID, Query, Functions } from 'appwrite'
import imagekitService from '../imagekit/imagekit.js'

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId)
        this.databases = new Databases(this.client);
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
            // Use ImageKit instead of Appwrite Storage
            return await imagekitService.uploadFile(file, customName);
        } catch (error) {
            console.log('Upload error:', error);
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
            return execution.responseBody;
        } catch (error) {
            console.error("Error searching users:", error.message);
            return null;
        }
    }

    async deleteFile(fileid) {
        try {
            // Use ImageKit instead of Appwrite Storage
            return await imagekitService.deleteFile(fileid);
        } catch (error) {
            console.log('Delete error:', error);
            return false;
        }
    }

    getFileView(fileid) {
        // Use ImageKit instead of Appwrite Storage
        return imagekitService.getFileView(fileid);
    }

    // Comments functionality
    async createComment({ userid, username, postid, content }) {
        try {
            return await this.databases.createDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCommentsCollectionId,
                ID.unique(),
                {
                    userid,
                    username,
                    postid,
                    content
                }
            )
        } catch (error) {
            console.log("Error creating comment:", error);
            throw error;
        }
    }

    async getCommentsByPostId(postid) {
        try {
            return await this.databases.listDocuments(
                conf.appWriteDatabaseId,
                conf.appWriteCommentsCollectionId,
                [
                    Query.equal('postid', postid),
                    Query.orderDesc('$createdAt')
                ]
            );
        } catch (error) {
            console.log("Error fetching comments:", error);
            return { documents: [] };
        }
    }

    async updateComment(commentId, content) {
        try {
            return await this.databases.updateDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCommentsCollectionId,
                commentId,
                {
                    content
                }
            )
        } catch (error) {
            console.log("Error updating comment:", error);
            throw error;
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(
                conf.appWriteDatabaseId,
                conf.appWriteCommentsCollectionId,
                commentId
            )
            return true;
        } catch (error) {
            console.log("Error deleting comment:", error);
            throw error;
        }
    }

    // AI Generation Tracking functionality
    async getTrackingItems(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appWriteDatabaseId,
                conf.appWriteTrackingCollectionId,
                [
                    Query.equal('userid', userId),
                    Query.orderDesc('$createdAt'),
                    Query.limit(50)
                ]
            );
        } catch (error) {
            console.log("Error fetching tracking items:", error);
            return { documents: [] };
        }
    }

    async getTrackingItem(trackingId) {
        try {
            return await this.databases.getDocument(
                conf.appWriteDatabaseId,
                conf.appWriteTrackingCollectionId,
                trackingId
            );
        } catch (error) {
            console.log("Error fetching tracking item:", error);
            throw error;
        }
    }

    async deleteTrackingItem(trackingId) {
        try {
            await this.databases.deleteDocument(
                conf.appWriteDatabaseId,
                conf.appWriteTrackingCollectionId,
                trackingId
            );
            return true;
        } catch (error) {
            console.log("Error deleting tracking item:", error);
            throw error;
        }
    }
}

const service = new Service()
export default service