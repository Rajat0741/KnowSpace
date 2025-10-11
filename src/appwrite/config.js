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
            throw new Error(`Failed to create post: ${error.message || error}`);
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
            throw new Error(`Failed to update post: ${error.message || error}`);
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
            throw new Error(`Failed to delete post: ${error.message || error}`);
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
            throw new Error(`Failed to get post: ${error.message || error}`);
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
            throw new Error(`Failed to get posts: ${error.message || error}`);
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
            throw new Error(`Failed to search posts: ${error.message || error}`);
        }
    }

    async uploadFile(file, customName = null) {
        try {
            // Use ImageKit instead of Appwrite Storage
            return await imagekitService.uploadFile(file, customName);
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message || error}`);
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
            throw new Error(`Failed to get user by ID: ${error.message || error}`);
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
            throw new Error(`Failed to search users: ${error.message || error}`);
        }
    }

    async deleteFile(fileid) {
        try {
            // Use ImageKit instead of Appwrite Storage
            return await imagekitService.deleteFile(fileid);
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message || error}`);
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
            throw new Error(`Failed to create comment: ${error.message || error}`);
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
            throw new Error(`Failed to get comments by post ID: ${error.message || error}`);
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
            throw new Error(`Failed to update comment: ${error.message || error}`);
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
            throw new Error(`Failed to delete comment: ${error.message || error}`);
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
            throw new Error(`Failed to get tracking items: ${error.message || error}`);
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
            throw new Error(`Failed to get tracking item: ${error.message || error}`);
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
            throw new Error(`Failed to delete tracking item: ${error.message || error}`);
        }
    }
}

const service = new Service()
export default service