
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = await login(email, password);
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to STARS."
      });
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoCredentials = [
    { role: 'Researcher', email: 'researcher@dlsl.edu.ph', password: 'password123' },
    { role: 'Archivist', email: 'archivist@dlsl.edu.ph', password: 'password123' },
    { role: 'Admin', email: 'admin@dlsl.edu.ph', password: 'password123' }
  ];

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%), url('/lovable-uploads/fd7995a2-1df9-4aeb-bbfb-6a33723b9835.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">STARS</h1>
                <p className="text-sm text-white/80 font-medium">De La Salle Lipa</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl">
          <CardContent className="p-10">
            <div className="flex flex-col items-center mb-10">
              <div className="inline-flex items-center bg-primary/10 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                <span className="text-primary">Academic Research Portal</span>
              </div>
              <div className="w-20 h-20 bg-primary/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Welcome back</h1>
              <p className="text-gray-600 text-lg font-medium">Sign in to access the repository</p>
            </div>
            
            {/* Social Logins */}
            <div className="space-y-4 mb-6">
              <Button variant="outline" className="w-full flex items-center justify-center h-14 border-gray-300 hover:border-primary/50 transition-all duration-300 bg-white hover:bg-gray-50 text-gray-700" type="button">
                <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                <span className="text-lg font-medium">Sign in with Google</span>
              </Button>
            </div>

            <div className="relative my-8">
              <Separator className="bg-gray-200" />
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500 font-medium">
                OR CONTINUE WITH EMAIL
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-medium text-gray-700">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@dlsl.edu.ph" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="h-14 text-lg bg-white border-gray-300 focus:border-primary transition-all duration-300 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-lg font-medium text-gray-700">Password</Label>
                  <Button variant="link" className="text-primary text-sm p-0 h-auto font-medium hover:text-primary/80" type="button">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="h-14 text-lg bg-white border-gray-300 focus:border-primary transition-all duration-300 text-gray-900 placeholder-gray-400 pr-14"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-gray-100" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription className="text-lg text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in to STARS'}
              </Button>
              
              <div className="text-center text-lg text-gray-600 font-medium">
                Don't have an account? <a href="#" className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors">Sign up →</a>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Demo Credentials:</h3>
              <div className="space-y-2 text-sm">
                {demoCredentials.map(cred => (
                  <div key={cred.role} className="flex justify-between">
                    <span className="font-medium text-gray-600">{cred.role}:</span>
                    <span className="text-gray-500">{cred.email}</span>
                  </div>
                ))}
                <p className="text-gray-500 mt-4 font-medium">Password: password123 (for all roles)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
