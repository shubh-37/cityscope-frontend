import { Sparkles, HelpCircle, MapPin, Calendar, Send, Upload, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const postTypes = [
  { value: 'recommendation', label: 'Recommendation', icon: Sparkles },
  { value: 'ask_for_help', label: 'Ask for Help', icon: HelpCircle },
  { value: 'local_update', label: 'Local Update', icon: MapPin },
  { value: 'event_announcement', label: 'Event Announcement', icon: Calendar }
];

export const CreatePostForm = ({
  isModal = false,
  user,
  postContent,
  setPostContent,
  location,
  setLocation,
  selectedImages,
  handleImageUpload,
  removeImage,
  handleCreatePost,
  postType,
  setPostType,
  isLoading
}) => (
  <Card className={`border-yellow-200 shadow-lg ${isModal ? 'border-0 shadow-none' : ''}`}>
    <CardHeader className="pb-3 px-3 sm:px-6">
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-yellow-400 flex-shrink-0">
          <AvatarImage src={user.profilePic} alt="You" />
          <AvatarFallback className="bg-yellow-100 text-black text-xs sm:text-sm">
            {user.name ? user.name.charAt(0) : user.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center space-x-2">
            <Label htmlFor="post-type" className="text-sm font-medium text-gray-700">
              Post Type:
            </Label>
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger className="w-40 h-8 border-yellow-200 focus:border-yellow-400">
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-yellow-400">
                {postTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Content Area */}
          <Textarea
            placeholder={`What's on your mind? ${postTypes.find((t) => t.value === postType)?.description || ''}`}
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
                onClick={() => document.getElementById('image-upload')?.click()}
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
                    <img src={image.url} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
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
        </div>
      </div>
    </CardHeader>

    <CardFooter className="pt-0 px-3 sm:px-6">
      <div className="flex justify-end w-full">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleCreatePost}
            disabled={!postContent.trim() || isLoading}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 text-sm sm:text-base shadow-lg"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Post
          </Button>
        </motion.div>
      </div>
    </CardFooter>
  </Card>
);
