
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600">Get assistance with using STARS</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-6 w-6" />
                  Common Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cannot access PDF documents</h3>
                    <p className="text-gray-700">Make sure you're logged in and connected to the DLSL network. Contact the LRC if you continue having issues.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Search not returning results</h3>
                    <p className="text-gray-700">Try using different keywords, check your spelling, or broaden your search terms.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Login problems</h3>
                    <p className="text-gray-700">Ensure you're using your correct DLSL credentials. Contact IT support if you've forgotten your password.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-dlsl-green" />
                    <div>
                      <p className="font-semibold">Email Support</p>
                      <a href="mailto:lrc@dlsl.edu.ph" className="text-dlsl-green hover:underline">
                        lrc@dlsl.edu.ph
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-dlsl-green" />
                    <div>
                      <p className="font-semibold">Phone Support</p>
                      <a href="tel:+6343123456" className="text-dlsl-green hover:underline">
                        (043) 123-4567
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-gray-700">
                    <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
