import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  TrendingUp,
  Eye,
  Download,
  Users,
  BookOpen,
  ArrowLeft,
  Calendar
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

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
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-xl text-gray-600">System usage reports and statistics</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map((i) => (
              <Card className="bg-white border-gray-200" key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-gray-300">
                    <div>
                      <p className="text-gray-300 text-sm font-medium">Metric</p>
                      <p className="text-3xl font-bold text-gray-300">—</p>
                      <p className="text-gray-200 text-sm font-medium">No data</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Monthly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-400 text-center py-8">No monthly trends available.</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  College Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-400 text-center py-8">No college stats available.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;
