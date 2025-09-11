
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CollegeCard from '@/components/CollegeCard';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';

const CollegeGrid: React.FC = () => {
  const navigate = useNavigate();
  const { data: colleges = [], isLoading: loading } = useCollegesWithCounts();

  return (
    <div className="mb-16 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Browse by College
          </h2>
          <p className="text-gray-600">Explore research across different academic disciplines</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/explore')}
          className="border-dlsl-green text-dlsl-green hover:bg-dlsl-green hover:text-white transition-all duration-300 hover-scale shadow-sm"
        >
          <Filter className="mr-2 h-4 w-4" />
          Advanced Search
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-dlsl-green/10 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-8 h-8 bg-dlsl-green/20 rounded-full"></div>
            </div>
            <p className="text-gray-500 font-medium">Loading colleges...</p>
          </div>
        )}
        
        {/* Top row: 3 colleges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {colleges.slice(0, 3).map((college, index) => (
            <div
              key={college.id}
              className="animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CollegeCard
                college={college}
                onClick={() => navigate(`/college/${college.id}`)}
              />
            </div>
          ))}
        </div>
        
        {/* Bottom row: next 2 colleges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {colleges.slice(3, 5).map((college, index) => (
            <div
              key={college.id}
              className="animate-fade-in hover-scale"
              style={{ animationDelay: `${(index + 3) * 150}ms` }}
            >
              <CollegeCard
                college={college}
                onClick={() => navigate(`/college/${college.id}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeGrid;
