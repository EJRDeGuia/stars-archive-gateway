
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Search,
  Plus,
  Edit,
  Settings,
  ArrowLeft,
  Code,
  Calculator,
  Microscope,
  HeartPulse,
  UtensilsCrossed
} from 'lucide-react';

const CollegeManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // College data
  const colleges = [
    {
      id: '1',
      name: 'CITE',
      fullName: 'College of Information Technology and Engineering',
      icon: Code,
      thesesCount: 120,
      activePrograms: 8,
      faculty: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'CBEAM',
      fullName: 'College of Business, Economics, Accountancy, and Management',
      icon: Calculator,
      thesesCount: 145,
      activePrograms: 12,
      faculty: 67,
      status: 'active'
    },
    {
      id: '3',
      name: 'CEAS',
      fullName: 'College of Education, Arts, and Sciences',
      icon: Microscope,
      thesesCount: 98,
      activePrograms: 15,
      faculty: 89,
      status: 'active'
    },
    {
      id: '4',
      name: 'CON',
      fullName: 'College of Nursing',
      icon: HeartPulse,
      thesesCount: 76,
      activePrograms: 5,
      faculty: 34,
      status: 'active'
    },
    {
      id: '5',
      name: 'CIHTM',
      fullName: 'College of International Hospitality and Tourism Management',
      icon: UtensilsCrossed,
      thesesCount: 110,
      activePrograms: 7,
      faculty: 52,
      status: 'active'
    }
  ];

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">College Management</h1>
                <p className="text-xl text-gray-600">Configure college settings and programs</p>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search colleges..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-dlsl-green hover:bg-dlsl-green/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New College
            </Button>
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-dlsl-green/10 rounded-xl flex items-center justify-center">
                        <college.icon className="w-6 h-6 text-dlsl-green" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{college.name}</CardTitle>
                        <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                          {college.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium text-gray-900 mb-4">{college.fullName}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Theses</span>
                      <span className="font-semibold text-gray-900">{college.thesesCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Programs</span>
                      <span className="font-semibold text-gray-900">{college.activePrograms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Faculty</span>
                      <span className="font-semibold text-gray-900">{college.faculty}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegeManagement;
