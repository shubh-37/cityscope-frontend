import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { ArrowLeft, Calendar, Heart, MessageCircle, Share2, Edit3, X, Save, Plus, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authContext } from '@/context/AuthContextProvider';

const user = JSON.parse(localStorage.getItem('user'));

export default function ProfilePage() {
  const { getPostsByUser } = useContext(authContext);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);

  const handleLike = (postId) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]));
  };

  const handleSaveBio = () => {
    // Handle bio save logic here
    console.log('Saving bio:', bioText);
    setIsEditingBio(false);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading photo:', file);
      setIsPhotoDialogOpen(false);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      const response = await getPostsByUser();
      setUserPosts(response.posts);
    };
    fetchUserPosts();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100/30">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-yellow-200/50 shadow-lg"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-black">{user?.name}</h1>
              <p className="text-sm text-gray-600">{userPosts.length} posts</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Profile Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Profile Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl">
                <AvatarImage src={user.profilePicture || '/placeholder.svg'} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black text-2xl sm:text-3xl">
                  {user?.name ? user?.name.charAt(0) : user?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Add Photo Button */}
              <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 shadow-lg cursor-pointer border-2 border-white"
                  >
                    <Camera className="h-4 w-4 text-black" />
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Profile Photo</DialogTitle>
                    <DialogDescription>Choose a new profile photo to upload</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Choose Photo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* User Info */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-black">{user?.name}</h2>
              <p className="text-gray-600">{user?.username}</p>

              {/* Bio Section */}
              <div className="max-w-md mx-auto">
                {isEditingBio ? (
                  <div className="space-y-3">
                    <Textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="border-yellow-200 focus:border-yellow-400 resize-none"
                      placeholder="Share your story, interests, or what makes you unique..."
                      rows={3}
                    />
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={handleSaveBio}
                        size="sm"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
                      >
                        <Save className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingBio(false);
                          setBioText(user.bio);
                        }}
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 hover:bg-yellow-50"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    {bioText ? (
                      <p className="text-black leading-relaxed flex-grow">{bioText}</p>
                    ) : (
                      <div className="text-center py-2 px-4 rounded-lg border-2 border-dashed border-yellow-200 bg-yellow-50/50">
                        <p className="text-gray-500 text-sm">No bio yet</p>
                        <p className="text-gray-400 text-xs mt-1">Write something cool about yourself!</p>
                      </div>
                    )}
                    <Button
                      onClick={() => setIsEditingBio(true)}
                      size="sm"
                      variant="ghost"
                      className={`absolute right-0 top-1/2 -translate-y-1/2 text-yellow-600 hover:bg-yellow-50 transition-opacity ${
                        bioText ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                      }`}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-black text-center">Posts</h3>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {userPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-yellow-400">
                          <AvatarImage src={user.profilePicture || '/placeholder.svg'} alt={user?.name} />
                          <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black">
                            {user?.name ? user?.name.charAt(0) : user?.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-black">{user?.name}</p>
                          <p className="text-sm text-gray-600">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <p className="text-black mb-3 leading-relaxed">{post.content || 'No content'}</p>
                      {post.images && Array.isArray(post.images) && post.images.length > 0 && (
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={post.images[0] || '/placeholder.svg'}
                            alt="Post content"
                            className="w-full h-64 object-cover"
                          />
                        </motion.div>
                      )}
                    </CardContent>

                    <CardFooter>
                      <div className="flex items-center space-x-6 w-full">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(post._id)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            className={`h-5 w-5 ${post.likes.some((like) => like.user._id === user?.id) ? 'fill-red-500 text-red-500' : ''}`}
                          />
                          <span className="text-sm">{post.likes.length || 0}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm">{post.comments.length || 0}</span>
                        </motion.button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
