
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Search, Download, Users } from 'lucide-react';

const UserGuide = () => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">User Guide</h1>
            <p className="text-xl text-gray-600">Learn how to use STARS effectively</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-6 w-6" />
                  Searching for Theses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Use the search bar to find theses by title, author, keywords, or college. You can also use advanced filters to narrow down your results.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Enter keywords related to your research topic</li>
                  <li>Use quotation marks for exact phrases</li>
                  <li>Filter by college, year, or subject area</li>
                  <li>Browse by collections for curated thesis groups</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-6 w-6" />
                  Accessing Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  To access full thesis documents, you need to be connected to the DLSL network and have appropriate permissions.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Log in with your DLSL credentials</li>
                  <li>Ensure you're connected to the campus network</li>
                  <li>Contact the LRC for access assistance</li>
                  <li>Preview pages are available for all users</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  Creating Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Organize your research by creating personal collections of theses.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Save interesting theses to your library</li>
                  <li>Create themed collections</li>
                  <li>Share collections with colleagues</li>
                  <li>Export citations for your research</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserGuide;
