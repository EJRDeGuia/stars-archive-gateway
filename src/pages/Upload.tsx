
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ThesisUploadForm from "@/components/ThesisUploadForm";
import PDFUploadCard from "@/components/PDFUploadCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

// Type for uploaded files UI state
interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
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
      toast({
        title: "Authentication required",
        description: "Please log in to upload theses.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    fetchColleges();
  }, [user, navigate]);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name');
        
      if (error) {
        console.error('Error fetching colleges:', error);
        toast({
          title: "Could not fetch colleges",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Build a map from code to UUID
      const codeToUuid: Record<string, string> = {};
      colleges.forEach(c => {
        const found = data?.find((d: any) => d.name === c.name);
        if (found) codeToUuid[c.id] = found.id;
      });
      
      setCollegeMap(codeToUuid);
      setCollegesLoaded(true);
      console.log('College mapping loaded:', codeToUuid);
      
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
      toast({
        title: "Error loading colleges",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
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

  const getFileUrl = async (fileName: string): Promise<string> => {
    try {
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from("thesis-pdfs")
        .getPublicUrl(fileName);
        
      if (!data.publicUrl) {
        throw new Error("Failed to get file URL");
      }
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error("Failed to get file URL");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload theses.",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation failed",
        description: errors.join(". "),
        variant: "destructive"
      });
      return;
    }

    if (!collegesLoaded || !collegeMap[formData.college]) {
      toast({
        title: "College not found",
        description: "Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const completedFile = uploadedFiles.find(f => f.status === 'completed');
      if (!completedFile) {
        throw new Error("No completed file upload found");
      }

      // Get the file URL from storage
      const timestamp = Date.now();
      const sanitizedName = completedFile.file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .replace(/_{2,}/g, "_");
      const storagePath = `${timestamp}-${sanitizedName}`;
      
      // Find the actual uploaded file path
      const { data: fileList, error: listError } = await supabase.storage
        .from("thesis-pdfs")
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (listError) throw listError;

      const uploadedFile = fileList?.find(item => 
        item.name.includes(sanitizedName) || 
        item.name.includes(completedFile.file.name.replace(/[^a-zA-Z0-9.-]/g, "_"))
      );

      if (!uploadedFile) {
        throw new Error("Could not find the uploaded file in storage");
      }

      const fileUrl = await getFileUrl(uploadedFile.name);

      // Insert thesis into database
      const { error: insertError } = await supabase
        .from("theses")
        .insert([{
          title: formData.title.trim(),
          author: formData.author.trim(),
          co_adviser: formData.coAuthor.trim() || null,
          adviser: formData.advisor.trim(),
          college_id: collegeMap[formData.college],
          program_id: null,
          abstract: formData.abstract.trim(),
          keywords: formData.keywords
            ? formData.keywords.split(",").map((k) => k.trim()).filter(k => k.length > 0)
            : [],
          publish_date: `${formData.year}-01-01`,
          file_url: fileUrl,
          status: "pending_review",
          uploaded_by: user.id,
        }]);

      if (insertError) {
        console.error('Database insertion error:', insertError);
        throw new Error(insertError.message);
      }

      toast({
        title: "Thesis uploaded successfully!",
        description: "Your thesis has been submitted for review and will be available once approved.",
      });

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

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Form submission error:', err);
      toast({
        title: "Upload failed",
        description: err?.message || "There was a problem saving your thesis. Please try again.",
        variant: "destructive"
      });
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
