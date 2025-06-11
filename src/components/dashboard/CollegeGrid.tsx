
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CollegeCard from '@/components/CollegeCard';
import { collegeData } from '@/data/collegeData';

const CollegeGrid: React.FC = () => {
  const navigate = useNavigate();

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
        {/* Top row: CITE, CBEAM, CEAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {collegeData.slice(0, 3).map(college => (
            <CollegeCard
              key={college.id}
              college={college}
              onClick={() => navigate(`/college/${college.id}`)}
            />
          ))}
        </div>
        
        {/* Bottom row: CON and CIHTM centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {collegeData.slice(3, 5).map(college => (
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
