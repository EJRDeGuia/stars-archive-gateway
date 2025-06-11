
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CollegeCard from '@/components/CollegeCard';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  BookOpen,
  Archive,
  Users,
  TrendingUp,
  AlertCircle,
  FolderOpen,
  Database,
  Calendar,
  Download,
  Edit3,
  Eye,
  Code,
  Briefcase,
  GraduationCap,
  Building,
  Utensils
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ArchivistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for archivist dashboard
  const stats = {
    totalTheses: 549,
    pendingReview: 12,
    thisMonth: 23,
    byCollege: {
      CITE: 120,
      CBEAM: 145,
      CEAS: 98,
      CON: 76,
      CIHTM: 110
    }
  };

  // College data with consistent design
  const colleges = [
    {
      id: 'cite',
      name: 'CITE',
      fullName: 'College of Information Technology Education',
      thesesCount: 120,
      color: '#3b82f6',
      bgColor: 'bg-blue-500',
      bgColorLight: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      icon: Code,
      description: 'Advancing digital innovation through cutting-edge technology and programming excellence'
    },
    {
      id: 'cbeam',
      name: 'CBEAM',
      fullName: 'College of Business Education, Arts and Management',
      thesesCount: 145,
      color: '#10b981',
      bgColor: 'bg-emerald-500',
      bgColorLight: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      icon: Briefcase,
      description: 'Fostering business leadership and entrepreneurial excellence for global competitiveness'
    },
    {
      id: 'ceas',
      name: 'CEAS',
      fullName: 'College of Engineering and Architectural Studies',
      thesesCount: 98,
      color: '#f59e0b',
      bgColor: 'bg-amber-500',
      bgColorLight: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      icon: Building,
      description: 'Building tomorrow through innovative engineering solutions and architectural design'
    },
    {
      id: 'con',
      name: 'CON',
      fullName: 'College of Nursing',
      thesesCount: 76,
      color: '#ef4444',
      bgColor: 'bg-red-500',
      bgColorLight: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      icon: GraduationCap,
      description: 'Nurturing compassionate healthcare professionals for community wellness and service'
    },
    {
      id: 'cihtm',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      thesesCount: 110,
      color: '#8b5cf6',
      bgColor: 'bg-violet-500',
      bgColorLight: 'bg-violet-100',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-200',
      icon: Utensils,
      description: 'Creating exceptional hospitality experiences through innovative tourism and service management'
    }
  ];

  const recentUploads = [
    {
      id: '1',
      title: 'Machine Learning Applications in Healthcare',
      author: 'John Smith',
      college: 'CITE',
      uploadDate: '2024-01-15',
      status: 'pending_review'
    },
    {
      id: '2',
      title: 'Sustainable Tourism Practices in the Philippines',
      author: 'Maria Garcia',
      college: 'CIHTM',
      uploadDate: '2024-01-14',
      status: 'approved'
    },
    {
      id: '3',
      title: 'Financial Technology Adoption in SMEs',
      author: 'Robert Johnson',
      college: 'CBEAM',
      uploadDate: '2024-01-13',
      status: 'needs_revision'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { label: 'Pending Review', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      needs_revision: { label: 'Needs Revision', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        navigate('/upload');
        break;
      case 'manage':
        navigate('/archivist/manage');
        break;
      case 'collections':
        navigate('/collections');
        break;
      case 'reports':
        navigate('/archivist/reports');
        break;
      case 'search':
        navigate('/explore');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleCollegeClick = (collegeId: string) => {
    navigate(`/college/${collegeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'Archivist'}!
            </h1>
            <p className="text-xl text-gray-600">
              Manage and organize the university's thesis repository with powerful tools designed for efficient archival management.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Theses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTheses}</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
                    <Archive className="h-6 w-6 text-dlsl-green" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Across all colleges</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingReview}</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-dlsl-green" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.thisMonth}</p>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-dlsl-green" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">New submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quick Upload</p>
                    <Button 
                      onClick={() => navigate('/upload')}
                      className="mt-2 bg-dlsl-green hover:bg-dlsl-green/90"
                      size="sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Thesis
                    </Button>
                  </div>
                  <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-dlsl-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Archivist Tools</h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('upload')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Upload className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Upload Thesis</h3>
                    <p className="text-sm text-gray-600">Add new thesis to repository</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('manage')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Database className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Manage Records</h3>
                    <p className="text-sm text-gray-600">Edit and organize theses</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('collections')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <FolderOpen className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Collections</h3>
                    <p className="text-sm text-gray-600">Organize by topic or theme</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('reports')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Calendar className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reports</h3>
                    <p className="text-sm text-gray-600">Generate archival reports</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('search')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Search className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Advanced Search</h3>
                    <p className="text-sm text-gray-600">Find specific theses</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleQuickAction('profile')}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-dlsl-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-dlsl-green group-hover:scale-110 transition-all duration-300">
                      <Users className="h-8 w-8 text-dlsl-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
                    <p className="text-sm text-gray-600">Manage your account</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* College Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by College</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  onClick={() => handleCollegeClick(college.id)}
                />
              ))}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
              <Button variant="outline" onClick={() => navigate('/archivist/manage')}>
                <FileText className="mr-2 h-4 w-4 text-dlsl-green" />
                View All
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentUploads.map((thesis) => (
                    <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                        <p className="text-sm text-gray-600">by {thesis.author} • {thesis.college}</p>
                        <p className="text-xs text-gray-500 mt-1">Uploaded: {thesis.uploadDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusBadge(thesis.status).variant}>
                          {getStatusBadge(thesis.status).label}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 text-dlsl-green" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4 text-dlsl-green" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 text-dlsl-green" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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

export default ArchivistDashboard;
