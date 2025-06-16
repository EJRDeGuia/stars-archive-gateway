
import { Card, CardContent } from '@/components/ui/card';
import { useTheses } from '@/hooks/useApi';
import { useMemo } from 'react';
import { collegeData } from '@/data/collegeData';

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    fullName: string;
    thesesCount: number;
    color: string;
    bgColor: string;
    bgColorLight: string;
    textColor: string;
    borderColor: string;
    icon: any;
    image?: string;
    description?: string;
  };
  onClick: () => void;
  size?: 'default' | 'large';
}

const CollegeCard = ({ college, onClick, size = 'default' }: CollegeCardProps) => {
  const { data: allTheses = [] } = useTheses();

  // Get the college data from the static data to get the proper styling and icon
  const collegeDesign = collegeData.find(c => c.id === college.id || c.name === college.name) || {
    icon: null,
    bgColor: 'bg-gray-500',
    bgColorLight: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    description: 'Advancing knowledge through innovative research and academic excellence'
  };

  const IconComponent = collegeDesign.icon;

  // Calculate actual thesis count for this college
  const actualThesesCount = useMemo(() => {
    if (!Array.isArray(allTheses)) return 0;
    return allTheses.filter((thesis: any) => 
      String(thesis.college_id).trim() === String(college.id).trim()
    ).length;
  }, [allTheses, college.id]);

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden rounded-2xl"
      onClick={onClick}
    >
      {/* Colored top bar */}
      <div className={`h-4 ${collegeDesign.bgColor}`}></div>
      
      <CardContent className="p-8 text-center">
        {/* Icon with colored background */}
        {IconComponent ? (
          <div className={`w-16 h-16 ${collegeDesign.bgColorLight} rounded-2xl flex items-center justify-center mx-auto mb-8`}>
            <IconComponent className={`w-8 h-8 ${collegeDesign.textColor}`} />
          </div>
        ) : (
          <div className={`w-16 h-16 ${collegeDesign.bgColorLight} rounded-2xl flex items-center justify-center mx-auto mb-8`}>
            {/* Default placeholder */}
          </div>
        )}

        {/* College Abbreviation */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {college.name}
        </h3>
        
        {/* Full College Name */}
        <h4 className="text-base font-medium text-gray-800 mb-4 leading-relaxed">
          {college.fullName}
        </h4>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-8 min-h-[48px]">
          {college.description || collegeDesign.description}
        </p>
        
        {/* Thesis Count with colored indicator - now shows actual count */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 ${collegeDesign.bgColor} rounded`}></div>
          <span className="text-sm text-gray-700 font-medium">
            {actualThesesCount} Theses
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
