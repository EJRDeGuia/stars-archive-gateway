
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
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden relative"
      onClick={onClick}
    >
      {/* Background Image */}
      {college.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${college.image})` }}
        />
      )}
      
      {/* Colored top bar */}
      <div className={`h-3 ${college.bgColor} relative z-10`}></div>
      
      <CardContent className={`${isLarge ? 'p-8' : 'p-6'} text-center relative z-10`}>
        {/* Icon with colored background */}
        <div className={`${isLarge ? 'w-20 h-20 mb-6' : 'w-16 h-16 mb-4'} ${college.bgColorLight} rounded-2xl flex items-center justify-center mx-auto`}>
          <IconComponent className={`${isLarge ? 'w-10 h-10' : 'w-8 h-8'} ${college.textColor}`} />
        </div>
        
        {/* College Name */}
        <h3 className={`${isLarge ? 'text-2xl mb-4' : 'text-xl mb-3'} font-bold text-gray-900`}>
          {college.name}
        </h3>
        
        {/* Full Name */}
        <p className={`${isLarge ? 'text-base mb-4' : 'text-sm mb-3'} text-gray-600 leading-relaxed`}>
          {college.fullName}
        </p>
        
        {/* Description */}
        <p className={`${isLarge ? 'text-sm mb-6' : 'text-xs mb-4'} text-gray-500 leading-relaxed`}>
          {college.description || 'Comprehensive collection of academic research and scholarly work'}
        </p>
        
        {/* Thesis Count with icon */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-4 h-4 ${college.bgColor} rounded`}></div>
          <span className={`${isLarge ? 'text-base' : 'text-sm'} text-gray-700 font-medium`}>
            {college.thesesCount}+ Theses
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
