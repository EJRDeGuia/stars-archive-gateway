import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PDFViewer from '@/components/PDFViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Bookmark, 
  User, 
  Calendar, 
  FileText,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import ThesisPDFPreviewDialog from '@/components/ThesisPDFPreviewDialog';
import { useThesis } from '@/hooks/useApi';
import type { Thesis } from '@/types/thesis';

const ThesisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Make sure to type thesis as Thesis | undefined
  const { data: thesis, isLoading, error } = useThesis(id || "") as { data: Thesis | undefined, isLoading: boolean, error: any };

  const [showPreview, setShowPreview] = React.useState(false);

  // Utility: Get the public Supabase Storage URL for a thesis PDF, if only a storage key is present
  function getPublicPdfUrl(fileUrl: string | undefined): string {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }
    // Remove all leading slashes AND any accidental internal duplicate slashes
    let cleanFileUrl = fileUrl.trim().replace(/^\/+/, "");
    cleanFileUrl = cleanFileUrl.replace(/\/{2,}/g, "/");
    return `https://cylsbcjqemluouxblywl.supabase.co/storage/v1/object/public/thesis-pdfs/${cleanFileUrl}`;
  }

  // Derived fields for easy rendering; guard against undefined
  const collegeName = thesis?.colleges?.name || "Unknown College";
  const thesisYear =
    thesis?.publish_date
      ? new Date(thesis.publish_date).getFullYear()
      : thesis?.created_at
        ? new Date(thesis.created_at).getFullYear()
        : "N/A";
  const thesisYearString = typeof thesisYear === "number" ? thesisYear.toString() : thesisYear;
  const thesisKeywords =
    Array.isArray(thesis?.keywords)
      ? thesis.keywords.filter(Boolean)
      : [];

  // Loading and error handling
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Loading thesis...</h1>
        </div>
      </div>
    );
  }

  if (error || !thesis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Thesis not found</h1>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const canViewPDF = user?.role && ['researcher', 'archivist', 'admin'].includes(user.role);

  const handleSaveToLibrary = () => {
    // Implementation for saving to library
    console.log('Saving to library:', thesis.id);
    // You could use localStorage or make an API call here
  };

  const handleCite = () => {
    // Implementation for citing
    const citation = `${thesis.author}. (${thesisYearString}). ${thesis.title}. De La Salle Lipa University.`;
    navigator.clipboard.writeText(citation);
    console.log('Citation copied:', citation);
  };

  const handleShare = () => {
    // Implementation for sharing
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    console.log('Share URL copied:', shareUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Metadata */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {thesis.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="font-medium text-lg">{thesis.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-lg">{thesisYearString}</span>
                      </div>
                      <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0 text-sm">
                        {collegeName}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-8 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        <span>{thesis.view_count || 0} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        <span>{thesis.download_count || 0} downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        <span>Citations not tracked</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {thesisKeywords.length > 0 ? (
                      thesisKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
                          {keyword}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No keywords</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Abstract</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {thesis.abstract || <span className="text-gray-400 italic">No abstract</span>}
                  </p>
                </div>
              </div>

              {/* PDF Preview Button */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Document Preview</h2>
                    {canViewPDF && thesis.file_url ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="border-dlsl-green text-dlsl-green hover:bg-dlsl-green/5 font-semibold"
                      >
                        Preview PDF (First 10 Pages)
                      </Button>
                    ) : (
                      <span className="text-gray-400 italic">No PDF preview available</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    View-only, download/copy/print disabled. This preview is secured via Adobe PDF Viewer.
                  </div>
                </div>
              </div>

              {/* Research Methodology */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Methodology</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    No methodology data available.
                  </p>
                </div>
              </div>

              {/* Key Findings */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Findings</h2>
                  <ul className="space-y-4 text-gray-700 text-lg">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-dlsl-green rounded-full mt-3 flex-shrink-0"></div>
                      <span>No key findings available.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Actions</h3>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
                      onClick={handleSaveToLibrary}
                    >
                      <Bookmark className="mr-2 h-5 w-5" />
                      Save to Library
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
                      onClick={handleCite}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Cite This Work
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-5 w-5" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Document Information</h3>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <span className="font-medium text-gray-900">N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span className="font-medium text-gray-900">N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium text-gray-900">{thesis.file_url ? "PDF" : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium text-gray-900">English</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Added:</span>
                      <span className="font-medium text-gray-900">
                        {thesis.created_at
                          ? new Date(thesis.created_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Theses */}
              {/* This needs related data. Placeholder for now */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Related Theses</h3>
                  <div className="space-y-4">
                    <span className="text-gray-400 italic">No related theses found.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* PDF Secure Preview Dialog */}
        <ThesisPDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={getPublicPdfUrl(thesis.file_url)}
          title={thesis.title}
          author={thesis.author}
          year={thesisYearString}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ThesisDetail;
