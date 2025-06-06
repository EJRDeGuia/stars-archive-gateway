
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
  const isLarge = size === 'large';
  const IconComponent = college.icon;
  
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden rounded-2xl"
      onClick={onClick}
    >
      {/* Colored top bar */}
      <div className={`h-4 ${college.bgColor} relative z-10`}></div>
      
      <CardContent className="p-8 text-center relative z-10">
        {/* Icon with colored background */}
        <div className={`w-16 h-16 ${college.bgColorLight} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <IconComponent className={`w-8 h-8 ${college.textColor}`} />
        </div>
        
        {/* College Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {college.name}
        </h3>
        
        {/* Full Name */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 min-h-[40px]">
          {college.fullName}
        </p>
        
        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-6 min-h-[32px]">
          {college.description || 'Comprehensive collection of academic research and scholarly work'}
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
