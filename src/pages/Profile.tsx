
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Edit,
  Save,
  Camera,
  BookOpen,
  Heart,
  Download,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+63 123 456 7890',
    department: 'College of Computer Studies',
    position: 'Graduate Student',
    bio: 'Passionate researcher in artificial intelligence and machine learning applications in education.',
    location: 'Lipa City, Batangas'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const stats = [
    { label: 'Papers Read', value: '124', icon: BookOpen },
    { label: 'Bookmarks', value: '23', icon: Heart },
    { label: 'Downloads', value: '45', icon: Download },
    { label: 'Profile Views', value: '89', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? "bg-primary text-white" : "bg-white text-gray-700 border border-gray-300"}
              >
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                      {isEditing && (
                        <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.name}</h2>
                      <p className="text-gray-600 mb-1">{formData.position}</p>
                      <p className="text-gray-600">{formData.department}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{formData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{formData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{formData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{formData.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-700">Department</Label>
                      {isEditing ? (
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>{formData.department}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-gray-700">Position</Label>
                      {isEditing ? (
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formData.position}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="border-gray-300 min-h-24"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900 leading-relaxed">{formData.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Research Interests */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Research Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Artificial Intelligence', 'Machine Learning', 'Educational Technology', 'Data Science', 'Natural Language Processing'].map((interest) => (
                      <Badge key={interest} variant="secondary" className="bg-primary/10 text-primary border-0">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Activity Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-gray-700">{stat.label}</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start border-gray-300">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-300">
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gray-300">
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
