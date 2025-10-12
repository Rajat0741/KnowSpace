import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MessageSquare, X, Send, MoreVertical, Edit2, Trash2, User } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/Components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import Button from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import service from '@/appwrite/config';
import { toast } from 'sonner';

// Avatar component using first letter of username
function Avatar({ username, onClick }) {
  const firstLetter = username?.charAt(0).toUpperCase() || 'U';
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-yellow-500 to-orange-600',
  ];
  
  // Generate consistent color based on username
  const colorIndex = username ? username.charCodeAt(0) % colors.length : 0;
  const gradient = colors[colorIndex];

  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 cursor-pointer`}
    >
      {firstLetter}
    </button>
  );
}

// Single comment component
function Comment({ comment, currentUserId, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isOwner = currentUserId === comment.userid;

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) return;
    
    setIsSubmitting(true);
    try {
      await onEdit(comment.$id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content || '');
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30 dark:border-purple-800/30 hover:border-blue-300/50 dark:hover:border-purple-700/50 transition-all duration-300">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar
          username={comment.username}
          onClick={() => navigate(`/user/${comment.userid}`)}
        />

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header with username, timestamp, and actions */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => navigate(`/user/${comment.userid}`)}
                className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
              >
                {comment.username}
              </button>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.$createdAt)}
              </span>
            </div>

            {/* Three-dot menu for owner */}
            {isOwner && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this comment? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => { onDelete(comment.$id); setIsDeleteDialogOpen(false); }}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Comment text or edit input */}
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-white dark:bg-gray-900 border-blue-300 dark:border-purple-700"
                disabled={isSubmitting}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting || !editContent.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/90 dark:text-foreground/85 leading-relaxed break-words">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main CommentsDrawer component
export default function CommentsDrawer({ postId }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchComments = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await service.getCommentsByPostId(postId);
      setComments(response.documents || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Fetch comments when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userData) return;

    setIsSubmitting(true);
    try {
      const comment = await service.createComment({
        userid: userData.$id,
        username: userData.name || 'Anonymous',
        postid: postId,
        content: newComment.trim()
      });
      
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await service.updateComment(commentId, content);
      setComments(comments.map(c => 
        c.$id === commentId ? { ...c, content } : c
      ));
    } catch (error) {
      console.error('Failed to edit comment:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await service.deleteComment(commentId);
      setComments(comments.filter(c => c.$id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
          <MessageSquare className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
            Comments
          </span>
          {comments.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-500/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-300">
              {comments.length}
            </span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-full sm:w-[500px] bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="flex flex-col h-full max-h-[100vh]">
          {/* Header */}
          <DrawerHeader className="border-b border-border/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Comments
                  </DrawerTitle>
                  <DrawerDescription className="text-xs text-muted-foreground">
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                  </DrawerDescription>
                </div>
              </div>
              <DrawerClose asChild>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-blue-400 dark:text-purple-400" />
                </div>
                <p className="text-muted-foreground font-medium">No comments yet</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.$id}
                  comment={comment}
                  currentUserId={userData?.$id}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </div>

          {/* Add Comment Form */}
          {userData ? (
            <div className="border-t border-border/50 p-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm">
              <form onSubmit={handleAddComment} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar username={userData.name} onClick={() => {}} />
                  <div className="flex-1">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="bg-white dark:bg-gray-900 border-blue-300 dark:border-purple-700"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border-t border-border/50 p-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm">
              <p className="text-center text-muted-foreground text-sm">
                Please{' '}
                <button
                  onClick={() => navigate('/')}
                  className="text-blue-500 hover:text-blue-600 font-medium underline"
                >
                  sign in
                </button>{' '}
                to comment
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
