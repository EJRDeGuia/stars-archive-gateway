
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">Terms and conditions for using STARS</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: January 2025</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-6 w-6" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  By accessing and using the Smart Thesis Archival and Retrieval System (STARS), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permitted Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">STARS is provided for legitimate educational and research purposes. You may:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Search and browse thesis collections</li>
                  <li>Access documents for academic research</li>
                  <li>Create personal collections for research purposes</li>
                  <li>Generate citations for academic work</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">The following activities are strictly prohibited:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Unauthorized copying, downloading, or distribution of thesis documents</li>
                  <li>Commercial use of any content without explicit permission</li>
                  <li>Attempting to circumvent access controls or security measures</li>
                  <li>Sharing login credentials with unauthorized users</li>
                  <li>Using automated tools to scrape or harvest content</li>
                  <li>Plagiarizing or misrepresenting thesis content as your own work</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  All thesis documents, metadata, and system content are protected by copyright and intellectual property laws. The original authors retain all rights to their work. STARS serves as a repository and access platform under fair use provisions for educational purposes.
                </p>
                <p className="text-gray-700">
                  Any use of thesis content must include proper attribution to the original authors and comply with academic integrity standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must provide accurate and current information when creating an account</li>
                  <li>Accounts are for individual use only and may not be shared</li>
                  <li>DLSL reserves the right to suspend or terminate accounts that violate these terms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Restrictions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Access to full thesis documents is restricted to authorized users within the DLSL network. This restriction is in place to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Protect intellectual property rights</li>
                  <li>Comply with copyright regulations</li>
                  <li>Maintain academic integrity</li>
                  <li>Ensure appropriate use of research materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  STARS is provided "as is" without any warranties, express or implied. While we strive to maintain accurate and up-to-date information, we do not guarantee the completeness, accuracy, or reliability of any content. Users are responsible for verifying information independently.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  De La Salle Lipa and the Learning Resource Center shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of STARS or inability to use the system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact:<br />
                  <strong>De La Salle Lipa - Learning Resource Center</strong><br />
                  Email: <a href="mailto:lrc@dlsl.edu.ph" className="text-dlsl-green hover:underline">lrc@dlsl.edu.ph</a><br />
                  Phone: <a href="tel:+6343123456" className="text-dlsl-green hover:underline">(043) 123-4567</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
