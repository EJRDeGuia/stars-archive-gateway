
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, TrendingUp } from 'lucide-react';
import { colleges, theses } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const navigate = useNavigate();

  const collections = [
    {
      id: 'featured',
      title: 'Featured Research',
      description: 'Highlighted theses and groundbreaking research',
      count: 24,
      color: 'from-dlsl-green to-dlsl-green-light',
      icon: TrendingUp
    },
    {
      id: 'recent',
      title: 'Recent Submissions',
      description: 'Latest theses added to the repository',
      count: 48,
      color: 'from-blue-500 to-blue-600',
      icon: Calendar
    },
    {
      id: 'popular',
      title: 'Most Popular',
      description: 'Most viewed and downloaded research',
      count: 36,
      color: 'from-purple-500 to-purple-600',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Research Collections</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curated collections of academic research organized by themes, colleges, and popularity
            </p>
          </div>

          {/* Featured Collections */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Card key={collection.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden">
                  <div className={`h-3 bg-gradient-to-r ${collection.color}`}></div>
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <collection.icon className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {collection.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {collection.description}
                      </p>
                      <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0 text-lg px-4 py-2">
                        {collection.count} items
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* College Collections */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Browse by College</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <span>{colleges.length} Colleges</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  onClick={() => navigate(`/college/${college.id}`)}
                  size="large"
                />
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-3xl p-12 border border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Repository Statistics</h2>
              <p className="text-lg text-gray-600">Overview of our academic research collection</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-dlsl-green" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{theses.length}</div>
                <div className="text-gray-600">Total Theses</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">1,247</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">45</div>
                <div className="text-gray-600">This Month</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">8.3k</div>
                <div className="text-gray-600">Weekly Views</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
