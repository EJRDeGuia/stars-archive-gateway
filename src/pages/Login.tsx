
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const {
    login,
    isLoading
  } = useAuth();
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

  const demoCredentials = [{
    role: 'Researcher',
    email: 'researcher@dlsl.edu.ph',
    password: 'password123'
  }, {
    role: 'Archivist',
    email: 'archivist@dlsl.edu.ph',
    password: 'password123'
  }, {
    role: 'Admin',
    email: 'admin@dlsl.edu.ph',
    password: 'password123'
  }];

  return <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-dlsl-green rounded-md flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h1 className="text-xl font-bold text-dlsl-green">STARS</h1>
            </div>
            <Button onClick={() => navigate('/')} variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-dlsl-green/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-dlsl-green fill-dlsl-green" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Log in to STARS</h1>
              <p className="text-gray-600 text-sm">Access the thesis repository system</p>
            </div>
            
            {/* Social Logins */}
            <div className="space-y-3 mb-4">
              <Button variant="outline" className="w-full flex items-center justify-center" type="button">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Sign in with Google
              </Button>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                OR CONTINUE WITH
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@dlsl.edu.ph" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="text-dlsl-green text-xs p-0 h-auto" type="button">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
              </div>

              {error && <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}

              <Button type="submit" className="w-full bg-dlsl-green hover:bg-dlsl-green-dark text-white" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                Don't have an account? <a href="#" className="text-dlsl-green hover:underline">Sign up →</a>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-xs">
                {demoCredentials.map(cred => <div key={cred.role} className="flex justify-between">
                    <span className="font-medium">{cred.role}:</span>
                    <span className="text-gray-600">{cred.email}</span>
                  </div>)}
                <p className="text-gray-500 mt-2">Password: password123 (for all roles)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>;
};

export default Login;
