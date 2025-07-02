
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
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Browse by College</h2>
        <Button variant="outline" onClick={() => navigate('/explore')}>
          <Filter className="mr-2 h-4 w-4 text-dlsl-green" />
          Advanced Search
        </Button>
      </div>
      
      <div className="max-w-5xl mx-auto">
        {/* Loading state */}
        {loading && (
          <div className="text-center py-12 text-gray-400">Loading colleges...</div>
        )}
        
        {/* Top row: 3 colleges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {colleges.slice(0, 3).map(college => (
            <CollegeCard
              key={college.id}
              college={college}
              onClick={() => navigate(`/college/${college.id}`)}
            />
          ))}
        </div>
        
        {/* Bottom row: next 2 colleges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {colleges.slice(3, 5).map(college => (
            <CollegeCard
              key={college.id}
              college={college}
              onClick={() => navigate(`/college/${college.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeGrid;
