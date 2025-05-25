import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  User,
  LogIn,
  LogOut,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Video,
  Smile,
  Send,
  TrendingUp,
  Clock,
  Users,
  Plus,
  MapPin,
  Upload,
  FileText,
  BarChart3,
  Camera,
  X,
  Sparkles,
} from "lucide-react"

const mockPosts = [
  {
    id: 1,
    user: { name: "Alex Chen", username: "@alexchen", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "Just launched my new project! 🚀 Excited to share it with everyone. The journey has been incredible and I can't wait to see what's next!",
    image: "/placeholder.svg?height=300&width=500",
    likes: 124,
    comments: 23,
    shares: 12,
    timestamp: "2h ago",
    tags: ["#launch", "#project", "#excited"],
    type: "text",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    user: { name: "Sarah Johnson", username: "@sarahj", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "Beautiful sunset from my balcony today. Sometimes you need to pause and appreciate the simple moments in life. 🌅",
    image: "/placeholder.svg?height=300&width=500",
    likes: 89,
    comments: 15,
    shares: 8,
    timestamp: "4h ago",
    tags: ["#sunset", "#peaceful", "#gratitude"],
    type: "photo",
    location: "Miami Beach, FL",
  },
  {
    id: 3,
    user: { name: "Mike Rodriguez", username: "@mikerod", avatar: "/placeholder.svg?height=40&width=40" },
    content:
      "Working on some new designs for the upcoming conference. The creative process never gets old! What do you think about this color palette?",
    likes: 67,
    comments: 31,
    shares: 5,
    timestamp: "6h ago",
    tags: ["#design", "#creative", "#conference"],
    type: "text",
  },
]

const filterOptions = [
  { label: "Trending", icon: TrendingUp, value: "trending" },
  { label: "Recent", icon: Clock, value: "recent" },
  { label: "Following", icon: Users, value: "following" },
]

const postTypes = [
  { value: "text", label: "Text Post", icon: FileText, description: "Share your thoughts" },
  { value: "photo", label: "Photo Post", icon: Camera, description: "Share a moment" },
  { value: "video", label: "Video Post", icon: Video, description: "Share a video" },
  { value: "poll", label: "Poll Post", icon: BarChart3, description: "Ask your audience" },
]

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [postContent, setPostContent] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("trending")
  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [showFAB, setShowFAB] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [postType, setPostType] = useState("text")
  const [location, setLocation] = useState("")
  const [selectedImages, setSelectedImages] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowFAB(scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLike = (postId) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleSave = (postId) => {
    setSavedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleCreatePost = () => {
    if (postContent.trim()) {
      // Handle post creation logic here
      setPostContent("")
      setLocation("")
      setSelectedImages([])
      setIsModalOpen(false)
    }
  }

  const handleImageUpload = (event) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setSelectedImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const CreatePostForm = ({ isModal = false }) => (
    <Card className={`border-yellow-200 shadow-lg ${isModal ? "border-0 shadow-none" : ""}`}>
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-yellow-400 flex-shrink-0">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
            <AvatarFallback className="bg-yellow-100 text-black text-xs sm:text-sm">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-3">
            {/* Post Type Selector */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="post-type" className="text-sm font-medium text-gray-700">
                Post Type:
              </Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger className="w-40 h-8 border-yellow-200 focus:border-yellow-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {postTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Area */}
            <Textarea
              placeholder={`What's on your mind? ${postTypes.find((t) => t.value === postType)?.description || ""}`}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[60px] sm:min-h-[80px] border-yellow-200 focus:border-yellow-400 resize-none text-sm sm:text-base"
            />

            {/* Location Input */}
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-yellow-600" />
              <Input
                placeholder="Add location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-yellow-200 focus:border-yellow-400 text-sm"
              />
            </div>

            {/* Image Upload for Photo Posts */}
            {(postType === "photo" || postType === "text") && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    className="border-yellow-300 hover:bg-yellow-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </div>

                {/* Image Preview */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Poll Options for Poll Posts */}
            {postType === "poll" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Poll Options:</Label>
                <Input placeholder="Option 1" className="border-yellow-200 focus:border-yellow-400 text-sm" />
                <Input placeholder="Option 2" className="border-yellow-200 focus:border-yellow-400 text-sm" />
                <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardFooter className="pt-0 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full space-y-3 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-600 hover:bg-yellow-50 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Smile className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Emoji
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-600 hover:bg-yellow-50 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              GIF
            </Button>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button
              onClick={handleCreatePost}
              disabled={!postContent.trim()}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base shadow-lg"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {postType === "poll" ? "Create Poll" : "Post"}
            </Button>
          </motion.div>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100/30">
      {/* Header with glassmorphism effect */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-yellow-200/50 shadow-lg"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none"><g clip-path="url(#clip0_72_1619)"><rect width="42" height="42" rx="8" fill="#FFCC29"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M30.5264 22.1245V30.359H22.292V33.6802H30.5264H33.8477V30.359V22.1245H30.5264Z" fill="#0C0C0C"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8.13477 8.302V11.6233V19.8577H11.456V11.6233H19.6904V8.302H11.456H8.13477Z" fill="#0C0C0C"></path><path d="M19.275 22.3963C19.275 23.9682 19.8334 25.1265 21.1364 25.1265C22.2119 25.1265 22.9772 24.5267 23.9699 23.3064L24.3629 23.6786C23.3701 25.3125 21.8603 26.6776 19.9161 26.6776C17.7238 26.6776 16.4414 25.0851 16.4414 22.8514C16.4414 19.1491 19.337 15.3022 22.9565 15.3022C24.5077 15.3022 25.5418 15.9433 25.5418 17.1844C25.5418 18.0116 25.0041 18.5287 24.1974 18.7149H23.5976C23.701 17.267 23.5356 16.0261 22.5014 16.0261C20.7434 16.0261 19.275 19.6249 19.275 22.3963Z" fill="#0C0C0C"></path></g><defs><clipPath id="clip0_72_1619"><rect width="42" height="42" rx="8" fill="white"></rect></clipPath></defs></svg>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              CityScope
            </span>
          </motion.div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Filter Button */}
            <Sheet>
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
                <div className="mt-6 space-y-4">
                  {filterOptions.map((option) => (
                    <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={selectedFilter === option.value ? "default" : "outline"}
                        className={`w-full justify-start shadow-md ${
                          selectedFilter === option.value
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
                            : "border-yellow-300 hover:bg-yellow-50"
                        }`}
                        onClick={() => setSelectedFilter(option.value)}
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
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="hover:bg-yellow-50">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-red-50 text-red-600" onClick={() => setIsLoggedIn(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setIsLoggedIn(true)}
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

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
        <div className="space-y-4 sm:space-y-8">
          {/* Create Post Section */}
          {isLoggedIn && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <CreatePostForm />
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
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-xs sm:text-sm shadow-md"
              >
                {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
              </Badge>
            </div>

            <AnimatePresence>
              {mockPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <Card className="border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 mx-1 sm:mx-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3 px-3 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-yellow-400 flex-shrink-0 shadow-lg">
                            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                            <AvatarFallback className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-black text-xs sm:text-sm">
                              {post.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-black text-sm sm:text-base truncate">{post.user.name}</p>
                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                              <span className="truncate">{post.user.username}</span>
                              <span>•</span>
                              <span>{post.timestamp}</span>
                              {post.location && (
                                <>
                                  <span>•</span>
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{post.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700 bg-yellow-50">
                          {postTypes.find((t) => t.value === post.type)?.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3 px-3 sm:px-6">
                      <p className="text-black mb-3 text-sm sm:text-base leading-relaxed">{post.content}</p>
                      {post.image && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="rounded-xl overflow-hidden -mx-3 sm:mx-0 shadow-lg"
                        >
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post content"
                            className="w-full h-48 sm:h-64 object-cover"
                          />
                        </motion.div>
                      )}
                      {post.tags && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                          {post.tags.map((tag, tagIndex) => (
                            <motion.div key={tagIndex} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 cursor-pointer text-xs sm:text-sm shadow-sm"
                              >
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-0 px-3 sm:px-6">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleLike(post.id)}
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors p-1 sm:p-0"
                          >
                            <Heart
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""
                              }`}
                            />
                            <span className="text-xs sm:text-sm">
                              {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors p-1 sm:p-0"
                          >
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-xs sm:text-sm">{post.comments}</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors p-1 sm:p-0"
                          >
                            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-xs sm:text-sm">{post.shares}</span>
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSave(post.id)}
                          className={`text-gray-600 hover:text-yellow-500 transition-colors p-1 sm:p-0 ${
                            savedPosts.includes(post.id) ? "text-yellow-500" : ""
                          }`}
                        >
                          <Bookmark
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${savedPosts.includes(post.id) ? "fill-yellow-500" : ""}`}
                          />
                        </motion.button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Floating Action Button */}
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
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-black hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-500 shadow-2xl border-2 border-white"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                  <motion.div
                    className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  />
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-yellow-50">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                    Create New Post
                  </DialogTitle>
                  <DialogDescription>Share what's on your mind with your followers</DialogDescription>
                </DialogHeader>
                <CreatePostForm isModal={true} />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
