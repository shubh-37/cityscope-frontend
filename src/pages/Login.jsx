import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, ArrowLeft, Sparkles, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '@/context/AuthContextProvider';
import { toast } from 'sonner';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(authContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(username, password);
    if (response.status === 200) {
      toast.success(response.message);
      navigate('/');
    } else {
      toast.error(response);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear'
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear'
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-full blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center space-x-2 mb-4 cursor-pointer">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Back to Home</span>
            </motion.div>
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
              <g clip-path="url(#clip0_72_1619)">
                <rect width="42" height="42" rx="8" fill="#FFCC29"></rect>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.5264 22.1245V30.359H22.292V33.6802H30.5264H33.8477V30.359V22.1245H30.5264Z"
                  fill="#0C0C0C"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.13477 8.302V11.6233V19.8577H11.456V11.6233H19.6904V8.302H11.456H8.13477Z"
                  fill="#0C0C0C"
                ></path>
                <path
                  d="M19.275 22.3963C19.275 23.9682 19.8334 25.1265 21.1364 25.1265C22.2119 25.1265 22.9772 24.5267 23.9699 23.3064L24.3629 23.6786C23.3701 25.3125 21.8603 26.6776 19.9161 26.6776C17.7238 26.6776 16.4414 25.0851 16.4414 22.8514C16.4414 19.1491 19.337 15.3022 22.9565 15.3022C24.5077 15.3022 25.5418 15.9433 25.5418 17.1844C25.5418 18.0116 25.0041 18.5287 24.1974 18.7149H23.5976C23.701 17.267 23.5356 16.0261 22.5014 16.0261C20.7434 16.0261 19.275 19.6249 19.275 22.3963Z"
                  fill="#0C0C0C"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_72_1619">
                  <rect width="42" height="42" rx="8" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              CityScope
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h1 className="text-2xl font-bold text-black mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your social journey</p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-yellow-200/50 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 border-yellow-200 focus:border-yellow-400 bg-white/50"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-yellow-200 focus:border-yellow-400 bg-white/50"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="pt-4">
              <p className="text-center text-sm text-gray-600 w-full">
                Don't have an account?{' '}
                <Link to="/register" className="text-yellow-600 hover:text-yellow-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
