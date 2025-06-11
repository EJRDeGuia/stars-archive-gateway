
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-dlsl-green" />
          </div>
          
          <h1 className="text-6xl font-bold text-dlsl-green mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. 
            Let's get you back on track.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-dlsl-green hover:bg-dlsl-green/90 text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full border-gray-300 hover:border-dlsl-green hover:bg-dlsl-green/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-dlsl-green" />
              Go Back
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Need help? Visit our <button onClick={() => navigate('/resources')} className="text-dlsl-green hover:underline">resources page</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
