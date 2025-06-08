
import { Card, CardContent } from '@/components/ui/card';

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
  const IconComponent = college.icon;
  
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden rounded-2xl"
      onClick={onClick}
    >
      {/* Colored top bar */}
      <div className={`h-4 ${college.bgColor}`}></div>
      
      <CardContent className="p-8 text-center">
        {/* Icon with colored background */}
        <div className={`w-16 h-16 ${college.bgColorLight} rounded-2xl flex items-center justify-center mx-auto mb-8`}>
          <IconComponent className={`w-8 h-8 ${college.textColor}`} />
        </div>
        
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
          {college.description || 'Advancing knowledge through innovative research and academic excellence'}
        </p>
        
        {/* Thesis Count with colored indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 ${college.bgColor} rounded`}></div>
          <span className="text-sm text-gray-700 font-medium">
            {college.thesesCount}+ Theses
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
