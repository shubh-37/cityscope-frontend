import { useState, useEffect, useContext, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.svg';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  User,
  LogIn,
  LogOut,
  Filter,
  Heart,
  MessageCircle,
  Send,
  Plus,
  MapPin,
  Upload,
  X,
  Sparkles,
  Loader2,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { postContext } from '@/context/PostContextProvider';
import { toast } from 'sonner';
import { CreatePostForm } from '@/components/CreatePostForm';

const postTypes = [
  { value: 'recommendation', label: 'Recommendation', icon: Sparkles },
  { value: 'ask_for_help', label: 'Ask for Help', icon: HelpCircle },
  { value: 'local_update', label: 'Local Update', icon: MapPin },
  { value: 'event_announcement', label: 'Event Announcement', icon: Calendar }
];

export default function HomePage() {
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  const user = JSON.parse(localStorage.getItem('user'));
  const { getPosts, createPost, likeUnlikePost, createComment } = useContext(postContext);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showFAB, setShowFAB] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postType, setPostType] = useState('text');
  const [location, setLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Infinite scrolling states
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();

  // Scroll detection for floating action button and infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFAB(scrollY > 200);

      // Check if user has scrolled to bottom for infinite scroll
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Trigger load more when user is 100px from bottom
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loading, hasNextPage]);

  // Fetch initial posts
  const fetchPosts = async (page = 1, reset = true) => {
    try {
      if (page === 1) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      const response = await getPosts({ page, limit: 10, type: selectedFilter });

      if (reset) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }

      setHasNextPage(response.pagination.hasNextPage);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Load more posts for infinite scroll
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasNextPage) return;

    const nextPage = currentPage + 1;
    await fetchPosts(nextPage, false);
  }, [currentPage, loading, hasNextPage]);

  // Initial load
  useEffect(() => {
    fetchPosts(1, true);
  }, [selectedFilter]); // Refetch when filter changes

  const handleLike = async (postId) => {
    try {
      await likeUnlikePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const userId = user.id;

            // Check if user already liked the post
            const alreadyLiked = post.likes.some((like) => like.user._id === userId);

            let updatedLikes;
            if (alreadyLiked) {
              // Unlike: remove user from likes
              updatedLikes = post.likes.filter((like) => like.user._id !== userId);
            } else {
              // Like: add user to likes
              updatedLikes = [...post.likes, { user: { _id: userId } }];
            }

            return {
              ...post,
              likes: updatedLikes
            };
          }
          return post;
        })
      );
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleOpenComments = (post) => {
    setSelectedPostComments(post);
    setIsCommentsOpen(true);
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append('content', postContent);
    formData.append('location', location);
    formData.append('type', postType);

    // Store the actual File objects instead of just URLs
    if (selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append('images', image.file);
      });
    }
    const response = await createPost(formData);
    if (response.success) {
      // Reset form state
      setPostContent('');
      setLocation('');
      setSelectedImages([]);
      setPostType('');
      toast.success(response.message);
      await fetchPosts(1, true);
      setIsModalOpen(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await createComment(selectedPostComments._id, { content: commentText });
      if (response.success) {
        // Update the posts array with the new comment
        setPosts(
          posts.map((post) => {
            if (post._id === selectedPostComments._id) {
              return {
                ...post,
                comments: [...post.comments, response.comment]
              };
            }
            return post;
          })
        );

        // Update the selected post comments
        setSelectedPostComments((prev) => ({
          ...prev,
          comments: [...prev.comments, response.comment]
        }));

        setCommentText('');
        toast.success('Comment added successfully');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-yellow-200/50 shadow-lg"
      >
        <div className="mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <img src={logo} alt="CityScope" className="h-10 w-10" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              CityScope
            </span>
          </motion.div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Filter Button */}
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon" className="border-yellow-300 hover:bg-yellow-50 shadow-md">
                    <Filter className="h-4 w-4" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gradient-to-b from-white to-yellow-50">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">Filter Posts</SheetTitle>
                  <SheetDescription>Choose how you want to see your feed</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4 px-4">
                  {postTypes.map((option) => (
                    <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={selectedFilter === option.value ? 'default' : 'outline'}
                        className={`w-full justify-start shadow-md ${
                          selectedFilter === option.value
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600'
                            : 'border-yellow-300 hover:bg-yellow-50'
                        }`}
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setIsFilterSheetOpen(false);
                        }}
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* User Navigation */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-yellow-400 shadow-lg">
                        <AvatarImage src={user.profilePic} alt="User" />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black">
                          {user.name ? user.name.charAt(0) : user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-yellow-400" align="end">
                  <Link to="/profile">
                    <DropdownMenuItem className="hover:bg-yellow-50">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem className="hover:bg-red-50 text-red-600" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
        <div className="space-y-4 sm:space-y-8">
          {isLoggedIn && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <CreatePostForm
                isModal={false}
                user={user}
                postContent={postContent}
                setPostContent={setPostContent}
                location={location}
                setLocation={setLocation}
                selectedImages={selectedImages}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                handleCreatePost={handleCreatePost}
                postType={postType}
                setPostType={setPostType}
              />
            </motion.div>
          )}

          {/* Feed Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center justify-between px-1 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                Your Feed
              </h2>
              {selectedFilter && (
                <Badge
                  variant="secondary"
                  className="text-yellow-800 text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-2"
                  onClick={() => setSelectedFilter('')}
                >
                  {postTypes.find((t) => t.value === selectedFilter)?.label} <X className="h-4 w-4" />
                </Badge>
              )}
            </div>

            {/* Loading skeleton for initial load */}
            {initialLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Card
                    key={index}
                    className="border-yellow-200/50 shadow-xl mx-1 sm:mx-0 bg-white/80 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-3 px-3 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 px-3 sm:px-6">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                  >
                    <Card className="border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 mx-1 sm:mx-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-2 sm:pb-3 px-2 sm:px-6">
                        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
                          <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-yellow-400 flex-shrink-0 shadow-lg">
                              <AvatarImage src={post.author?.profilePic} alt={post.author.name} />
                              <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black text-xs sm:text-sm">
                                {post.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex sm:flex-row sm:items-center gap-0.5 sm:gap-2 sm:justify-between">
                                <p className="font-semibold text-black text-sm sm:text-base truncate">
                                  {post.author.name}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="hidden sm:inline-flex text-xs border-yellow-300 text-yellow-700 bg-yellow-50"
                                >
                                  {postTypes.find((t) => t.value === post.type)?.label}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-1.5 text-[11px] sm:text-sm text-gray-600">
                                <span className="truncate max-w-[120px] sm:max-w-none">{post.author.username}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="text-[10px] sm:text-sm">
                                  {new Date(post.createdAt).toLocaleString()}
                                </span>
                                {post.location && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate max-w-[100px] sm:max-w-none">{post.location}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="sm:hidden text-[10px] border-yellow-300 text-yellow-700 bg-yellow-50"
                          >
                            {postTypes.find((t) => t.value === post.type)?.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-3 px-3 sm:px-6">
                        <p className="text-black mb-3 text-sm sm:text-base leading-relaxed">{post.content}</p>
                        {post.images && post.images.length > 0 && (
                          <div className="space-y-2">
                            {post.images.length === 1 ? (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="rounded-xl overflow-hidden -mx-3 sm:mx-0 shadow-lg"
                              >
                                <img
                                  src={post.images[0]}
                                  alt="Post content"
                                  className="w-full h-48 sm:h-64 object-contain"
                                />
                              </motion.div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 p-2 -mx-3 sm:mx-0">
                                {post.images.map((image, index) => (
                                  <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="rounded-xl overflow-hidden shadow-lg"
                                  >
                                    <img
                                      src={image}
                                      alt={`Post content ${index + 1}`}
                                      className="w-full h-32 sm:h-48 object-contain"
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="pt-0 px-3 sm:px-6">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleLike(post._id)}
                              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors p-1 sm:p-0"
                            >
                              <Heart
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                  post.likes.some((like) => like.user._id === user?.id)
                                    ? 'fill-red-500 text-red-500'
                                    : ''
                                }`}
                              />
                              <span className="text-xs sm:text-sm">{post.likes.length}</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors p-1 sm:p-0"
                              onClick={() => handleOpenComments(post)}
                            >
                              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="text-xs sm:text-sm">{post.comments.length}</span>
                            </motion.button>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Loading indicator for infinite scroll */}
            {loading && !initialLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center py-8"
              >
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Loading more posts...</span>
                </div>
              </motion.div>
            )}

            {/* End of posts indicator */}
            {!hasNextPage && posts.length > 0 && !initialLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center py-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full mb-4">
                    <Sparkles className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-gray-600 text-sm">You've reached the end!</p>
                  <p className="text-gray-500 text-xs mt-1">No more posts to show</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showFAB && isLoggedIn && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-black hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-500 shadow-2xl border-white"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                    Create New Post
                  </DialogTitle>
                  <DialogDescription>Share what's on your mind with your followers</DialogDescription>
                </DialogHeader>
                <CreatePostForm
                  isModal={true}
                  user={user}
                  postContent={postContent}
                  setPostContent={setPostContent}
                  location={location}
                  setLocation={setLocation}
                  selectedImages={selectedImages}
                  handleImageUpload={handleImageUpload}
                  removeImage={removeImage}
                  handleCreatePost={handleCreatePost}
                  postType={postType}
                  setPostType={setPostType}
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Comments Drawer */}
      <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b border-yellow-200">
            <DrawerTitle className="text-lg font-bold">Comments</DrawerTitle>
            <DrawerDescription>
              {selectedPostComments && `${selectedPostComments.comments?.length || 0} comments on this post`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedPostComments?.comments?.map((comment) => (
                <motion.div
                  key={comment._id || comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  <Avatar className="h-8 w-8 border-2 border-yellow-400 flex-shrink-0">
                    <AvatarImage src={comment.user?.profilePic} alt={comment.user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black text-xs">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-2xl px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm text-black">{comment.user?.name || 'Unknown User'}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-black leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {selectedPostComments &&
                (!selectedPostComments.comments || selectedPostComments.comments.length === 0) && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No comments yet</p>
                    <p className="text-gray-400 text-sm">Be the first to comment!</p>
                  </div>
                )}
            </div>

            {isLoggedIn && (
              <div className="border-t border-yellow-200 p-4">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8 border-2 border-yellow-400 flex-shrink-0">
                    <AvatarImage src={user.profilePic} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black text-xs">
                      {user.name ? user.name.charAt(0) : user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 border-yellow-200 focus:border-yellow-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        size="sm"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
