
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ThesisUploadForm from "@/components/ThesisUploadForm";
import PDFUploadCard from "@/components/PDFUploadCard";
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { UploadService } from '@/services/uploadService';

// Type for uploaded files UI state
interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  storagePath?: string;
}

// College and Department options for the form
const colleges = [
  { id: 'cite', name: 'CITE', fullName: 'College of Information Technology and Engineering' },
  { id: 'cbeam', name: 'CBEAM', fullName: 'College of Business, Economics, Accountancy, and Management' },
  { id: 'ceas', name: 'CEAS', fullName: 'College of Education, Arts, and Sciences' },
  { id: 'con', name: 'CON', fullName: 'College of Nursing' },
  { id: 'cihtm', name: 'CIHTM', fullName: 'College of International Hospitality and Tourism Management' }
];

const departments = {
  cite: ['Computer Science', 'Information Technology', 'Computer Engineering', 'Electronics Engineering'],
  cbeam: ['Business Administration', 'Management', 'Accountancy', 'Economics', 'Marketing'],
  ceas: ['Elementary Education', 'Secondary Education', 'Psychology', 'English', 'Mathematics', 'History'],
  cihtm: ['Tourism Management', 'Hotel and Restaurant Management', 'Culinary Arts'],
  con: ['Nursing', 'Community Health Nursing', 'Medical-Surgical Nursing']
};

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coAuthor: '',
    college: '',
    department: '',
    year: new Date().getFullYear(),
    abstract: '',
    keywords: '',
    advisor: ''
  });

  // Store actual college UUID mapping from backend
  const [collegeMap, setCollegeMap] = useState<Record<string, string>>({});
  const [collegesLoaded, setCollegesLoaded] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error("Please log in to upload theses.");
      navigate('/login');
      return;
    }

    fetchColleges();
  }, [user, navigate]);

  const fetchColleges = async () => {
    try {
      const mapping = await UploadService.getCollegeMapping();
      setCollegeMap(mapping);
      setCollegesLoaded(true);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
      toast.error("Error loading colleges. Please refresh the page to try again.");
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.author.trim()) errors.push("Author is required");
    if (!formData.college) errors.push("College is required");
    if (!formData.department) errors.push("Department is required");
    if (!formData.abstract.trim()) errors.push("Abstract is required");
    if (!formData.advisor.trim()) errors.push("Advisor is required");
    
    if (formData.year < 2000 || formData.year > new Date().getFullYear()) {
      errors.push("Year must be between 2000 and current year");
    }

    if (uploadedFiles.length === 0) {
      errors.push("At least one PDF file must be uploaded");
    }

    if (uploadedFiles.length > 1) {
      errors.push("Only one PDF file per thesis is allowed");
    }

    const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
    if (completedFiles.length === 0 && uploadedFiles.length > 0) {
      errors.push("Please wait for file upload to complete");
    }

    return errors;
  };


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to upload theses.");
      return;
    }

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join(". "));
      return;
    }

    if (!collegesLoaded || !collegeMap[formData.college]) {
      toast.error("College not found. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Upload] Starting upload process...');
      
      const completedFile = uploadedFiles.find(f => f.status === 'completed');
      if (!completedFile || !completedFile.storagePath) {
        throw new Error("No completed file upload found");
      }

      console.log('[Upload] File found, getting URL...');
      // Get the file URL from storage
      const fileUrl = UploadService.getFileUrl(completedFile.storagePath);
      console.log('[Upload] File URL obtained:', fileUrl);

      console.log('[Upload] Calling upload service...');
      // Use the upload service for optimized thesis insertion
      const result = await UploadService.uploadThesis({
        title: formData.title,
        author: formData.author,
        coAdviser: formData.coAuthor,
        adviser: formData.advisor,
        collegeId: collegeMap[formData.college],
        abstract: formData.abstract,
        keywords: formData.keywords
          ? formData.keywords.split(",").map((k) => k.trim()).filter(k => k.length > 0)
          : [],
        publishYear: formData.year,
        fileUrl,
        uploadedBy: user.id,
      });

      console.log('[Upload] Upload service result:', result);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      console.log('[Upload] Thesis uploaded successfully:', result.thesis?.id);

      // Invalidate queries to refresh the thesis list and dashboards
      queryClient.invalidateQueries({ queryKey: ['theses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['archivist-dashboard'] });
      
      // Also invalidate any collections that might be affected
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      queryClient.invalidateQueries({ queryKey: ['system-stats'] });

      toast.success("Thesis uploaded successfully! Your thesis has been submitted for review and will be available once approved.");

      // Reset form
      setFormData({
        title: "",
        author: "",
        coAuthor: "",
        college: "",
        department: "",
        year: new Date().getFullYear(),
        abstract: "",
        keywords: "",
        advisor: "",
      });
      setUploadedFiles([]);

      // Navigate back to archivist dashboard after a short delay
      setTimeout(() => {
        navigate('/archivist');
      }, 2000);

    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error(`Upload failed: ${err?.message || "There was a problem saving your thesis. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please log in to upload theses.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-dlsl-green hover:text-dlsl-green-dark"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-dlsl-green">Upload New Thesis</h1>
          <p className="text-gray-600 mt-2">
            Add a new thesis to the STARS repository
          </p>
        </div>
        
        <div className="space-y-6">
          <PDFUploadCard
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            isExtracting={isExtracting}
            setIsExtracting={setIsExtracting}
          />
          
          <ThesisUploadForm
            formData={formData}
            setFormData={setFormData}
            colleges={colleges}
            departments={departments}
            isExtracting={isExtracting || isSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </main>
    </div>
  );
};

export default Upload;
