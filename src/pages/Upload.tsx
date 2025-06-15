import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ThesisUploadForm from "@/components/ThesisUploadForm";
import PDFUploadCard from "@/components/PDFUploadCard";
import { supabase } from "@/integrations/supabase/client";

// Type for uploaded files UI state
interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
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

// Helper: get college_id by code for insertion
function getCollegeIdByCode(code: string) {
  const college = colleges.find((c) => c.id === code);
  return college ? college.id : null;
}

const Upload = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
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
  const [collegeMap, setCollegeMap] = useState<Record<string, string>>({}); // code => uuid

  useEffect(() => {
    // Fetch colleges from Supabase and build code => uuid map
    async function fetchColleges() {
      const { data, error } = await supabase
        .from('colleges')
        .select('id,name');
      if (error) {
        toast({
          title: "Could not fetch colleges",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      // Build a map from code ("cite") to id (uuid)
      // Use frontend `colleges` declaration to get known code mapping
      const codeToUuid: Record<string, string> = {};
      colleges.forEach(c => {
        // Match college by name
        const found = data?.find((d: any) => d.name === c.name);
        if (found) codeToUuid[c.id] = found.id;
      });
      setCollegeMap(codeToUuid);
    }
    fetchColleges();
  }, []);

  // Insert a row into the theses table after PDF upload
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one PDF file.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.title || !formData.author || !formData.college || !formData.department) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    if (uploadedFiles.length > 1) {
      toast({
        title: "Multiple files uploaded",
        description: "Please upload only one thesis PDF per entry.",
        variant: "destructive"
      });
      return;
    }

    // Map code (e.g. "cite") to UUID for college_id
    const collegeUuid = collegeMap[formData.college];
    if (!collegeUuid) {
      toast({
        title: "College not recognized",
        description: "Could not find matching college. Please refresh the page or contact admin.",
        variant: "destructive"
      });
      return;
    }

    // Get file info
    const fileObj = uploadedFiles[0];
    const filePath = fileObj.file.name.replace(/[^a-zA-Z0-9.-]+/g, "_");
    let thesisFileUrl: string | null = null;
    try {
      setIsExtracting(true);
      const { data, error } = await supabase
        .storage
        .from("thesis-pdfs")
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      const match = data?.find(item => item.name.endsWith(filePath));
      if (!match) {
        throw new Error("Could not find the uploaded file in storage.");
      }
      thesisFileUrl = supabase.storage.from("thesis-pdfs").getPublicUrl(match.name).data.publicUrl;
      if (!thesisFileUrl) throw new Error("Failed to get public URL for uploaded PDF.");

      // Insert thesis into Supabase
      const { error: insertError } = await supabase
        .from("theses")
        .insert([{
          title: formData.title,
          author: formData.author,
          co_adviser: formData.coAuthor || null,
          adviser: formData.advisor,
          college_id: collegeUuid, // use mapped uuid
          program_id: null,
          abstract: formData.abstract,
          keywords: formData.keywords
            ? formData.keywords.split(",").map((k) => k.trim())
            : [],
          publish_date: `${formData.year}-01-01`,
          file_url: thesisFileUrl,
          status: "pending_review",
        }]);

      if (insertError) {
        toast({
          title: "Error uploading thesis metadata",
          description: insertError.message,
          variant: "destructive"
        });
        setIsExtracting(false);
        return;
      }

      toast({
        title: "Thesis uploaded successfully!",
        description: "The thesis has been added to the repository."
      });

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
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.message || "There was a problem saving your thesis.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-dlsl-green hover:text-dlsl-green-dark"
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
            isExtracting={isExtracting}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </main>
    </div>
  );
};

export default Upload;
