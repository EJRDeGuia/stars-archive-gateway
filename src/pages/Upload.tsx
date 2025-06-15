import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, FileText, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const Upload = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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

  // Add colleges array for the Select in the form
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only.",
        variant: "destructive"
      });
      return;
    }

    handleFileUpload(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, uploadFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { ...uf, progress: Math.min(uf.progress + 10, 100) }
              : uf
          )
        );
      }, 200);

      // Complete upload after 2 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { ...uf, progress: 100, status: 'completed' }
              : uf
          )
        );
      }, 2000);
    });
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(uf => uf.file !== fileToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    // Simulate form submission
    toast({
      title: "Thesis uploaded successfully!",
      description: "The thesis has been added to the repository.",
    });

    // Reset form
    setFormData({
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
    setUploadedFiles([]);
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
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Document</CardTitle>
              <CardDescription>
                Drag and drop your PDF file here, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-dlsl-green bg-dlsl-green/5'
                    : 'border-gray-300 hover:border-dlsl-green hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your PDF files here
                </p>
                <p className="text-gray-600 mb-4">
                  or click to select files from your computer
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild className="bg-dlsl-green hover:bg-dlsl-green-dark">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                  {uploadedFiles.map((uploadFile, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-dlsl-green flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={uploadFile.progress} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500">
                            {uploadFile.progress}%
                          </span>
                        </div>
                      </div>
                      {uploadFile.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.file)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thesis Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Thesis Information</CardTitle>
              <CardDescription>
                Provide detailed information about the thesis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter thesis title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Primary Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Last Name, First Name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coAuthor">Co-Author (Optional)</Label>
                    <Input
                      id="coAuthor"
                      value={formData.coAuthor}
                      onChange={(e) => setFormData({ ...formData, coAuthor: e.target.value })}
                      placeholder="Last Name, First Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advisor">Thesis Advisor *</Label>
                    <Input
                      id="advisor"
                      value={formData.advisor}
                      onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                      placeholder="Dr./Prof. Last Name, First Name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college">College *</Label>
                    <Select 
                      value={formData.college} 
                      onValueChange={(value) => setFormData({ ...formData, college: value, department: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name} - {college.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      disabled={!formData.college}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.college && departments[formData.college as keyof typeof departments]?.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="Separate keywords with commas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract *</Label>
                  <Textarea
                    id="abstract"
                    rows={6}
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    placeholder="Enter the thesis abstract"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-dlsl-green hover:bg-dlsl-green-dark text-white"
                  >
                    Upload Thesis
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
