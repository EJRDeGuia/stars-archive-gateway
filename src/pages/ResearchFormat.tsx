
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download } from 'lucide-react';

const ResearchFormat = () => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Format Guidelines</h1>
            <p className="text-xl text-gray-600">Official formatting requirements for DLSL theses</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-6 w-6" />
                  General Formatting Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Paper size: 8.5" x 11" (Letter)</li>
                  <li>Font: Times New Roman, 12pt</li>
                  <li>Line spacing: Double-spaced</li>
                  <li>Margins: 1.5" left, 1" right, top, and bottom</li>
                  <li>Page numbers: Bottom center, starting from the introduction</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Preliminary Pages</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Title Page</li>
                      <li>Approval Sheet</li>
                      <li>Acknowledgments</li>
                      <li>Abstract</li>
                      <li>Table of Contents</li>
                      <li>List of Tables/Figures (if applicable)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Main Body</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Chapter 1: Introduction</li>
                      <li>Chapter 2: Review of Related Literature</li>
                      <li>Chapter 3: Methodology</li>
                      <li>Chapter 4: Results and Discussion</li>
                      <li>Chapter 5: Summary, Conclusions, and Recommendations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reference Materials</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>References (APA 7th Edition)</li>
                      <li>Appendices (if applicable)</li>
                      <li>Curriculum Vitae</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Citation Style</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  All theses must follow the APA (American Psychological Association) 7th Edition style for citations and references.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Need help with APA formatting?</strong> Contact the LRC for assistance or attend our citation workshops.
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

export default ResearchFormat;
